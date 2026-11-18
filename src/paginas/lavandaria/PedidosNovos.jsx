// =====================================================================
//  Ecrã L - Gestão de pedidos > Pedidos novos
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento, Etiqueta } from '../../componentes/Basicos';
import SeparadoresPedidos from './SeparadoresPedidos';
import { listarPedidosNovos } from '../../servicos/servicosLavandaria';
import { formatarKz } from '../../utilidades';

export default function PedidosNovos() {
  const navegar = useNavigate();
  const [pedidos, setPedidos] = useState(null);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');

  useEffect(() => {
    listarPedidosNovos(pesquisa).then(setPedidos).catch((falha) => setErro(falha.message));
  }, [pesquisa]);

  const abrir = (pedido) => navegar('/lavandaria/pedidos/novos/' + pedido.id);

  return (
    <>
      <BarraSuperior painel="lavandaria" titulo="Gestão de pedidos" subtitulo="Pedidos novos aguardando encaminhamento e recolha" />

      <div className="conteudo">
        <SeparadoresPedidos ativo="novos" pesquisa={pesquisa} aoPesquisar={setPesquisa} />

        <div className="aviso-amarelo">
          <CircleAlert size={18} color="var(--laranja)" />
          2 pedidos têm recolha agendada nas próximas 2 horas e ainda não foram encaminhados.
          <button type="button" className="botao-ligacao" style={{ marginLeft: 'auto', color: 'var(--laranja)', fontSize: 13 }}>Ver pedidos</button>
        </div>

        <EstadoCarregamento aCarregar={!pedidos} erro={erro} />

        {pedidos && (
          <div className="cartao cartao-sem-espaco">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nº pedido</th>
                  <th>Cliente</th>
                  <th>Serviço</th>
                  <th>Peças</th>
                  <th>Recolha agendada</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido, posicao) => (
                  <tr key={pedido.id} className={posicao === 0 ? 'destacada' : ''}>
                    <td className="forte">{pedido.numero}</td>
                    <td>
                      <div className="celula-pessoa">
                        <div><strong className="texto-escuro">{pedido.cliente}</strong><small>{pedido.bairro}</small></div>
                      </div>
                    </td>
                    <td className="texto-escuro">{pedido.servico}</td>
                    <td className="texto-escuro">{pedido.pecas}</td>
                    <td className="texto-escuro">{pedido.recolhaAgendada}</td>
                    <td className="texto-escuro">{formatarKz(pedido.valor)}</td>
                    <td><Etiqueta texto={pedido.estado} /></td>
                    <td className="acoes">
                      {pedido.estado === 'Novo' ? (
                        <button type="button" className={'botao botao-pequeno ' + (posicao === 0 ? 'botao-primario' : 'botao-claro')} style={{ width: 110 }} onClick={() => abrir(pedido)}>
                          Encaminhar
                        </button>
                      ) : (
                        <button type="button" className="botao botao-pequeno botao-claro" style={{ width: 110 }} onClick={() => abrir(pedido)}>
                          Ver detalhes
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="texto-cinza texto-pequeno" style={{ marginTop: -8 }}>
          A mostrar {pedidos ? pedidos.length : 0} pedidos novos · Atualizado há 1 min
        </p>
      </div>
    </>
  );
}
