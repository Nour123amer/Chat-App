"use client"
import GroupIdProvider from "./context/groupIdContext"
import OnlineUsersProvider from "./context/onlineUsers"
import UsernameProvider from "./context/userContext"

export default function ProviderWrapper({children}) {
  return (
    <>
    <UsernameProvider>
      <OnlineUsersProvider>
        <GroupIdProvider>
          {children}
        </GroupIdProvider>
      </OnlineUsersProvider>
    </UsernameProvider>
    </>
  )
}
