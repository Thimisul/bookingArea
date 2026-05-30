# State

## Decisões

- **2026-05-29** — v1 é frontend-only. Mock data (`mockAreas`) fica hardcoded até v2. Sem backend próprio.
- **2026-05-29** — sessionStorage como persistência de reserva é aceito para v1. Limitação documentada.
- **2026-05-29** — Integração n8n → Google Calendar + email é o entregável central do v1.
- **2026-05-29** — Botão "Editar reserva" fica visível mas sem funcionalidade real até v2.
- **2026-05-29** — v2 implementa API REST via n8n. v3 potencialmente migra para API própria consumindo outra aplicação.

## Blockers

_(nenhum registrado)_

## TODOs

- [ ] Configurar workflow n8n: webhook → Google Calendar + email
- [ ] Validação inline de formulário (substituir `alert()`)
- [ ] Testar fluxo completo em produção (mobile first)

## Deferred

- Edição de reserva → v2
- Cancelamento com notificação ao bar → v2
- Autenticação / admin → v3
- Pagamento online → futuro

## Preferências

_(nenhuma registrada)_
