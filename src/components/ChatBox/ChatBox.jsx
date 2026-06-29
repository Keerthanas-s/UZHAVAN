import React, { useState } from "react";
import { Paper, TextField, Button } from "@mui/material";
import "../../styles/chatBox.css";

const ChatBox = ({ onSend }) => {
  const [msg, setMsg] = useState("");

  return (
    <Paper className="chat-box">
      <div className="chat-input-area">
        <TextField
          fullWidth
          size="small"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type message..."
        />

        <Button
          variant="contained"
          className="chat-btn"
          onClick={() => {
            onSend(msg);
            setMsg("");
          }}
        >
          Send
        </Button>
      </div>
    </Paper>
  );
};

export default ChatBox;