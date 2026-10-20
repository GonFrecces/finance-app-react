import { Navigate, Outlet, useLocation } from "react-router"
import useAuthentication from "@/hooks/authentication"
import type { Role } from "@/lib/jwt"

interface ProtectedRouteProps {
  roles?: Role[]
}

// Guard de UI: evita mostrar pantallas sin sesión. No reemplaza la
// autorización del backend, que vuelve a validar el JWT en cada request.
export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const { session } = useAuthentication()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && !roles.includes(session.user.role)) {
    return <Navigate to="/score" replace />
  }

  return <Outlet />
}
