# Project Structure

**Root:** `/home/thimisul/claude/bookingArea`

## Árvore de Diretórios

```
bookingArea/
├── app/
│   ├── app.css              # Estilos globais (Tailwind entry point)
│   ├── root.tsx             # Layout raiz: <html>, fontes, ErrorBoundary
│   ├── routes.ts            # Registro das rotas
│   └── routes/
│       ├── home.tsx         # / — seleção de área
│       ├── reservation.tsx  # /reservation/:id — checkout + pré-venda
│       └── my-reservation.tsx # /minha-reserva/:token — visualização/cancel
├── public/
│   ├── favicon.ico / favicon.svg
│   ├── logo.svg
│   ├── lounge_area.png      # Imagem Churrasqueira Bar
│   ├── private_room.png     # Imagem Churrasqueira Garagem
│   └── restaurant_table.png # Imagem Reserva de Mesa
├── docs/
│   └── api.md               # Spec da futura API REST (não implementada)
├── .specs/                  # Documentação de arquitetura (este diretório)
├── .react-router/           # Tipos gerados (não editar manualmente)
├── build/                   # Output do build (não commitar)
├── vite.config.ts           # Plugins: tailwindcss() + reactRouter()
├── react-router.config.ts   # Configuração do framework mode
├── tsconfig.json
├── package.json
├── Dockerfile               # Build + serve para produção
└── .env                     # WEBHOOK_URL (não commitar)
```

## Módulos

### Rota Home (`app/routes/home.tsx`)
**Propósito:** Página de seleção de área — exibe cards das áreas disponíveis.
**Dados:** `areas` array hardcoded (apenas dados de exibição, sem preços).
**Interatividade:** seletor de pessoas para "Reserva de Mesa", nav com IntersectionObserver.

### Rota Reservation (`app/routes/reservation.tsx`)
**Propósito:** Checkout completo — formulário de dados, carrinho de pré-venda, resumo financeiro.
**Dados:** `mockAreas` com toda a lógica de negócio (preços, produtos, regras de desconto).
**Server:** `action` que submete ao webhook n8n.

### Rota My Reservation (`app/routes/my-reservation.tsx`)
**Propósito:** Visualização, edição (redirect) e cancelamento da reserva.
**Dados:** lidos do `sessionStorage` — sem chamada ao servidor.

## Onde as Coisas Vivem

**Dados de áreas:**
- Exibição (home): `home.tsx` → `const areas`
- Dados completos (checkout): `reservation.tsx` → `const mockAreas`

**Lógica de negócio:**
- Cálculo de totais: `reservation.tsx` (inline no componente)
- Regras de desconto: `reservation.tsx` (inline)

**Integração externa:**
- Webhook n8n: `reservation.tsx` → `action()`

**Assets estáticos:**
- Imagens das áreas: `public/`
- Logo: `public/logo.svg`

**Configuração:**
- Variáveis de ambiente: `.env`
- Build/dev: `vite.config.ts`
- Rotas: `app/routes.ts`
