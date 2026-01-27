"use client"
import OnlineUsersProvider from "./context/onlineUsers"
import UsernameProvider from "./context/userContext"

export default function ProviderWrapper({children}) {
  return (
    <>
    <UsernameProvider>
      <OnlineUsersProvider>
          {children}
      </OnlineUsersProvider>
    </UsernameProvider>
    </>
  )
}
