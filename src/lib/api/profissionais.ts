import { http } from "./http";
import type { Profissional, ProfissionalRequest } from "../types";

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
};