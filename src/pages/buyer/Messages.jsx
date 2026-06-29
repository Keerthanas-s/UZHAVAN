import { buyerMessages } from "../../data/mockData";

function Messages() {
  return (
    <div className="page-wrapper">
      <h1>Messages</h1>
      <p>Your conversations with farmers</p>
      <div className="card">
        {buyerMessages.map((msg) => (
          <div key={msg.id} className="message-item">
            <h4>{msg.sender}</h4>
            <p>{msg.content}</p>
            <small>{msg.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
