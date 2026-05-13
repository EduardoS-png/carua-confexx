// Dados mockados para o MVP — em produção viriam do backend
import pro1 from "@/assets/pro-1.jpg";
import pro2 from "@/assets/pro-2.jpg";
import pro3 from "@/assets/pro-3.jpg";
import pro4 from "@/assets/pro-4.jpg";

export type StatusEtapa = "pendente" | "em_andamento" | "concluido";
export type EtapaProducao = "corte" | "costura" | "acabamento" | "entrega";

export interface Pedido {
  id: string;
  cliente: string;
  produto: string;
  quantidade: number;
  prazo: string;
  valorPeca: number;
  responsavel?: string; // responsável geral (legado / coordenador)
  responsaveisPorEtapa: Partial<Record<EtapaProducao, string>>; // quem faz cada etapa
  etapaAtual: EtapaProducao;
  etapas: Record<EtapaProducao, StatusEtapa>;
  criadoEm: string;
}

export interface Material {
  id: string;
  nome: string;
  unidade: string;
  estoque: number;
  minimo: number;
  ultimaEntrada: string;
  vinculadoA?: string; // pedido id
}

export type TipoMovimento = "entrada" | "saida";

export type VinculoTipo = "pedido" | "membro" | "nenhum";

export interface MovimentoMaterial {
  id: string;
  materialId: string;
  tipo: TipoMovimento;
  quantidade: number;
  observacao?: string;
  pedidoId?: string;
  membroId?: string; // se o material foi entregue / devolvido por um membro da equipe
  data: string;
}

// Equipe interna da facção (não aparece no marketplace público)
export interface MembroEquipe {
  id: string;
  nome: string;
  funcao: string; // costureira, cortador, acabamento...
  etapas: EtapaProducao[]; // em quais etapas atua
  telefone?: string;
  pagamentoPorPeca: number; // valor que recebe por peça
  ativo: boolean;
  desde: string;
}

// Profissionais do marketplace público (autônomos, fora da facção)
export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  servicos: string[];
  precoBase: number;
  prazoMedioDias: number;
  cidade: string;
  foto: string;
  bio: string;
  portfolio: string[];
  pedidosConcluidos: number;
  avaliacao: number;
  experienciaAnos: number;
  capacidadePecasMes: number;
  formaPagamento: string[]; // PIX, dinheiro, etc
  atendeRemoto: boolean;
  certificacoes?: string[];
  maquinario?: string[];
  contato: { telefone: string; email?: string };
  disponibilidade: "imediata" | "1_semana" | "2_semanas" | "agendar";
}

// Profissionais do marketplace contratados pela facção (separado da equipe fixa)
export interface ContratadoMarketplace {
  id: string;
  profissionalId: string;
  pedidoId?: string;
  servico: string;
  status: "negociando" | "em_andamento" | "concluido";
  valorAcordado: number;
  prazoEntrega: string;
  contratadoEm: string;
}

export const equipe: MembroEquipe[] = [
  {
    id: "eq1",
    nome: "Dona Maria",
    funcao: "Costureira",
    etapas: ["costura"],
    telefone: "(81) 99999-1111",
    pagamentoPorPeca: 5,
    ativo: true,
    desde: "2024-03-10",
  },
  {
    id: "eq2",
    nome: "Joana",
    funcao: "Costureira e acabamento",
    etapas: ["costura", "acabamento"],
    telefone: "(81) 99999-2222",
    pagamentoPorPeca: 6,
    ativo: true,
    desde: "2024-08-22",
  },
  {
    id: "eq3",
    nome: "Carlos",
    funcao: "Cortador",
    etapas: ["corte"],
    telefone: "(81) 99999-3333",
    pagamentoPorPeca: 3,
    ativo: true,
    desde: "2025-01-15",
  },
  {
    id: "eq4",
    nome: "Lúcia",
    funcao: "Acabamento",
    etapas: ["acabamento", "entrega"],
    pagamentoPorPeca: 2.5,
    ativo: true,
    desde: "2025-06-02",
  },
];

