// =====================================================================
//  Separadores do topo da "Gestão de pedidos" + pesquisa + filtrar
//  (usado nas páginas Pedidos novos, Em processamento e Histórico)
// =====================================================================

import { useNavigate, useOutletContext } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function SeparadoresPedidos({ ativo, pesquisa, aoPesquisar }) {
  const navegar = useNavigate();
  const { lavandaria } = useOutletContext(); // vem do LayoutLavandaria

  const separadores = [
    { id: 'novos', texto: 'Pedidos novos (' + (lavandaria.pedidosNovos || 0) + ')', endereco: '/lavandaria/pedidos/novos' },
    { id: 'em-processamento', texto: 'Em processamento (' + (lavandaria.pedidosEmProcessamento || 0) + ')', endereco: '/lavandaria/pedidos/em-processamento' },
    { id: 'historico', texto: 'Histórico', endereco: '/lavandaria/pedidos/historico' },
  ];

  return (
    <div className="linha-entre">
      <div className="separadores">
        {separadores.map((item) => (
          <button key={item.id} type="button" className={ativo === item.id ? 'ativo' : ''} onClick={() => navegar(item.endereco)}>
            {item.texto}
          </button>
        ))}
      </div>
      <div className="linha">
        <div className="caixa-campo pesquisa" style={{ width: 300 }}>
          <Search size={18} />
          <input value={pesquisa} placeholder="Nº pedido ou cliente" onChange={(evento) => aoPesquisar(evento.target.value)} />
        </div>
      </div>
    </div>
  );
}
