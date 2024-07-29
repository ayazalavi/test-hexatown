import React, { useEffect, useRef, useState } from "react";
import { Paper, Typography, Box, TextField, Button } from "@mui/material";

const ChatInterface = ({ peer, messages, sendMessage, myuserid }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  console.log(peer);
  const handleSendMessage = () => {
    // Handle the message sending logic here
    console.log("Send message:", message);
    sendMessage(message, peer); // Clear the input after sending
    setMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent",
      }}
    >
      {/* User Name and Last Sign-in Date */}
      <Box>
        <Typography variant="h6" sx={{ color: "white" }}>
          {peer.username}
        </Typography>
        <Typography variant="caption" sx={{ color: "white" }}>
          Last sign-in: {peer.dateLastSigned}
        </Typography>
      </Box>

      {/* Messages Container */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          mt: 2,
          mb: 2,
        }}
      >
        {messages ? (
          messages.map((message, index) => (
            <Box
              key={index}
              mb={2}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender._id === myuserid ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                sx={{
                  padding: "8px",
                  display: "inline-block",
                  backgroundColor: "#FFA500",
                  color: "white",
                }}
              >
                <Typography variant="body1">{message.message}</Typography>
                <Typography variant="caption">{message.dateSent}</Typography>
              </Paper>
            </Box>
          ))
        ) : (
          <></>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Chat Input Box */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          onKeyDown={(e) =>
            e.nativeEvent.key === "Enter" ? handleSendMessage() : false
          }
          sx={{
            mr: 2,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#FFA500",
              },
              "&:hover fieldset": {
                borderColor: "#FFA500",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#FFA500",
              },
            },
          }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: "#FFA500" }}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatInterface;
