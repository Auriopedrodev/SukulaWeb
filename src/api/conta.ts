// PEDIDOS À API: login, conta do administrador, página principal e informações
// Endereços usados na API em C#:
//   POST /autenticacao/login             -> entrar
//   GET  /dashboard/resumo               -> números da página principal
//   GET  /conta                          -> dados do administrador
//   PUT  /conta                          -> guardar dados do administrador
//   GET  /conta/historico-lavandarias    -> "Histórico da lavandaria"
//   GET  /informacoes                    -> Central de ajuda, Termos, Privacidade, Sobre
//   PUT  /informacoes/central-ajuda | /termos | /privacidade | /sobre
import { api, apagarToken, esperar, guardarToken, lerToken, USAR_DADOS_EXEMPLO } from "./configuracao";
import * as exemplo from "./dadosExemplo";
import type { Administrador, CentralAjuda, Documento, Informacoes, RespostaLogin, Resumo, SobreSukula } from "./tipos";

// ---------- Sessão ----------
export function temSessao() {
  return lerToken() !== null;
}

export async function entrar(utilizador: string, palavraPasse: string) {
  let resposta: RespostaLogin;
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    if (palavraPasse !== exemplo.PALAVRA_PASSE_EXEMPLO) {
      throw new Error("Palavra-passe incorreta. Verifique os dados e tente novamente.");
    }
    resposta = { token: "token-de-exemplo", administrador: exemplo.administrador };
  } else {
    const r = await api.post<RespostaLogin>("/autenticacao/login", { utilizador, palavraPasse });
    resposta = r.data;
  }
  guardarToken(resposta.token);
  return resposta.administrador;
}

export function terminarSessao() {
  apagarToken();
}

// ---------- Página principal ----------
export async function obterResumo(): Promise<Resumo> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    return exemplo.resumo;
  }
  const r = await api.get<Resumo>("/dashboard/resumo");
  return r.data;
}

// ---------- Conta do administrador ----------
export async function obterConta(): Promise<Administrador> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar(100);
    return exemplo.administrador;
  }
  const r = await api.get<Administrador>("/conta");
  return r.data;
}

export type DadosEditarConta = {
  nome: string;
  morada: string;
  ativo: boolean;
};

export async function guardarConta(dados: DadosEditarConta): Promise<Administrador> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.administrador.nome = dados.nome;
    exemplo.administrador.morada = dados.morada;
    exemplo.administrador.ativo = dados.ativo;
    return exemplo.administrador;
  }
  const r = await api.put<Administrador>("/conta", dados);
  return r.data;
}

export async function listarHistoricoLavandarias(): Promise<{ nome: string; logo: string }[]> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    return exemplo.historicoLavandarias;
  }
  const r = await api.get("/conta/historico-lavandarias");
  return r.data;
}

// ---------- Informações ----------
export async function obterInformacoes(): Promise<Informacoes> {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    return exemplo.informacoes;
  }
  const r = await api.get<Informacoes>("/informacoes");
  return r.data;
}

// Data de hoje no formato "12 Nov 2026"
function hoje() {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

export async function publicarCentralAjuda(dados: CentralAjuda) {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.informacoes.centralAjuda = { ...dados, ultimaAtualizacao: hoje() };
    return;
  }
  await api.put("/informacoes/central-ajuda", dados);
}

// qual = "termos" ou "privacidade"
export async function publicarDocumento(qual: "termos" | "privacidade", dados: Documento) {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.informacoes[qual] = { ...dados, ultimaAtualizacao: `${hoje()} · ${dados.versao}` };
    return;
  }
  await api.put(`/informacoes/${qual}`, dados);
}

export async function publicarSobre(dados: SobreSukula) {
  if (USAR_DADOS_EXEMPLO) {
    await esperar();
    exemplo.informacoes.sobre = dados;
    return;
  }
  await api.put("/informacoes/sobre", dados);
}
