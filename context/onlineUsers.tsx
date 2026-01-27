import { createContext, useState } from "react";


export const OnlineUsersContext = createContext<any>(null);

export default function OnlineUsersProvider({children}:{children:React.ReactNode}){
    const [onlineUsers, setOnlineUsers] = useState([]);

    return(
        <>
        <OnlineUsersContext.Provider value={{onlineUsers, setOnlineUsers}}>
          {children}
        </OnlineUsersContext.Provider>
        
        </>
    )
}