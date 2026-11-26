// =====================================================================
//  MOLDURA DO PAINEL DO ADMINISTRADOR
//  Barra lateral à esquerda + a página escolhida à direita (<Outlet />).
//  Para acrescentar um item ao menu, junte uma linha à lista "itensDoMenu".
// =====================================================================

import { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Home, LogOut, Shirt, Store, User, Users } from 'lucide-react';
import { ModalConfirmacao } from './Modais';
import { destinoDaFuncao, lerSessao, terminarSessao, temSessaoIniciada } from '../servicos/autenticacao';
import { obterPerfil } from '../servicos/servicosAdmin';

const itensDoMenu = [
  { texto: 'Página principal', endereco: '/admin', icone: Home },
  { texto: 'Gestão de utilizadores', endereco: '/admin/clientes', icone: Users },
  { texto: 'Gestão de lavandarias', endereco: '/admin/lavandarias', icone: Store },
  { texto: 'Gestão de artigos', endereco: '/admin/artigos', icone: Shirt },
  { texto: 'Perfil da conta', endereco: '/admin/perfil', icone: User },
];

export default function LayoutAdmin() {
  const navegar = useNavigate();
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [administrador, setAdministrador] = useState({ nomeCompleto: '', fotoUrl: '' });
  const sessao = lerSessao();
  const ehAdmin = sessao?.funcao === 'Admin';

  function carregarPerfil() {
    obterPerfil().then(setAdministrador).catch(() => {});
  }

  useEffect(() => {
    if (temSessaoIniciada() && ehAdmin) carregarPerfil();
  }, []);

  if (!temSessaoIniciada() || !ehAdmin) {
    return <Navigate to={destinoDaFuncao(sessao?.funcao) || '/admin/login'} replace />;
  }

  function sair() {
    terminarSessao();
    navegar('/admin/login', { state: { sessaoTerminada: true } });
  }

  return (
    <div className="layout">
      <aside className="barra-lateral">
        <img className="logo" src="/imagens/logo-sukula.png" alt="Sukula" />

        <div className="cartao-perfil-lateral sem-fundo">
          <div className="foto">
            {administrador.fotoUrl && <img src={administrador.fotoUrl} alt={administrador.nomeCompleto} />}
            <span className="ponto-online" />
          </div>
          <div>
            <strong>{administrador.nomeCompleto}</strong>
            <small>Administrador</small>
          </div>
        </div>

        <p className="titulo-menu">MENU</p>
        {itensDoMenu.map((item) => (
          <NavLink
            key={item.endereco}
            to={item.endereco}
            end={item.endereco === '/admin'}
            className={({ isActive }) => 'item-menu' + (isActive ? ' ativo' : '')}
          >
            <item.icone size={20} />
            {item.texto}
          </NavLink>
        ))}

        <div className="espaco-flexivel" />
        <hr className="divisor" />
        <button type="button" className="item-menu sair" onClick={() => setConfirmarSaida(true)}>
          <LogOut size={20} />
          Terminar sessão
        </button>
      </aside>

      <main className="area-principal">
        {/* Aqui aparece a página escolhida no menu */}
        <Outlet context={{ pedirTerminarSessao: () => setConfirmarSaida(true), recarregarPerfil: carregarPerfil }} />
      </main>

      {confirmarSaida && (
        <ModalConfirmacao
          icone={<LogOut size={26} />}
          titulo="Terminar sessão?"
          texto="Terá de iniciar sessão novamente para aceder ao painel de administração da Sukula."
          textoConfirmar="Sim, terminar sessão"
          aoConfirmar={sair}
          aoCancelar={() => setConfirmarSaida(false)}
        />
      )}
    </div>
  );
}
