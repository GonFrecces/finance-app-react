import { Navigate, useLocation, useNavigate, type Location } from "react-router"
import useAuthentication from "@/hooks/authentication"
import { LoginForm } from "@/views/auth/LoginForm"

export const LoginPage = () => {
  const { session } = useAuthentication()
  const navigate = useNavigate()
  const location = useLocation()
  // Vuelve a la ruta protegida que el usuario intentó abrir, si existe.
  const from = (location.state as { from?: Location } | null)?.from?.pathname
  const target = from && from !== "/login" ? from : "/score"

  if (session) return <Navigate to={target} replace />

  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <LoginForm onSuccess={() => navigate(target, { replace: true })} />
    </main>
  )
}
