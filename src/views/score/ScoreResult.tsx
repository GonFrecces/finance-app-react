import type { ScoreResponse } from "@/lib/api"

interface ScoreResultProps {
  data: ScoreResponse
}

export const ScoreResult = ({ data }: ScoreResultProps) => {
  const fecha = new Date(data.fecha).toLocaleString("es-CL")

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">RUT</span>
        <span className="font-mono">{data.rut}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Score</span>
        <span className="text-3xl font-semibold tabular-nums">
          {data.score}
          <span className="text-sm text-muted-foreground"> / 100</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${data.score}%` }}
        />
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">Fecha</span>
        <time dateTime={data.fecha} className="text-sm">
          {fecha}
        </time>
      </div>
    </div>
  )
}
