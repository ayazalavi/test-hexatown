"use client";

import React, { useDeferredValue, useEffect, useRef, useState } from "react";
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { socket as socketMethod } from "@/socket";
import { Socket } from "socket.io-client";
import ChatInterface from "@/components/chatinterface";
import { useRouter } from "next/navigation";
import SearchField from "@/components/searchfield";
import LeftMenuMessage from "@/components/leftlist/nochatsmessage";
import Users from "@/components/leftlist/users";
import Chats from "@/components/leftlist/chats";
import { ObjectId } from "mongoose";

export interface IChat {
  peers: IUser[];
  messages: {
    message: string;
    sender: IUser;
    dateSent: Date;
  }[];
  _id: string;
}
export interface IUser {
  username: String; // String is shorthand for {type: String}
  dateSignedUp: Date;
  dateLastSigned: Date;
  _id: string;
}

const ChatPage = () => {
  const socket = useRef<Socket | null>(null);
  const myid = useRef<string>("");
  const [chats, setChats] = useState<IChat[]>([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [peer, setPeer] = useState<IUser | null>(null);
  const searchText = useDeferredValue(search);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
    socket.current = socketMethod(token || "");

    socket.current.on("connect", () => {
      console.log("Connected to server");
    });

    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.current.on("chathistory", (data) => {
      setChats(data.data);
      myid.current = data.myuserid;
    });

    socket.current.on("usersearch", (data) => {
      setUsers(data.data);
      setSearching(false);
    });

    // Clean up the connection when the component unmounts
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Example of emitting an event
  const searchUsers = () => {
    if (socket.current) {
      setSearching(true);
      socket.current.emit("search", { data: searchText });
    }
  };

  const handleNewChat = (user: any) => {
    console.log("user", user);
    setUsers([]);
    setPeer(user);
  };

  const sendMessage = (message: string, peer: any) => {
    if (socket.current) {
      socket.current.emit("message", { to: peer._id, message });
    }
  };

  return (
    <Container disableGutters style={{ maxWidth: "100%" }}>
      <Grid container spacing={0}>
        <Grid
          item
          xs={4}
          lg={2}
          bgcolor="transparent"
          sx={{ borderRight: 1, borderRightColor: "white", height: "100vh" }}
        >
          <Box flexDirection={"column"} display={"flex"}>
            <SearchField
              search={search}
              searchUsers={searchUsers}
              setSearch={setSearch}
            />
            <LeftMenuMessage
              users={users}
              chats={chats}
              searching={searching}
            />
            <Users users={users} handleNewChat={handleNewChat} />
            <Chats chats={chats} handleNewChat={handleNewChat} myid={myid} />
          </Box>
          {/* <List component={Paper}>
            {chats.map((chat) => (
              <ListItem
                button
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
              >
                <ListItemText primary={chat.name} />
              </ListItem>
            ))}
          </List> */}
        </Grid>
        <Grid item xs={8} lg={10}>
          {peer ? (
            <ChatInterface
              peer={peer}
              messages={
                chats.find((chat) =>
                  chat.peers.find((peer_) => peer_._id === peer._id)
                )?.messages
              }
              sendMessage={sendMessage}
              myuserid={myid.current}
            />
          ) : (
            <Typography
              variant="h6"
              width={"90vw"}
              height={"100vh"}
              textAlign={"center"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              Select a chat or search for the user
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatPage;
