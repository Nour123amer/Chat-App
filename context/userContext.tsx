import { createContext, useState } from "react";

 export const UsernameContext = createContext<any>();


 export default function UsernameProvider({children}:{children:React.ReactNode}){
    const [username, setUsername] = useState<string>("");


    return(
        <>
        <UsernameContext.Provider value={{username, setUsername}}>
            {children}
        </UsernameContext.Provider>
        
        </>
    )
 }