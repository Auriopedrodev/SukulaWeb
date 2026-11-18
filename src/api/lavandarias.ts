// PEDIDOS À API: lavandarias
//   GET    /lavandarias
//   GET    /lavandarias/{id}
//   POST   /lavandarias
//   PUT    /lavandarias/{id}
//   PATCH  /lavandarias/{id}/estado     { ativa: true/false }
//   DELETE /lavandarias/{id}
import { api, esperar, USAR_DADOS_EXEMPLO } from "./configuracao";
import * as exemplo from "./dadosExemplo";
import type { Lavandaria } from "./tipos";

export async function listarLavandarias(): Promise<Lavandaria[]> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    return [...exemplo.lavandarias];
  }
  const r = await api.get<Lavandaria[]>("/lavandarias");
  return r.data;
}

export async function obterLavandaria(id: number): Promise<Lavandaria | undefined> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    return exemplo.lavandarias.find((l) => l.id === id);
  }
  const r = await api.get<Lavandaria>(`/lavandarias/${id}`);
  return r.data;
}

export async function adicionarLavandaria(lavandaria: Lavandaria): Promise<Lavandaria> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    const nova = { ...lavandaria, id: Date.now(), nova: true };
    exemplo.lavandarias.unshift(nova); // aparece em primeiro lugar, como no Figma (Q2.1)
    return nova;
  }
  const r = await api.post<Lavandaria>("/lavandarias", lavandaria);
  return r.data;
}

export async function editarLavandaria(lavandaria: Lavandaria): Promise<Lavandaria> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.lavandarias.splice(exemplo.lavandarias.findIndex((l) => l.id === lavandaria.id), 1, lavandaria);
    return lavandaria;
  }
  const r = await api.put<Lavandaria>(`/lavandarias/${lavandaria.id}`, lavandaria);
  return r.data;
}

export async function mudarEstadoLavandaria(id: number, ativa: boolean) {
  if (USAR_DADOS_EXEMPLO) {
    const lavandaria = exemplo.lavandarias.find((l) => l.id === id);
    if (lavandaria) lavandaria.ativa = ativa;
    return;
  }
  await api.patch(`/lavandarias/${id}/estado`, { ativa });
}

export async function removerLavandaria(id: number) {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.lavandarias.splice(exemplo.lavandarias.findIndex((l) => l.id === id), 1);
    return;
  }
  await api.delete(`/lavandarias/${id}`);
}
