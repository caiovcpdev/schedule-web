import { http } from "./http";
import type { Profissional, ProfissionalRequest, Servico } from "../types";

export interface SlotDisponivel {
  inicio: string;
  fim: string;
}

export const profissionaisApi = {
  listar: () =>
    http.get<Profissional[]>("/api/Profissionais").then((r) => r.data),

  obter: (id: string) =>
    http.get<Profissional>(`/api/Profissionais/${id}`).then((r) => r.data),
  
  disponibilidade: (id: string, data: string, intervalo = 30) =>
    http
      .get<SlotDisponivel[] | string[]>(
        `/api/Profissionais/${id}/disponibilidade`,
        { params: { data, intervalo } },
      )
      .then((r) => r.data),
  
  criar: (dto: ProfissionalRequest) =>
    http.post<Profissional>("/api/Profissionais", dto).then((r) => r.data),

  obterServicoPorProfissional: (id: string) =>
       http.get<Servico[]>(`/api/Profissionais/${id}/servicos`).then((r) => r.data),

  atualizar: (id: string, dto: ProfissionalRequest) => 
    http.put<Profissional>(`/api/Profissionais/${id}`, dto).then((r) => r.data),

  vincularServico: (profissionalId: string, servicoId: string) => 
    http.post(`/api/Profissionais/${profissionalId}/servicos/${servicoId}`,).then((r) => r.data)
};