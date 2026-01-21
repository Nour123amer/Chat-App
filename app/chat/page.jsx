"use client";
import { Card } from "@/components/ui/card";
import { UsernameContext } from "@/context/userContext";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
    const {username} = useContext(UsernameContext);
    const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (!message) return;
    socket.emit("send_message", {text:message, user:username});
    setMessage("");
    setCurrentUser(username)
  };

  return (
 <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[380px] h-[600px] bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden py-0 gap-0">

        {/* Header */}
        <div className="bg-emerald-600 text-white px-4 py-5 font-semibold text-center  rounded-tl-2xl  rounded-tr-2xl">
          Chat App
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3  space-y-2 bg-gray-50">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.user === username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-xl max-w-[75%] shadow ${
                  m.user === username
                    ? "bg-emerald-500 text-white rounded-br-sm"
                    : "bg-white text-gray-800 border rounded-bl-sm"
                }`}
              >
                <p className="text-xs opacity-70 mb-1">{m.user}</p>
                <p>{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 p-3 border-t bg-white">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <button
            onClick={sendMessage}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full transition"
          >
            Send
          </button>
        </div>
      </Card>
    </div>
  
  );
}
