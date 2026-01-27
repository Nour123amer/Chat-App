"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UsernameContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import { FormEvent, useContext, useState } from 'react'

export default function Signup() {
    // const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {username, setUsername} = useContext(UsernameContext);
    const router = useRouter();

    const handleSubmit = async(e:FormEvent) =>{

        e.preventDefault();
        const res = await fetch("http://localhost:4000/register",{
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                username:username,
                password:password
            })
        });

        const data = await res.json();
        if(!data.error){
            localStorage.setItem("username", data.username);
            setUsername(data.username)
            // router.push(`/chat?to=${encodeURIComponent(data.username.trim())}`)
            router.push("/intro")
        }
    }


  return (
    <>
    <form onSubmit={handleSubmit} className='w-fit'>

        <br />
        <Input value={username}
        onChange={(e)=> {setUsername(e.target.value)}}
        className='mb-4'
        name='username' placeholder='enter your username address' type='username'  />
        <br />
        <Input value={password}
        className='mb-4'
        onChange={(e)=>{setPassword(e.target.value)}}
        name='password' type='password' placeholder='enter your password' />

        <Button className='bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer'>Submit</Button>
    </form>
    
    </>
  )
}
