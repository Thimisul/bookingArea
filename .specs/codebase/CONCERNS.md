# Concerns

## [CRÍTICO] Reservas sem persistência real

**Evidência:** `my-reservation.tsx:53` — `sessionStorage.getItem(`reserva_${token}`)`
**Impacto:** Dados da reserva existem apenas no browser do usuário que fez a reserva. Ao fechar a aba, acessar por outro dispositivo ou limpar cache, a reserva desaparece. O webhook n8n recebe os dados, mas o sistema não tem como recuperá-los para o usuário.
**Fix:** Implementar backend com persistência (ex: banco de dados) e consulta por token. Ver `docs/api.md` para spec já documentada.

## [CRÍTICO] Token gerado no servidor não é persistido

**Evidência:** `reservation.tsx:48` — `const token = crypto.randomUUID()` no `action`, retornado para o client mas não salvo em nenhum store server-side.
**Impacto:** O link `/minha-reserva/:token` só funciona no mesmo browser/aba onde a reserva foi feita. O QR code ou link enviado por email seria inútil hoje.
**Fix:** Persistir o token no backend junto com os dados da reserva (correlaciona com concern acima).

## [ALTO] Dados de áreas duplicados e dessincronizados

**Evidência:** `home.tsx:12-31` (`const areas`) e `reservation.tsx:57-127` (`const mockAreas`) — dois arrays separados descrevendo as mesmas 3 áreas, com diferentes campos.
**Impacto:** Qualquer mudança em uma área (nome, preço, produto) exige edição em dois lugares. Divergência já presente: `home.tsx` não tem `basePrice`/`products`; `reservation.tsx` não tem `tag`/`tagGreen`.
**Fix:** Fonte única de dados — mover para um `loader` que chama `GET /api/v1/areas` (spec em `docs/api.md`), ou ao menos um arquivo de constantes compartilhado.

## [ALTO] Sem testes

**Evidência:** `package.json` — nenhum framework de testes nas dependências.
**Impacto:** A lógica de cálculo de totais (`actualDiscountValue`, `productDiscountValue`, `UPFRONT_FEE`) tem vários edge cases críticos (desconto excede taxa, `applyExcessToProducts`, reserva de mesa sem taxa) sem nenhuma cobertura automatizada.
**Fix:** Adicionar Vitest (compatível com Vite) e cobrir a lógica de cálculo com testes unitários.

## [MÉDIO] Validação de formulário via `alert()`

**Evidência:** `reservation.tsx:255-258` — `if (!name || !email || ...) { alert("..."); return; }`
**Impacto:** UX ruim em mobile (alert nativo). Não indica qual campo está inválido. Sem validação de formato (email, telefone).
**Fix:** Inline validation com mensagens de erro por campo, ou biblioteca como `zod` + mensagens na UI.

## [MÉDIO] Ação de editar reserva não implementada

**Evidência:** `my-reservation.tsx:255` — `navigate(`/reservation/${reservation.areaId}?edit=${token}`)` — navega para o checkout mas `reservation.tsx` não lê o param `edit` nem pré-preenche os dados.
**Impacto:** O botão "Editar reserva" está visível mas abre um checkout vazio, sem os dados da reserva original.
**Fix:** Implementar leitura de `?edit=token` em `reservation.tsx`: ler `sessionStorage`, pré-popular os estados do formulário.

## [BAIXO] Lógica de negócio acoplada ao componente

**Evidência:** Cálculo de totais em `reservation.tsx:195-218` — inline no corpo do componente, recalculado a cada render.
**Impacto:** Dificulta testes unitários, reuso e manutenção.
**Fix:** Extrair para função pura `calculateTotals(area, cart, peopleCount)` — facilita testar e reusar em `/minha-reserva`.

## [BAIXO] `any` cast em produtos

**Evidência:** `reservation.tsx:158,373,375,419` — `(foundArea.products as any[])`, `(area.products as any)`
**Impacto:** Perde segurança de tipos nos produtos; erros de acesso a propriedade inexistente ficam silenciosos.
**Fix:** Definir interface `Product` com todos os campos e tipar `mockAreas` corretamente.

## [BAIXO] Sem testes de acessibilidade / semântica HTML

**Evidência:** Formulário em `reservation.tsx` usa `<div>` para layout, sem `<form>` nativo, `aria-*`, ou `role` nos campos interativos.
**Impacto:** Leitores de tela e navegação por teclado degradadas.
