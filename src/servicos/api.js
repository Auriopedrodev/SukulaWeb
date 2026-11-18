// =====================================================================
//  LIGAÇÃO À API C#
//  Todas as chamadas ao servidor passam por aqui.
//  - Envia e recebe JSON (o ASP.NET Core usa "camelCase" por defeito:
//    a propriedade "NomeCompleto" em C# chega aqui como "nomeCompleto").
//  - Envia o token JWT no cabeçalho "Authorization: Bearer ...".
// =====================================================================

import { URL_DA_API, NOME_DO_TOKEN, NOME_DO_UTILIZADOR } from '../configuracao';

// Faz um pedido ao servidor e devolve a resposta em JSON.
// metodo: 'GET', 'POST', 'PUT' ou 'DELETE'
// caminho: por exemplo '/clientes' ou '/clientes/5'
// dados: objeto a enviar (só para POST e PUT)
export async function pedidoApi(metodo, caminho, dados) {
  const token = localStorage.getItem(NOME_DO_TOKEN);

  const cabecalhos = { 'Content-Type': 'application/json' };
  if (token) {
    cabecalhos.Authorization = 'Bearer ' + token;
  }

  const resposta = await fetch(URL_DA_API + caminho, {
    method: metodo,
    headers: cabecalhos,
    body: dados ? JSON.stringify(dados) : undefined,
  });

  // 401 = sessão expirada ou inválida -> volta ao login
  if (resposta.status === 401) {
    localStorage.removeItem(NOME_DO_TOKEN);
    localStorage.removeItem(NOME_DO_UTILIZADOR);
    const ehLavandaria = window.location.pathname.startsWith('/lavandaria');
    window.location.href = ehLavandaria ? '/lavandaria/login' : '/admin/login';
    throw new Error('Sessão expirada. Inicie sessão novamente.');
  }

  if (!resposta.ok) {
    throw new Error(await lerMensagemDeErro(resposta));
  }

  // 204 = "sem conteúdo" (normal num DELETE ou PUT)
  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

// Envia um ficheiro (foto, logótipo...). Em C# é recebido como IFormFile.
// O nome do campo é "ficheiro".
export async function enviarFicheiro(caminho, ficheiro) {
  const token = localStorage.getItem(NOME_DO_TOKEN);
  const formulario = new FormData();
  formulario.append('ficheiro', ficheiro);

  const resposta = await fetch(URL_DA_API + caminho, {
    method: 'POST',
    headers: token ? { Authorization: 'Bearer ' + token } : {},
    body: formulario,
  });

  if (!resposta.ok) {
    throw new Error(await lerMensagemDeErro(resposta));
  }
  return resposta.status === 204 ? null : resposta.json();
}

// Lê a mensagem de erro devolvida pelo C#.
// Aceita { "mensagem": "..." } ou o formato "ProblemDetails" do ASP.NET Core.
async function lerMensagemDeErro(resposta) {
  try {
    const erro = await resposta.json();
    if (erro.mensagem) return erro.mensagem;
    if (erro.errors) {
      const primeiroCampo = Object.keys(erro.errors)[0];
      return erro.errors[primeiroCampo][0];
    }
    if (erro.title) return erro.title;
  } catch {
    // a resposta não era JSON
  }
  return 'Ocorreu um erro (código ' + resposta.status + '). Tente novamente.';
}

// Atalhos para escrever menos código nos outros ficheiros.
export const obter = (caminho) => pedidoApi('GET', caminho);
export const criar = (caminho, dados) => pedidoApi('POST', caminho, dados);
export const atualizar = (caminho, dados) => pedidoApi('PUT', caminho, dados);
export const apagar = (caminho) => pedidoApi('DELETE', caminho);

// Transforma um objeto de filtros em texto para o URL.
// Exemplo: { pesquisa: 'ana', pagina: 2 } -> '?pesquisa=ana&pagina=2'
export function montarFiltros(filtros) {
  const partes = new URLSearchParams();
  for (const chave in filtros) {
    const valor = filtros[chave];
    if (valor !== undefined && valor !== null && valor !== '') {
      partes.append(chave, valor);
    }
  }
  const texto = partes.toString();
  return texto ? '?' + texto : '';
}

// Simula a espera de um servidor quando usamos dados fictícios.
// Devolve uma cópia dos dados para não estragar os originais.
export function simular(dados) {
  return new Promise((resolver) => {
    setTimeout(() => resolver(JSON.parse(JSON.stringify(dados ?? null))), 200);
  });
}

// Divide uma lista em páginas, no mesmo formato que a API C# deve devolver:
// { itens: [...], total: 120, pagina: 1, tamanhoPagina: 8 }
export function paginar(lista, pagina, tamanhoPagina) {
  const inicio = (pagina - 1) * tamanhoPagina;
  return {
    itens: lista.slice(inicio, inicio + tamanhoPagina),
    total: lista.length,
    pagina: pagina,
    tamanhoPagina: tamanhoPagina,
  };
}
