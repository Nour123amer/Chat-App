"use client";
import { GroupIdContext } from "@/context/groupIdContext";
import { OnlineUsersContext } from "@/context/onlineUsers";
import { UsernameContext } from "@/context/userContext";
import { BellDot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { username, setUsername } = useContext(UsernameContext);
  const { setOnlineUsers } = useContext(OnlineUsersContext);
  const [notifications, setNotifications] = useState();

  const [socket, setSocket] = useState<Socket | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedUser = searchParams.get("to");

      const groupId = searchParams.get("groupId")
  

  // get username
  useEffect(() => {
    const stored = localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  // init socket
  useEffect(() => {
    const s = io("http://localhost:4000");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // user online
  useEffect(() => {
    if (!socket || !username) return;
    socket.emit("user_online", username);
  }, [socket, username]);

  // online users
  useEffect(() => {
    if (!socket) return;

    const handler = (users: string[]) => {
      setOnlineUsers(users.filter((user)=> user !== username));
      console.log("users",users)
    };

    socket.on("online_users", handler);
    return () => socket.off("online_users", handler);
  }, [socket]);



  // notifications
  useEffect(() => {
    if (!socket || !username) return;

    const handler = (data: any) => {
      console.log("🔔 Notification:", data);
      setNotifications(`${data.title}\n${data.body}`);
    };

    socket.on("notification:new", handler);
    return () => socket.off("notification:new", handler);
  }, [socket]);





  // join room + messages
//   useEffect(() => {
//     if (!socket || !username || !selectedUser) return;

//     const room = [username, selectedUser].sort().join("__");
// ;
//     socket.emit("join_room", room);

//     fetch(`http://localhost:4000/messages/${username}/${selectedUser}`)
//       .then(res => res.json())
//       .then(setMessages);

//     const handler = (data: any) => {
//       setMessages(prev => [...prev, data]);
//     };

//     socket.on("receive_message", handler);
//     return () => socket.off("receive_message", handler);
//   }, [socket, username, selectedUser]);

//   const sendMessage = () => {
//     if (!message || !socket) return;

//     const room = [username, selectedUser].sort().join("__");

//     socket.emit("send_message", {
//       sender: username,
//       receiver: selectedUser,
//       text: message,
//       room,
//     });

//     setMessage("");
//   };

useEffect(() => {
  if (!socket || !username) return;

  let room = "";
  let url = "";

  if (selectedUser) {
    // 💬 chat فردي
    room = [username, selectedUser].sort().join("__");
    url = `http://localhost:4000/messages/${username}/${selectedUser}`;
  } 
  else if (groupId) {
    // 👥 جروب
    room = `group_${groupId}`;
    url = `http://localhost:4000/group-messages/${groupId}`;
  }

  socket.emit("join_room", room);

  fetch(url)
    .then(res => res.json())
    .then(setMessages);

  const handler = (data: any) => {
    setMessages(prev => [...prev, data]);
  };
console.log("join room =>",room)
  socket.on("receive_message", handler);

  return () => socket.off("receive_message", handler);

}, [socket, username, selectedUser, groupId]);


const sendMessage = () => {
  if (!message || !socket) return;

  if (selectedUser) {
    // 💬 فردي
    const room = [username, selectedUser].sort().join("__");

    socket.emit("send_message", {
      sender: username,
      receiver: selectedUser,
      text: message,
      room,
    });
  }

  else if (groupId) {
    // 👥 جروب
    const room = `group_${groupId}`;

    socket.emit("send_group_message", {
      sender: username,
      groupId,
      text: message,
      room,
    });
  }

  setMessage("");
};


  return (
  <>
  {/* Header */}
  <div className="fixed top-25 w-[375px] z-0 h-12 bg-emerald-500 flex items-center px-4 text-white font-semibold shadow">
    {selectedUser}  <BellDot className="mx-3" />
    <p className="bg-gray-50 text-emerald-500 rounded-lg p-2 relative top-6 shadow-md ">{notifications}</p>
  </div>

  {/* Messages */}
  <div className="pt-14 pb-24 px-3 space-y-3 h-screen ">
    {messages.map((m, i) => (
      <div
        key={i}
        className={`flex ${m.sender === username ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`relative max-w-[75%] px-3 py-2 rounded-2xl shadow-sm ${
            m.sender === username
              ? "bg-emerald-500 text-white rounded-br-sm"
              : "bg-white text-gray-800 rounded-bl-sm"
          }`}
        >
          <p className="text-sm break-words">{m.text}</p>
          <span className="absolute -top-6 left-2">{m.sender}</span>

          <span className="block text-[10px] opacity-70 mt-1 text-right">
            {new Date(m.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    ))}
  </div>

  {/* Input */}
  <div className="fixed bottom-16 w-[375px] bg-white border-t p-2 flex items-center gap-2">
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
      className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
    />

    <button
      onClick={sendMessage}
      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full transition"
    >
      Send
    </button>

    <button
      onClick={() => router.back()}
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-full transition"
    >
      Back
    </button>
  </div>
</>

  );
}
