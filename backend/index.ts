import express, { Express, NextFunction, Request, Response } from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
const mongoose = require("mongoose");
import cors from "cors";
import { User } from "./schemas/user";
import { Chat } from "./schemas/chat";
import { Schema, Types } from "mongoose";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

const SECRET_KEY = "your_secret_key";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from this origin
  methods: ["GET", "POST"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "x-access-token"], // Allow these headers
};

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/test-hexatown", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: Error) => {
    console.error("Error connecting to MongoDB:", err);
  });

const port = 4000;

app.use(cors(corsOptions));
app.use(express.json());

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["x-access-token"],
    credentials: true,
  },
});

const users: Record<string, string> = {}; // Object to track connected users and their socket IDs

interface SocketC extends Socket {
  token: string | string[];
}
// Socket.IO connection handler
io.use((socket: SocketC, next: NextFunction) => {
  const token = socket.handshake.headers["x-access-token"];
  if (token) {
    socket.token = token;
    next();
  } else {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket: SocketC) => {
  console.log("New client connected");
  console.log("Token:", socket.token);
  let userid = "";
  const sendHistory = async (myuserid: string) => {
    const chats = await Chat.findChatsWithUser(myuserid);
    socket.emit("chathistory", { data: chats, myuserid });
  };

  jwt.verify(socket.token, SECRET_KEY, async (err: Error, decoded: any) => {
    userid = decoded.id;
    users[userid] = socket.id;
    sendHistory(decoded.id);
  });

  socket.on("message", async (data) => {
    const chats = await Chat.findChatWithUsers(userid, data.to);
    const recipientSocketId = users[data.to];

    if (!chats) {
      const chat = new Chat({
        peers: [
          new Types.ObjectId(userid),
          new Types.ObjectId(data.to as string),
        ],
        messages: [
          {
            message: data.message,
            sender: new Types.ObjectId(userid),
          },
        ],
      });
      await chat.save();
      logger.info(`Message`, {
        message: `user ${userid} sending mesasge ${data.message}, peers: ${chat.peers} `,
      });
      sendHistory(userid);
    } else {
      console.log(chats, data);
      chats.messages.push({
        message: data.message,
        sender: new mongoose.Types.ObjectId(userid),
        dateSent: new Date(),
      });
      await chats.save();
      logger.info(`Message`, {
        message: `user ${userid} sending mesasge ${data.message}, peers: ${chats.peers} `,
      });
      sendHistory(userid);
    }

    if (recipientSocketId) {
      const chats = await Chat.findChatsWithUser(data.to);

      io.to(recipientSocketId).emit("chathistory", {
        data: chats,
        myuserid: data.to,
      });
    }
    // const users = await User.find({
    //   username: { $regex: new RegExp(data.data, "i") },
    // });
    // socket.emit("usersearch", { data: users });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    for (let username in users) {
      if (users[username] === socket.id) {
        delete users[username];
        break;
      }
    }
  });

  socket.on("search", async (data) => {
    console.log("messages:", data.data);
    let users = await User.find({
      username: { $regex: new RegExp(data.data, "i") },
    });
    users = users.filter((user) => user.id !== userid);
    socket.emit("usersearch", { data: users });
  });
});

app.post("/login", async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.body.username }).exec();
  if (!user) res.status(404).json({ error: "user not found" });
  else {
    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: 86400, // 24 hours
    });
    user.dateLastSigned = new Date();
    user.save();
    logger.info(`Logged in`, { message: `user ${user.username} logged in` });
    res.status(200).send({ auth: true, token });
  }
});

app.post("/register", async (req: Request, res: Response) => {
  const user = await User.findOne({ username: req.body.username }).exec();
  if (user)
    res.status(500).json({ error: "user already exists with this username" });
  else {
    const user_ = new User({ username: req.body.username });
    await user_.save();
    logger.info(`Registered`, {
      message: `user ${user_.username} registered `,
    });

    res.status(200).send({ success: true });
  }
});

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
