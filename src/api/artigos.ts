// PEDIDOS À API: artigos
//   GET    /artigos?pagina=1&pesquisa=(nome)&categoria=Todos|Roupa|Calçados|Lar
//   GET    /artigos/{id}
//   POST   /artigos
//   PUT    /artigos/{id}
//   DELETE /artigos/{id}
import { api, esperar, USAR_DADOS_EXEMPLO } from "./configuracao";
import * as exemplo from "./dadosExemplo";
import type { Artigo, Pagina } from "./tipos";

export const ARTIGOS_POR_PAGINA = 9;

export async function listarArtigos(pagina: number, pesquisa: string, categoria: string): Promise<Pagina<Artigo>> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    const lista = exemplo.artigos.filter((a) => {
      if (!a.nome.toLowerCase().includes(pesquisa.toLowerCase())) return false; // pesquisa só pelo nome
      return categoria === "Todos" || a.categoria === categoria;
    });
    const semFiltros = pesquisa === "" && categoria === "Todos";
    return { itens: lista, total: semFiltros ? exemplo.totais.artigos : lista.length };
  }
  const r = await api.get<Pagina<Artigo>>("/artigos", {
    params: { pagina, porPagina: ARTIGOS_POR_PAGINA, pesquisa, categoria },
  });
  return r.data;
}

export async function obterArtigo(id: number): Promise<Artigo | undefined> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    return exemplo.artigos.find((a) => a.id === id);
  }
  const r = await api.get<Artigo>(`/artigos/${id}`);
  return r.data;
}

export async function adicionarArtigo(artigo: Artigo): Promise<Artigo> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    const novo = { ...artigo, id: Date.now() };
    exemplo.artigos.push(novo);
    return novo;
  }
  const r = await api.post<Artigo>("/artigos", artigo);
  return r.data;
}

export async function editarArtigo(artigo: Artigo): Promise<Artigo> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.artigos.splice(exemplo.artigos.findIndex((a) => a.id === artigo.id), 1, artigo);
    return artigo;
  }
  const r = await api.put<Artigo>(`/artigos/${artigo.id}`, artigo);
  return r.data;
}

export async function removerArtigo(id: number) {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.artigos.splice(exemplo.artigos.findIndex((a) => a.id === id), 1);
    return;
  }
  await api.delete(`/artigos/${id}`);
}
