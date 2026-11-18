// =====================================================================
//  DETALHES DO PEDIDO  (ecrãs L1 a L1.4, L2.1 a L2.5, L3.1 e L3.2)
//
//  Endereço: /lavandaria/pedidos/{separador}/{id}
//    separador = "novos", "em-processamento" ou "historico"
//
//  A coluna da esquerda (cliente + peças) é sempre igual.
//  A coluna da direita muda conforme a "fase" do pedido:
//    'encaminhar'         -> escolher estafeta para a recolha     (L1)
//    'aguardaRecolha'     -> estafeta a caminho, confirmar recolha (L1.2)
//    'execucao'           -> etapas do serviço na lavandaria       (L2.1)
//    'encaminharEntrega'  -> escolher estafeta para a entrega      (L2.3)
//    'entregue'           -> histórico de um pedido realizado      (L3.1)
//    'naoRealizado'       -> histórico de um pedido não realizado  (L3.2)
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import {
  Banknote, Calendar, Check, CircleAlert, Clock, Download, FileText, House, MapPin, Navigation, Package, Phone, Route, Star, Truck, X,
} from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Avatar, EstadoCarregamento, Etiqueta } from '../../componentes/Basicos';
import { ModalSucesso } from '../../componentes/Modais';
import IconePorNome from '../../componentes/IconePorNome';
import { ListaEscolhaEstafetas, Mapa, ordenarPorDistancia } from './PainelEstafetas';
import { JanelaConfirmarExecucao, JanelaConfirmarRecolha, JanelaEncaminharEntrega, JanelaEncaminharEstafeta } from './JanelasPedido';
import {
  confirmarExecucao, confirmarRecolha, encaminharParaEntrega, enviarFotoPedido, encaminharParaEstafeta, listarEstafetas, obterPedido, recusarPedido,
} from '../../servicos/servicosLavandaria';
import { formatarKz } from '../../utilidades';

// Escolhe a fase inicial a partir do estado que vem da API
function faseInicial(estado, etapa) {
  if (estado === 'Novo') return 'encaminhar';
  if (estado === 'Aguarda recolha') return 'aguardaRecolha';
  if (estado === 'Pronto para entrega' || etapa === 'entrega') return 'encaminharEntrega';
  if (estado === 'Em processamento') return 'execucao';
  if (estado === 'Entregue') return 'entregue';
  return 'naoRealizado';
}

const nomesSeparadores = { novos: 'Pedidos novos', 'em-processamento': 'Em processamento', historico: 'Histórico' };

