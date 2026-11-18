// =====================================================================
//  MOLDURA DO PAINEL DA LAVANDARIA (Portal do Parceiro)
//  Barra lateral à esquerda + a página escolhida à direita (<Outlet />).
// =====================================================================

import { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, LayoutGrid, LogOut, Package, User } from 'lucide-react';
import { ModalConfirmacao } from './Modais';
import { terminarSessao, temSessaoIniciada } from '../servicos/autenticacao';
import { obterContaLavandaria } from '../servicos/servicosLavandaria';

// Grupos do menu. Cada grupo tem os seus subitens.
// "contador" é o nome do campo da conta com o número a mostrar no círculo vermelho.
const gruposDoMenu = [
  {
    texto: 'Controle',
    icone: LayoutGrid,
    comeco: '/lavandaria/controle',
    itens: [
      { texto: 'Dashboard', endereco: '/lavandaria/controle/dashboard' },
      { texto: 'Estafetas', endereco: '/lavandaria/controle/estafetas' },
    ],
  },
  {
    texto: 'Gestão de pedidos',
    icone: Package,
    comeco: '/lavandaria/pedidos',
    itens: [
      { texto: 'Pedidos novos', endereco: '/lavandaria/pedidos/novos', contador: 'pedidosNovos' },
      { texto: 'Em processamento', endereco: '/lavandaria/pedidos/em-processamento', contador: 'pedidosEmProcessamento' },
      { texto: 'Histórico', endereco: '/lavandaria/pedidos/historico' },
    ],
  },
];

export default function LayoutLavandaria() {
  const navegar = useNavigate();
  const endereco = useLocation().pathname;
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [lavandaria, setLavandaria] = useState({ nome: '', localizacao: '', fotoUrl: '' });

  // Vai buscar os dados da lavandaria (nome, foto, contadores) à API
  function carregarConta() {
    obterContaLavandaria().then(setLavandaria).catch(() => {});
  }

  useEffect(() => {
    if (temSessaoIniciada()) carregarConta();
  }, []);

  if (!temSessaoIniciada()) {
    return <Navigate to="/lavandaria/login" replace />;
  }

  function sair() {
    terminarSessao();
    navegar('/lavandaria/login', { state: { sessaoTerminada: true } });
  }

  return (
    <div className="layout">
      <aside className="barra-lateral">
        <img className="logo" src="/imagens/logo-sukula.png" alt="Sukula" />

        <div className="cartao-perfil-lateral">
          <div className="foto">
            {lavandaria.fotoUrl && <img src={lavandaria.fotoUrl} alt={lavandaria.nome} />}
            <span className="ponto-online" />
          </div>
          <div>
            <strong>{lavandaria.nome}</strong>
            <small>{lavandaria.localizacao}</small>
          </div>
        </div>

        <p className="titulo-menu">MENU</p>

        {gruposDoMenu.map((grupo) => {
          const aberto = endereco.startsWith(grupo.comeco);
          return (
            <div key={grupo.texto}>
              <button
                type="button"
                className={'item-menu' + (aberto ? ' grupo-aberto' : '')}
                onClick={() => navegar(grupo.itens[0].endereco)}
              >
                <grupo.icone size={20} />
                {grupo.texto}
                {aberto ? <ChevronDown size={16} className="seta" /> : <ChevronRight size={16} className="seta" />}
              </button>
              <div className="submenu">
                {grupo.itens.map((item) => (
                  <NavLink key={item.endereco} to={item.endereco} className={({ isActive }) => 'item-menu' + (isActive ? ' ativo' : '')}>
                    {item.texto}
                    {lavandaria[item.contador] > 0 && <span className="contador-menu">{lavandaria[item.contador]}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}

        <NavLink to="/lavandaria/perfil" className={({ isActive }) => 'item-menu' + (isActive ? ' ativo' : '')}>
          <User size={20} />
          Perfil da conta
        </NavLink>

        <div className="espaco-flexivel" />
        <hr className="divisor" />
        <button type="button" className="item-menu sair-vermelho" onClick={() => setConfirmarSaida(true)}>
          <LogOut size={20} />
          Terminar sessão
        </button>
      </aside>

      <main className="area-principal">
        {/* As páginas recebem a conta da lavandaria através de useOutletContext() */}
        <Outlet context={{ lavandaria: lavandaria, recarregarConta: carregarConta, pedirTerminarSessao: () => setConfirmarSaida(true) }} />
      </main>

      {confirmarSaida && (
        <ModalConfirmacao
          icone={<LogOut size={26} />}
          iconeComFundo
          escuro
          titulo="Terminar sessão?"
          texto={'Terá de iniciar sessão novamente para gerir os pedidos da ' + lavandaria.nome + '.'}
          textoConfirmar="Sim, terminar sessão"
          aoConfirmar={sair}
          aoCancelar={() => setConfirmarSaida(false)}
        />
      )}
    </div>
  );
}
