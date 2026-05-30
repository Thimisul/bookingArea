# API — bookingArea

Especificação dos endpoints necessários para substituir o `mockAreas` em `reservation.tsx` por uma API real. O frontend já está estruturado para receber esses dados via `loader` do React Router; a migração é cirúrgica.

---

## Base URL

```
/api/v1
```

Pode ser servida pelo próprio React Router (route handlers em `routes/api/`) ou por um backend externo configurado via variável de ambiente `API_URL`.

---

## Endpoints

### `GET /api/v1/areas`

Lista todas as áreas disponíveis para reserva. Usado na home para exibir os cards.

**Response `200`**

```json
[
  {
    "id": "1",
    "name": "Churrasqueira Bar",
    "image": "/lounge_area.png",
    "capacity": "Até 15 pessoas",
    "consumption": "Valor convertido em consumação"
  },
  {
    "id": "2",
    "name": "Churrasqueira Garagem",
    "image": "/private_room.png",
    "capacity": "Até 50 pessoas",
    "consumption": "Consumo aplica desconto"
  },
  {
    "id": "3",
    "name": "Reserva de Mesa",
    "image": "/restaurant_table.png",
    "capacity": "Até 12 pessoas",
    "consumption": "Sem taxa de reserva"
  }
]
```

> Nota: os campos `capacity` e `consumption` são strings de exibição, derivadas de `maxPeople` e da lógica de `basePrice`/`hasDiscountProducts`. Podem ser geradas no backend ou computadas no frontend a partir do endpoint de detalhes.

---

### `GET /api/v1/areas/:id`

Retorna os detalhes completos de uma área, incluindo produtos disponíveis para pré-venda. Usado em `reservation.tsx` para substituir o `mockAreas.find()`.

**Params**

| Param | Tipo   | Descrição       |
|-------|--------|-----------------|
| `id`  | string | ID da área      |

**Response `200`**

```json
{
  "id": "1",
  "name": "Churrasqueira Bar",
  "image": "/lounge_area.png",
  "basePrice": 400,
  "minPeople": 1,
  "maxPeople": 15,
  "openTime": "17:00",
  "closeTime": "23:30",
  "hasDiscountProducts": true,
  "applyExcessToProducts": false,
  "observations": "Acesso exclusivo à área VIP com atendimento dedicado.",
  "products": [
    {
      "id": "p1",
      "name": "Combo Absolut + RedBull",
      "price": 350,
      "discountPercent": 100
    },
    {
      "id": "p2",
      "name": "Combo Gin Beefeater + Tônica",
      "price": 400,
      "discountPercent": 100
    }
  ]
}
```

**Response `404`**

```json
{ "error": "Área não encontrada." }
```

**Campos explicados**

| Campo                   | Tipo      | Descrição |
|-------------------------|-----------|-----------|
| `calendarId`            | string    | ID do Google Calendar da área — usado pelo n8n para criar o evento no calendário correto |
| `basePrice`             | number    | Taxa de reserva em R$. `0` = sem taxa (ex: Reserva de Mesa) |
| `minPeople`             | number    | Mínimo de pessoas |
| `maxPeople`             | number    | Máximo de pessoas |
| `openTime`              | string    | Horário de abertura `HH:MM` |
| `closeTime`             | string    | Horário de encerramento `HH:MM` |
| `hasDiscountProducts`   | boolean   | Se a área exibe o carrinho de pré-venda |
| `applyExcessToProducts` | boolean   | Se o desconto que excede `basePrice` abate também os produtos |
| `products[].discountPercent` | number | % do valor do produto que abate a taxa de reserva |

---

### `POST /api/v1/reservations`

Cria uma nova reserva. Substitui o envio direto ao webhook n8n — o backend pode então encaminhar ao n8n ou processar internamente.

> Por enquanto o frontend envia direto ao `WEBHOOK_URL` via `action` do React Router. A migração para este endpoint é opcional e depende de autenticação/persistência futura.

**Body `application/json`**

```json
{
  "areaId": "1",
  "calendarId": "6a5434a1f376e4c3aade9330128fd8afa3d5d84f6c934fb9acd36c36605794d9@group.calendar.google.com",
  "areaName": "Churrasqueira Bar",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(42) 99999-0000",
  "date": "2026-06-01",
  "startTime": "19:00",
  "endTime": "23:00",
  "startDateTime": "2026-06-01T19:00:00-03:00",
  "endDateTime": "2026-06-01T23:00:00-03:00",
  "people": "8",
  "cart": {
    "p1": 2,
    "p3": 1
  },
  "totals": {
    "finalTotal": 640,
    "finalReservationPrice": 0,
    "finalProductsTotal": 640,
    "discountValue": 400,
    "productDiscountValue": 0,
    "upfrontFee": 50,
    "remainingTotal": 590
  }
}
```

**Response `201`**

```json
{ "success": true, "reservationId": "uuid-gerado" }
```

**Response `422`**

```json
{ "error": "Data indisponível para esta área." }
```

---

## Lógica de negócio — cálculo de totais

O frontend calcula os totais localmente com base nos dados da área. Documentado aqui para garantir consistência em uma futura validação server-side.

```
discountValue         = Σ (produto.price × qty × produto.discountPercent / 100)
actualDiscountValue   = min(discountValue, basePrice)
finalReservationPrice = basePrice - actualDiscountValue

excessDiscount        = applyExcessToProducts ? max(0, discountValue - basePrice) : 0
productDiscountValue  = min(excessDiscount, productsTotal)
finalProductsTotal    = productsTotal - productDiscountValue

finalTotal            = finalReservationPrice + finalProductsTotal
UPFRONT_FEE           = basePrice === 0 ? 0 : 50   (sinal cobrado online)
remainingTotal        = max(0, finalTotal - UPFRONT_FEE)
```

---

## Como migrar o frontend

1. **Criar um `loader` em `reservation.tsx`** que chama `GET /api/v1/areas/:id` e retorna os dados da área.
2. **Substituir o `useEffect` + `mockAreas.find()`** por `useLoaderData()` — o dado já chega no servidor, sem flash de carregamento.
3. **Criar um `loader` em `home.tsx`** que chama `GET /api/v1/areas` para gerar os cards dinamicamente.
4. O `action` de `reservation.tsx` pode continuar enviando ao `WEBHOOK_URL` ou ser alterado para `POST /api/v1/reservations` quando houver backend com persistência.

**Antes (mock):**
```ts
// reservation.tsx
const foundArea = mockAreas.find(a => a.id === id);
setArea(foundArea);
```

**Depois (API):**
```ts
// reservation.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const res = await fetch(`${process.env.API_URL}/api/v1/areas/${params.id}`);
  if (!res.ok) throw new Response("Área não encontrada", { status: 404 });
  return res.json();
}

// no componente:
const area = useLoaderData<typeof loader>();
```

---

## Variáveis de ambiente

| Variável      | Uso                                      |
|---------------|------------------------------------------|
| `WEBHOOK_URL` | Webhook n8n — destino atual das reservas |
| `API_URL`     | Base URL da futura API (quando criada)   |
