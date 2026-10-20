import { Button } from "@/components/ui/button"
import useAuthentication from "@/hooks/authentication"
import { formatRut } from "@/lib/rut"
import { ScoreLookup } from "@/views/score/ScoreLookup"

export const ScorePage = () => {
  const { session, logout } = useAuthentication()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <span className="font-medium">Finance App</span>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            Rol: {session?.user.role}
            {session?.user.rut && ` · RUT ${formatRut(session.user.rut)}`}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center p-6">
        <ScoreLookup />
      </main>
    </div>
  )
}
