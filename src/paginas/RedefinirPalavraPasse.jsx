import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, TriangleAlert } from 'lucide-react';
import MolduraAcesso from '../componentes/MolduraAcesso';
import { CampoPalavraPasse } from '../componentes/Formulario';
import { redefinirPalavraPasse, validarPalavraPasse } from '../servicos/autenticacao';
import simboloSukula from '../assets/imagens/logo-sukula-simbolo.png';

export default function RedefinirPalavraPasse() {
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const email = parametros.get('email') || '';
  const token = parametros.get('token') || '';

  const [palavraPasse, setPalavraPasse] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState(email && token ? '' : 'O link de redefinição está incompleto. Peça um novo email.');
  const [aEnviar, setAEnviar] = useState(false);

  async function submeter(evento) {
    evento.preventDefault();
    if (!email || !token) {
      setErro('O link de redefinição está incompleto. Peça um novo email.');
      return;
    }
    const erroPalavra = validarPalavraPasse(palavraPasse, confirmacao);
    if (erroPalavra) {
      setErro(erroPalavra);
      return;
    }

    setErro('');
    setAEnviar(true);
    try {
      await redefinirPalavraPasse({
        novaPalavraPasse: palavraPasse,
        confirmarPalavraPasse: confirmacao,
        email,
        token,
      });
      navegar('/admin/login', { state: { palavraPasseRedefinida: true } });
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <MolduraAcesso
      etiqueta="Palavra-passe"
      titulo={<>Escolha uma<br />palavra-passe nova.</>}
      descricao="Use pelo menos 8 caracteres, com maiúscula, minúscula, número e um símbolo."
    >
      <form onSubmit={submeter}>
        <img className="simbolo" src={simboloSukula} alt="" />
        <h1>Redefinir palavra-passe</h1>
        <p className="descricao">{email ? `Conta: ${email}` : 'Abra o link que recebeu por email.'}</p>

        <CampoPalavraPasse rotulo="Nova palavra-passe" icone={<Lock size={20} />} valor={palavraPasse} aoMudar={setPalavraPasse} placeholder="Nova palavra-passe" erro={Boolean(erro)} />
        <CampoPalavraPasse rotulo="Confirmar palavra-passe" icone={<Lock size={20} />} valor={confirmacao} aoMudar={setConfirmacao} placeholder="Repita a palavra-passe" erro={Boolean(erro)} />

        {erro && (
          <p className="mensagem-erro">
            <TriangleAlert size={14} /> {erro}
          </p>
        )}

        <button type="submit" className="botao botao-escuro botao-largo" disabled={aEnviar || !email || !token} style={{ marginTop: 16 }}>
          {aEnviar ? 'A guardar...' : 'Guardar palavra-passe'}
        </button>

        <p className="registo">
          O link expirou?
          <Link to="/esqueci-palavra-passe">Pedir outro</Link>
        </p>
      </form>
    </MolduraAcesso>
  );
}
