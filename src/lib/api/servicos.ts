import { http } from "./http";
import type { Profissional, Servico, ServicoRequest } from "../types";

export const servicosApi = {
  listar: () => 
    http.get<Servico[]>("/api/Servicos").then((r) => r.data),

  obter: (id: string) =>
    http.get<Servico>(`/api/Servicos/${id}`).then((r) => r.data),
  
  criar: (dto: ServicoRequest) =>
    http.post<Servico>("/api/Servicos", dto).then((r) => r.data),

  obterProfissionalPorServico: (id: string) =>
    http.get<Profissional[]>(`/api/Servicos/${id}/profissionais`).then((r) => r.data),

  atualizar: (id: string, dto: ServicoRequest) =>
      http.put<Servico>(`/api/Servicos/${id}`, dto).then((r) => r.data),
};  