// =====================================================================
//  PEDIDOS À API - PAINEL DO ADMINISTRADOR
//  Cada função tem por cima o endpoint C# que deve existir.
//  Se USAR_DADOS_FICTICIOS = true, os dados vêm de "src/dados/dadosAdmin.js".
// =====================================================================

import { obter, criar, atualizar, apagar, enviarFicheiro, montarFiltros, simular, paginar } from './api';
import { USAR_DADOS_FICTICIOS, LINHAS_POR_PAGINA } from '../configuracao';
import * as dados from '../dados/dadosAdmin';

// Pequena ajuda: procura texto sem ligar a maiúsculas/minúsculas
function contem(texto, pesquisa) {
  return String(texto || '').toLowerCase().includes(String(pesquisa || '').toLowerCase());
}

// ---------------------------------------------------------------------
//  PÁGINA PRINCIPAL
// ---------------------------------------------------------------------

// GET /api/admin/resumo
// Recebe: { totalClientes, totalLavandarias, servicosAtivos, totalArtigos, totalEntregadores }
export function obterResumo() {
  if (USAR_DADOS_FICTICIOS) {
    return simular({
      totalClientes: 1248,
      totalLavandarias: 24,
      servicosAtivos: 8,
      totalArtigos: 36,
      totalEntregadores: 18,
    });
  }
  return obter('/admin/resumo');
}

// ---------------------------------------------------------------------
//  CLIENTES
// ---------------------------------------------------------------------

// GET /api/clientes?pesquisa=&estado=&pagina=1&tamanhoPagina=8
// Recebe: { itens: [...], total, pagina, tamanhoPagina }
export function listarClientes(pesquisa, estado, pagina) {
  if (USAR_DADOS_FICTICIOS) {
    const filtrados = dados.clientes.filter(
      (c) => contem(c.nomeCompleto, pesquisa) && (estado === '' || c.estado === estado)
    );
    const resultado = paginar(filtrados, pagina, LINHAS_POR_PAGINA);
    return simular(resultado);
  }
  return obter('/clientes' + montarFiltros({ pesquisa, estado, pagina, tamanhoPagina: LINHAS_POR_PAGINA }));
}

// PUT /api/clientes/{id}
// Envia: { nomeCompleto, morada, estado }
export function editarCliente(id, cliente) {
  if (USAR_DADOS_FICTICIOS) {
    const posicao = dados.clientes.findIndex((c) => c.id === id);
    dados.clientes[posicao] = { ...dados.clientes[posicao], ...cliente };
    return simular(dados.clientes[posicao]);
  }
  return atualizar('/clientes/' + id, cliente);
}

// POST /api/clientes/{id}/foto   (ficheiro no campo "ficheiro", IFormFile em C#)
// Recebe: { fotoUrl }
export function enviarFotoCliente(id, ficheiro) {
  if (USAR_DADOS_FICTICIOS) {
    const cliente = dados.clientes.find((c) => c.id === id);
    cliente.fotoUrl = URL.createObjectURL(ficheiro);
    cliente.fotoNome = ficheiro.name;
    return simular({ fotoUrl: cliente.fotoUrl });
  }
  return enviarFicheiro('/clientes/' + id + '/foto', ficheiro);
}

// DELETE /api/clientes/{id}
export function removerCliente(id) {
  if (USAR_DADOS_FICTICIOS) {
    const posicao = dados.clientes.findIndex((c) => c.id === id);
    dados.clientes.splice(posicao, 1);
    return simular(null);
  }
  return apagar('/clientes/' + id);
}

// ---------------------------------------------------------------------
//  LAVANDARIAS
// ---------------------------------------------------------------------

// GET /api/lavandarias?pesquisa=
export function listarLavandarias(pesquisa) {
  if (USAR_DADOS_FICTICIOS) {
    return simular(dados.lavandarias.filter((l) => contem(l.nome, pesquisa) || contem(l.localizacao, pesquisa)));
  }
  return obter('/lavandarias' + montarFiltros({ pesquisa }));
}

// GET /api/lavandarias/{id}
export function obterLavandaria(id) {
  if (USAR_DADOS_FICTICIOS) {
    return simular(dados.lavandarias.find((l) => l.id === Number(id)));
  }
  return obter('/lavandarias/' + id);
}