export const pedidos: Pedido[] = [
  {
    id: "LT-2401",
    cliente: "Loja Mariposa",
    produto: "Camiseta básica branca",
    quantidade: 120,
    prazo: "2026-05-12",
    valorPeca: 8.5,
    responsavel: "Dona Maria",
    responsaveisPorEtapa: { corte: "Carlos", costura: "Dona Maria", acabamento: "Joana", entrega: "Lúcia" },
    etapaAtual: "costura",
    etapas: { corte: "concluido", costura: "em_andamento", acabamento: "pendente", entrega: "pendente" },
    criadoEm: "2026-04-22",
  },
  {
    id: "LT-2402",
    cliente: "Atelier Rosa",
    produto: "Vestido floral",
    quantidade: 40,
    prazo: "2026-05-08",
    valorPeca: 22,
    responsavel: "Joana",
    responsaveisPorEtapa: { corte: "Carlos", costura: "Joana", acabamento: "Joana", entrega: "Lúcia" },
    etapaAtual: "acabamento",
    etapas: { corte: "concluido", costura: "concluido", acabamento: "em_andamento", entrega: "pendente" },
    criadoEm: "2026-04-18",
  },
  {
    id: "LT-2403",
    cliente: "Confecção Sertão",
    produto: "Calça jeans masculina",
    quantidade: 80,
    prazo: "2026-05-20",
    valorPeca: 18,
    responsavel: "Carlos",
    responsaveisPorEtapa: { corte: "Carlos", costura: "Dona Maria", acabamento: "Lúcia" },
    etapaAtual: "corte",
    etapas: { corte: "em_andamento", costura: "pendente", acabamento: "pendente", entrega: "pendente" },
    criadoEm: "2026-04-28",
  },
  {
    id: "LT-2404",
    cliente: "Boutique Lírio",
    produto: "Blusa rendada",
    quantidade: 60,
    prazo: "2026-05-04",
    valorPeca: 14,
    responsavel: "Lúcia",
    responsaveisPorEtapa: { corte: "Carlos", costura: "Joana", acabamento: "Lúcia", entrega: "Lúcia" },
    etapaAtual: "entrega",
    etapas: { corte: "concluido", costura: "concluido", acabamento: "concluido", entrega: "concluido" },
    criadoEm: "2026-04-10",
  },
  {
    id: "LT-2405",
    cliente: "Maria Bonita Modas",
    produto: "Saia midi",
    quantidade: 30,
    prazo: "2026-05-15",
    valorPeca: 16,
    responsaveisPorEtapa: {},
    etapaAtual: "corte",
    etapas: { corte: "pendente", costura: "pendente", acabamento: "pendente", entrega: "pendente" },
    criadoEm: "2026-04-30",
  },
];

export const materiais: Material[] = [
  { id: "M1", nome: "Tecido algodão branco", unidade: "m", estoque: 240, minimo: 50, ultimaEntrada: "2026-04-20", vinculadoA: "LT-2401" },
  { id: "M2", nome: "Linha branca 5000m", unidade: "un", estoque: 8, minimo: 5, ultimaEntrada: "2026-04-15" },
  { id: "M3", nome: "Tecido floral", unidade: "m", estoque: 12, minimo: 30, ultimaEntrada: "2026-04-10", vinculadoA: "LT-2402" },
  { id: "M4", nome: "Botão madrepérola", unidade: "un", estoque: 1200, minimo: 200, ultimaEntrada: "2026-04-22" },
  { id: "M5", nome: "Zíper 20cm", unidade: "un", estoque: 35, minimo: 50, ultimaEntrada: "2026-04-12" },
  { id: "M6", nome: "Renda guipir", unidade: "m", estoque: 18, minimo: 10, ultimaEntrada: "2026-04-25" },
];

export const movimentosIniciais: MovimentoMaterial[] = [
  { id: "mv1", materialId: "M1", tipo: "entrada", quantidade: 300, observacao: "Compra fornecedor SP", data: "2026-04-20" },
  { id: "mv2", materialId: "M1", tipo: "saida", quantidade: 60, observacao: "Lote inicial corte", pedidoId: "LT-2401", data: "2026-04-22" },
  { id: "mv3", materialId: "M3", tipo: "saida", quantidade: 18, pedidoId: "LT-2402", data: "2026-04-23" },
];

