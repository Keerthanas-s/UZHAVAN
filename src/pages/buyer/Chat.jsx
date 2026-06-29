import { useState } from "react";

function Chat() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log("Sending:", message);
    setMessage("");
  };

  return (
    <div className="page-wrapper">
      <h1>Chat with Farmers</h1>
      <div className="chat-container">
        <div className="messages">
          <div className="message received">
            <p>Hi! Can I place an order?</p>
          </div>
          <div className="message sent">
            <p>Yes, we have fresh tomatoes available</p>
          </div>
        </div>
        <div className="message-input">
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
