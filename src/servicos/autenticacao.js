// =====================================================================
//  AUTENTICAÇÃO (Axios → Sukula API /api/v1/auth)
//  POST /login            { email, palavraPasse }
//  POST /signup           { nomeCompleto, palavraPasse, email, telefone }
//  POST /forgot-password  { email, uriCliente }
//  POST /reset-password   { novaPalavraPasse, confirmarPalavraPasse, email, token }
//  POST /refresh-token    { tokenAtualizacao }
// =====================================================================

import axios from 'axios';
import { api, caminhoPublico, getApiErrorMessage } from './api';
import {
  URL_DA_API,
  NOME_DO_TOKEN,
  NOME_DO_TOKEN_ATUALIZACAO,
  NOME_DA_SESSAO,
  NOME_DO_UTILIZADOR,
} from '../configuracao';

const CAMINHO = '/api/v1/auth';

export function destinoDaFuncao(funcao) {
  if (funcao === 'Admin') return '/admin';
  if (funcao === 'Manager') return '/lavandaria/controle/dashboard';
  return null;
}

export function lerSessao() {
  try {
    return JSON.parse(localStorage.getItem(NOME_DA_SESSAO) || 'null');
  } catch {
    return null;
  }
}

export function temSessaoIniciada() {
  return Boolean(localStorage.getItem(NOME_DO_TOKEN));
}

export function terminarSessao() {
  localStorage.removeItem(NOME_DO_TOKEN);
  localStorage.removeItem(NOME_DO_TOKEN_ATUALIZACAO);
  localStorage.removeItem(NOME_DA_SESSAO);
  localStorage.removeItem(NOME_DO_UTILIZADOR);
}

function guardarSessao(resposta, email) {
  localStorage.setItem(NOME_DO_TOKEN, resposta.token);
  localStorage.setItem(NOME_DO_TOKEN_ATUALIZACAO, resposta.tokenAtualizacao);
  const sessao = {
    funcao: resposta.funcao,
    lavandariaId: resposta.lavandariaId || null,
    email,
  };
  localStorage.setItem(NOME_DA_SESSAO, JSON.stringify(sessao));
  localStorage.setItem(NOME_DO_UTILIZADOR, JSON.stringify(sessao));
}

export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
}

export function validarTelefone(telefone) {
  return /^\+?\d{8,15}$/.test((telefone || '').replace(/\s/g, ''));
}

export function validarPalavraPasse(palavra, confirmacao) {
  if (!palavra || palavra.length < 8) return 'A palavra-passe deve ter pelo menos 8 caracteres.';
  if (!/[A-Z]/.test(palavra)) return 'A palavra-passe deve conter pelo menos uma letra maiúscula.';
  if (!/[a-z]/.test(palavra)) return 'A palavra-passe deve conter pelo menos uma letra minúscula.';
  if (!/[0-9]/.test(palavra)) return 'A palavra-passe deve conter pelo menos um dígito.';
  if (!/[\W_]/.test(palavra)) return 'A palavra-passe deve conter pelo menos um caractere especial.';
  if (confirmacao !== undefined && confirmacao !== palavra) {
    return 'A confirmação da palavra-passe deve corresponder à nova palavra-passe.';
  }
  return '';
}

export async function iniciarSessao(email, palavraPasse) {
  let resposta;
  try {
    const resultado = await api.post(CAMINHO + '/login', { email, palavraPasse });
    resposta = resultado.data;
  } catch (erro) {
    throw new Error(getApiErrorMessage(erro));
  }

  if (resposta.funcao !== 'Admin' && resposta.funcao !== 'Manager') {
    throw new Error('Esta conta não tem acesso a este painel.');
  }

  guardarSessao(resposta, email);
  return resposta;
}

export async function registar({ nomeCompleto, palavraPasse, email, telefone }) {
  try {
    const resultado = await api.post(CAMINHO + '/signup', {
      nomeCompleto,
      palavraPasse,
      email,
      telefone: telefone.replace(/\s/g, ''),
    });
    return resultado.data;
  } catch (erro) {
    throw new Error(getApiErrorMessage(erro));
  }
}

export async function pedirRedefinicao(email) {
  const uriCliente = window.location.origin + '/redefinir-palavra-passe';
  try {
    const resultado = await api.post(CAMINHO + '/forgot-password', { email, uriCliente });
    return resultado.data;
  } catch (erro) {
    throw new Error(getApiErrorMessage(erro));
  }
}

export async function redefinirPalavraPasse({ novaPalavraPasse, confirmarPalavraPasse, email, token }) {
  try {
    const resultado = await api.post(CAMINHO + '/reset-password', {
      novaPalavraPasse,
      confirmarPalavraPasse,
      email,
      token,
    });
    return resultado.data;
  } catch (erro) {
    throw new Error(getApiErrorMessage(erro));
  }
}

// Pede um access token novo. Usa o Axios cru para não voltar a entrar no interceptor.
export async function atualizarToken() {
  const tokenAtualizacao = localStorage.getItem(NOME_DO_TOKEN_ATUALIZACAO);
  if (!tokenAtualizacao) throw new Error('Sessão expirada. Inicie sessão novamente.');

  const resultado = await axios.post(URL_DA_API + CAMINHO + '/refresh-token', { tokenAtualizacao });
  const tokenAcesso = resultado.data?.tokenAcesso;
  if (!tokenAcesso) throw new Error('Não foi possível atualizar a sessão.');
  localStorage.setItem(NOME_DO_TOKEN, tokenAcesso);
  return tokenAcesso;
}

api.interceptors.response.use(
  (resposta) => resposta,
  async (erro) => {
    const pedido = erro.config;
    const caminho = pedido?.url || '';
    if (erro.response?.status === 401 && pedido && !caminhoPublico(caminho) && !pedido._repetido) {
      pedido._repetido = true;
      try {
        const token = await atualizarToken();
        pedido.headers = pedido.headers || {};
        pedido.headers.Authorization = 'Bearer ' + token;
        return api(pedido);
      } catch {
        terminarSessao();
        if (!window.location.pathname.endsWith('/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(erro);
  }
);
