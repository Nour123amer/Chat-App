import Signup from "./auth/Signup/page";
import User from "./user/page";


export default function Home() {


  return (
    <div className="flex min-h-[500px]  items-center justify-center bg-zinc-50 font-sans dark:bg-black">

       <Signup />
    </div>
  );
}
