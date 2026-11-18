// =====================================================================
//  PÁGINA DE INICIAR SESSÃO
//  É usada pelos dois painéis (Administrador e Lavandaria).
//  O que muda entre eles vem pelas "props" (textos e tipo de utilizador).
// =====================================================================

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircleCheck, Lock, Phone, TriangleAlert } from 'lucide-react';
import { CampoPalavraPasse } from './Formulario';
import { AvisoFlutuante } from './Modais';
import { iniciarSessao } from '../servicos/autenticacao';

export default function PaginaLogin({ tipoUtilizador, etiqueta, titulo, descricao, enderecoDepois, mostrarRedesSociais, textoRegisto, textoLigacaoRegisto }) {
  const navegar = useNavigate();
  const local = useLocation();

  const [emailOuTelefone, setEmailOuTelefone] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [manterSessao, setManterSessao] = useState(false);
  const [erro, setErro] = useState('');
  const [aEntrar, setAEntrar] = useState(false);
  const [mostrarAvisoSaida, setMostrarAvisoSaida] = useState(Boolean(local.state && local.state.sessaoTerminada));

  async function entrar(evento) {
    evento.preventDefault();
    setErro('');
    setAEntrar(true);
    try {
      await iniciarSessao(emailOuTelefone, palavraPasse, manterSessao, tipoUtilizador);
      navegar(enderecoDepois);
    } catch (falha) {
      setErro(falha.message);
    }
    setAEntrar(false);
  }

  return (
    <div className="pagina-login">
      {/* Lado esquerdo: fotografia e textos */}
      <section className="login-imagem" style={{ backgroundImage: 'url(/imagens/foto-login.jpg)' }}>
        <div className="fundo-logo">
          <img src="/imagens/logo-sukula.png" alt="Sukula" />
        </div>
        <span className="chip">{etiqueta}</span>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </section>

      {/* Lado direito: formulário */}
      <section className="login-formulario">
        {mostrarAvisoSaida && (
          <AvisoFlutuante
            emCima
            icone={<CircleCheck size={20} />}
            titulo="Sessão terminada"
            texto="Inicie sessão novamente para aceder ao painel."
            aoFechar={() => setMostrarAvisoSaida(false)}
          />
        )}

        <form onSubmit={entrar}>
          <img className="simbolo" src="/imagens/logo-sukula-simbolo.png" alt="" />
          <h1>Iniciar sessão</h1>
          <p className="descricao">Preencha suas informações abaixo.</p>

          <label>E-mail/ Número de telefone</label>
          <div className="caixa-campo">
            <Phone size={20} />
            <input
              value={emailOuTelefone}
              placeholder="Ex: +244 9XX XXX XXX"
              onChange={(evento) => setEmailOuTelefone(evento.target.value)}
            />
          </div>

          <CampoPalavraPasse
            rotulo="Palavra-passe"
            icone={<Lock size={20} />}
            valor={palavraPasse}
            aoMudar={setPalavraPasse}
            placeholder="Insira a sua palavra-passe"
            erro={Boolean(erro)}
          />
          {erro && (
            <p className="mensagem-erro">
              <TriangleAlert size={14} /> {erro}
            </p>
          )}

          <div className="opcoes">
            <label>
              <input
                type="checkbox"
                className="caixa-de-selecao"
                style={{ width: 18, height: 18 }}
                checked={manterSessao}
                onChange={(evento) => setManterSessao(evento.target.checked)}
              />
              Manter sessão iniciada
            </label>
            <a href="#">Esqueci a palavra-passe ?</a>
          </div>

          <button type="submit" className="botao botao-escuro botao-largo" disabled={aEntrar}>
            {aEntrar ? 'A entrar...' : 'Entrar'}
          </button>

          {mostrarRedesSociais && (
            <>
              <div className="separador-ou">ou</div>
              <button type="button" className="botao botao-secundario botao-largo">Continuar com Google</button>
              <button type="button" className="botao botao-secundario botao-largo" style={{ marginTop: 4 }}>
                Continuar com Apple
              </button>
            </>
          )}

          <p className="registo">
            {textoRegisto}
            <a href="#">{textoLigacaoRegisto}</a>
          </p>
        </form>

        <p className="rodape-login">© 2026 Sukula · Termos · Privacidade</p>
      </section>
    </div>
  );
}
