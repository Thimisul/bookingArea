# Architecture

**Padrão:** Monolítico — SPA com SSR via React Router 7 framework mode. Sem backend separado.

## Estrutura de Alto Nível

```
Browser ──→ React Router (SSR) ──→ action: POST webhook n8n
                  │
                  ├── / (home.tsx)            — seleção de área
                  ├── /reservation/:id        — checkout + pré-venda
                  └── /minha-reserva/:token   — visualização/cancelamento
```

## Padrões Identificados

### Route-as-Feature
**Localização:** `app/routes/*.tsx`
**Propósito:** Cada rota contém tudo: meta, loader (quando existir), action e componente.
**Exemplo:** `reservation.tsx` define `action`, `mockAreas`, estados, cálculo de totais e UI na mesma file.

### Action para integração externa
**Localização:** `reservation.tsx:11-53`
**Propósito:** O `action` do React Router Server-Side faz o POST ao webhook n8n, evitando expor `WEBHOOK_URL` no client.
**Implementação:** `formData` → payload JSON → `fetch(WEBHOOK_URL)` → retorna `{ success, token }` ou `{ error }`.

### Persistência temporária via sessionStorage
**Localização:** `reservation.tsx:176` e `my-reservation.tsx:53`
**Propósito:** Após o `action` retornar sucesso, os dados da reserva são gravados em `sessionStorage` com a chave `reserva_${token}`. A rota `/minha-reserva/:token` lê desse storage.
**Limitação crítica:** Os dados somem ao fechar a aba/browser. Não há backend persistindo reservas.

### Token gerado no servidor sem persistência
**Localização:** `reservation.tsx:48`
**Propósito:** `crypto.randomUUID()` gera o token no `action` (server-side). Mas o token não é salvo em lugar nenhum no servidor — só no `sessionStorage` do cliente.

## Fluxo de Dados — Reserva

```
1. Home (/) → usuário clica "Reservar" → navega para /reservation/:id
2. /reservation/:id → lê mockAreas por id → exibe formulário + carrinho
3. Usuário preenche form e clica "Confirmar e Pagar"
4. submit() → POST action (server) → fetch WEBHOOK_URL (n8n)
5. action retorna { success: true, token }
6. useEffect detecta actionData.success → grava em sessionStorage → navega para /minha-reserva/:token
7. /minha-reserva/:token → lê sessionStorage → exibe detalhes, permite cancelar
```

## Lógica de Negócio — Cálculo de Totais

Toda em `reservation.tsx` (client-side):

```
discountValue         = Σ(produto.price × qty × discountPercent/100)
actualDiscountValue   = min(discountValue, basePrice)
finalReservationPrice = basePrice - actualDiscountValue
excessDiscount        = applyExcessToProducts ? max(0, discountValue - basePrice) : 0
productDiscountValue  = min(excessDiscount, productsTotal)
finalProductsTotal    = productsTotal - productDiscountValue
finalTotal            = finalReservationPrice + finalProductsTotal
UPFRONT_FEE           = area.name === "Reserva de Mesa" ? 0 : 50
remainingTotal        = max(0, finalTotal - UPFRONT_FEE)
```

## Organização de Código

**Abordagem:** feature-por-rota — cada arquivo de rota é autocontido.
**Sem camadas separadas:** lógica de negócio, UI e integração convivem na mesma file.
**Sem componentes reutilizáveis:** nenhum `components/` directory; UI inline nas rotas.
