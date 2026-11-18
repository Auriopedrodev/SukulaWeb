// =====================================================================
//  Ecrã L2 - Gestão de pedidos > Em processamento
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CircleAlert, Shirt, WashingMachine } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { BarraProgresso, EstadoCarregamento, Etiqueta } from '../../componentes/Basicos';
import SeparadoresPedidos from './SeparadoresPedidos';
import { listarPedidosEmProcessamento } from '../../servicos/servicosLavandaria';

export default function PedidosEmProcessamento() {
  const navegar = useNavigate();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');

  useEffect(() => {
    listarPedidosEmProcessamento(pesquisa).then(setDados).catch((falha) => setErro(falha.message));
  }, [pesquisa]);

  const abrir = (pedido) => navegar('/lavandaria/pedidos/em-processamento/' + pedido.id);

  return (
    <>
      <BarraSuperior painel="lavandaria" titulo="Gestão de pedidos" subtitulo="Pedidos recolhidos em execução na lavandaria" />

      <div className="conteudo">
        <SeparadoresPedidos ativo="em-processamento" pesquisa={pesquisa} aoPesquisar={setPesquisa} />

        <EstadoCarregamento aCarregar={!dados} erro={erro} />

        {dados && (
          <>
            <div className="grelha-4">
              <CartaoResumo valor={dados.resumo.emLavagem} texto="Em lavagem" icone={<WashingMachine size={20} />} />
              <CartaoResumo valor={dados.resumo.emEngomagem} texto="Em engomagem" icone={<Shirt size={20} color="var(--roxo)" />} />
              <CartaoResumo valor={dados.resumo.prontosParaEntrega} texto="Prontos para entrega" icone={<Check size={20} color="var(--verde)" />} />
              <CartaoResumo valor={dados.resumo.atrasados} texto="Atrasados" icone={<CircleAlert size={20} color="var(--vermelho)" />} />
            </div>

            <div className="cartao cartao-sem-espaco">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Nº pedido</th>
                    <th>Cliente</th>
                    <th>Serviço</th>
                    <th>Peças</th>
                    <th>Recebido em</th>
                    <th>Etapa</th>
                    <th style={{ width: 120 }}>Progresso</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {dados.itens.map((pedido, posicao) => (
                    <tr key={pedido.id} className={posicao === 0 ? 'destacada' : ''}>
                      <td className="forte">{pedido.numero}</td>
                      <td><strong className="texto-escuro" style={{ display: 'block' }}>{pedido.cliente}</strong><small className="texto-cinza">{pedido.bairro}</small></td>
                      <td className="texto-escuro">{pedido.servico}</td>
                      <td className="texto-escuro">{pedido.pecas}</td>
                      <td className="texto-escuro">{pedido.recebidoEm}</td>
                      <td><Etiqueta texto={pedido.etapa} /></td>
                      <td>
                        <div className="linha" style={{ gap: 8 }}>
                          <BarraProgresso percentagem={pedido.progresso} cor={pedido.progresso === 100 ? 'var(--verde)' : 'var(--azul-medio)'} />
                          <strong style={{ fontSize: 11 }}>{pedido.progresso}%</strong>
                        </div>
                      </td>
                      <td className="acoes">
                        {pedido.etapa === 'Pronto p/ entrega' && (
                          <button type="button" className="botao botao-pequeno botao-primario" style={{ width: 130 }} onClick={() => navegar('/lavandaria/pedidos/em-processamento/' + pedido.id + '?etapa=entrega')}>
                            Encaminhar entrega
                          </button>
                        )}
                        {pedido.etapa === 'Engomagem' && (
                          <button type="button" className="botao botao-pequeno botao-primario" style={{ width: 130 }} onClick={() => abrir(pedido)}>
                            Confirmar serviço
                          </button>
                        )}
                        {pedido.etapa === 'Lavagem' && (
                          <button type="button" className="botao botao-pequeno botao-claro" style={{ width: 130 }} onClick={() => abrir(pedido)}>
                            Ver detalhes
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function CartaoResumo({ valor, texto, icone }) {
  return (
    <div className="cartao linha" style={{ padding: 14 }}>
      <span className="icone-redondo">{icone}</span>
      <div>
        <strong style={{ fontSize: 22 }}>{valor}</strong>
        <p className="texto-escuro" style={{ fontSize: 11 }}>{texto}</p>
      </div>
    </div>
  );
}
