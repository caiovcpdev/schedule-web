import { http } from "./http";
import type { Servico, ServicoRequest } from "../types";

export const servicosApi = {
  listar: () => http.get<Servico[]>("/api/Servicos").then((r) => r.data),
  obter: (id: string) =>
    http.get<Servico>(`/api/Servicos/${id}`).then((r) => r.data),
  criar: (dto: ServicoRequest) =>
    http.post<Servico>("/api/Servicos", dto).then((r) => r.data),
};