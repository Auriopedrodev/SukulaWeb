// =====================================================================
//  Ecrã K4 - Controle > Produção individual do estafeta
// =====================================================================

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bike, Calendar, Mail, MapPin, Phone, Plus, Star } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Avatar, EstadoCarregamento, Etiqueta, Seletor } from '../../componentes/Basicos';
import IconePorNome from '../../componentes/IconePorNome';
import { obterEstafeta, obterProducaoEstafeta } from '../../servicos/servicosLavandaria';
import { formatarNota } from '../../utilidades';

export default function ProducaoEstafeta() {
  const { id } = useParams();
  const [estafeta, setEstafeta] = useState(null);
  const [producao, setProducao] = useState(null);
  const [periodo, setPeriodo] = useState('semana');
  const [erro, setErro] = useState('');

  useEffect(() => {
    obterEstafeta(id).then(setEstafeta).catch((falha) => setErro(falha.message));
  }, [id]);

  useEffect(() => {
    obterProducaoEstafeta(id, periodo).then(setProducao);
  }, [id, periodo]);

  if (!estafeta || !producao) {
    return (
      <>
        <BarraSuperior painel="lavandaria" titulo="Estafeta" subtitulo="Estafetas › Produção individual" voltarPara="/lavandaria/controle/estafetas" />
        <div className="conteudo"><EstadoCarregamento aCarregar erro={erro} /></div>
      </>
    );
  }

  const maximo = 4; // valor mais alto do eixo do gráfico
  const informacoes = [
    { rotulo: 'Telefone', valor: estafeta.telefone, icone: Phone },
    { rotulo: 'E-mail', valor: estafeta.email, icone: Mail },
    { rotulo: 'Veículo', valor: estafeta.veiculo, icone: Bike },
    { rotulo: 'Zona de atuação', valor: estafeta.zonaAtuacao, icone: MapPin },
    { rotulo: 'Membro desde', valor: estafeta.membroDesde, icone: Calendar },
    { rotulo: 'Avaliação média', valor: formatarNota(estafeta.avaliacao) + ' (' + estafeta.totalAvaliacoes + ' avaliações)', icone: Star },
  ];

  return (
    <>
      <BarraSuperior painel="lavandaria" titulo={estafeta.nome} subtitulo="Estafetas › Produção individual" voltarPara="/lavandaria/controle/estafetas" />

      <div className="conteudo">
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
          {/* ---- Perfil do estafeta ---- */}
          <div className="cartao" style={{ padding: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <Avatar nome={estafeta.nome} fotoUrl={estafeta.fotoUrl} tamanho={96} />
              <h3 style={{ fontSize: 19, margin: '12px 0 8px' }}>{estafeta.nome}</h3>
              <Etiqueta texto={estafeta.estado} />
            </div>
            <hr className="divisor" style={{ margin: '18px 0' }} />
            <div className="coluna" style={{ gap: 14 }}>
              {informacoes.map((item) => (
                <div key={item.rotulo} className="linha">
                  <span className="icone-quadrado azul pequeno" style={{ width: 40, height: 40 }}><item.icone size={18} /></span>
                  <div>
                    <small className="texto-cinza" style={{ fontSize: 11 }}>{item.rotulo}</small>
                    <strong className="texto-escuro" style={{ display: 'block', fontSize: 13 }}>{item.valor}</strong>
                  </div>
                </div>
              ))}
            </div>
            <div className="linha" style={{ marginTop: 20, gap: 10 }}>
              <a href={'tel:' + estafeta.telefone} className="botao botao-secundario" style={{ flex: 1 }}><Phone size={18} /> Ligar</a>
              <button type="button" className="botao botao-primario" style={{ flex: 1.6 }}><Plus size={18} /> Atribuir pedido</button>
            </div>
            <div className="mapa pequeno" style={{ marginTop: 16, height: 130 }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                <line x1="20%" y1="40%" x2="68%" y2="70%" stroke="var(--azul-medio)" strokeWidth="3" />
              </svg>
              <div className="marcador" style={{ left: '72%', top: '28%' }}>
                <div className="pino cheio"><Bike size={14} /></div>
              </div>
              <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, background: 'var(--branco)', borderRadius: 6, padding: '6px 10px', fontSize: 11, fontWeight: 700 }}>
                {producao.localizacaoAtual}
              </div>
            </div>
          </div>

          {/* ---- Produção ---- */}
          <div className="coluna" style={{ gap: 16 }}>
            <div className="linha-entre">
              <div>
                <h2 className="titulo-cartao" style={{ fontSize: 17 }}>Produção do estafeta</h2>
                <p className="texto-cinza texto-pequeno">{producao.periodo}</p>
              </div>
              <Seletor
                valor={periodo}
                aoMudar={setPeriodo}
                opcoes={[
                  { valor: 'dia', texto: 'Dia' },
                  { valor: 'semana', texto: 'Semana' },
                  { valor: 'mes', texto: 'Mês' },
                ]}
              />
            </div>

            <div className="grelha-4">
              {producao.indicadores.map((item) => (
                <div key={item.titulo} className="cartao" style={{ padding: 16 }}>
                  <div className="linha" style={{ gap: 10 }}>
                    <span className="icone-quadrado azul pequeno"><IconePorNome nome={item.icone} tamanho={18} /></span>
                    <span className="texto-escuro" style={{ fontSize: 12 }}>{item.titulo}</span>
                  </div>
                  <strong style={{ fontSize: 22, display: 'block', marginTop: 12 }}>{item.valor}</strong>
                </div>
              ))}
            </div>

            <div className="cartao" style={{ padding: 22 }}>
              <div className="linha-entre" style={{ marginBottom: 20 }}>
                <h3 className="titulo-cartao">Recolhas e entregas por dia</h3>
                <div className="legenda">
                  <span><i style={{ background: 'var(--azul)' }} /> Recolhas</span>
                  <span><i style={{ background: 'var(--azul-medio)' }} /> Entregas</span>
                </div>
              </div>
              <div className="grafico" style={{ height: 120 }}>
                <div className="linhas-guia">
                  {[4, 3, 2, 1, 0].map((marca) => <div key={marca}><span>{marca}</span></div>)}
                </div>
                {producao.grafico.map((dia) => (
                  <div key={dia.rotulo} className="coluna-grafico">
                    <div className="barra-valor" style={{ width: 18, height: (dia.recolhas / maximo) * 100 + '%' }} />
                    <div className="barra-valor destaque" style={{ width: 18, height: (dia.entregas / maximo) * 100 + '%' }} />
                  </div>
                ))}
              </div>
              <div className="rotulos-grafico">
                {producao.grafico.map((dia) => <span key={dia.rotulo}>{dia.rotulo}</span>)}
              </div>
            </div>

            <h3 className="titulo-cartao">Últimos pedidos atribuídos</h3>
            <div className="cartao cartao-sem-espaco" style={{ marginTop: -6 }}>
              <table className="tabela">
                <thead>
                  <tr><th>Nº pedido</th><th>Cliente</th><th>Tipo</th><th>Data / Hora</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {producao.ultimosPedidos.map((pedido) => (
                    <tr key={pedido.numero}>
                      <td className="forte">{pedido.numero}</td>
                      <td className="texto-escuro">{pedido.cliente}</td>
                      <td className="texto-escuro">{pedido.tipo}</td>
                      <td className="texto-escuro">{pedido.dataHora}</td>
                      <td><Etiqueta texto={pedido.estado} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
