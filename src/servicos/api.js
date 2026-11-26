// =====================================================================
//  LIGAÇÃO À API C#
//  Todas as chamadas ao servidor passam por aqui.
//  - Envia e recebe JSON (o ASP.NET Core usa "camelCase" por defeito:
//    a propriedade "NomeCompleto" em C# chega aqui como "nomeCompleto").
//  - Envia o token JWT no cabeçalho "Authorization: Bearer ...".
// =====================================================================

import axios from 'axios';
import {
  URL_DA_API,
  NOME_DO_TOKEN,
  NOME_DO_TOKEN_ATUALIZACAO,
  NOME_DA_SESSAO,
  NOME_DO_UTILIZADOR,
} from '../configuracao';

// Cliente Axios usado pela autenticação.
// O endereço base é o da API (ex.: http://localhost:5164).
export const api = axios.create({
  baseURL: URL_DA_API,
  headers: { 'Content-Type': 'application/json' },
});

// Login, registo e palavra-passe não levam o token. Um Bearer antigo
// faz a API cortar a resposta (401 e corpo incompleto).
export function caminhoPublico(caminho) {
  const url = String(caminho || '');
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/signup') ||
    url.includes('/auth/forgot-password') ||
    url.includes('/auth/reset-password') ||
    url.includes('/auth/refresh-token')
  );
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(NOME_DO_TOKEN);
  if (token && !caminhoPublico(config.url)) config.headers.Authorization = `Bearer ${token}`;
  // O Axios junta o boundary do multipart sozinho. O JSON por defeito impedia isso.
  if (config.data instanceof FormData && config.headers?.delete) {
    config.headers.delete('Content-Type');
  }
  return config;
});

// errorType da API: 2 validação, 3 não encontrado, 5 conflito.
export const TIPO_VALIDACAO = 2;
export const TIPO_NAO_ENCONTRADO = 3;
export const TIPO_CONFLITO = 5;

const SEM_LIGACAO = 'Não foi possível ligar à API. Verifique se está ligada.';

// Lê a frase que a API devolve.
// errors[].description (ou Errors/Description), texto, message ou title.
export const getApiErrorMessage = (error, fallback = 'Ocorreu um erro. Tente novamente.') => {
  try {
    if (!error?.response) return SEM_LIGACAO;

    const errBody = error.response.data;
    let backendMessage = '';

    if (errBody) {
      const lista = Array.isArray(errBody.errors) ? errBody.errors : Array.isArray(errBody.Errors) ? errBody.Errors : null;
      if (lista && lista.length > 0) {
        const descriptions = lista
          .map((e) => e?.description || e?.Description)
          .filter((d) => typeof d === 'string' && d.trim().length > 0);
        if (descriptions.length > 0) backendMessage = descriptions.join('\n');
      } else if (typeof errBody === 'string') {
        backendMessage = errBody;
      } else if (typeof errBody.message === 'string') {
        backendMessage = errBody.message;
      } else if (typeof errBody.Message === 'string') {
        backendMessage = errBody.Message;
      } else if (typeof errBody.title === 'string') {
        backendMessage = errBody.title;
      }
    }

    return backendMessage || fallback;
  } catch {
    return fallback;
  }
};

// O texto vem de getApiErrorMessage. status, code e errorType ficam
// para quem distingue 404 de lista vazia, validação e conflito.
export function erroDoPedido(erro) {
  const dados = erro?.response?.data;
  const lista = dados?.errors || dados?.Errors;
  const primeiro = Array.isArray(lista) ? lista[0] : null;
  return Object.assign(new Error(getApiErrorMessage(erro)), {
    status: erro?.response?.status ?? 0,
    code: primeiro?.code || primeiro?.Code,
    errorType: primeiro?.errorType ?? primeiro?.ErrorType,
  });
}

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
    localStorage.removeItem(NOME_DO_TOKEN_ATUALIZACAO);
    localStorage.removeItem(NOME_DA_SESSAO);
    localStorage.removeItem(NOME_DO_UTILIZADOR);
    const ehLavandaria = window.location.pathname.startsWith('/lavandaria');
    window.location.href = ehLavandaria ? '/lavandaria/login' : '/admin/login';
    throw new Error('Sessão expirada. Inicie sessão novamente.');
  }

  if (!resposta.ok) {
    throw new Error(await mensagemDoFetch(resposta));
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
    throw new Error(await mensagemDoFetch(resposta));
  }
  return resposta.status === 204 ? null : resposta.json();
}

// O fetch não traz o erro no formato do Axios. O corpo entra na mesma função.
async function mensagemDoFetch(resposta) {
  let dados = null;
  try {
    dados = await resposta.json();
  } catch {
    dados = null;
  }
  return getApiErrorMessage({ response: { data: dados, status: resposta.status } });
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
