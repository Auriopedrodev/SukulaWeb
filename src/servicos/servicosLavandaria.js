// =====================================================================
//  PEDIDOS À API - PAINEL DA LAVANDARIA (Portal do Parceiro)
//  Cada função tem por cima o endpoint C# que deve existir.
//  Se USAR_DADOS_FICTICIOS = true, os dados vêm de "src/dados/dadosLavandaria.js".
// =====================================================================

import { obter, criar, atualizar, enviarFicheiro, montarFiltros, simular, paginar } from './api';
import { USAR_DADOS_FICTICIOS, LINHAS_POR_PAGINA } from '../configuracao';
import * as dados from '../dados/dadosLavandaria';

function contem(texto, pesquisa) {
  return String(texto || '').toLowerCase().includes(String(pesquisa || '').toLowerCase());
}

// ---------------------------------------------------------------------
//  CONTA DA LAVANDARIA
// ---------------------------------------------------------------------

// GET /api/lavandaria/conta
export function obterContaLavandaria() {
  if (USAR_DADOS_FICTICIOS) return simular(dados.lavandaria);
  return obter('/lavandaria/conta');
}

// PUT /api/lavandaria/conta
// Envia: { nome, moradaCompleta, horario, servicosOferecidos, descricao }
export function editarContaLavandaria(conta) {
  if (USAR_DADOS_FICTICIOS) {
    Object.assign(dados.lavandaria, conta);
    return simular(dados.lavandaria);
  }
  return atualizar('/lavandaria/conta', conta);
}

// POST /api/lavandaria/conta/foto   (ficheiro no campo "ficheiro")
export function enviarFotoContaLavandaria(ficheiro) {
  if (USAR_DADOS_FICTICIOS) {
    dados.lavandaria.fotoUrl = URL.createObjectURL(ficheiro);
    return simular({ fotoUrl: dados.lavandaria.fotoUrl });
  }
  return enviarFicheiro('/lavandaria/conta/foto', ficheiro);
}

// POST /api/lavandaria/pedidos/{id}/fotos   (fotos do pedido pronto, campo "ficheiro")
export function enviarFotoPedido(id, ficheiro) {
  if (USAR_DADOS_FICTICIOS) return simular({ fotoUrl: URL.createObjectURL(ficheiro) });
  return enviarFicheiro('/lavandaria/pedidos/' + id + '/fotos', ficheiro);
}

// ---------------------------------------------------------------------
//  CONTROLE - DASHBOARD E ESTAFETAS
// ---------------------------------------------------------------------

// GET /api/lavandaria/dashboard?periodo=dia   (dia, semana ou mes)
// Recebe: { subtitulo, indicadores: [...], grafico: { descricao, maximo, barras: [...] }, producaoTotal: {...} }
export function obterDashboard(periodo) {
  if (USAR_DADOS_FICTICIOS) {
    return simular({ ...dados.dashboard[periodo], producaoTotal: dados.dashboard.producaoTotal });
  }
  return obter('/lavandaria/dashboard' + montarFiltros({ periodo }));
}

// GET /api/lavandaria/estafetas?estado=&periodo=semana
export function listarEstafetas(estado, periodo) {
  if (USAR_DADOS_FICTICIOS) {
    return simular(dados.estafetas.filter((e) => !estado || e.estado === estado));
  }
  return obter('/lavandaria/estafetas' + montarFiltros({ estado, periodo }));
}

// GET /api/lavandaria/estafetas/{id}
export function obterEstafeta(id) {
  if (USAR_DADOS_FICTICIOS) return simular(dados.estafetas.find((e) => e.id === Number(id)));
  return obter('/lavandaria/estafetas/' + id);
}

// GET /api/lavandaria/estafetas/{id}/producao?periodo=semana
export function obterProducaoEstafeta(id, periodo) {
  if (USAR_DADOS_FICTICIOS) return simular(dados.producaoEstafeta);
  return obter('/lavandaria/estafetas/' + id + '/producao' + montarFiltros({ periodo }));
}

// ---------------------------------------------------------------------
//  GESTÃO DE PEDIDOS
// ---------------------------------------------------------------------

// GET /api/lavandaria/pedidos/novos?pesquisa=
export function listarPedidosNovos(pesquisa) {
  if (USAR_DADOS_FICTICIOS) {
    return simular(dados.pedidosNovos.filter((p) => contem(p.numero, pesquisa) || contem(p.cliente, pesquisa)));
  }
  return obter('/lavandaria/pedidos/novos' + montarFiltros({ pesquisa }));
}

// GET /api/lavandaria/pedidos/em-processamento?pesquisa=
// Recebe: { resumo: { emLavagem, emEngomagem, prontosParaEntrega, atrasados }, itens: [...] }
export function listarPedidosEmProcessamento(pesquisa) {
  if (USAR_DADOS_FICTICIOS) {
    return simular({
      resumo: dados.resumoProcessamento,
      itens: dados.pedidosEmProcessamento.filter((p) => contem(p.numero, pesquisa) || contem(p.cliente, pesquisa)),
    });
  }
  return obter('/lavandaria/pedidos/em-processamento' + montarFiltros({ pesquisa }));
}