// POST /api/lavandarias
// Envia: { nome, localizacao, descricao, diasFuncionamento: ["Seg",...], abertura: "08:00", encerramento: "19:00",
//          servicos: [{ servicoId, categoria, artigos: [...], preco }] }
export function adicionarLavandaria(lavandaria) {
  if (USAR_DADOS_FICTICIOS) {
    const nova = {
      ...lavandaria,
      id: Date.now(),
      avaliacao: null,
      ativa: true,
      logoUrl: '',
      fotoUrl: '',
      moradaCompleta: lavandaria.localizacao,
      horarioResumo: lavandaria.diasFuncionamento[0] + ' – ' + lavandaria.diasFuncionamento.at(-1) + ' · ' + lavandaria.abertura + ' – ' + lavandaria.encerramento,
      categorias: [...new Set(lavandaria.servicos.map((s) => s.categoria))],
      totalServicos: lavandaria.servicos.length,
      horario: [],
    };
    dados.lavandarias.push(nova);
    return simular(nova);
  }
  return criar('/lavandarias', lavandaria);
}

// PUT /api/lavandarias/{id}
export function editarLavandaria(id, lavandaria) {
  if (USAR_DADOS_FICTICIOS) {
    const posicao = dados.lavandarias.findIndex((l) => l.id === id);
    dados.lavandarias[posicao] = { ...dados.lavandarias[posicao], ...lavandaria, totalServicos: lavandaria.servicos.length };
    return simular(dados.lavandarias[posicao]);
  }
  return atualizar('/lavandarias/' + id, lavandaria);
}

// PUT /api/lavandarias/{id}/estado   Envia: { ativa: true/false }
export function alterarEstadoLavandaria(id, ativa) {
  if (USAR_DADOS_FICTICIOS) {
    dados.lavandarias.find((l) => l.id === id).ativa = ativa;
    return simular(null);
  }
  return atualizar('/lavandarias/' + id + '/estado', { ativa });
}

// DELETE /api/lavandarias/{id}
export function removerLavandaria(id) {
  if (USAR_DADOS_FICTICIOS) {
    const posicao = dados.lavandarias.findIndex((l) => l.id === id);
    dados.lavandarias.splice(posicao, 1);
    return simular(null);
  }
  return apagar('/lavandarias/' + id);
}

// POST /api/lavandarias/{id}/foto   (ficheiro no campo "ficheiro", IFormFile em C#)
export function enviarFotoLavandaria(id, ficheiro) {
  if (USAR_DADOS_FICTICIOS) {
    const lavandaria = dados.lavandarias.find((l) => l.id === id);
    lavandaria.logoUrl = URL.createObjectURL(ficheiro);
    return simular({ fotoUrl: lavandaria.logoUrl });
  }
  return enviarFicheiro('/lavandarias/' + id + '/foto', ficheiro);
}

// ---------------------------------------------------------------------
//  SERVIÇOS (Lavagem + Engomar, Lavagem a Seco, ...)
// ---------------------------------------------------------------------

// GET /api/servicos?pesquisa=&categoria=
export function listarServicos(pesquisa, categoria) {
  if (USAR_DADOS_FICTICIOS) {
    return simular(dados.servicos.filter((s) => contem(s.nome, pesquisa) && (!categoria || s.categoria === categoria)));
  }
  return obter('/servicos' + montarFiltros({ pesquisa, categoria }));
}

// GET /api/servicos/{id}
// Recebe também: artigosDetalhados: [{ nome, cores, tamanhos }] e lavandarias: [{ id, nome, localizacao, fotoUrl }]
export function obterServico(id) {
  if (USAR_DADOS_FICTICIOS) {
    const servico = dados.servicos.find((s) => s.id === Number(id));
    return simular({
      ...servico,
      artigosDetalhados: dados.artigos.filter((a) => servico.artigos.includes(a.nome)),
      lavandarias: dados.lavandarias.slice(0, 3),
    });
  }
  return obter('/servicos/' + id);
}

// POST /api/servicos   Envia: { nome, categoria, precoBase, ativo, artigos: ["Cortinado", ...] }
export function adicionarServico(servico) {
  if (USAR_DADOS_FICTICIOS) {
    const novo = { ...servico, id: Date.now(), totalLavandarias: 0 };
    dados.servicos.push(novo);
    return simular(novo);
  }
  return criar('/servicos', servico);
}

