
# Reestruturação em três ambientes

Hoje o `/app` mistura papéis: cria ordens, controla toda a cadeia, gerencia equipe, materiais, financeiro — isso é papel de **Confecção**, não de **Facção**. Vou separar em três ambientes independentes, com rotas, sidebars, permissões e dashboards próprios, refletindo o fluxo real:

```text
Confecção  →  Facção / Serviços  →  Revisão  →  Entrega
(coordena)    (executa lotes)      (QA)       (logística)
```

## 1. Três ambientes

### `/confeccao` — Núcleo coordenador (era `/app`)
Mantém tudo que já existe hoje no dashboard atual, com o enquadramento correto de "quem coordena a cadeia":
- Visão geral da cadeia
- **Ordens de produção** (era Pedidos) — cria OP, define fluxo, distribui em **lotes** para facções/serviços parceiros
- **Parceiros produtivos** (nova aba) — facções, estamparias, lavanderias, bordados, corte contratados
- **Equipe interna** (colaboradores da confecção)
- Materiais, Financeiro, Relatórios, Alertas, Perfil
- Marketplace (para contratar profissionais/facções)

### `/faccao` — Execução produtiva (NOVO)
Ambiente enxuto e mobile-first, focado em "recebo lote → executo → devolvo":
```text
/faccao                → Visão geral (lotes ativos, prazos, avisos)
/faccao/lotes          → Lotes recebidos (kanban simples: A fazer / Em produção / Pronto para envio / Entregue)
/faccao/lotes/:id      → Detalhe do lote: etapas, apontar avanço, anexar foto, marcar concluído
/faccao/historico      → Histórico produtivo (lotes finalizados, avaliação recebida)
/faccao/perfil         → Dados da facção
```
Sem: criação de OP, dashboards administrativos, financeiro global, marketplace de contratação, equipe/materiais globais.

### `/pro` — Profissional autônomo (simplificar o atual)
Simplificar para o essencial:
```text
/pro                → Visão geral
/pro/pedidos        → Pedidos recebidos + clientes básicos
/pro/agenda         → Agenda de entregas
/pro/portfolio      → Portfólio digital
/pro/perfil         → Dados
```
Remover complexidade que não faz sentido para autônomo (mantendo o que já é útil).

## 2. Modelo de dados — novos conceitos

Adicionar em `src/data/mock.ts`:

```ts
export type TipoParceiro = "faccao" | "estamparia" | "lavanderia" | "bordado" | "corte" | "revisao" | "logistica";

export interface Parceiro {
  id: string; nome: string; tipo: TipoParceiro; cidade: string;
  contato: string; capacidadeMes: number; avaliacao: number; ativo: boolean;
}

export interface Lote {
  id: string;
  ordemId: string;              // ordem de produção da confecção
  parceiroId: string;           // facção/serviço responsável
  etapa: string;                // ex: "costura", "bordado"
  quantidade: number;
  prazo: string;
  status: "enviado" | "em_producao" | "pronto" | "entregue" | "atrasado";
  observacoes?: string;
  avancoPct: number;
  historico: { data: string; texto: string; foto?: string }[];
}
```

`Pedido` vira semanticamente **Ordem de Produção** (renomear labels/UI, manter tipo por compatibilidade). Cada etapa do fluxo pode gerar um `Lote` enviado a um parceiro.

Facção "logada" fica fixa em um mock (`FACCAO_LOGADA_ID`), recebendo lotes das confecções.

## 3. Rotas e navegação

`src/App.tsx`:
```tsx
/confeccao/*   → ConfeccaoLayout   (era DashboardLayout)
/faccao/*      → FaccaoLayout      (novo, sidebar enxuta)
/pro/*         → ProLayout         (já existe, simplificar)
```
Manter `/app/*` como redirect para `/confeccao/*` para não quebrar links.

**Cadastro** ganha 3 opções: Confecção / Facção / Profissional — cada uma leva ao seu dashboard.
**Login** com toggle dos 3 perfis (mock).
**Landing** com CTAs deixando claro os três públicos.

## 4. Sidebars por perfil

**Confecção** (rica):
Visão geral · Ordens de produção · Lotes distribuídos · Parceiros produtivos · Equipe interna · Materiais · Financeiro · Relatórios · Alertas · Marketplace

**Facção** (enxuta, mobile-first):
Visão geral · Lotes recebidos · Histórico · Perfil

**Profissional** (já existe, revisar):
Visão geral · Pedidos · Agenda · Portfólio · Perfil

## 5. Arquivos

Novos:
```
src/pages/faccao/FaccaoLayout.tsx
src/pages/faccao/FaccaoHome.tsx
src/pages/faccao/FaccaoLotes.tsx
src/pages/faccao/FaccaoLoteDetalhe.tsx
src/pages/faccao/FaccaoHistorico.tsx
src/pages/faccao/FaccaoPerfil.tsx
src/pages/confeccao/Parceiros.tsx        # lista de facções/serviços contratados
src/pages/confeccao/Lotes.tsx            # visão da confecção dos lotes distribuídos
```

Renomear/ajustar (labels, textos, sidebar) em:
```
src/pages/dashboard/*  → mantém arquivo, ajusta wording para "Confecção" e "Ordem de produção"
src/pages/dashboard/DashboardLayout.tsx  → título "Confecção", inclui Parceiros e Lotes
src/App.tsx, Login, Cadastro, Index, SiteHeader
```

## 6. Fluxo operacional (ponta a ponta, mock)

1. Confecção cria **Ordem de Produção** e define o fluxo (corte → costura → bordado → revisão → entrega).
2. Para cada etapa terceirizada, cria um **Lote** e escolhe o parceiro (facção, estamparia, etc.).
3. O parceiro vê o lote em `/faccao/lotes`, atualiza avanço, anexa foto, marca "pronto".
4. Confecção acompanha em `/confeccao/lotes` (kanban por etapa/parceiro) e recebe alertas de atraso.
5. Ao concluir todos os lotes, a OP fecha em "Entregue".

## 7. Design

Mesma paleta terracota / surface / gradient-warm. Sidebar da Facção com identidade visual sutilmente diferente (badge "Facção" no topo, cor de destaque) para deixar claro o ambiente. Mobile-first reforçado no ambiente da Facção (cards grandes, ações em botões cheios, tipografia maior).

## Detalhes técnicos

- Tudo client-side, sem backend.
- Sem quebrar rotas antigas: `/app/*` redireciona para `/confeccao/*`.
- Reaproveitar componentes existentes (`PageHeader`, `UserMenu`, `Card`, `Badge`, `Tabs`, `Progress`, `Dialog`).
- Marketplace e ProfissionalDetalhe ficam acessíveis a Confecção; Facção não contrata via marketplace neste MVP.
- Facção logada fixa como mock (`f1`) para o MVP.

Quando aprovar, implemento tudo.
