// Validación de formato en el cliente (feedback rápido). El dígito
// verificador lo valida el backend (400 si es inválido).
export const RUT_FORMAT = /^\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]$/

// El token trae el RUT normalizado ("123456785"); se muestra como "12.345.678-5".
export function formatRut(rut: string): string {
  const clean = normalizeRut(rut)
  const body = clean.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${body}-${clean.slice(-1)}`
}

// Forma canónica para comparar RUTs: sin puntos ni guion y con K mayúscula.
export function normalizeRut(rut: string): string {
  return rut.replace(/[.\s-]/g, "").toUpperCase()
}