export default function DetalhesPedido() {
  const { separador, id } = useParams();
  const [parametros] = useSearchParams();
  const navegar = useNavigate();
  const { lavandaria } = useOutletContext(); // vem do LayoutLavandaria

  const [pedido, setPedido] = useState(null);
  const [estafetas, setEstafetas] = useState([]);
  const [erro, setErro] = useState('');
  const [fase, setFase] = useState('');
  const [estafetaEscolhido, setEstafetaEscolhido] = useState(null);
  const [janela, setJanela] = useState(''); // que janela está aberta

  useEffect(() => {
    obterPedido(id)
      .then((dados) => {
        setPedido(dados);
        setFase(faseInicial(dados.estado, parametros.get('etapa')));
      })
      .catch((falha) => setErro(falha.message));
    listarEstafetas('', 'dia').then((lista) => {
      const ordenados = ordenarPorDistancia(lista);
      setEstafetas(ordenados);
      setEstafetaEscolhido(ordenados[0]);
    });
  }, [id]);

  const subtitulo = 'Gestão de pedidos › ' + nomesSeparadores[separador] + ' › ' + (pedido ? pedido.numero : '');
  const voltarPara = '/lavandaria/pedidos/' + separador;

  if (!pedido) {
    return (
      <>
        <BarraSuperior painel="lavandaria" titulo="Detalhes do pedido" subtitulo={subtitulo} voltarPara={voltarPara} />
        <div className="conteudo"><EstadoCarregamento aCarregar erro={erro} /></div>
      </>
    );
  }

  // Texto da etiqueta conforme a fase
  const estadoVisivel = {
    encaminhar: 'Novo',
    aguardaRecolha: 'Aguarda recolha',
    execucao: 'Em processamento',
    encaminharEntrega: 'Pronto para entrega',
    entregue: 'Entregue',
    naoRealizado: pedido.estado === 'Cancelado' ? 'Cancelado' : 'Não realizado',
  }[fase];

  // ---- Ações dos botões ----
  async function confirmarEncaminhamento() {
    await encaminharParaEstafeta(pedido.id, estafetaEscolhido.id);
    setPedido({ ...pedido, estafeta: { ...pedido.estafeta, nome: estafetaEscolhido.nome, iniciais: '', veiculo: estafetaEscolhido.veiculo } });
    setJanela('');
    setFase('aguardaRecolha');
  }

  async function concluirRecolha(observacoes) {
    await confirmarRecolha(pedido.id, observacoes);
    setJanela('recolhaConfirmada');
  }

  async function concluirExecucao(fotos) {
    for (const foto of fotos) await enviarFotoPedido(pedido.id, foto); // envia as fotos do pedido pronto
    await confirmarExecucao(pedido.id);
    setJanela('');
    setFase('encaminharEntrega');
  }

  async function confirmarEntrega() {
    await encaminharParaEntrega(pedido.id, estafetaEscolhido.id);
    setJanela('entregaEncaminhada');
  }

  async function recusar() {
    if (window.confirm('Tem a certeza que quer recusar o pedido ' + pedido.numero + '?')) {
      await recusarPedido(pedido.id);
      navegar('/lavandaria/pedidos/novos');
    }
  }

  return (
    <>
      <BarraSuperior painel="lavandaria" titulo="Detalhes do pedido" subtitulo={subtitulo} voltarPara={voltarPara} />

      <div className="conteudo">
        {/* ---------- Cabeçalho do pedido ---------- */}
        <div className="cartao linha-entre" style={{ padding: '16px 20px' }}>
          <div className="linha">
            <span className="icone-quadrado azul"><Package size={22} /></span>
            <div>
              <div className="linha" style={{ gap: 10 }}>
                <h2 style={{ fontSize: 19 }}>Pedido {pedido.numero}</h2>
                <Etiqueta texto={estadoVisivel} />
              </div>
              <p className="texto-cinza" style={{ fontSize: 12, marginTop: 4 }}>{pedido.criadoEm} · {pedido.resumoServico}</p>
            </div>
          </div>
          <div className="linha" style={{ gap: 10 }}>
            {fase === 'encaminhar' && (
              <button type="button" className="botao botao-secundario" style={{ color: 'var(--vermelho)', borderColor: '#f3b7b9' }} onClick={recusar}>
                <X size={18} /> Recusar
              </button>
            )}
            <button type="button" className="botao botao-secundario" onClick={() => window.print()}>
              <FileText size={18} /> Imprimir
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 430px', gap: 20, alignItems: 'stretch' }}>
          {/* ---------- Coluna da esquerda ---------- */}
          <div className="coluna" style={{ gap: 20 }}>
            <CartaoCliente pedido={pedido} />
            <CartaoPecas pedido={pedido} />
          </div>

          {/* ---------- Coluna da direita (muda com a fase) ---------- */}
          <div className="cartao coluna" style={{ padding: 24, gap: 0 }}>
            {fase === 'encaminhar' && (
              <>
                <h3 className="titulo-cartao">Encaminhar para estafeta</h3>
                <p className="texto-cinza" style={{ fontSize: 11, margin: '3px 0 14px' }}>Estafetas mais próximos do cliente</p>
                <Mapa estafetas={estafetas} />
                <ListaEscolhaEstafetas estafetas={estafetas} escolhido={estafetaEscolhido} aoEscolher={setEstafetaEscolhido} />
                <div className="espaco-flexivel" style={{ minHeight: 20 }} />
                <button type="button" className="botao botao-primario botao-largo" onClick={() => setJanela('encaminhar')}>
                  <Navigation size={18} /> Encaminhar para {estafetaEscolhido === estafetas[0] ? 'o mais próximo' : estafetaEscolhido ? estafetaEscolhido.nome : ''}
                </button>
              </>
            )}

            {fase === 'aguardaRecolha' && (
              <>
                <h3 className="titulo-cartao" style={{ marginBottom: 18 }}>Estado do pedido</h3>
                <LinhaTempo
                  passos={[
                    { titulo: 'Pedido recebido', detalhe: 'Hoje, 13:42', estado: 'concluido' },
                    { titulo: 'Encaminhado para estafeta', detalhe: pedido.estafeta.nome + ' · Hoje, 13:50', estado: 'concluido' },
                    { titulo: 'Recolha em casa do cliente', detalhe: 'Estafeta a caminho · ETA 6 min', estado: 'atual' },
                    { titulo: 'Confirmação da recolha', detalhe: 'Conferir peças recebidas', estado: 'pendente' },
                    { titulo: 'Em processamento', detalhe: 'Lavagem e engomagem', estado: 'pendente' },
                    { titulo: 'Encaminhado para entrega', detalhe: pedido.entregaPrevista, estado: 'pendente' },
                  ]}
                />
                <hr className="divisor" style={{ margin: '18px 0' }} />
                <CartaoEstafetaResponsavel estafeta={pedido.estafeta} />
                <div style={{ marginTop: 12 }}>
                  <Mapa pequeno legendaEstafeta="6 min" />
                </div>
                <div className="espaco-flexivel" style={{ minHeight: 20 }} />
                <div className="linha" style={{ gap: 10 }}>
                  <button type="button" className="botao botao-secundario" style={{ flex: 1 }} onClick={() => setFase('encaminhar')}>Reencaminhar</button>
                  <button type="button" className="botao botao-verde" style={{ flex: 1.7 }} onClick={() => setJanela('confirmarRecolha')}>
                    <Check size={18} /> Confirmar recolha
                  </button>
                </div>
              </>
            )}

            {fase === 'execucao' && (
              <>
                <h3 className="titulo-cartao">Execução do serviço</h3>
                <p className="texto-cinza" style={{ fontSize: 11, margin: '3px 0 18px' }}>Atualize as etapas à medida que o serviço avança</p>
                <LinhaTempo
                  espacoGrande
                  passos={[
                    { titulo: 'Triagem e etiquetagem', detalhe: 'Concluído · 15:25', estado: 'concluido' },
                    { titulo: 'Lavagem', detalhe: 'Concluído · 16:40', estado: 'concluido' },
                    { titulo: 'Secagem', detalhe: 'Concluído · 18:10', estado: 'concluido' },
                    { titulo: 'Engomagem', detalhe: 'Em curso · 5 de 7 peças', estado: 'atual' },
                    { titulo: 'Controlo de qualidade', detalhe: '', estado: 'pendente' },
                    { titulo: 'Embalagem', detalhe: '', estado: 'pendente' },
                  ]}
                />
                <hr className="divisor" style={{ margin: '18px 0' }} />
                <p className="texto-pequeno forte" style={{ fontWeight: 700, marginBottom: 10 }}>Responsável na lavandaria</p>
                <div className="cartao-estafeta">
                  <span className="avatar" style={{ width: 34, height: 34, fontSize: 12, background: 'var(--roxo-claro)', color: 'var(--roxo)' }}>{pedido.responsavel.iniciais}</span>
                  <div><strong>{pedido.responsavel.nome}</strong><small>{pedido.responsavel.funcao}</small></div>
                </div>
                <div className="aviso-azul" style={{ marginTop: 12, fontWeight: 700, fontSize: 13, alignItems: 'center' }}>
                  <Clock size={18} /> Prazo de conclusão: {pedido.prazoConclusao}
                </div>
                <div className="espaco-flexivel" style={{ minHeight: 20 }} />
                <button type="button" className="botao botao-verde botao-largo" onClick={() => setJanela('confirmarExecucao')}>
                  <Check size={18} /> Confirmar execução do serviço
                </button>
              </>
            )}

            {fase === 'encaminharEntrega' && (
              <>
                <h3 className="titulo-cartao">Encaminhar para entrega</h3>
                <p className="texto-cinza" style={{ fontSize: 11, margin: '3px 0 14px' }}>Serviço concluído · Escolha o estafeta para entregar</p>
                <Mapa estafetas={estafetas} />
                <ListaEscolhaEstafetas estafetas={estafetas} escolhido={estafetaEscolhido} aoEscolher={setEstafetaEscolhido} />
                <div className="espaco-flexivel" style={{ minHeight: 20 }} />
                <button type="button" className="botao botao-primario botao-largo" onClick={() => setJanela('encaminharEntrega')}>
                  <Navigation size={18} /> Encaminhar para entrega
                </button>
              </>
            )}

            {fase === 'entregue' && (
              <>
                <h3 className="titulo-cartao" style={{ marginBottom: 18 }}>Histórico do pedido</h3>
                <LinhaTempo
                  passos={[
                    { titulo: 'Pedido recebido', detalhe: '02 Nov · 13:42', estado: 'concluido' },
                    { titulo: 'Encaminhado para estafeta', detalhe: 'Joana Sebastião · 13:50', estado: 'concluido' },
                    { titulo: 'Recolha confirmada', detalhe: '7 de 7 peças · 15:20', estado: 'concluido' },
                    { titulo: 'Serviço executado', detalhe: 'Teresa Manuel · 04 Nov 09:00', estado: 'concluido' },
                    { titulo: 'Encaminhado para entrega', detalhe: 'Joana Sebastião · 09:12', estado: 'concluido' },
                    { titulo: 'Entregue ao cliente', detalhe: '04 Nov · 10:34 · Assinado por Ana P.', estado: 'concluido' },
                  ]}
                />
                <hr className="divisor" style={{ margin: '18px 0' }} />
                <p className="texto-pequeno" style={{ fontWeight: 700, marginBottom: 10 }}>Avaliação do cliente</p>
                <div className="cartao-estafeta" style={{ display: 'block' }}>
                  <div className="linha" style={{ gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={18} fill="var(--amarelo)" color="var(--amarelo)" />)}
                    <strong style={{ marginLeft: 6, color: 'var(--azul)' }}>{pedido.avaliacao.nota}</strong>
                  </div>
                  <p className="texto-escuro" style={{ fontSize: 12, margin: '10px 0 4px', lineHeight: 1.5 }}>{pedido.avaliacao.comentario}</p>
                  <small>{pedido.avaliacao.autor}</small>
                </div>
                <div className="grelha-2" style={{ marginTop: 12, gap: 10 }}>
                  <div className="cartao-azul-claro"><small>Tempo total</small><strong>{pedido.tempoTotal}</strong></div>
                  <div className="cartao-azul-claro"><small>Valor recebido</small><strong>{formatarKz(pedido.total)}</strong></div>
                </div>
                <div className="espaco-flexivel" style={{ minHeight: 20 }} />
                <button type="button" className="botao botao-secundario botao-largo"><Download size={18} /> Descarregar recibo</button>
              </>
            )}

            {fase === 'naoRealizado' && pedido.naoRealizado && (
              <>
                <h3 className="titulo-cartao" style={{ marginBottom: 18 }}>Histórico do pedido</h3>
                <LinhaTempo
                  passos={[
                    { titulo: 'Pedido recebido', detalhe: '31 Out · 20:15', estado: 'concluido' },
                    { titulo: 'Encaminhado para estafeta', detalhe: 'Mateus Kiala · 01 Nov 10:20', estado: 'concluido' },
                    { titulo: 'Recolha não realizada', detalhe: 'Cliente ausente · 2 tentativas · 11:45', estado: 'falhou' },
                  ]}
                />
                <div style={{ background: 'var(--vermelho-claro)', border: '1px solid #f3b7b9', borderRadius: 12, padding: 16, marginTop: 18 }}>
                  <p className="linha" style={{ gap: 8, color: 'var(--vermelho)', fontWeight: 700, fontSize: 13 }}><CircleAlert size={18} /> Motivo da não realização</p>
                  <p className="texto-escuro" style={{ fontSize: 12, lineHeight: 1.6, marginTop: 10 }}>{pedido.naoRealizado.motivo}</p>
                </div>
                <div className="cartao-azul-claro linha-entre" style={{ marginTop: 12 }}>
                  <div><small>Reembolso processado</small><strong style={{ fontSize: 14 }}>{pedido.naoRealizado.reembolso}</strong></div>
                  <Etiqueta texto="Concluído" cor="verde" />
                </div>
                <div className="cartao-estafeta" style={{ display: 'block', marginTop: 12 }}>
                  <small>Nota interna</small>
                  <p className="texto-escuro" style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>{pedido.naoRealizado.notaInterna}</p>
                </div>
                <div className="espaco-flexivel" style={{ minHeight: 20 }} />
                <div className="linha" style={{ gap: 10 }}>
                  <a href={'tel:' + pedido.cliente.telefone} className="botao botao-secundario" style={{ flex: 1 }}><Phone size={18} /> Contactar cliente</a>
                  <button type="button" className="botao botao-primario" style={{ flex: 1 }}><Calendar size={18} /> Reagendar recolha</button>
                </div>
              </>
            )}

            {fase === 'naoRealizado' && !pedido.naoRealizado && (
              <p className="texto-cinza">Este pedido foi {estadoVisivel.toLowerCase()}.</p>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Janelas ---------- */}
      {janela === 'encaminhar' && (
        <JanelaEncaminharEstafeta pedido={pedido} estafeta={estafetaEscolhido} aoFechar={() => setJanela('')} aoConfirmar={confirmarEncaminhamento} />
      )}
      {janela === 'confirmarRecolha' && <JanelaConfirmarRecolha pedido={pedido} aoFechar={() => setJanela('')} aoConfirmar={concluirRecolha} />}
      {janela === 'recolhaConfirmada' && (
        <ModalSucesso
          icone={<Check size={24} />}
          titulo="Recolha confirmada!"
          texto={'O pedido ' + pedido.numero + ' foi movido para "Em processamento". Já pode iniciar o serviço.'}
          textoPrincipal="Ver em processamento"
          aoPrincipal={() => navegar('/lavandaria/pedidos/em-processamento')}
          textoSecundario="Voltar aos pedidos novos"
          aoSecundario={() => navegar('/lavandaria/pedidos/novos')}
        />
      )}
      {janela === 'confirmarExecucao' && <JanelaConfirmarExecucao pedido={pedido} aoFechar={() => setJanela('')} aoConfirmar={concluirExecucao} />}
      {janela === 'encaminharEntrega' && (
        <JanelaEncaminharEntrega pedido={pedido} estafeta={estafetaEscolhido} nomeLavandaria={lavandaria.nome} aoFechar={() => setJanela('')} aoConfirmar={confirmarEntrega} />
      )}
      {janela === 'entregaEncaminhada' && (
        <ModalSucesso
          icone={<Check size={24} />}
          titulo="Pedido encaminhado!"
          texto={estafetaEscolhido.nome + ' foi notificada para levantar o pedido ' + pedido.numero + ' e entregá-lo ao cliente.'}
          textoPrincipal={<><Route size={18} /> Acompanhar entrega</>}
          aoPrincipal={() => navegar('/lavandaria/controle/estafetas/' + estafetaEscolhido.id)}
          textoSecundario="Voltar a Em processamento"
          aoSecundario={() => navegar('/lavandaria/pedidos/em-processamento')}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------
//  Partes da coluna da esquerda
// ---------------------------------------------------------------------

function CartaoCliente({ pedido }) {
  const detalhes = [
    { rotulo: 'Tipo de residência', valor: pedido.tipoResidencia, icone: House },
    { rotulo: 'Recolha agendada', valor: pedido.recolhaAgendada, icone: Calendar },
    { rotulo: 'Entrega prevista', valor: pedido.entregaPrevista, icone: Truck },
    { rotulo: 'Pagamento', valor: pedido.pagamento, icone: Banknote },
  ];
  return (
    <div className="cartao" style={{ padding: 22 }}>
      <h3 className="titulo-cartao">Cliente</h3>
      <div className="linha-entre" style={{ marginTop: 12 }}>
        <div className="celula-pessoa">
          <Avatar nome={pedido.cliente.nome} tamanho={44} />
          <div>
            <strong className="texto-escuro" style={{ fontSize: 14 }}>{pedido.cliente.nome}</strong>
            <small>{pedido.cliente.telefone} · Cliente desde {pedido.cliente.clienteDesde}</small>
          </div>
        </div>
        <a href={'tel:' + pedido.cliente.telefone} className="icone-redondo" title="Ligar"><Phone size={18} /></a>
      </div>
      <hr className="divisor" style={{ margin: '16px 0' }} />
      <div className="linha" style={{ alignItems: 'flex-start' }}>
        <span className="icone-quadrado azul pequeno"><MapPin size={18} /></span>
        <div><small className="texto-cinza" style={{ fontSize: 11 }}>Endereço de recolha e entrega</small><strong className="texto-escuro" style={{ display: 'block', fontSize: 13 }}>{pedido.endereco}</strong></div>
      </div>
      <div className="grelha-2" style={{ marginTop: 16, rowGap: 16 }}>
        {detalhes.map((item) => (
          <div key={item.rotulo} className="linha" style={{ alignItems: 'flex-start' }}>
            <span className="icone-quadrado azul pequeno"><item.icone size={18} /></span>
            <div><small className="texto-cinza" style={{ fontSize: 11 }}>{item.rotulo}</small><strong className="texto-escuro" style={{ display: 'block', fontSize: 13 }}>{item.valor}</strong></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartaoPecas({ pedido }) {
  return (
    <div className="cartao" style={{ padding: 22, flex: 1 }}>
      <h3 className="titulo-cartao">Peças ({pedido.pecas.reduce((soma, p) => soma + p.quantidade, 0)})</h3>
      <div style={{ marginTop: 10 }}>
        {pedido.pecas.map((peca) => (
          <div key={peca.nome} className="linha" style={{ padding: '10px 0', borderBottom: '1px solid var(--borda)' }}>
            <span className="icone-quadrado azul pequeno"><IconePorNome nome={peca.icone} tamanho={18} /></span>
            <div style={{ flex: 1 }}>
              <strong className="texto-escuro" style={{ fontSize: 13 }}>{peca.nome}</strong>
              <p className="texto-cinza" style={{ fontSize: 11 }}>{peca.servico}</p>
            </div>
            <span className="texto-cinza" style={{ width: 120, fontSize: 12 }}>x{peca.quantidade}</span>
            <strong style={{ width: 90, textAlign: 'right' }}>{formatarKz(peca.valor)}</strong>
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--fundo)', borderRadius: 10, padding: '12px 14px', marginTop: 14, fontSize: 12 }}>
        <div className="linha-entre texto-cinza"><span>Subtotal</span><strong className="texto-escuro">{formatarKz(pedido.subtotal)}</strong></div>
        <div className="linha-entre texto-cinza" style={{ marginTop: 6 }}><span>Taxa de recolha e entrega</span><strong className="texto-escuro">{formatarKz(pedido.taxaRecolha)}</strong></div>
        <div className="linha-entre texto-cinza" style={{ marginTop: 6 }}><span>Desconto (cupão {pedido.cupao})</span><strong className="texto-verde">- {formatarKz(pedido.desconto)}</strong></div>
        <hr className="divisor" style={{ margin: '10px 0' }} />
        <div className="linha-entre"><strong style={{ fontSize: 14 }}>Total</strong><strong style={{ fontSize: 18 }}>{formatarKz(pedido.total)}</strong></div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
//  Partes da coluna da direita
// ---------------------------------------------------------------------

// Linha do tempo. estado de cada passo: 'concluido', 'atual', 'pendente' ou 'falhou'
function LinhaTempo({ passos, espacoGrande = false }) {
  return (
    <div className="linha-tempo">
      {passos.map((passo) => (
        <div key={passo.titulo} className={'passo ' + passo.estado} style={espacoGrande ? { paddingBottom: 22 } : undefined}>
          <span className="marca">
            {passo.estado === 'concluido' && <Check size={14} />}
            {passo.estado === 'falhou' && <X size={14} />}
          </span>
          <div>
            <strong>{passo.titulo}</strong>
            {passo.detalhe && <small>{passo.detalhe}</small>}
          </div>
        </div>
      ))}
    </div>
  );
}

function CartaoEstafetaResponsavel({ estafeta }) {
  return (
    <>
      <p className="texto-pequeno" style={{ fontWeight: 700, marginBottom: 10 }}>Estafeta responsável</p>
      <div className="cartao-estafeta">
        <Avatar nome={estafeta.nome} tamanho={34} />
        <div style={{ flex: 1 }}>
          <strong>{estafeta.nome}</strong>
          <small>{estafeta.veiculo}</small>
        </div>
        <span className="icone-redondo"><Phone size={18} /></span>
      </div>
    </>
  );
}
