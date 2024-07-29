import { IUser } from "@/app/chat/page";
import { List, ListItem, ListItemText, Paper } from "@mui/material";
import React from "react";

export type UsersType = {
  users: IUser[];
  handleNewChat: (user: any) => void;
};
export default function Users({ users, handleNewChat }: UsersType) {
  return users.length ? (
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
  );
}