// GET /api/lavandaria/pedidos/historico?pesquisa=&resultado=&pagina=1&tamanhoPagina=8
// Recebe: { itens, total, pagina, tamanhoPagina, resumo: { todos, realizados, naoRealizados, periodo } }
export function listarHistoricoPedidos(pesquisa, resultado, pagina) {
  if (USAR_DADOS_FICTICIOS) {
    const filtrados = dados.historicoPedidos.filter((p) => {
      const passaPesquisa = contem(p.numero, pesquisa) || contem(p.cliente, pesquisa);
      if (resultado === 'Realizados') return passaPesquisa && p.resultado === 'Entregue';
      if (resultado === 'Não realizados') return passaPesquisa && p.resultado !== 'Entregue';
      return passaPesquisa;
    });
    return simular({ ...paginar(filtrados, pagina, LINHAS_POR_PAGINA), resumo: dados.resumoHistorico });
  }
  return obter('/lavandaria/pedidos/historico' + montarFiltros({ pesquisa, resultado, pagina, tamanhoPagina: LINHAS_POR_PAGINA }));
}

// GET /api/lavandaria/pedidos/{id}
export function obterPedido(id) {
  if (USAR_DADOS_FICTICIOS) return simular(dados.criarDetalhesPedido(id));
  return obter('/lavandaria/pedidos/' + id);
}

// POST /api/lavandaria/pedidos/{id}/encaminhar   Envia: { estafetaId }
export function encaminharParaEstafeta(id, estafetaId) {
  if (USAR_DADOS_FICTICIOS) return simular(null);
  return criar('/lavandaria/pedidos/' + id + '/encaminhar', { estafetaId });
}

// POST /api/lavandaria/pedidos/{id}/recusar
export function recusarPedido(id) {
  if (USAR_DADOS_FICTICIOS) return simular(null);
  return criar('/lavandaria/pedidos/' + id + '/recusar', {});
}

// POST /api/lavandaria/pedidos/{id}/confirmar-recolha   Envia: { observacoes }
export function confirmarRecolha(id, observacoes) {
  if (USAR_DADOS_FICTICIOS) return simular(null);
  return criar('/lavandaria/pedidos/' + id + '/confirmar-recolha', { observacoes });
}

// POST /api/lavandaria/pedidos/{id}/confirmar-execucao
export function confirmarExecucao(id) {
  if (USAR_DADOS_FICTICIOS) return simular(null);
  return criar('/lavandaria/pedidos/' + id + '/confirmar-execucao', {});
}

// POST /api/lavandaria/pedidos/{id}/encaminhar-entrega   Envia: { estafetaId }
export function encaminharParaEntrega(id, estafetaId) {
  if (USAR_DADOS_FICTICIOS) return simular(null);
  return criar('/lavandaria/pedidos/' + id + '/encaminhar-entrega', { estafetaId });
}

// ---------------------------------------------------------------------
//  PERFIL - HISTÓRICO E DESCONTOS
// ---------------------------------------------------------------------

// GET /api/lavandaria/historico
export function obterHistoricoLavandaria() {
  if (USAR_DADOS_FICTICIOS) return simular(dados.historicoLavandaria);
  return obter('/lavandaria/historico');
}

// GET /api/lavandaria/descontos
// Recebe: { resumo: { cupoesAtivos, utilizacoesMes, descontoConcedido }, itens: [...] }
export function listarDescontos() {
  if (USAR_DADOS_FICTICIOS) return simular({ resumo: dados.resumoDescontos, itens: dados.descontos });
  return obter('/lavandaria/descontos');
}

// POST /api/lavandaria/descontos
// Envia: { codigo, tipo: "percentagem"|"valor", valor, limite, validoDe, validoAte, servicos: [...] }
export function criarDesconto(desconto) {
  if (USAR_DADOS_FICTICIOS) {
    const novo = {
      ...desconto,
      id: Date.now(),
      descricao: 'Aplicável a ' + desconto.servicos.length + ' serviço(s)',
      validade: 'Válido até ' + desconto.validoAte,
      utilizacoes: 0,
      ativo: true,
      expirado: false,
    };
    dados.descontos.unshift(novo);
    dados.resumoDescontos.cupoesAtivos += 1;
    return simular(novo);
  }
  return criar('/lavandaria/descontos', desconto);
}

// PUT /api/lavandaria/descontos/{id}/estado   Envia: { ativo: true/false }
export function alterarEstadoDesconto(id, ativo) {
  if (USAR_DADOS_FICTICIOS) {
    dados.descontos.find((d) => d.id === id).ativo = ativo;
    return simular(null);
  }
  return atualizar('/lavandaria/descontos/' + id + '/estado', { ativo });
}

export const servicosParaDescontos = dados.servicosParaDescontos;
