import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuthentication from "@/hooks/authentication"
import { ApiError, getScore, type ScoreResponse } from "@/lib/api"
import { RUT_FORMAT, formatRut, normalizeRut } from "@/lib/rut"
import { ScoreResult } from "@/views/score/ScoreResult"

interface ScoreFormValues {
  rut: string
}

export const ScoreLookup = () => {
  const { session, logout } = useAuthentication()
  const isAdmin = session?.user.role === "admin"
  const ownRut = session?.user.rut ? formatRut(session.user.rut) : ""

  const [result, setResult] = useState<ScoreResponse | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ScoreFormValues>({
    defaultValues: { rut: ownRut },
    // Valida al salir del campo y luego en cada cambio.
    mode: "onTouched",
  })

  // Misma regla que RutOwnershipGuard en el backend, aplicada antes de enviar
  // para dar feedback inmediato. El backend sigue siendo la fuente de verdad.
  const validateOwnership = (value: string) =>
    isAdmin ||
    normalizeRut(value) === normalizeRut(session?.user.rut ?? "") ||
    "Solo puedes consultar tu propio RUT"

  const onSubmit = async ({ rut }: ScoreFormValues) => {
    if (!session) return
    try {
      setResult(await getScore(rut.trim(), session.token))
    } catch (err) {
      setResult(null)
      if (err instanceof ApiError && err.status === 401) {
        // Token vencido o inválido: la ruta protegida redirige al login.
        logout()
        return
      }
      // Errores del servidor (400 RUT inválido, 403 RUT ajeno) se muestran
      // en el mismo campo.
      setError("rut", {
        type: "server",
        message:
          err instanceof ApiError && err.status === 403
            ? "No tienes permiso para consultar este RUT"
            : err instanceof Error
              ? err.message
              : "Error inesperado",
      })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Score financiero</CardTitle>
        <CardDescription>
          {isAdmin
            ? "Como administrador puedes consultar cualquier RUT."
            : "Solo puedes consultar el score de tu propio RUT."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-2"
        >
          <Label htmlFor="rut">RUT</Label>
          <div className="flex items-start gap-2">
            <Input
              id="rut"
              placeholder="12.345.678-5"
              aria-invalid={!!errors.rut}
              aria-describedby={errors.rut ? "rut-error" : undefined}
              {...register("rut", {
                setValueAs: (value: string) => value.trim(),
                required: "Ingresa un RUT",
                pattern: {
                  // Formato en el cliente; el dígito verificador lo valida el backend.
                  value: RUT_FORMAT,
                  message: "Formato de RUT inválido (ej: 12.345.678-5)",
                },
                validate: validateOwnership,
              })}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Consultando..." : "Consultar"}
            </Button>
          </div>
          {errors.rut && (
            <p id="rut-error" role="alert" className="text-sm text-destructive">
              {errors.rut.message}
            </p>
          )}
        </form>
        {result && <ScoreResult data={result} />}
      </CardContent>
    </Card>
  )
}
