# Área do Profissional Autônomo

Hoje o MVP tem só o lado da **facção**. Vou adicionar o lado do **profissional autônomo** (costureira, cortador, bordadeira) que se cadastra no marketplace, monta o portfólio digital e recebe pedidos de conexão das facções.

## 1. Fluxo de acesso

- Na página de **Cadastro** (`/cadastro`), adicionar seleção de tipo de conta no topo: **Facção** ou **Profissional autônomo**.
- Ao escolher "Profissional", o cadastro leva para `/pro` (novo dashboard do profissional).
- Na **Login**, mesmo formulário, mas com toggle simulado para entrar como profissional.
- No `SiteHeader` e `Index`, ajustar CTAs para deixar claro que existem dois caminhos ("Sou facção" / "Sou profissional").

## 2. Novo dashboard do profissional (`/pro`)

Layout próprio, mais leve que o da facção (sidebar enxuta, cara de "perfil pessoal"):

```text
/pro                  → Visão geral (resumo simples)
/pro/portfolio        → Editar portfólio digital
/pro/perfil           → Dados profissionais e contato
/pro/pedidos          → Pedidos de conexão de facções
/pro/agenda           → Disponibilidade e capacidade
```

### Visão geral
KPIs simples e humanos:
- Pedidos de conexão pendentes
- Trabalhos em andamento
- Avaliação média e total de pedidos concluídos
- Visualizações do portfólio (mock)
- Próximas entregas
- Bloco "Complete seu perfil" com % de preenchimento

### Portfólio digital (`/pro/portfolio`)
- Foto de capa + bio
- Lista de trabalhos (título, descrição, fotos mock, cliente, ano)
- Adicionar/remover itens via dialog
- Preview "como aparece no marketplace" (reusa o card do `Marketplace.tsx`)

### Perfil (`/pro/perfil`)
Edição dos campos que já existem em `Profissional`:
- Nome, especialidade, cidade, bio
- Serviços oferecidos (chips editáveis)
- Preço base, prazo médio, capacidade peças/mês, anos de experiência
- Maquinário, certificações, formas de pagamento, atende remoto
- Contato (telefone, e-mail) e disponibilidade

### Pedidos de conexão (`/pro/pedidos`)
Coração do dashboard. Lista de **convites de facções** querendo contratar:
- Card com nome da facção, serviço solicitado, quantidade, prazo, valor proposto, mensagem
- Status: `pendente`, `negociando`, `aceito`, `recusado`, `concluido`
- Ações: **Aceitar**, **Recusar**, **Contraproposta** (dialog com novo valor/prazo)
- Filtros por status + tabs (Novos / Em andamento / Histórico)

### Agenda (`/pro/agenda`)
- Toggle de disponibilidade atual (imediata / 1 semana / 2 semanas / agendar)
- Capacidade mensal restante (barra de progresso baseada nos aceitos)
- Lista de compromissos firmados com prazos

## 3. Dados mock (`src/data/mock.ts`)

Adicionar:

```ts
export interface PedidoConexao {
  id: string;
  faccaoNome: string;
  faccaoCidade: string;
  profissionalId: string;
  servico: string;
  quantidade: number;
  valorProposto: number;
  prazo: string;
  mensagem: string;
  status: "pendente" | "negociando" | "aceito" | "recusado" | "concluido";
  recebidoEm: string;
}

export interface ItemPortfolio {
  id: string;
  profissionalId: string;
  titulo: string;
  descricao: string;
  cliente?: string;
  ano: number;
  imagem: string;
}

export const pedidosConexao: PedidoConexao[] = [/* 5-6 mocks variados para p1 */];
export const portfolioItens: ItemPortfolio[] = [/* 4-5 itens para p1 */];
```

O profissional "logado" no dashboard será fixo no `p1` (Maria das Graças) para o MVP.

## 4. Arquivos novos

```
src/pages/pro/ProLayout.tsx        # sidebar própria, header com avatar
src/pages/pro/ProHome.tsx          # visão geral
src/pages/pro/ProPortfolio.tsx
src/pages/pro/ProPerfil.tsx
src/pages/pro/ProPedidos.tsx
src/pages/pro/ProAgenda.tsx
```

Rotas registradas em `src/App.tsx` agrupadas em `/pro`.

## 5. Integração com o lado da facção

- Na página de **detalhe do profissional** (`ProfissionalDetalhe.tsx`), o botão "Solicitar conexão" passa a abrir um dialog de envio de proposta (mock — só fecha com toast). Isso fecha o ciclo visual: a facção envia → o profissional vê na sua área de pedidos.
- No `Marketplace.tsx`, sem mudança estrutural.

## 6. Design

- Mesma paleta (terracota / surface / gradient-warm) e tipografia já estabelecidas.
- Sidebar do profissional mais curta e com tom mais "pessoal" (avatar grande + nome em destaque no topo).
- Cards de pedido de conexão com hierarquia clara: facção em destaque, valor e prazo como chips, ações como botões primários.

## Detalhes técnicos

- Tudo client-side com mocks; sem backend.
- Reaproveitar `PageHeader`, `Card`, `Badge`, `Dialog`, `Tabs`, `Progress` já existentes.
- Tipos exportados de `mock.ts` para serem usados nas novas páginas.
- Sem mudanças no schema da facção; apenas adições.

Quando aprovar, eu implemento.
