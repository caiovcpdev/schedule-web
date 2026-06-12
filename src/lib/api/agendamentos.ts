import { http } from "./http";
import type { Agendamento, AgendamentoRequest } from "../types";

export const agendamentosApi = {
  listar: () => http.get<Agendamento[]>("/api/Agendamentos").then((r) => r.data),
  obter: (id: string) =>
    http.get<Agendamento>(`/api/Agendamentos/${id}`).then((r) => r.data),
  criar: (dto: AgendamentoRequest) =>
    http.post<Agendamento>("/api/Agendamentos", dto).then((r) => r.data),
  confirmar: (id: string) =>
    http.patch(`/api/Agendamentos/${id}/confirmar`).then((r) => r.data),
  cancelar: (id: string) =>
    http.patch(`/api/Agendamentos/${id}/cancelar`).then((r) => r.data),
};