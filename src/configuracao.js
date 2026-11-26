// =====================================================================
//  CONFIGURAÇÃO GERAL DO SITE
//  Os valores vêm do ficheiro ".env" (na raiz do projeto).
//  Se mudar o ".env", pare o site (Ctrl+C) e volte a correr "npm run dev".
// =====================================================================

// Endereço da API em C#. As rotas de autenticação ficam em /api/v1/auth.
export const URL_DA_API = import.meta.env.VITE_URL_API || 'http://localhost:5164';

// true  -> usa os dados de exemplo da pasta "src/dados" (não precisa da API)
// false -> fala com a API verdadeira
export const USAR_DADOS_FICTICIOS = import.meta.env.VITE_USAR_DADOS_FICTICIOS !== 'false';

// Nomes com que a sessão é guardada no navegador.
export const NOME_DO_TOKEN = 'sukula_token';
export const NOME_DO_TOKEN_ATUALIZACAO = 'sukula_token_atualizacao';
export const NOME_DA_SESSAO = 'sukula_sessao';
export const NOME_DO_UTILIZADOR = 'sukula_utilizador';

// Quantas linhas aparecem em cada página das tabelas.
export const LINHAS_POR_PAGINA = 8;
