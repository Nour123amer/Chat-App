"use client"
import UsernameProvider from "./context/userContext"

export default function ProviderWrapper({children}) {
  return (
    <>
    <UsernameProvider>
        {children}
    </UsernameProvider>
    </>
  )
}
