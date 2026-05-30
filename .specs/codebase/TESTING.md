# Testing Infrastructure

## Frameworks

**Unit/Integration:** nenhum instalado
**E2E:** nenhum instalado
**Coverage:** nenhum

## Estado Atual

O projeto não possui nenhum teste. Nenhum framework de testes está nas dependências (`package.json`).

## Test Coverage Matrix

| Camada | Tipo Requerido | Padrão de Localização | Comando |
|--------|----------------|----------------------|---------|
| Lógica de cálculo de totais (`reservation.tsx`) | unit | `app/routes/__tests__/reservation.test.ts` | — (não definido) |
| action (integração webhook) | integration/mock | `app/routes/__tests__/reservation.action.test.ts` | — |
| Rotas E2E | e2e | `e2e/` | — |

## Parallelism Assessment

| Tipo de Teste | Parallel-Safe? | Modelo de Isolamento |
|---------------|----------------|---------------------|
| Unit | Sim | sem estado compartilhado |
| Integration | N/A | não implementado |
| E2E | N/A | não implementado |

## Gate Check Commands

| Nível | Quando Usar | Comando |
|-------|-------------|---------|
| Typecheck | Após qualquer mudança de código | `npm run typecheck` |
| Build | Antes de deploy | `npm run build` |

> Não há comandos de test. O único gate automatizável hoje é `npm run typecheck`.

## Recomendação

A lógica de cálculo de totais (`discountValue`, `actualDiscountValue`, `productDiscountValue`, etc.) é o candidato mais crítico para cobertura de testes unitários — é pura, sem efeitos colaterais, e tem vários edge cases (excesso de desconto, `applyExcessToProducts`, `UPFRONT_FEE` variável).
