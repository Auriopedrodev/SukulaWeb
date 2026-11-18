// =====================================================================
//  Ecrã L3 - Gestão de pedidos > Histórico
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, Eye } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento, Etiqueta, Paginacao } from '../../componentes/Basicos';
import SeparadoresPedidos from './SeparadoresPedidos';
import { listarHistoricoPedidos } from '../../servicos/servicosLavandaria';
import { formatarKz } from '../../utilidades';

export default function HistoricoPedidos() {
  const navegar = useNavigate();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [resultado, setResultado] = useState(''); // '', 'Realizados', 'Não realizados'
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    listarHistoricoPedidos(pesquisa, resultado, pagina).then(setDados).catch((falha) => setErro(falha.message));
  }, [pesquisa, resultado, pagina]);

  function filtrar(valor) {
    setResultado(valor);
    setPagina(1);
  }

  return (
    <>
      <BarraSuperior painel="lavandaria" titulo="Gestão de pedidos" subtitulo="Todos os pedidos realizados e não realizados" />

      <div className="conteudo">
        <SeparadoresPedidos ativo="historico" pesquisa={pesquisa} aoPesquisar={setPesquisa} />

        <EstadoCarregamento aCarregar={!dados} erro={erro} />

        {dados && (
          <>
            <div className="linha-entre">
              <div className="linha" style={{ gap: 8 }}>
                <button type="button" className={'pilula' + (resultado === '' ? ' ativo' : '')} onClick={() => filtrar('')}>
                  Todos <span>{dados.resumo.todos}</span>
                </button>
                <button type="button" className={'pilula' + (resultado === 'Realizados' ? ' ativo' : '')} onClick={() => filtrar('Realizados')}>
                  Realizados <span>{dados.resumo.realizados}</span>
                </button>
                <button type="button" className={'pilula' + (resultado === 'Não realizados' ? ' ativo' : '')} onClick={() => filtrar('Não realizados')}>
                  Não realizados <span>{dados.resumo.naoRealizados}</span>
                </button>
              </div>
              <button type="button" className="botao botao-secundario" style={{ fontWeight: 500, fontSize: 13 }}>
                <Calendar size={18} /> {dados.resumo.periodo} <ChevronDown size={16} />
              </button>
            </div>

            <div className="cartao cartao-sem-espaco">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Nº pedido</th>
                    <th>Cliente</th>
                    <th>Serviço</th>
                    <th>Data</th>
                    <th>Estafeta</th>
                    <th>Valor</th>
                    <th>Resultado</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {dados.itens.map((pedido) => (
                    <tr key={pedido.id} className={pedido.resultado === 'Não realizado' && pedido.id === 10461 ? 'destacada' : ''}>
                      <td className="forte">{pedido.numero}</td>
                      <td><strong className="texto-escuro" style={{ display: 'block' }}>{pedido.cliente}</strong><small className="texto-cinza">{pedido.bairro}</small></td>
                      <td className="texto-escuro">{pedido.servico}</td>
                      <td className="texto-escuro">{pedido.data}</td>
                      <td className="texto-escuro">{pedido.estafeta}</td>
                      <td className="texto-escuro">{formatarKz(pedido.valor)}</td>
                      <td><Etiqueta texto={pedido.resultado} /></td>
                      <td className="acoes">
                        <button type="button" className="botao botao-pequeno botao-claro" onClick={() => navegar('/lavandaria/pedidos/historico/' + pedido.id)}>
                          <Eye size={16} /> Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="linha-entre" style={{ marginTop: -6 }}>
              <span className="texto-cinza texto-pequeno">A mostrar {dados.itens.length} de {dados.resumo.todos} pedidos</span>
              <Paginacao pagina={pagina} totalPaginas={Math.ceil(dados.total / dados.tamanhoPagina)} aoMudar={setPagina} comFim />
            </div>
          </>
        )}
      </div>
    </>
  );
}
