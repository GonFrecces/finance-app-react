import { use } from "react"
import { AuthContext } from "@/context/auth-context"

const useAuthentication = () => {
  const context = use(AuthContext)
  if (!context) {
    throw new Error("useAuthentication debe usarse dentro de <AuthProvider>")
  }
  return context
}

export default useAuthentication
