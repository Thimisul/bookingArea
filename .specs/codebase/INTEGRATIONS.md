# External Integrations

## Webhook n8n

**Serviço:** n8n (self-hosted em `n8n.thimisul.com.br`)
**Propósito:** Recebe o payload de cada reserva confirmada. Provavelmente envia notificação/email e armazena o registro.
**Implementação:** `app/routes/reservation.tsx` → `action()` → `fetch(WEBHOOK_URL, { method: "POST" })`
**Configuração:** variável de ambiente `WEBHOOK_URL` em `.env`
**Autenticação:** nenhuma (URL de webhook direto)
**Payload enviado:**
```json
{
  "areaId": "1",
  "calendarId": "6a5434a1f376e4c3...@group.calendar.google.com",
  "areaName": "Churrasqueira Bar",
  "name": "...", "email": "...", "phone": "...",
  "date": "2026-06-01",
  "startTime": "19:00", "endTime": "23:00",
  "startDateTime": "2026-06-01T19:00:00-03:00",
  "endDateTime": "2026-06-01T23:00:00-03:00",
  "people": "8",
  "cart": { "p1": 2 },
  "totals": { "finalTotal": 640, "finalReservationPrice": 0, "finalProductsTotal": 640,
              "discountValue": 400, "productDiscountValue": 0,
              "upfrontFee": 50, "remainingTotal": 590 }
}
```
`calendarId` vem do `mockAreas` — cada área tem seu Google Calendar ID. O n8n usa esse campo para criar o evento no calendário correto.
**Resposta esperada:** HTTP 2xx (qualquer). O conteúdo da resposta não é usado.

## Google Fonts

**Serviço:** Google Fonts CDN
**Propósito:** Fonte Inter (400–900, italic + normal)
**Implementação:** `app/root.tsx` → `links()` → `<link rel="stylesheet" href="https://fonts.googleapis.com/...">`
**Configuração:** hardcoded no root
**Impacto offline:** sem a fonte, o browser usa fallback `sans-serif`

## sessionStorage (pseudo-persistência)

**Serviço:** browser API nativa
**Propósito:** Armazenar dados da reserva entre a confirmação e a visualização em `/minha-reserva/:token`
**Chave:** `reserva_${token}` (onde `token` = UUID gerado no `action`)
**Escrita:** `reservation.tsx:176` após `actionData.success`
**Leitura:** `my-reservation.tsx:53`
**Limite:** dados perdidos ao fechar aba/browser ou em outro dispositivo

## Variáveis de Ambiente

| Variável | Uso | Obrigatório |
|----------|-----|-------------|
| `WEBHOOK_URL` | URL do webhook n8n para envio de reservas | Sim |
| `API_URL` | Base URL da futura API REST (documentada em `docs/api.md`, não implementada) | Não |
