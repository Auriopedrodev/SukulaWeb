// =====================================================================
//  PÁGINA DE INICIAR SESSÃO
//  É usada pelos dois painéis (Administrador e Lavandaria).
//  O que muda entre eles vem pelas "props" (textos e tipo de utilizador).
// =====================================================================

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CircleCheck, Lock, Mail, TriangleAlert } from 'lucide-react';
import { CampoPalavraPasse } from './Formulario';
import { AvisoFlutuante } from './Modais';
import { destinoDaFuncao, iniciarSessao, validarEmail } from '../servicos/autenticacao';
import fotoLogin from '../assets/imagens/foto-login.jpg';
import logoSukula from '../assets/imagens/logo-sukula.png';
import simboloSukula from '../assets/imagens/logo-sukula-simbolo.png';

export default function PaginaLogin({ etiqueta, titulo, descricao, mostrarRedesSociais, textoRegisto, textoLigacaoRegisto }) {
  const navegar = useNavigate();
  const local = useLocation();

  const [emailOuTelefone, setEmailOuTelefone] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [manterSessao, setManterSessao] = useState(false);
  const [erro, setErro] = useState('');
  const [aEntrar, setAEntrar] = useState(false);
  const [mostrarAvisoSaida, setMostrarAvisoSaida] = useState(Boolean(local.state && local.state.sessaoTerminada));
  const [mostrarAvisoConta, setMostrarAvisoConta] = useState(Boolean(local.state && local.state.contaCriada));
  const [mostrarAvisoPalavra, setMostrarAvisoPalavra] = useState(Boolean(local.state && local.state.palavraPasseRedefinida));

  async function entrar(evento) {
    evento.preventDefault();
    setErro('');
    if (!validarEmail(emailOuTelefone)) {
      setErro('O email deve ser válido.');
      return;
    }
    if (!palavraPasse) {
      setErro('A palavra-passe é obrigatória.');
      return;
    }
    setAEntrar(true);
    try {
      const sessao = await iniciarSessao(emailOuTelefone.trim(), palavraPasse);
      const destino = destinoDaFuncao(sessao.funcao);
      if (!destino) throw new Error('Esta conta não tem acesso a este painel.');
      navegar(destino);
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setAEntrar(false);
    }
  }

  return (
    <div className="pagina-login">
      {/* Lado esquerdo: fotografia e textos */}
      <section className="login-imagem" style={{ backgroundImage: `url(${fotoLogin})` }}>
        <div className="fundo-logo">
          <img src={logoSukula} alt="Sukula" />
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
        {mostrarAvisoConta && (
          <AvisoFlutuante
            emCima
            icone={<CircleCheck size={20} />}
            titulo="Conta criada"
            texto="A conta foi criada. Inicie sessão se já tiver acesso a um painel."
            aoFechar={() => setMostrarAvisoConta(false)}
          />
        )}
        {mostrarAvisoPalavra && (
          <AvisoFlutuante
            emCima
            icone={<CircleCheck size={20} />}
            titulo="Palavra-passe redefinida"
            texto="Já pode iniciar sessão com a nova palavra-passe."
            aoFechar={() => setMostrarAvisoPalavra(false)}
          />
        )}

        <form onSubmit={entrar}>
          <img className="simbolo" src={simboloSukula} alt="" />
          <h1>Iniciar sessão</h1>
          <p className="descricao">Preencha suas informações abaixo.</p>

          <label>E-mail</label>
          <div className="caixa-campo">
            <Mail size={20} />
            <input
              type="email"
              value={emailOuTelefone}
              placeholder="nome@email.com"
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
            <Link to="/esqueci-palavra-passe">Esqueci a palavra-passe ?</Link>
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
            <Link to="/registo">{textoLigacaoRegisto}</Link>
          </p>
        </form>

        <p className="rodape-login">© 2026 Sukula · Termos · Privacidade</p>
      </section>
    </div>
  );
}
