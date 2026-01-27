"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { OnlineUsersContext } from "@/context/onlineUsers";
import { Backpack } from "lucide-react";
import { ChevronLeft } from "lucide-react";



export default function Intro() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const { onlineUsers } = useContext(OnlineUsersContext);

  // const myUsername = localStorage.getItem("username");

  console.log("online users =>", onlineUsers)


  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:4000/users");
      const data = await res.json();

      setUsers(data)
    }

    fetchUsers();
  }, [])

  console.log("CONTEXT ONLINE:", onlineUsers);


  return (
    <>

   <div className="relative h-full bg-gray-50">

  {/* Header */}
  <div className="sticky top-0 z-10 flex items-center gap-3 bg-white shadow-sm px-4 py-3">
    <button
      onClick={() => router.back()}
      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full transition"
    >
      <ChevronLeft size={22} />
    </button>
    <h2 className="font-semibold text-gray-700">Chats</h2>
  </div>

  {/* Users list */}
  <div className="flex flex-col gap-1 p-2">

    {users && users.map((user) => {
      const isOnline = onlineUsers?.includes(user.username);

      return (
        <div
          key={user._id}
          onClick={() => {
            setSelectedUser(user.username.trim());
            router.push(`/chat?to=${encodeURIComponent(user.username.trim())}`);
          }}
          className="group flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer shadow-sm hover:shadow-md hover:bg-emerald-50 transition-all"
        >

          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-700">
              {user.username[0].toUpperCase()}
            </div>

            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          {/* Username */}
          <div className="flex flex-col flex-1">
            <span className="font-medium text-gray-800 group-hover:text-emerald-700">
              {user.username}
            </span>
            <span className="text-xs text-gray-400">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

        </div>
      );
    })}

  </div>
</div>



    </>
  )
}
