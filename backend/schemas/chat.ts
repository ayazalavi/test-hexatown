import mongoose, { Document, Model, ObjectId } from "mongoose";
const { Schema } = mongoose;

interface IChat extends Document {
  peers: ObjectId[];
  messages: {
    message: string;
    sender: ObjectId;
    dateSent: Date;
  }[];
}

interface IChatModel extends Model<IChat> {
  findChatWithUsers(userId1: string, userId2: string): Promise<IChat | null>;
  findChatsWithUser(userId: string): Promise<IChat[]>;
}

const chatSchema = new Schema<IChat>({
  peers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ], // String is shorthand for {type: String}
  messages: [
    {
      message: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      dateSent: { type: Date, default: Date.now },
    },
  ],
});

chatSchema.index({ peers: 1 });

chatSchema.statics.findChatWithUsers = async function (
  userId1: string,
  userId2: string
) {
  const userId1_ = new mongoose.Types.ObjectId(userId1);
  const userId2_ = new mongoose.Types.ObjectId(userId2);

  try {
    const chat = await this.findOne({
      peers: { $all: [userId1_, userId2_] },
    });

    if (chat) {
      console.log("Chat found:", chat);
    } else {
      console.log("No chat found with both user IDs");
    }
    return chat;
  } catch (err) {
    console.error("Error finding chat:", err);
    throw err;
  }
};

// Static method to find chats where the user ID exists in the peers array
chatSchema.statics.findChatsWithUser = async function (userId: string) {
  const userId_ = new mongoose.Types.ObjectId(userId);

  try {
    const chats = await this.find({
      peers: { $in: [userId_] },
    })
      .populate("peers") // Populate peers with only the username field
      .populate({
        path: "messages.sender",
        select: "username", // Select only the username field for the sender
      });

    if (chats.length > 0) {
      console.log("Chats found:", chats);
    } else {
      console.log("No chats found with the user ID");
    }
    return chats;
  } catch (err) {
    console.error("Error finding chats:", err);
    throw err;
  }
};

export const Chat = mongoose.model<IChat, IChatModel>("Chat", chatSchema);
