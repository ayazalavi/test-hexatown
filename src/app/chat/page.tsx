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

const ChatPage = () => {
  const socket = useRef<Socket | null>(null);
  const myid = useRef<string>("");
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [peer, setPeer] = useState(null);
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
      console.log("history:", data.data);
      setChats(data.data);
      myid.current = data.myuserid;
    });

    socket.current.on("usersearch", (data) => {
      console.log("users:", data.data);

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

  console.log(chats);
  const [selectedChat, setSelectedChat] = useState({
    name: "user1",
    lastSignin: new Date().toISOString(),
    messages: [
      {
        text: "some message",
        timestamp: new Date().toISOString(),
      },
      {
        text: "some message",
        mine: true,
        timestamp: new Date().toISOString(),
      },
    ],
  });
  const [newChat, setNewChat] = useState(false);
  const [searchUser, setSearchUser] = useState("");

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
            <TextField
              id="standard-basic"
              label="Search User"
              variant="standard"
              value={search}
              onKeyDown={({ nativeEvent: { key } }) => {
                if (key === "Enter") {
                  searchUsers();
                }
              }}
              onChange={(e) => setSearch(e.target.value)}
              inputProps={{ className: "text-white" }}
              sx={{
                width: "95%",
                marginLeft: "6px",
                input: {
                  color: "white",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                },
                label: { color: "white" },
                "& .MuiInput-underline:before": { borderBottomColor: "white" },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "white",
                },
                "& .MuiInput-underline:after": { borderBottomColor: "white" },
              }}
            />

            {(users.length === 0 && chats.length === 0) || searching ? (
              <Box
                sx={{
                  flex: 1,
                  textAlign: "center",
                  marginTop: "50px",
                  fontSize: "14px",
                }}
              >
                {searching ? (
                  <CircularProgress size={20} color="primary" />
                ) : (
                  "No chat found"
                )}
              </Box>
            ) : (
              <></>
            )}
            {users.length ? (
              <List
                component={Paper}
                sx={{
                  backgroundColor: "transparent",
                  color: "white", // This will set the text color for ListItemText
                }}
              >
                {users.map((user) => (
                  <ListItem
                    button
                    key={user._id}
                    sx={{
                      backgroundColor: "transparent",
                      "&:hover": { backgroundColor: "#FFA500" },
                    }}
                    onClick={() => handleNewChat(user)}
                  >
                    <ListItemText
                      primary={user.username}
                      sx={{
                        color: "white",
                        fontSize: "14px",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <></>
            )}
            {chats.length ? (
              <List
                component={Paper}
                sx={{
                  backgroundColor: "transparent",
                  color: "white", // This will set the text color for ListItemText
                }}
              >
                {chats.map((chat) => (
                  <ListItem
                    button
                    key={chat._id}
                    sx={{
                      backgroundColor: "transparent",
                      "&:hover": { backgroundColor: "#FFA500" },
                    }}
                    onClick={() =>
                      handleNewChat(
                        chat.peers.find((peer) => peer._id !== myid.current)
                      )
                    }
                  >
                    <ListItemText
                      primary={
                        chat.peers.find((peer) => peer._id !== myid.current)
                          .username
                      }
                      sx={{
                        color: "white",
                        fontSize: "14px",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <></>
            )}
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
