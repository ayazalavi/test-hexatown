import { IChat } from "@/app/chat/page";
import { List, ListItem, ListItemText, Paper } from "@mui/material";
import React, { RefObject } from "react";

export type ChatsType = {
  chats: IChat[];
  handleNewChat: (user: any) => void;
  myid: RefObject<string>;
};

export default function Chats({ chats, handleNewChat, myid }: ChatsType) {
  return chats.length ? (
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
            handleNewChat(chat.peers.find((peer) => peer._id !== myid.current))
          }
        >
          <ListItemText
            primary={
              chat.peers.find((peer) => peer._id !== myid.current)?.username
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
  );
}
