"use client";
import { OnlineUsersContext } from "@/context/onlineUsers";
import { UsernameContext } from "@/context/userContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";


export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { username, setUsername } = useContext(UsernameContext);
  const [socket, setSocket] = useState(null);
  // const [currentUser, setCurrentUser] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedUser = searchParams.get("to");
  const { setOnlineUsers} = useContext(OnlineUsersContext);

  useEffect(()=>{
  const stored = localStorage.getItem("username");
   setUsername(stored)
  },[])

  useEffect(() => {
    const socket = io("http://localhost:4000");
    setSocket(socket);
    return () => socket.disconnect();
  }, [])


useEffect(() => {
  if (!socket) return;

  const handler = (users) => {
    setOnlineUsers(users);
      console.log("ONLINE FROM SERVER:", users);

  };

  socket.on("online_users", handler);

  return () => socket.off("online_users", handler);

}, [socket]);



  useEffect(() => {
  if (!socket || !username || username === "null") return;

  socket.emit("user_online", username);

}, [socket, username]);


  useEffect(() => {

  if (!username || !selectedUser || !socket) return;
    const room = [username, selectedUser].sort().join("__");
    socket?.emit("join_room", room)
    console.log("Joining room:", room);

    const fetchMessages = async () => {
      const result = await fetch(`http://localhost:4000/messages/${username}/${selectedUser}`);
      const data = await result.json();
      setMessages(data)
      console.log("fetch data =>", data)

    }

    fetchMessages();

     socket.on("receive_message", (data) => {
      console.log("📩 New message:", data);

      setMessages((prev) => [...prev, data]);
    });

    return () => socket?.off("receive_message");

  }, [username, selectedUser, socket])



  const sendMessage = () => {
    if (!message) return;
    const room = [username, selectedUser].sort().join("__");
    const now = new Date();

socket?.emit("send_message", {
  text: message,
  sender: username,
  receiver: selectedUser,
  room:room,
  createdAt: now
});


setMessage("");
  };

  console.log("username ==>", username)

  return (
    <>

<h2 className="fixed bg-emerald-500 px-5 text-white">{selectedUser}</h2>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3  space-y-2 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.sender === username ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`px-3 py-2 rounded-xl max-w-[75%] shadow ${m.sender === username
                  ? "bg-emerald-500 text-white rounded-br-sm"
                  : "bg-white text-gray-800 border rounded-bl-sm"
                }`}
            >
              <p className="text-xs opacity-70 mb-1">{selectedUser}</p>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-1 p-2 border-t  absolute bottom-14 h-16 overflow-hidden">
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

        <button
          onClick={() => router.back()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full transition"
        >
          Back
        </button>
      </div>
    </>


  );
}
