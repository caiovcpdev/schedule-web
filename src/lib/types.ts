// Tipos espelhando os DTOs da API .NET.
// Ajuste conforme os response DTOs reais do backend.

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

export interface Profissional {
  id: string;
  nome: string;
  email: string;
  especialidade: string;
  inicioExpediente: string; // "HH:mm:ss"
  fimExpediente: string;
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracaoEmMinutos: number;
}

export type StatusAgendamento = "Pendente" | "Confirmado" | "Cancelado" | string;

export interface Agendamento {
  id: string;
  clienteId: string;
  profissionalId: string;
  servicoId: string;
  dataHoraInicio: string;
  observacao?: string | null;
  status?: StatusAgendamento;
  cliente?: Cliente;
  profissional?: Profissional;
  servico?: Servico;
}

export interface AgendamentoListagem {
  id: string;
  clienteNome: string;
  profissionalNome: string;
  servicoNome: string;
  servicoPreco: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  status: string;
  observacao?: string;
  createdAt: string;
}

export interface AgendamentoRequest {
  clienteId: string;
  profissionalId: string;
  servicoId: string;
  dataHoraInicio: string; // ISO
  observacao?: string;
}

export interface ClienteRequest {
  nome: string;
  email: string;
  telefone: string;
}

export interface ProfissionalRequest {
  nome: string;
  email: string;
  especialidade: string;
  inicioExpediente: string;
  fimExpediente: string;
}

export interface ServicoRequest {
  nome: string;
  descricao: string;
  preco: number;
  duracaoEmMinutos: number;
}