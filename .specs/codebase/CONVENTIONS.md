# Code Conventions

## Nomenclatura

**Arquivos de rota:**
- kebab-case: `home.tsx`, `reservation.tsx`, `my-reservation.tsx`

**Componentes:**
- PascalCase: `Home`, `Reservation`, `MyReservation`
- Exportados como `export default function`

**Variáveis e funções:**
- camelCase: `tablePeople`, `activeCategory`, `updateCart`, `handleConfirmAndPay`
- Constantes de domínio em UPPER_SNAKE: `UPFRONT_FEE`

**Tipos:**
- PascalCase: `ReservationData`
- Inline quando simples, `type` nomeado quando reutilizado

## Importações

Ordem observada em `reservation.tsx`:
1. React hooks (`useState`, `useEffect`)
2. React Router hooks (`useParams`, `useNavigate`, etc.)
3. Tipos gerados (`./+types/reservation`)

Sem import de CSS por rota — só `app.css` no root.

## Estrutura de Arquivo de Rota

1. Imports
2. `export function meta()`
3. `export async function loader()` (se houver)
4. `export async function action()` (se houver)
5. Mocks/constantes locais
6. `export default function ComponenteNome()`

## Estilização

- Tailwind CSS 4 com classes inline — sem CSS Modules, sem styled-components
- Design tokens como valores literais nas classes (`bg-[#1a261e]`, `text-[#ffcc29]`)
- Classes utilitárias reutilizadas via variável de string:
  ```ts
  const inputClass = "w-full bg-[#1a261e] border border-white/10 ...";
  const labelClass = "block text-xs font-semibold text-white/40 ...";
  ```
- Opacidade como modificador: `border-white/8`, `bg-[#006b3e]/75`

## Tipos de Rotas

- Sempre importar tipos gerados: `import type { Route } from "./+types/<rota>"`
- Nunca tipar `loader`/`action` manualmente — usar `Route.LoaderArgs`, `Route.ActionArgs`

## Comentários

Ausentes na maior parte. Quando usados, demarcam seções de UI:
```tsx
{/* Header */}
{/* Pré-venda */}
{/* Resumo */}
```

## Tratamento de Erros

- `action` retorna `{ error: string }` em vez de lançar exceção
- `useEffect` em `reservation.tsx` detecta `actionData?.error` e chama `alert()`
- Sem `ErrorBoundary` por rota — apenas o global em `root.tsx`

## Formulários

- Controlled inputs: cada campo tem `useState` próprio
- Submissão via `useSubmit()` do React Router (não `<Form>` declarativo)
- Validação: `if (!name || !email ...)` + `alert()` antes do submit
