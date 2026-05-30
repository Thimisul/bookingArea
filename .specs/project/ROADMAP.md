# Roadmap

**Milestone atual:** v1 — Frontend Funcional
**Status:** In Progress

---

## v1 — Frontend Funcional

**Goal:** Cliente consegue fazer uma reserva completa do início ao fim, recebe email de confirmação e o bar vê o evento no Google Calendar.
**Target:** Produção o quanto antes

### Features

**Fluxo de reserva completo** - IN PROGRESS

- Seleção de área na home (cards com dados mockados)
- Checkout com formulário de dados pessoais + data/horário/pessoas
- Carrinho de pré-venda com cálculo de desconto (Churrasqueira Bar e Garagem)
- Submissão via webhook n8n
- Redirecionamento para `/minha-reserva/:token` após confirmação

**Integração n8n → Google Calendar + Email** - PLANNED

- Webhook recebe payload completo da reserva
- n8n cria evento no Google Calendar do bar com dados do cliente e área
- n8n envia email de confirmação ao cliente com detalhes da reserva (área, data, horário, totais, token)

**Página Minha Reserva** - IN PROGRESS

- Exibição dos detalhes da reserva (área, data, horário, pessoas, financeiro)
- Status: confirmada / cancelada
- Cancelamento local (atualiza sessionStorage, sem notificação ao bar)
- Botão "Editar" presente mas não funcional — aceito como limitação v1

**Qualidade mínima para produção** - PLANNED

- Validação de formulário com mensagens de erro inline (substituir `alert()`)
- Tratamento visual de erro quando webhook falha
- Responsividade mobile validada

---

## v2 — Persistência via n8n

**Goal:** Reservas persistem independente do browser; link `/minha-reserva/:token` funciona em qualquer dispositivo.
**Target:** Após v1 em produção

### Features

**API REST via n8n** - PLANNED

- `GET /api/v1/areas` — lista áreas (substitui `mockAreas` da home)
- `GET /api/v1/areas/:id` — detalhes + produtos (substitui `mockAreas` do checkout)
- `POST /api/v1/reservations` — cria reserva e persiste no n8n/planilha/DB leve
- `GET /api/v1/reservations/:token` — consulta reserva por token (substitui sessionStorage)

**Edição de reserva** - PLANNED

- `/reservation/:id?edit=:token` pré-preenche o formulário com dados da reserva original
- Submissão atualiza a reserva existente (via n8n)

**Cancelamento com notificação** - PLANNED

- Cancelamento remove/atualiza evento no Google Calendar
- Email de cancelamento enviado ao cliente

---

## v3 — API Própria

**Goal:** Desacoplar dados do n8n; gestão de disponibilidade e conflitos de horário.
**Target:** Quando n8n virar gargalo ou houver necessidade de lógica mais complexa

### Features

**Backend com API própria** - PLANNED

- Implementar spec de `docs/api.md`
- Verificação de disponibilidade por área/data
- Gestão de produtos e preços via admin (sem hardcode)

**Área administrativa** - PLANNED

- Visão de reservas por data
- Gestão de áreas e produtos

---

## Considerações Futuras

- Pagamento online integrado (Stripe / Pagar.me) para cobrar o sinal de R$50
- Notificação WhatsApp via n8n ao confirmar/cancelar
- Sistema de avaliação pós-evento
