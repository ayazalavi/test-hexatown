import { Box, CircularProgress } from "@mui/material";
import React from "react";

export type LeftMenuType = {
  users: any[];
  chats: any[];
  searching: boolean;
};
export default function NoChats({ users, chats, searching }: LeftMenuType) {
  return (users.length === 0 && chats.length === 0) || searching ? (
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
  ) : null;
}
