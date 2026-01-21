"use client"
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { use, useContext } from "react";
import { UsernameContext } from "@/context/userContext";
import Image from "next/image";
import Link from "next/link";

const users = [
  { id:"1", name: "Alice Johnson", image: "/images/success-2.jpg" },
  { id:"2", name: "Mohamed Ali", image: "/images/success-3.png" },
  { id:"3", name: "Sophia Brown", image: "/images/success-4.jpg" },
  { id:"4", name: "Ahmed Hassan", image: "/images/success-5.jpg" },
  { id:"5", name: "Emma Wilson", image: "/images/success-6.jpg" },
  { id:"6", name: "Omar Khaled", image: "/images/success-2.jpg" },
  { id:"7", name: "Liam Smith", image: "/images/success-3.png" },
  { id:"8", name: "Noor Adel", image: "/images/success-4.jpg" },
  { id:"9", name: "Olivia Martinez", image: "/images/success-5.jpg" },
  { id:"10", name: "Youssef Samir", image: "/images/success-5.jpg" },
  { id:"11", name: "Ava Thompson", image: "/images/success-2.jpg" },
  { id:"12", name: "Hassan Mahmoud", image: "/images/testimonial-2.png" },
  { id:"13", name: "Mia Anderson", image: "/images/testimonial-1.jpg" },
  { id:"14", name: "Karim Nabil", image: "/images/testimonial-2.png" },
  { id:"15", name: "Isabella Garcia", image: "/images/testimonial-1.jpg" }
]
export default function Intro() {
const router = useRouter();
const { username, setUsername } = useContext(UsernameContext);
return (
  <>
   <div className="flex justify-center items-center min-h-screen bg-gray-100">
     <Card className="w-[380px] h-[600px] bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden py-0 gap-0">
        {/* Header */}
     <div className="bg-emerald-600 text-white px-4 py-5 font-semibold text-center  rounded-tl-2xl  rounded-tr-2xl">
         Chat App
          </div>
          {/* <p>Please enter your name.</p>
        <Input 
        value={username}
        onChange={(e)=>{setUsername(e.target.value)}}
        className="bg-white" /> */}
          <div className="overflow-y-auto">
          {users && users.map((user) => (
            
               <Link href="/chat" key={user.id} className="flex gap-2 mb-2 items-center px-3 py-2">
                <Image src={user.image} width={40} height={40} className="rounded-full" alt="user image" />
                <p>{user.name}</p>
                <hr />

              </Link>
            
          ))}
          </div>

          {/* <Button
            onClick={() => { router.push("/chat") }}
            className="bg-white text-lime-500 cursor-pointer px-5 w-fit">Next</Button> */}
        </Card>
      </div>
    </>
  )
}
