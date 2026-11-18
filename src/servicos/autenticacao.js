// =====================================================================
//  INICIAR / TERMINAR SESSÃO
//  Endpoint C#:  POST /api/autenticacao/login
//  Envia:   { emailOuTelefone, palavraPasse, manterSessao, tipoUtilizador }
//  Recebe:  { token: "jwt...", utilizador: { id, nome, perfil, fotoUrl } }
//  tipoUtilizador: "Administrador" ou "Lavandaria"
// =====================================================================

import { criar, simular } from './api';
import { USAR_DADOS_FICTICIOS, NOME_DO_TOKEN, NOME_DO_UTILIZADOR } from '../configuracao';

export async function iniciarSessao(emailOuTelefone, palavraPasse, manterSessao, tipoUtilizador) {
  let resposta;

  if (USAR_DADOS_FICTICIOS) {
    // Em modo de teste qualquer palavra-passe com 6 ou mais caracteres é aceite.
    if (!emailOuTelefone || palavraPasse.length < 6) {
      throw new Error('Palavra-passe incorreta. Verifique os dados e tente novamente.');
    }
    resposta = await simular({
      token: 'token-de-teste',
      utilizador:
        tipoUtilizador === 'Administrador'
          ? { id: 1, nome: 'Sukulinha', perfil: 'Administrador', fotoUrl: '/imagens/foto-administrador.png' }
          : { id: 1, nome: 'Lavandaria Lavimpa', perfil: 'Lavandaria', fotoUrl: '/imagens/foto-lavandaria.jpg' },
    });
  } else {
    resposta = await criar('/autenticacao/login', {
      emailOuTelefone: emailOuTelefone,
      palavraPasse: palavraPasse,
      manterSessao: manterSessao,
      tipoUtilizador: tipoUtilizador,
    });
  }

  localStorage.setItem(NOME_DO_TOKEN, resposta.token);
  localStorage.setItem(NOME_DO_UTILIZADOR, JSON.stringify(resposta.utilizador));
  return resposta.utilizador;
}

export function terminarSessao() {
  localStorage.removeItem(NOME_DO_TOKEN);
  localStorage.removeItem(NOME_DO_UTILIZADOR);
}

// Devolve true se existir uma sessão guardada no navegador.
export function temSessaoIniciada() {
  return Boolean(localStorage.getItem(NOME_DO_TOKEN));
}
