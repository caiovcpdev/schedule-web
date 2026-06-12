# Atelier — Frontend de Agendamentos

Frontend em **React + Vite + TanStack Router** para o sistema de agendamentos.
Pensado para ser simples, organizado e fácil de manter.

## Stack

- **React 19 + TypeScript**
- **Vite** (dev server e build)
- **TanStack Router** (file-based routing)
- **TanStack Query** (cache de dados da API)
- **TailwindCSS v4** + **shadcn/ui** (UI components acessíveis, headless e customizáveis — "similar a HeroUI")
- **axios** para chamadas HTTP
- **sonner** para notificações
- **lucide-react** para ícones

> Nota: começamos com shadcn/ui porque já vem totalmente configurado com Tailwind v4 e funciona out-of-the-box. Os componentes vivem em `src/components/ui/` e podem ser editados livremente — você é dono do código.

## Como rodar

```bash
bun install        # ou npm install
bun dev            # http://localhost:5173
bun run build      # build de produção
```

Configure a URL da API no arquivo `.env` na raiz:

```
VITE_API_URL=https://localhost:7135
```

## Estrutura de pastas

```
src/
├── components/
│   ├── ui/                 # Componentes base (shadcn/ui)
│   ├── layout/             # SiteHeader, AdminShell
│   └── PageHeader.tsx
├── lib/
│   ├── api/                # Chamadas HTTP por recurso
│   │   ├── http.ts         # instância axios + interceptor de erros
│   │   ├── agendamentos.ts
│   │   ├── clientes.ts
│   │   ├── profissionais.ts
│   │   └── servicos.ts
│   ├── auth.ts             # auth mockada (admin/admin)
│   ├── theme.ts            # dark mode (localStorage)
│   ├── types.ts            # tipos espelhando os DTOs da API
│   └── utils.ts
├── routes/                 # file-based routing
│   ├── __root.tsx          # layout raiz + providers
│   ├── index.tsx           # / — landing pública
│   ├── agendar.tsx         # /agendar — fluxo do cliente
│   ├── login.tsx           # /login — admin
│   ├── admin.tsx           # /admin (layout protegido com sidebar)
│   ├── admin.index.tsx     # /admin — dashboard
│   ├── admin.agendamentos.tsx
│   ├── admin.clientes.tsx
│   ├── admin.profissionais.tsx
│   └── admin.servicos.tsx
└── styles.css              # design tokens (Warm Boutique)
```

## Áreas

- **Cliente** (público): `/` e `/agendar` — fluxo de agendamento.
- **Admin** (protegido): `/admin/*` — gestão de agendamentos, clientes, profissionais e serviços.

### Login admin (mockado)

Use `admin` / `admin`. A "autenticação" salva uma flag em `localStorage`.
**Substituir por JWT real** quando o backend expuser endpoint de login:
- Trocar `src/lib/auth.ts` para chamar `/api/auth/login`.
- Adicionar um interceptor em `src/lib/api/http.ts` para enviar `Authorization: Bearer ...`.

## Como adicionar uma página nova

1. Crie `src/routes/minha-pagina.tsx`:
   ```tsx
   import { createFileRoute } from "@tanstack/react-router";
   export const Route = createFileRoute("/minha-pagina")({
     component: () => <h1>Olá</h1>,
   });
   ```
2. Link com `<Link to="/minha-pagina">`. A rota é registrada automaticamente.

## Como adicionar uma chamada de API

1. Adicione o tipo em `src/lib/types.ts`.
2. Crie/edite o arquivo em `src/lib/api/<recurso>.ts`:
   ```ts
   import { http } from "./http";
   export const recursoApi = {
     listar: () => http.get("/api/Recurso").then(r => r.data),
   };
   ```
3. Use no componente:
   ```tsx
   const { data } = useQuery({ queryKey: ["recurso"], queryFn: recursoApi.listar });
   ```

## Design System

Tokens em `src/styles.css` usando `oklch`. Tema **Warm Boutique**
(branco-creme, marrom escuro, terracota, âmbar). Dark mode opcional via
botão no header (salvo em `localStorage`).

Nunca use cores hardcoded (`bg-white`, `text-black`) — use tokens semânticos
(`bg-background`, `text-foreground`, `bg-primary`, etc.).

## Acessibilidade

- Componentes Radix (base do shadcn) — totalmente navegáveis por teclado.
- Inputs com `<Label>` associada.
- Botões de ícone com `aria-label`.
- Contraste validado em light e dark.
