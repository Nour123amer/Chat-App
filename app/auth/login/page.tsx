import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react'

export default function page() {
     const [email, setEmail] = useState();
        const [password, setPassword] = useState();
        const router = useRouter();
    
        const handleSubmit = async (e:FormEvent) =>{
            e.preventDefault();
            const res = await fetch("http://localhost:4000/login",{
                method:"POST",
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({
                    username:email,
                    password:password
                })
            });
    
            const data = await res.json();
            if(!data.error){
                localStorage.setItem("username", data.username);
                router.push("/chat")
            }
        }
  return (
    <>
    <form onSubmit={handleSubmit}>

      
        <Input value={email}
        onClick={(e:FormEvent)=>{setEmail(e.target.value)}}
        name='email' placeholder='enter your email address' type='email'  />
        <br />
        <Input value={password}
        onClick={(e)=>{setPassword(e.target.value)}}
        name='password' type='password' placeholder='enter your password' />

        <Button>Submit</Button>
    </form>
    
    </>
  )
}
