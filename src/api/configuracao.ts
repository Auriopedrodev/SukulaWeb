// LIGAÇÃO À API EM C#
// Aqui fica o Axios (a biblioteca que faz os pedidos HTTP) e o token de sessão.
// O endereço da API está no ficheiro ".env" (VITE_API_URL).
import axios from "axios";

// true = usa os dados de exemplo (dadosExemplo.ts) em vez da API.
// Mude no ficheiro ".env": VITE_USAR_DADOS_EXEMPLO=false
export const USAR_DADOS_EXEMPLO = import.meta.env.VITE_USAR_DADOS_EXEMPLO !== "false";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7001/api",
  headers: { "Content-Type": "application/json" },
});

// ---------- Token (sessão) ----------
const CHAVE_TOKEN = "sukula_token";

// Guarda o token enquanto o separador do navegador estiver aberto
export function guardarToken(token: string) {
  sessionStorage.setItem(CHAVE_TOKEN, token);
}

export function lerToken() {
  return localStorage.getItem(CHAVE_TOKEN) || sessionStorage.getItem(CHAVE_TOKEN);
}

export function apagarToken() {
  localStorage.removeItem(CHAVE_TOKEN);
  sessionStorage.removeItem(CHAVE_TOKEN);
}

// Antes de cada pedido: junta o token (a API em C# lê "Authorization: Bearer ...")
api.interceptors.request.use((config) => {
  const token = lerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Depois de cada resposta: se a API responder 401 (sessão expirada) volta ao login
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401 && !window.location.pathname.startsWith("/login")) {
      apagarToken();
      window.location.href = "/login";
    }
    return Promise.reject(erro);
  }
);

// Transforma um erro do Axios numa frase para mostrar ao utilizador
export function mensagemDeErro(erro: unknown) {
  if (axios.isAxiosError(erro)) {
    const dados = erro.response?.data;
    if (typeof dados === "string" && dados) return dados;
    if (dados?.mensagem) return dados.mensagem; // a API em C# pode devolver { mensagem: "..." }
    if (dados?.title) return dados.title; // erros padrão do ASP.NET
    if (!erro.response) return "Não foi possível ligar à API. Verifique se está ligada.";
  }
  if (erro instanceof Error) return erro.message;
  return "Ocorreu um erro. Tente novamente.";
}

// Simula a demora de uma resposta da API (só para os dados de exemplo)
export function esperar(milissegundos = 250) {
  return new Promise((resolver) => setTimeout(resolver, milissegundos));
}
