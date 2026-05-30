# bookingArea — Sistema de Reservas Casa Verde Bar

**Vision:** Sistema de reservas online do Casa Verde Bar onde o cliente escolhe a área, preenche os dados, monta o pedido de consumação antecipada (nas áreas permitidas) e confirma — gerando automaticamente uma agenda no Google Calendar e enviando email de confirmação ao cliente.

**Para:** Clientes do Casa Verde Bar que querem reservar uma área ou mesa.
**Resolve:** Eliminar reservas feitas por WhatsApp/telefone sem registro formal — cada reserva vira um evento no Google Calendar e o cliente recebe confirmação por email.

## Goals

- Cliente consegue reservar qualquer área sem contato humano (zero intervenção manual para confirmar)
- Cada reserva gera evento no Google Calendar do bar + email de confirmação ao cliente via n8n
- Carrinho de pré-venda funcional nas áreas Churrasqueira Bar e Churrasqueira Garagem, com desconto aplicado corretamente na taxa de reserva

## Tech Stack

**Core:**
- Framework: React Router 7.14.0 (SSR, framework mode)
- Linguagem: TypeScript 5.9
- Banco de dados: nenhum (v1 frontend-only)

**Dependências-chave:** React 19, Tailwind CSS 4, n8n (webhook), Google Calendar (via n8n)

## Scope

**v1 inclui (frontend-only, mock data):**
- Seleção de área na home (3 áreas: Churrasqueira Bar, Churrasqueira Garagem, Reserva de Mesa)
- Formulário de checkout com dados pessoais, data/horário e número de pessoas
- Carrinho de pré-venda com cálculo de desconto na taxa de reserva
- Submissão via webhook n8n → cria evento Google Calendar + envia email ao cliente
- Página `/minha-reserva/:token` com detalhes da reserva (baseada em sessionStorage — v1 aceita essa limitação)
- Mock data (`mockAreas`) mantido hardcoded — sem API

**Explicitamente fora do escopo (v1):**
- Backend próprio / banco de dados
- Edição de reserva após confirmação (botão presente mas incompleto — aceito como limitação v1)
- Cancelamento com notificação ao bar (cancelamento local no browser apenas)
- Autenticação / área administrativa
- Pagamento online (sinal de R$50 é cobrado presencialmente ou via link separado)

## Constraints

- Timeline: quanto antes (prioritário)
- Técnico: frontend-only; toda automação via n8n
- Recursos: desenvolvedor solo
