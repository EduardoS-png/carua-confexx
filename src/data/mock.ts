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
  responsavel?: string; // nome de um membro da equipe interna
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

export interface MovimentoMaterial {
  id: string;
  materialId: string;
  tipo: TipoMovimento;
  quantidade: number;
  observacao?: string;
  pedidoId?: string;
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
  },
];
