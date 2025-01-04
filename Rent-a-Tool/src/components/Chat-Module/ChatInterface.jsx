import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with your server URL

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatUser, setChatUser] = useState({
    name: "John Doe",
    profilePicture: "https://via.placeholder.com/50",
  }); // Dummy data for the user you're chatting with

  useEffect(() => {
    // Listen for incoming messages
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.off("chat message");
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;

    const messageData = {
      sender: "You",
      text: input,
      timestamp: new Date().toISOString(),
    };

    socket.emit("chat message", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-0">
      {/* Profile Section */}
      <div className="flex items-center p-4 bg-white shadow rounded-t">
        <img
          src={chatUser.profilePicture}
          alt="Profile"
          className="w-12 h-12 rounded-full mr-4"
        />
        <h1 className="text-xl font-semibold">{chatUser.name}</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 bg-white shadow rounded-b">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 rounded ${
              msg.sender === "You"
                ? "bg-blue-100 self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
