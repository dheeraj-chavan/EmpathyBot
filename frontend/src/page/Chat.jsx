import React, { useState } from "react";
import { logOut } from '../firebase/authFirebase';
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const navigate = useNavigate();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    const userMessage = { sender: "user", text: userInput };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });
      
      const data = await response.json();
      
      const botMessage = { sender: "assistant", text: data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "assistant", text: "Unexpected Error Occurred" },
      ]);
    }
    setUserInput("");
  };

  const handleNewChat = () => {
    setMessages([]);
    setUserInput("");
  };

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <div className="font-roboto h-screen flex flex-col bg-gray-50">
      <div className="w-full p-4 bg-[#e97363] text-white flex justify-between items-center">
        <div className="font-instrument italic text-2xl font-semibold">EmpathyBot</div>
        <div className="flex space-x-2">
          <button className="bg-white text-blue-500 px-4 py-2 rounded-xl" onClick={handleNewChat}>New</button>
          <button className="bg-white text-blue-500 px-4 py-2 rounded-xl" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 w-full max-w-7xl mx-auto">
        <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 mx-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-3`}>
              <div className={`${message.sender === "user" ? "bg-gray-200 text-black" : "bg-[#e97363] text-white"} p-3 rounded-xl max-w-[75%] sm:max-w-md break-words`}>{message.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-white border-t border-gray-200 shadow-sm">
        <form className="w-full max-w-7xl mx-auto p-4 flex items-center gap-2" onSubmit={handleSendMessage}>
          <div className="w-full flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-100 text-black rounded-lg"
              placeholder="Type a message"
              required
            />
            <button type="submit" className="px-6 py-3 bg-[#e97363] text-white rounded-lg hover:bg-[#d66959]">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