export const profissionais: Profissional[] = [
  {
    id: "p1",
    nome: "Maria das Graças",
    especialidade: "Costureira sênior",
    servicos: ["Produção em lote", "Camisetas", "Uniformes"],
    precoBase: 8,
    prazoMedioDias: 7,
    cidade: "Caruaru, PE",
    foto: pro1,
    bio: "Há mais de 20 anos confeccionando peças com capricho. Especialista em produção em lote para pequenas marcas.",
    portfolio: ["Lote 200 camisetas — Loja Mariposa", "Uniforme escolar — Colégio Sertão", "Linha verão 2025"],
    pedidosConcluidos: 142,
    avaliacao: 4.9,
    experienciaAnos: 22,
    capacidadePecasMes: 600,
    formaPagamento: ["PIX", "Dinheiro"],
    atendeRemoto: true,
    certificacoes: ["SENAI - Costura industrial"],
    maquinario: ["Reta industrial", "Overlock", "Galoneira"],
    contato: { telefone: "(81) 98888-1010", email: "maria.gracas@email.com" },
    disponibilidade: "1_semana",
  },
  {
    id: "p2",
    nome: "João Pereira",
    especialidade: "Cortador e modelista",
    servicos: ["Modelagem", "Corte em escala", "Encaixe de tecido"],
    precoBase: 12,
    prazoMedioDias: 4,
    cidade: "Toritama, PE",
    foto: pro2,
    bio: "Modelagem precisa que economiza tecido e reduz perdas. Atende facções de pequeno e médio porte.",
    portfolio: ["Modelagem jeans masculino", "Encaixe otimizado lote 500 peças"],
    pedidosConcluidos: 98,
    avaliacao: 4.8,
    experienciaAnos: 15,
    capacidadePecasMes: 1500,
    formaPagamento: ["PIX", "Boleto"],
    atendeRemoto: false,
    certificacoes: ["SENAI - Modelagem CAD"],
    maquinario: ["Mesa de corte 3m", "Máquina de corte vertical"],
    contato: { telefone: "(81) 98888-2020", email: "joao.modelagem@email.com" },
    disponibilidade: "imediata",
  },
  {
    id: "p3",
    nome: "Ana Cristina",
    especialidade: "Acabamento e bainha",
    servicos: ["Bainha", "Ajustes", "Casa de botão"],
    precoBase: 4,
    prazoMedioDias: 3,
    cidade: "Santa Cruz do Capibaribe, PE",
    foto: pro3,
    bio: "Trabalho de acabamento com olhar de quem ama o que faz. Detalhe que faz a peça valer mais.",
    portfolio: ["Acabamento vestidos festa", "Bainha lote 300 calças"],
    pedidosConcluidos: 67,
    avaliacao: 5.0,
    experienciaAnos: 8,
    capacidadePecasMes: 800,
    formaPagamento: ["PIX"],
    atendeRemoto: true,
    maquinario: ["Overlock", "Caseadeira"],
    contato: { telefone: "(81) 98888-3030" },
    disponibilidade: "imediata",
  },
  {
    id: "p4",
    nome: "Dona Lurdinha",
    especialidade: "Bordado e renda",
    servicos: ["Bordado manual", "Renda renascença", "Aplicações"],
    precoBase: 25,
    prazoMedioDias: 10,
    cidade: "Caruaru, PE",
    foto: pro4,
    bio: "Bordado tradicional do agreste. Cada peça leva a alma da nossa cultura.",
    portfolio: ["Coleção festas juninas", "Renda renascença para vestidos"],
    pedidosConcluidos: 53,
    avaliacao: 5.0,
    experienciaAnos: 35,
    capacidadePecasMes: 120,
    formaPagamento: ["PIX", "Dinheiro"],
    atendeRemoto: false,
    certificacoes: ["Mestra em Renda Renascença - SEBRAE"],
    contato: { telefone: "(81) 98888-4040" },
    disponibilidade: "2_semanas",
  },
];

export const contratadosMarketplace: ContratadoMarketplace[] = [
  {
    id: "ct1",
    profissionalId: "p2",
    pedidoId: "LT-2403",
    servico: "Modelagem e corte em escala",
    status: "em_andamento",
    valorAcordado: 960,
    prazoEntrega: "2026-05-10",
    contratadoEm: "2026-04-28",
  },
  {
    id: "ct2",
    profissionalId: "p4",
    pedidoId: "LT-2402",
    servico: "Bordado de detalhes — 40 vestidos",
    status: "concluido",
    valorAcordado: 1000,
    prazoEntrega: "2026-04-25",
    contratadoEm: "2026-04-12",
  },
];


// ============================================================
// Lado do PROFISSIONAL AUTÔNOMO (marketplace)
// ============================================================

export type StatusPedidoConexao = "pendente" | "negociando" | "aceito" | "recusado" | "concluido";

