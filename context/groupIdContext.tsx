import { createContext, useState } from "react";


export const GroupIdContext = createContext(null);

export default function GroupIdProvider ({children}:{children:React.ReactNode}){
    const[groupId, setGroupId] = useState();

    return(
        <>
        <GroupIdContext.Provider value={{groupId, setGroupId}}>
           {children}
        </GroupIdContext.Provider>
        </>
    )
}