// PUT /api/servicos/{id}
export function editarServico(id, servico) {
  if (USAR_DADOS_FICTICIOS) {
    const posicao = dados.servicos.findIndex((s) => s.id === Number(id));
    dados.servicos[posicao] = { ...dados.servicos[posicao], ...servico };
    return simular(dados.servicos[posicao]);
  }
  return atualizar('/servicos/' + id, servico);
}

// DELETE /api/servicos/{id}
export function removerServico(id) {
  if (USAR_DADOS_FICTICIOS) {
    dados.servicos.splice(dados.servicos.findIndex((s) => s.id === Number(id)), 1);
    return simular(null);
  }
  return apagar('/servicos/' + id);
}

// ---------------------------------------------------------------------
//  ARTIGOS (Camisa, Calça, Ténis, ...)
// ---------------------------------------------------------------------

// GET /api/artigos?pesquisa=&categoria=&pagina=1&tamanhoPagina=9
export function listarArtigos(pesquisa, categoria, pagina) {
  if (USAR_DADOS_FICTICIOS) {
    const filtrados = dados.artigos.filter(
      (a) => (contem(a.nome, pesquisa) || a.cores.some((cor) => contem(cor, pesquisa))) && (!categoria || a.categoria === categoria)
    );
    return simular(paginar(filtrados, pagina, 9));
  }
  return obter('/artigos' + montarFiltros({ pesquisa, categoria, pagina, tamanhoPagina: 9 }));
}

// GET /api/artigos/todos   (lista completa, sem páginas, para os formulários)
export function listarTodosArtigos() {
  if (USAR_DADOS_FICTICIOS) return simular(dados.artigos);
  return obter('/artigos/todos');
}

// GET /api/artigos/{id}
// Recebe também: servicosDetalhados: [{ id, nome, categoria, precoBase, totalLavandarias }]
export function obterArtigo(id) {
  if (USAR_DADOS_FICTICIOS) {
    const artigo = dados.artigos.find((a) => a.id === Number(id));
    return simular({ ...artigo, servicosDetalhados: dados.servicos.filter((s) => s.artigos.includes(artigo.nome)) });
  }
  return obter('/artigos/' + id);
}

// POST /api/artigos   Envia: { nome, categoria, cores: ["Azul"], tamanhos: ["M"], servicos: ["Lavagem a Seco"] }
export function adicionarArtigo(artigo) {
  if (USAR_DADOS_FICTICIOS) {
    const novo = { ...artigo, id: Date.now() };
    dados.artigos.push(novo);
    return simular(novo);
  }
  return criar('/artigos', artigo);
}

// PUT /api/artigos/{id}
export function editarArtigo(id, artigo) {
  if (USAR_DADOS_FICTICIOS) {
    const posicao = dados.artigos.findIndex((a) => a.id === Number(id));
    dados.artigos[posicao] = { ...dados.artigos[posicao], ...artigo };
    return simular(dados.artigos[posicao]);
  }
  return atualizar('/artigos/' + id, artigo);
}

// DELETE /api/artigos/{id}
export function removerArtigo(id) {
  if (USAR_DADOS_FICTICIOS) {
    dados.artigos.splice(dados.artigos.findIndex((a) => a.id === Number(id)), 1);
    return simular(null);
  }
  return apagar('/artigos/' + id);
}

// ---------------------------------------------------------------------
//  ENTREGADORES (estafetas)
// ---------------------------------------------------------------------

// GET /api/entregadores?pesquisa=&pagina=1&tamanhoPagina=8
// Recebe: { itens, total, pagina, tamanhoPagina, totalAtivos }
export function listarEntregadores(pesquisa, pagina) {
  if (USAR_DADOS_FICTICIOS) {
    const filtrados = dados.entregadores.filter((e) => contem(e.nomeCompleto, pesquisa) || contem(e.telefone, pesquisa));
    const resultado = paginar(filtrados, pagina, LINHAS_POR_PAGINA);
    resultado.totalAtivos = dados.entregadores.filter((e) => e.ativo).length;
    return simular(resultado);
  }
  return obter('/entregadores' + montarFiltros({ pesquisa, pagina, tamanhoPagina: LINHAS_POR_PAGINA }));
}

// POST /api/entregadores
// Envia: { nomeCompleto, telefone, email, numeroBi, zona, lavandaria, tipoVeiculo, modeloVeiculo, matricula, palavraPasseTemporaria }
export function adicionarEntregador(entregador) {
  if (USAR_DADOS_FICTICIOS) {
    const novo = { ...entregador, id: Date.now(), avaliacao: 0, ativo: true, totalEntregas: 0, taxaSucesso: 0, membroDesde: 'Hoje', ultimaAtividade: '—', utilizador: '@novo.estafeta' };
    dados.entregadores.push(novo);
    return simular(novo);
  }
  return criar('/entregadores', entregador);
}

