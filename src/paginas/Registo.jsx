import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Phone, TriangleAlert, User } from 'lucide-react';
import MolduraAcesso from '../componentes/MolduraAcesso';
import { CampoPalavraPasse, CampoTexto } from '../componentes/Formulario';
import { registar, validarEmail, validarPalavraPasse, validarTelefone } from '../servicos/autenticacao';
import simboloSukula from '../assets/imagens/logo-sukula-simbolo.png';

export default function Registo() {
  const navegar = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [aEnviar, setAEnviar] = useState(false);

  async function submeter(evento) {
    evento.preventDefault();
    setErro('');
    if (!nome.trim()) {
      setErro('O nome completo é obrigatório.');
      return;
    }
    if (!validarEmail(email)) {
      setErro('O email deve ser válido.');
      return;
    }
    if (!validarTelefone(telefone)) {
      setErro('O número de telefone deve conter apenas dígitos e pode incluir o código do país (ex: +244...).');
      return;
    }
    const erroPalavra = validarPalavraPasse(palavraPasse, confirmacao);
    if (erroPalavra) {
      setErro(erroPalavra);
      return;
    }

    setAEnviar(true);
    try {
      await registar({
        nomeCompleto: nome.trim(),
        palavraPasse,
        email: email.trim(),
        telefone,
      });
      navegar('/admin/login', { state: { contaCriada: true } });
    } catch (falha) {
      setErro(falha.message);
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <MolduraAcesso
      etiqueta="Criar conta"
      titulo={<>Crie a sua conta<br />na Sukula.</>}
      descricao="O registo cria uma conta de cliente. O acesso aos painéis de administrador e de lavandaria depende da função atribuída à conta."
    >
      <form onSubmit={submeter}>
        <img className="simbolo" src={simboloSukula} alt="" />
        <h1>Criar conta</h1>
        <p className="descricao">Preencha os dados. A palavra-passe precisa de 8 caracteres, maiúscula, minúscula, número e símbolo.</p>

        <CampoTexto rotulo="Nome completo" icone={<User size={20} />} valor={nome} aoMudar={setNome} placeholder="Nome e apelido" />
        <CampoTexto rotulo="E-mail" icone={<Mail size={20} />} tipo="email" valor={email} aoMudar={setEmail} placeholder="nome@email.com" />
        <CampoTexto rotulo="Telefone" icone={<Phone size={20} />} tipo="tel" valor={telefone} aoMudar={setTelefone} placeholder="+244900000000" />
        <CampoPalavraPasse rotulo="Palavra-passe" icone={<Lock size={20} />} valor={palavraPasse} aoMudar={setPalavraPasse} placeholder="Crie uma palavra-passe" erro={Boolean(erro)} />
        <CampoPalavraPasse rotulo="Confirmar palavra-passe" icone={<Lock size={20} />} valor={confirmacao} aoMudar={setConfirmacao} placeholder="Repita a palavra-passe" erro={Boolean(erro)} />

        {erro && (
          <p className="mensagem-erro">
            <TriangleAlert size={14} /> {erro}
          </p>
        )}

        <button type="submit" className="botao botao-escuro botao-largo" disabled={aEnviar} style={{ marginTop: 16 }}>
          {aEnviar ? 'A criar...' : 'Criar conta'}
        </button>

        <p className="registo">
          Já tem conta?
          <Link to="/admin/login">Iniciar sessão</Link>
        </p>
      </form>
    </MolduraAcesso>
  );
}
