// =====================================================================
//  PEDIDOS À API - PAINEL DO ADMINISTRADOR
//  Cada função tem por cima o endpoint C# que deve existir.
//  Se USAR_DADOS_FICTICIOS = true, os dados vêm de "src/dados/dadosAdmin.js".
// =====================================================================

import { api, erroDoPedido, obter, criar, atualizar, apagar, enviarFicheiro, montarFiltros, simular, paginar } from './api';
import { USAR_DADOS_FICTICIOS, LINHAS_POR_PAGINA, URL_DA_API } from '../configuracao';
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
//  ARTIGOS, LAVANDARIAS E SERVIÇOS  (/api/v1)
//  Estes três recursos falam sempre com a API. Os nomes dos campos
//  são os da API (idArtigo, horarioFuncionamento, artigoId, ...).
// ---------------------------------------------------------------------

const ARTIGOS = '/api/v1/artigos';
const LAVANDARIAS = '/api/v1/lavandarias';
const SERVICOS = '/api/v1/servicos';
const UTILIZADORES = '/api/v1/utilizadores';

async function pedir(promessa) {
  try {
    const resposta = await promessa;
    return resposta.status === 204 ? null : resposta.data;
  } catch (erro) {
    throw erroDoPedido(erro);
  }
}

// Junta a base da API a um caminho relativo de foto ("/lavandarias/ficheiro").
export function urlDaFoto(foto) {
  if (!foto) return '';
  if (foto.startsWith('http') || foto.startsWith('blob:')) return foto;
  return URL_DA_API + foto;
}

function formularioLavandaria(dados, foto) {
  const form = new FormData();
  form.append('nomeLavandaria', dados.nomeLavandaria);
  form.append('horarioFuncionamento', dados.horarioFuncionamento);
  form.append('endereco', dados.endereco);
  form.append('latitude', String(dados.latitude));
  form.append('longitude', String(dados.longitude));
  form.append('descricao', dados.descricao);
  if (foto) form.append('foto', foto);
  return form;
}

// GET /api/v1/artigos  → array. Vazio é [].
export function listarArtigos() {
  return pedir(api.get(ARTIGOS));
}

export function listarTodosArtigos() {
  return listarArtigos();
}

// GET /api/v1/artigos/{idArtigo}
export function obterArtigo(idArtigo) {
  return pedir(api.get(ARTIGOS + '/' + idArtigo));
}

// POST /api/v1/artigos  { nome, categoria }
export function adicionarArtigo(artigo) {
  return pedir(api.post(ARTIGOS, { nome: artigo.nome, categoria: artigo.categoria }));
}

// PUT /api/v1/artigos/{idArtigo}
export function editarArtigo(idArtigo, artigo) {
  return pedir(api.put(ARTIGOS + '/' + idArtigo, { nome: artigo.nome, categoria: artigo.categoria }));
}

// DELETE /api/v1/artigos/{idArtigo} → 204
export function removerArtigo(idArtigo) {
  return pedir(api.delete(ARTIGOS + '/' + idArtigo));
}

// GET /api/v1/lavandarias
// 404 com code Lavandaria.ListaVazia é uma lista vazia, não um erro.
export async function listarLavandarias() {
  try {
    const resposta = await api.get(LAVANDARIAS);
    return resposta.data;
  } catch (erro) {
    const convertido = erroDoPedido(erro);
    if (convertido.status === 404 && convertido.code === 'Lavandaria.ListaVazia') return [];
    throw convertido;
  }
}

// GET /api/v1/lavandarias/{idLavandaria}
export function obterLavandaria(idLavandaria) {
  return pedir(api.get(LAVANDARIAS + '/' + idLavandaria));
}

// POST /api/v1/lavandarias  multipart/form-data
export function adicionarLavandaria(dados, foto) {
  return pedir(api.post(LAVANDARIAS, formularioLavandaria(dados, foto)));
}

// PUT /api/v1/lavandarias/{idLavandaria}
// Sem ficheiro, a foto actual mantém-se.
export function editarLavandaria(idLavandaria, dados, foto) {
  return pedir(api.put(LAVANDARIAS + '/' + idLavandaria, formularioLavandaria(dados, foto)));
}

// DELETE /api/v1/lavandarias/{idLavandaria} → 204
export function removerLavandaria(idLavandaria) {
  return pedir(api.delete(LAVANDARIAS + '/' + idLavandaria));
}

// GET /api/v1/utilizadores/clientes → array. Vazio é [].
export function listarClientesDaApi() {
  return pedir(api.get(UTILIZADORES + '/clientes'));
}

// GET /api/v1/utilizadores/managers → array. Vazio é [].
// Só o Admin pode chamar. O ecrã do gestor da lavandaria não usa esta função.
export function listarGestores() {
  return pedir(api.get(UTILIZADORES + '/managers'));
}

// POST /api/v1/auth/manager  { nomeCompleto, palavraPasse, email, telefone, lavandariaId }
export function criarGestor(gestor) {
  return pedir(api.post('/api/v1/auth/manager', {
    nomeCompleto: gestor.nomeCompleto,
    palavraPasse: gestor.palavraPasse,
    email: gestor.email,
    telefone: gestor.telefone,
    lavandariaId: gestor.lavandariaId,
  }));
}

// GET /api/v1/servicos
export function listarServicos() {
  return pedir(api.get(SERVICOS));
}

// GET /api/v1/servicos/lavandaria/{idLavandaria}
export function listarServicosDaLavandaria(idLavandaria) {
  return pedir(api.get(SERVICOS + '/lavandaria/' + idLavandaria));
}

// GET /api/v1/servicos/{idServico}
export function obterServico(idServico) {
  return pedir(api.get(SERVICOS + '/' + idServico));
}

// POST /api/v1/servicos  { nome, precoBase, artigoId, lavandariaId }
export function adicionarServico(servico) {
  return pedir(api.post(SERVICOS, {
    nome: servico.nome,
    precoBase: servico.precoBase,
    artigoId: servico.artigoId,
    lavandariaId: servico.lavandariaId,
  }));
}

// PUT /api/v1/servicos/{idServico}
export function editarServico(idServico, servico) {
  return pedir(api.put(SERVICOS + '/' + idServico, {
    nome: servico.nome,
    precoBase: servico.precoBase,
    artigoId: servico.artigoId,
    lavandariaId: servico.lavandariaId,
  }));
}

// DELETE /api/v1/servicos/{idServico} → 204
export function removerServico(idServico) {
  return pedir(api.delete(SERVICOS + '/' + idServico));
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
