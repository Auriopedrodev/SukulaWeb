import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, TriangleAlert } from 'lucide-react';
import MolduraAcesso from '../componentes/MolduraAcesso';
import { CampoTexto } from '../componentes/Formulario';
import { pedirRedefinicao, validarEmail } from '../servicos/autenticacao';
import simboloSukula from '../assets/imagens/logo-sukula-simbolo.png';

export default function EsqueciPalavraPasse() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [aEnviar, setAEnviar] = useState(false);

  async function submeter(evento) {
    evento.preventDefault();
    setErro('');
    setAviso('');
    if (!validarEmail(email)) {
      setErro('O email deve ser válido.');
      return;
    }

    setAEnviar(true);
    try {
      const resposta = await pedirRedefinicao(email.trim());
      setAviso(resposta?.message || 'Email de redefinição de palavra-passe enviado com sucesso.');
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <MolduraAcesso
      etiqueta="Palavra-passe"
      titulo={<>Recupere o acesso<br />à sua conta.</>}
      descricao="Indique o email da conta. Enviaremos um link para escolher uma palavra-passe nova."
    >
      <form onSubmit={submeter}>
        <img className="simbolo" src={simboloSukula} alt="" />
        <h1>Esqueci a palavra-passe</h1>
        <p className="descricao">O link do email abre a página para definir a nova palavra-passe.</p>

        <CampoTexto rotulo="E-mail" icone={<Mail size={20} />} tipo="email" valor={email} aoMudar={setEmail} placeholder="nome@email.com" />

        {erro && (
          <p className="mensagem-erro">
            <TriangleAlert size={14} /> {erro}
          </p>
        )}
        {aviso && <p className="descricao">{aviso}</p>}

        <button type="submit" className="botao botao-escuro botao-largo" disabled={aEnviar} style={{ marginTop: 16 }}>
          {aEnviar ? 'A enviar...' : 'Enviar link'}
        </button>

        <p className="registo">
          Lembrou-se?
          <Link to="/admin/login">Iniciar sessão</Link>
        </p>
      </form>
    </MolduraAcesso>
  );
}
