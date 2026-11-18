// =====================================================================
//  CONFIGURAÇÃO GERAL DO SITE
//  Os valores vêm do ficheiro ".env" (na raiz do projeto).
//  Se mudar o ".env", pare o site (Ctrl+C) e volte a correr "npm run dev".
// =====================================================================

// Endereço da API em C#. Exemplo: https://localhost:7001/api
export const URL_DA_API = import.meta.env.VITE_URL_API || 'https://localhost:7001/api';

// true  -> usa os dados de exemplo da pasta "src/dados" (não precisa da API)
// false -> fala com a API verdadeira
export const USAR_DADOS_FICTICIOS = import.meta.env.VITE_USAR_DADOS_FICTICIOS !== 'false';

// Nome com que o "token" de sessão é guardado no navegador.
export const NOME_DO_TOKEN = 'sukula_token';
export const NOME_DO_UTILIZADOR = 'sukula_utilizador';

// Quantas linhas aparecem em cada página das tabelas.
export const LINHAS_POR_PAGINA = 8;
