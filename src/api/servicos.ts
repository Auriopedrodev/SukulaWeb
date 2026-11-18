// PEDIDOS À API: serviços
//   GET    /servicos
//   GET    /servicos/{id}
//   POST   /servicos
//   PUT    /servicos/{id}
//   DELETE /servicos/{id}
import { api, esperar, USAR_DADOS_EXEMPLO } from "./configuracao";
import * as exemplo from "./dadosExemplo";
import type { Servico } from "./tipos";

export async function listarServicos(): Promise<Servico[]> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    return [...exemplo.servicos];
  }
  const r = await api.get<Servico[]>("/servicos");
  return r.data;
}

export async function obterServico(id: number): Promise<Servico | undefined> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    return exemplo.servicos.find((s) => s.id === id);
  }
  const r = await api.get<Servico>(`/servicos/${id}`);
  return r.data;
}

export async function adicionarServico(servico: Servico): Promise<Servico> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    const novo = { ...servico, id: Date.now() };
    exemplo.servicos.push(novo);
    return novo;
  }
  const r = await api.post<Servico>("/servicos", servico);
  return r.data;
}

export async function editarServico(servico: Servico): Promise<Servico> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.servicos.splice(exemplo.servicos.findIndex((s) => s.id === servico.id), 1, servico);
    return servico;
  }
  const r = await api.put<Servico>(`/servicos/${servico.id}`, servico);
  return r.data;
}

export async function removerServico(id: number) {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.servicos.splice(exemplo.servicos.findIndex((s) => s.id === id), 1);
    return;
  }
  await api.delete(`/servicos/${id}`);
}
