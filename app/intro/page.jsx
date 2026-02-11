"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { OnlineUsersContext } from "@/context/onlineUsers";
import { ChevronLeft } from "lucide-react";
import { UsernameContext } from "@/context/userContext";
import { GroupIdContext } from "@/context/groupIdContext";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function Intro() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const { onlineUsers } = useContext(OnlineUsersContext);
  const { username , setUsername} = useContext(UsernameContext);
  const [selectedMember, setSelectedMember] = useState([]);
  const [groups, setGroups] = useState([]);
  const { groupId, setGroupId } = useContext(GroupIdContext);
  const [groupName, setGroupName] = useState("");

  useEffect(()=>{
  const  user =  localStorage.getItem("username");
  setUsername(user)
  },[username])


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


    const createGroup = async () => {
      if (!username) return;
      const res = await fetch("http://localhost:4000/groups", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: groupName,
          members: [username, ...selectedMember]
        })
      })

      const data = await res.json();
      setGroupId(data);
console.log("group created")
      await getGroups();

    }

    // createGroup();

    const getGroups = async () => {
      if (!username) return;
      const res = await fetch(`http://localhost:4000/groups/${username}`);
        if (!res.ok) {
    console.log("Failed to fetch groups");
    return;
  }
      const data = await res.json();
      setGroups(data);

  console.log("groups ==>", data)


    }

 useEffect(()=>{
  if(username) getGroups();


 },[username])
  

  console.log("CONTEXT ONLINE:", onlineUsers);
  console.log("username", username)


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

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Create Group</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Select members</PopoverTitle>
               <span>
                      <label>Enter group name:</label>
                      <Input type="text" value={groupName} onChange={(e)=>{setGroupName(e.target.value)}} />
                    </span>
              <PopoverDescription className="flex flex-col gap-1 p-2 overflow-y-scroll h-[350px]">

                {users && users.map((user) => {
                  const isOnline = onlineUsers?.includes(user.username);

                  return (
                    <>
                   
                      <span key={user._id}
                        className="group flex items-center gap-3 bg-white rounded-xl px-2 py-3 cursor-pointer shadow-sm
                            hover:shadow-md hover:bg-emerald-50 transition-all">
                        <Checkbox

                          onClick={() => {
                            setSelectedMember(prev => [...prev, user.username.trim()]);
                            console.log("selectedGroupMembers =>", selectedMember)
                            // router.push(`/chat?to=${encodeURIComponent(user.username.trim())}`);
                          }}
                          className=""
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
                            <span className="font-medium text-gray-800 group-hover:text-emerald-700 text-xs">
                              {user.username}
                            </span>
                            <span className="text-xs text-gray-400">
                              {isOnline ? "Online" : "Offline"}
                            </span>
                          </div>

                        </Checkbox>
                      </span>
                    </>
                  );
                })}

              </PopoverDescription>
              <Button
              onClick={()=>{
                createGroup();
                console.log("group created")
              }}
              className="my-3 bg-emerald-700">Save</Button>

            </PopoverHeader>
          </PopoverContent>
        </Popover>

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
                  <div onClick={() => { selectedMember(prev => [...prev, user.username]) }} className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center font-bold text-emerald-700">
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

          {groups && groups.map((group) => {
            return <div
              key={group._id}
              onClick={() => {
                setSelectedUser(group.name.trim());
                router.push(`/chat?groupId=${group._id}`);
              }}
              className="group flex items-center gap-3 bg-white rounded-xl px-4 py-3 cursor-pointer shadow-sm hover:shadow-md hover:bg-emerald-50 transition-all"
            >
              {group.name}
            </div>
          })}

        </div>
      </div>



    </>
  )
}
