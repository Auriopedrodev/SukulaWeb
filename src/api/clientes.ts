// PEDIDOS À API: clientes
//   GET    /clientes?pagina=1&pesquisa=...&estado=todos|ativos|inativos
//   PUT    /clientes/{id}
//   DELETE /clientes/{id}
import { api, esperar, USAR_DADOS_EXEMPLO } from "./configuracao";
import * as exemplo from "./dadosExemplo";
import type { Cliente, Pagina } from "./tipos";

export const CLIENTES_POR_PAGINA = 8;

export async function listarClientes(pagina: number, pesquisa: string, estado: string): Promise<Pagina<Cliente>> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    const lista = exemplo.clientes.filter((c) => {
      if (!c.nome.toLowerCase().includes(pesquisa.toLowerCase())) return false;
      if (estado === "ativos") return c.ativo;
      if (estado === "inativos") return !c.ativo;
      return true;
    });
    // Sem filtros mostramos o total do Figma (1.248); com filtros, o total real.
    const semFiltros = pesquisa === "" && estado === "todos";
    return { itens: lista, total: semFiltros ? exemplo.totais.clientes : lista.length };
  }
  const r = await api.get<Pagina<Cliente>>("/clientes", {
    params: { pagina, porPagina: CLIENTES_POR_PAGINA, pesquisa, estado },
  });
  return r.data;
}

export async function editarCliente(cliente: Cliente): Promise<Cliente> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.clientes.splice(exemplo.clientes.findIndex((c) => c.id === cliente.id), 1, cliente);
    return cliente;
  }
  const r = await api.put<Cliente>(`/clientes/${cliente.id}`, cliente);
  return r.data;
}

export async function removerCliente(id: number) {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.clientes.splice(exemplo.clientes.findIndex((c) => c.id === id), 1);
    return;
  }
  await api.delete(`/clientes/${id}`);
}