export interface PedidoConexao {
  id: string;
  profissionalId: string;
  faccaoNome: string;
  faccaoCidade: string;
  faccaoResponsavel: string;
  servico: string;
  quantidade: number;
  valorProposto: number;
  prazo: string;
  mensagem: string;
  status: StatusPedidoConexao;
  recebidoEm: string;
  contraproposta?: { valor: number; prazo: string; observacao?: string };
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

// Profissional "logado" no MVP do dashboard do autônomo
export const PROFISSIONAL_LOGADO_ID = "p1";

export const pedidosConexao: PedidoConexao[] = [
  {
    id: "PC-001",
    profissionalId: "p1",
    faccaoNome: "Confecção Sertão",
    faccaoCidade: "Caruaru, PE",
    faccaoResponsavel: "Antônio Silva",
    servico: "Costura — camiseta básica em malha",
    quantidade: 200,
    valorProposto: 1600,
    prazo: "2026-05-25",
    mensagem: "Olá Maria! Vimos seu portfólio e gostaríamos de fechar um lote de 200 camisetas. Conseguimos enviar o tecido cortado.",
    status: "pendente",
    recebidoEm: "2026-05-12",
  },
  {
    id: "PC-002",
    profissionalId: "p1",
    faccaoNome: "Atelier Rosa",
    faccaoCidade: "Toritama, PE",
    faccaoResponsavel: "Rosângela Lima",
    servico: "Costura de vestidos floral — produção pequena",
    quantidade: 40,
    valorProposto: 880,
    prazo: "2026-05-30",
    mensagem: "Bom dia! Estou montando uma coleção e preciso de alguém de confiança para os vestidos. Pode ser?",
    status: "pendente",
    recebidoEm: "2026-05-11",
  },
  {
    id: "PC-003",
    profissionalId: "p1",
    faccaoNome: "Boutique Lírio",
    faccaoCidade: "Santa Cruz do Capibaribe, PE",
    faccaoResponsavel: "Patrícia Mendes",
    servico: "Costura blusa rendada",
    quantidade: 60,
    valorProposto: 720,
    prazo: "2026-06-05",
    mensagem: "Oi Maria, gostaria de negociar valor. Posso pagar R$ 12 a peça.",
    status: "negociando",
    recebidoEm: "2026-05-08",
    contraproposta: { valor: 900, prazo: "2026-06-08", observacao: "R$15/peça e +3 dias para garantir o acabamento" },
  },
  {
    id: "PC-004",
    profissionalId: "p1",
    faccaoNome: "Loja Mariposa",
    faccaoCidade: "Recife, PE",
    faccaoResponsavel: "Carla Souza",
    servico: "Lote 120 camisetas brancas",
    quantidade: 120,
    valorProposto: 1020,
    prazo: "2026-05-20",
    mensagem: "Fechado nas condições combinadas. Aguardando início.",
    status: "aceito",
    recebidoEm: "2026-04-28",
  },
  {
    id: "PC-005",
    profissionalId: "p1",
    faccaoNome: "Maria Bonita Modas",
    faccaoCidade: "Caruaru, PE",
    faccaoResponsavel: "Júlia Andrade",
    servico: "Saia midi — 30 peças",
    quantidade: 30,
    valorProposto: 480,
    prazo: "2026-04-30",
    mensagem: "Trabalho entregue. Obrigada pelo capricho!",
    status: "concluido",
    recebidoEm: "2026-04-05",
  },
  {
    id: "PC-006",
    profissionalId: "p1",
    faccaoNome: "Confecção Vale",
    faccaoCidade: "Toritama, PE",
    faccaoResponsavel: "Marcos Pereira",
    servico: "Bordado em uniforme escolar",
    quantidade: 50,
    valorProposto: 250,
    prazo: "2026-04-20",
    mensagem: "Não vai dar dessa vez, valor abaixo do meu mínimo.",
    status: "recusado",
    recebidoEm: "2026-04-02",
  },
];

export const portfolioItens: ItemPortfolio[] = [
  {
    id: "po1",
    profissionalId: "p1",
    titulo: "Lote 200 camisetas — Loja Mariposa",
    descricao: "Produção em malha 100% algodão, costura reta com overlock. Entrega em 7 dias.",
    cliente: "Loja Mariposa",
    ano: 2025,
    imagem: pro1,
  },
  {
    id: "po2",
    profissionalId: "p1",
    titulo: "Uniforme escolar — Colégio Sertão",
    descricao: "300 conjuntos com bordado do brasão. Trabalho em parceria com bordadeira local.",
    cliente: "Colégio Sertão",
    ano: 2025,
    imagem: pro2,
  },
  {
    id: "po3",
    profissionalId: "p1",
    titulo: "Linha verão 2025 — vestidos leves",
    descricao: "60 peças em viscose com modelagem própria. Acabamento de bainha invisível.",
    cliente: "Atelier Rosa",
    ano: 2025,
    imagem: pro3,
  },
  {
    id: "po4",
    profissionalId: "p1",
    titulo: "Camisaria masculina — sob medida",
    descricao: "Linha de 25 camisas em tricoline com botões de madrepérola.",
    ano: 2024,
    imagem: pro4,
  },
];
