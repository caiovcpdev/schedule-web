import { http } from "./http";
import type { Cliente, ClienteRequest } from "../types";

export const clientesApi = {
  listar: () => http.get<Cliente[]>("/api/Clientes").then((r) => r.data),
  obter: (id: string) =>
    http.get<Cliente>(`/api/Clientes/${id}`).then((r) => r.data),
  criar: (dto: ClienteRequest) =>
    http.post<Cliente>("/api/Clientes", dto).then((r) => r.data),
  atualizar: (id: string, dto: ClienteRequest) =>
    http.put<Cliente>(`/api/Clientes/${id}`, dto).then((r) => r.data),
};