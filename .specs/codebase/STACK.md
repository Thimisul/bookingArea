# Tech Stack

**Analisado:** 2026-05-29

## Core

- Framework: React Router 7.14.0 (framework mode — SSR habilitado)
- Linguagem: TypeScript 5.9.3
- Runtime: Node.js (via `@react-router/serve`)
- Gerenciador de pacotes: npm

## Frontend

- UI Framework: React 19.2.4
- Estilização: Tailwind CSS 4.2.2 via plugin Vite (sem `tailwind.config.js`)
- State Management: `useState` local — sem biblioteca global
- Formulários: controlled inputs nativos (sem biblioteca)
- Fonte: Inter (Google Fonts, carregada no `root.tsx`)

## Backend

- API Style: sem API própria — `action` do React Router faz POST direto ao webhook n8n
- Banco de dados: nenhum — dados de áreas em `mockAreas` hardcoded em `reservation.tsx`
- Persistência de reserva: `sessionStorage` (client-side only, volátil)
- Autenticação: nenhuma

## Testes

- Nenhum framework de testes instalado

## Serviços Externos

- Webhook: n8n (`WEBHOOK_URL` em `.env`) — recebe o payload de cada reserva
- Fontes: Google Fonts (Inter)

## Ferramentas de Desenvolvimento

- Build: Vite 8.0.3
- Bundler/Dev server: Vite via plugin `@react-router/dev`
- Tipos gerados: `react-router typegen` → `.react-router/types/`
- Containerização: Dockerfile presente (imagem Node, serve o build)
