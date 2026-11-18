// =====================================================================
//  Ecrãs K, K1, K2 - Controle > Dashboard (Dia / Semana / Mês)
// =====================================================================

import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Download } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Avatar, BarraProgresso, EstadoCarregamento, Etiqueta, Nota, Seletor, corDaProducao } from '../../componentes/Basicos';
import IconePorNome from '../../componentes/IconePorNome';
import { listarEstafetas, obterDashboard } from '../../servicos/servicosLavandaria';

export default function Dashboard() {
  const { lavandaria } = useOutletContext(); // vem do LayoutLavandaria
  const [periodo, setPeriodo] = useState('dia'); // 'dia', 'semana' ou 'mes'
  const [dados, setDados] = useState(null);
  const [estafetas, setEstafetas] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    obterDashboard(periodo).then(setDados).catch((falha) => setErro(falha.message));
    listarEstafetas('', periodo).then((lista) => setEstafetas(lista.slice(0, 4)));
  }, [periodo]);

  return (
    <>
      <BarraSuperior painel="lavandaria" titulo="Controle" subtitulo={'Bem-vindo de volta, ' + lavandaria.nome} />

      <div className="conteudo">
        <EstadoCarregamento aCarregar={!dados} erro={erro} />

        {dados && (
          <>
            <div className="linha-entre">
              <div>
                <h2 className="titulo-cartao" style={{ fontSize: 18 }}>Produção da lavandaria</h2>
                <p className="texto-cinza texto-pequeno" style={{ marginTop: 4 }}>{dados.subtitulo}</p>
              </div>
              <div className="linha">
                <Seletor
                  valor={periodo}
                  aoMudar={setPeriodo}
                  opcoes={[
                    { valor: 'dia', texto: 'Dia' },
                    { valor: 'semana', texto: 'Semana' },
                    { valor: 'mes', texto: 'Mês' },
                  ]}
                />
                <button type="button" className="botao botao-secundario"><Download size={18} /> Exportar</button>
              </div>
            </div>

            {/* Cartões de indicadores */}
            <div className="grelha-4">
              {dados.indicadores.map((item) => (
                <div key={item.titulo} className="cartao" style={{ padding: 20 }}>
                  <div className="linha">
                    <span className="icone-quadrado azul pequeno"><IconePorNome nome={item.icone} /></span>
                    <span className="texto-escuro" style={{ fontSize: 13 }}>{item.titulo}</span>
                  </div>
                  <div className="linha-entre" style={{ marginTop: 16 }}>
                    <strong style={{ fontSize: 26 }}>{item.valor}</strong>
                    <span className="texto-verde" style={{ fontSize: 11, fontWeight: 700 }}>{item.variacao}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
              {/* Gráfico de barras */}
              <div className="cartao" style={{ padding: 24 }}>
                <div className="linha-entre" style={{ marginBottom: 36 }}>
                  <div>
                    <h3 className="titulo-cartao">Produção por período</h3>
                    <p className="texto-cinza" style={{ fontSize: 11, marginTop: 3 }}>{dados.grafico.descricao}</p>
                  </div>
                  <div className="legenda">
                    <span><i style={{ background: 'var(--azul)' }} /> Concluídos</span>
                    <span><i style={{ background: '#eef2f6' }} /> Meta</span>
                  </div>
                </div>
                <GraficoProducao grafico={dados.grafico} />
              </div>

              {/* Produção total desde a adesão */}
              <div className="cartao" style={{ padding: 24 }}>
                <h3 className="titulo-cartao">Produção total</h3>
                <p className="texto-cinza" style={{ fontSize: 11, marginTop: 3 }}>{dados.producaoTotal.desde}</p>
                <div className="linha" style={{ margin: '18px 0', gap: 0 }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 22 }}>{dados.producaoTotal.pedidos}</strong>
                    <p className="texto-cinza texto-pequeno">pedidos</p>
                  </div>
                  <div style={{ flex: 1, borderLeft: '1px solid var(--borda)', paddingLeft: 18 }}>
                    <strong style={{ fontSize: 22 }}>{dados.producaoTotal.pecas}</strong>
                    <p className="texto-cinza texto-pequeno">peças lavadas</p>
                  </div>
                </div>
                <div className="coluna" style={{ gap: 12 }}>
                  {dados.producaoTotal.categorias.map((categoria, posicao) => (
                    <div key={categoria.nome}>
                      <div className="linha-entre texto-escuro" style={{ fontSize: 11, marginBottom: 5 }}>
                        <span>{categoria.nome}</span>
                        <strong style={{ color: 'var(--azul)' }}>{categoria.percentagem}%</strong>
                      </div>
                      <BarraProgresso percentagem={categoria.percentagem} cor={['var(--azul)', 'var(--azul-medio)', '#5aa9f0', '#a9cff3'][posicao]} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabela de estafetas */}
            <div className="linha-entre">
              <div className="linha" style={{ alignItems: 'baseline' }}>
                <h2 className="titulo-cartao" style={{ fontSize: 18 }}>Estafetas</h2>
                <span className="texto-cinza texto-pequeno">{dados.subtituloEstafetas || 'Produção de cada estafeta'}</span>
              </div>
              <Link to="/lavandaria/controle/estafetas" className="texto-pequeno">Ver todos →</Link>
            </div>
            <TabelaEstafetas estafetas={estafetas} />
          </>
        )}
      </div>
    </>
  );
}

// Gráfico de barras (barra cinzenta = meta, barra azul = concluídos)
function GraficoProducao({ grafico }) {
  const marcas = [4, 3, 2, 1, 0].map((parte) => Math.round((grafico.maximo / 4) * parte));
  return (
    <>
      <div className="grafico">
        <div className="linhas-guia">
          {marcas.map((marca) => (
            <div key={marca}><span>{marca}</span></div>
          ))}
        </div>
        {grafico.barras.map((barra) => (
          <div key={barra.rotulo} className="coluna-grafico">
            <div className="barra-meta" style={{ height: (barra.meta / grafico.maximo) * 100 + '%' }} />
            <div className={'barra-valor' + (barra.destaque ? ' destaque' : '')} style={{ height: (barra.valor / grafico.maximo) * 100 + '%' }}>
              {barra.destaque && <span className="balao">{barra.valor} ped.</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="rotulos-grafico">
        {grafico.barras.map((barra) => <span key={barra.rotulo}>{barra.rotulo}</span>)}
      </div>
    </>
  );
}

// Tabela resumida de estafetas (também usada noutras páginas)
export function TabelaEstafetas({ estafetas }) {
  return (
    <div className="cartao cartao-sem-espaco">
      <table className="tabela">
        <thead>
          <tr>
            <th>Estafeta</th>
            <th>Estado</th>
            <th>Recolhas</th>
            <th>Entregas</th>
            <th>Pedidos</th>
            <th>Avaliação</th>
            <th style={{ width: 230 }}>Produção</th>
          </tr>
        </thead>
        <tbody>
          {estafetas.map((estafeta) => (
            <tr key={estafeta.id}>
              <td>
                <Link to={'/lavandaria/controle/estafetas/' + estafeta.id} className="celula-pessoa">
                  <Avatar nome={estafeta.nome} fotoUrl={estafeta.fotoUrl} tamanho={36} />
                  <div>
                    <strong className="texto-escuro">{estafeta.nome}</strong>
                    <small>{estafeta.telefone}</small>
                  </div>
                </Link>
              </td>
              <td><Etiqueta texto={estafeta.estado} /></td>
              <td className="texto-escuro">{estafeta.recolhas}</td>
              <td className="texto-escuro">{estafeta.entregas}</td>
              <td className="texto-escuro">{estafeta.pedidos}</td>
              <td className="texto-escuro"><Nota valor={estafeta.avaliacao} /></td>
              <td>
                <div className="linha" style={{ gap: 10 }}>
                  <BarraProgresso percentagem={estafeta.producao} cor={corDaProducao(estafeta.producao)} />
                  <strong style={{ fontSize: 12, width: 30 }}>{estafeta.producao}%</strong>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
