import {AuthProvider} from "./AuthProvider.jsx";

export default function ContextProvider({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
 }