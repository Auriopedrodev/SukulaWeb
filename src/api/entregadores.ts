// PEDIDOS À API: entregadores
//   GET    /entregadores?pagina=1&pesquisa=...
//   POST   /entregadores
//   PUT    /entregadores/{id}
//   PATCH  /entregadores/{id}/estado     { ativo: true/false }
//   DELETE /entregadores/{id}
import { api, esperar, USAR_DADOS_EXEMPLO } from "./configuracao";
import * as exemplo from "./dadosExemplo";
import type { Entregador, Pagina } from "./tipos";

export const ENTREGADORES_POR_PAGINA = 8;

export async function listarEntregadores(pagina: number, pesquisa: string): Promise<Pagina<Entregador>> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    const texto = pesquisa.toLowerCase();
    const lista = exemplo.entregadores.filter(
      (e) => e.nome.toLowerCase().includes(texto) || e.telefone.replace(/\s/g, "").includes(texto.replace(/\s/g, ""))
    );
    return { itens: lista, total: pesquisa === "" ? exemplo.totais.entregadores : lista.length };
  }
  const r = await api.get<Pagina<Entregador>>("/entregadores", {
    params: { pagina, porPagina: ENTREGADORES_POR_PAGINA, pesquisa },
  });
  return r.data;
}

// Número de entregadores ativos (cartão "Ativos")
export async function contarEntregadoresAtivos(): Promise<number> {
  if (USAR_DADOS_EXEMPLO) return 15;
  const r = await api.get<number>("/entregadores/ativos/total");
  return r.data;
}

export async function adicionarEntregador(entregador: Entregador): Promise<Entregador> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    const novo = { ...entregador, id: Date.now() };
    exemplo.entregadores.push(novo);
    return novo;
  }
  const r = await api.post<Entregador>("/entregadores", entregador);
  return r.data;
}

export async function editarEntregador(entregador: Entregador): Promise<Entregador> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.entregadores.splice(exemplo.entregadores.findIndex((e) => e.id === entregador.id), 1, entregador);
    return entregador;
  }
  const r = await api.put<Entregador>(`/entregadores/${entregador.id}`, entregador);
  return r.data;
}

export async function mudarEstadoEntregador(id: number, ativo: boolean) {
  if (USAR_DADOS_EXEMPLO) {
    const entregador = exemplo.entregadores.find((e) => e.id === id);
    if (entregador) entregador.ativo = ativo;
    return;
  }
  await api.patch(`/entregadores/${id}/estado`, { ativo });
}

export async function removerEntregador(id: number) {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.entregadores.splice(exemplo.entregadores.findIndex((e) => e.id === id), 1);
    return;
  }
  await api.delete(`/entregadores/${id}`);
}
