"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UsernameContext } from '@/context/userContext';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useContext, useEffect } from 'react'

export default function User() {
    
  const { username, setUsername } = useContext(UsernameContext);
  const router = useRouter();

  useEffect(()=>{
    localStorage.setItem("username", username);
  },[username])


  return (
   <>
   <div className='flex flex-col gap-4 h-fit'>
    
    <p className='mb-4'>Please enter your name</p>
    <br />
   <Input className='mb-4' value={username} onChange={(e)=>{setUsername(e.target.value)}} />
   <Button onClick={()=>{router.push("/intro")}} >Next</Button>
   </div>
   </>
  )
}
