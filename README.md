# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

## Finance App (challenge)

```bash
cp .env.example .env   # VITE_API_URL=http://localhost:3000
bun install
bun run dev            # http://localhost:5173 (el backend debe estar corriendo)
```

Usuarios mock: `admin / Admin123!`, `juan / User123!`, `maria / User456!`.