// PUT /api/entregadores/{id}
// Envia os mesmos campos do POST + { ativo: true/false }  (o estado só se muda aqui, ao editar)
export function editarEntregador(id, entregador) {
  if (USAR_DADOS_FICTICIOS) {
    const posicao = dados.entregadores.findIndex((e) => e.id === id);
    dados.entregadores[posicao] = { ...dados.entregadores[posicao], ...entregador };
    return simular(dados.entregadores[posicao]);
  }
  return atualizar('/entregadores/' + id, entregador);
}

// POST /api/entregadores/{id}/foto   (ficheiro no campo "ficheiro")
export function enviarFotoEntregador(id, ficheiro) {
  if (USAR_DADOS_FICTICIOS) {
    const entregador = dados.entregadores.find((e) => e.id === id);
    entregador.fotoUrl = URL.createObjectURL(ficheiro);
    return simular({ fotoUrl: entregador.fotoUrl });
  }
  return enviarFicheiro('/entregadores/' + id + '/foto', ficheiro);
}

// DELETE /api/entregadores/{id}
export function removerEntregador(id) {
  if (USAR_DADOS_FICTICIOS) {
    dados.entregadores.splice(dados.entregadores.findIndex((e) => e.id === id), 1);
    return simular(null);
  }
  return apagar('/entregadores/' + id);
}

// ---------------------------------------------------------------------
//  PERFIL DA CONTA DO ADMINISTRADOR
// ---------------------------------------------------------------------

// GET /api/perfil
export function obterPerfil() {
  if (USAR_DADOS_FICTICIOS) return simular(dados.administrador);
  return obter('/perfil');
}

// PUT /api/perfil   Envia: { nomeCompleto, morada }
export function editarPerfil(perfil) {
  if (USAR_DADOS_FICTICIOS) {
    Object.assign(dados.administrador, perfil);
    return simular(dados.administrador);
  }
  return atualizar('/perfil', perfil);
}

// PUT /api/perfil/palavra-passe   Envia: { palavraPasseAtual, novaPalavraPasse }
export function alterarPalavraPasse(palavraPasseAtual, novaPalavraPasse) {
  if (USAR_DADOS_FICTICIOS) return simular(null);
  return atualizar('/perfil/palavra-passe', { palavraPasseAtual, novaPalavraPasse });
}

// POST /api/perfil/foto   (ficheiro no campo "ficheiro")
export function enviarFotoPerfil(ficheiro) {
  if (USAR_DADOS_FICTICIOS) {
    dados.administrador.fotoUrl = URL.createObjectURL(ficheiro);
    dados.administrador.fotoNome = ficheiro.name;
    return simular({ fotoUrl: dados.administrador.fotoUrl });
  }
  return enviarFicheiro('/perfil/foto', ficheiro);
}

// GET /api/perfil/historico-lavandarias
export function obterHistoricoLavandarias() {
  if (USAR_DADOS_FICTICIOS) return simular(dados.historicoLavandarias);
  return obter('/perfil/historico-lavandarias');
}

// GET /api/informacoes
export function listarInformacoes() {
  if (USAR_DADOS_FICTICIOS) return simular(dados.informacoes);
  return obter('/informacoes');
}

// PUT /api/informacoes/{id}
// Envia: { perfisAbrangidos, perguntas: [{ pergunta, resposta }] }  ou  { perfisAbrangidos, texto }
export function publicarInformacao(id, informacao) {
  if (USAR_DADOS_FICTICIOS) {
    const atual = dados.informacoes.find((i) => i.id === id);
    Object.assign(atual, informacao, { ultimaAtualizacao: '12 Nov 2026' });
    if (id === 'termos-e-condicoes') atual.descricao = 'Última atualização: 12 Nov 2026 · v2.1';
    return simular(atual);
  }
  return atualizar('/informacoes/' + id, informacao);
}

// Listas fixas usadas nos formulários (podem vir da API no futuro)
export const listas = {
  cores: dados.coresDisponiveis,
  tamanhos: dados.tamanhosDisponiveis,
  categorias: dados.categorias,
  zonas: dados.zonas,
};
