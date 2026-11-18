// =====================================================================
//  Janelas (modais) da página "Detalhes do pedido"
//  L1.1 Encaminhar pedido · L1.3 Confirmar a recolha
//  L2.2 Confirmar execução do serviço · L2.4 Encaminhar para entrega
// =====================================================================

import { useState } from 'react';
import { Check, Loader, Navigation, Package, Plus, Truck, X } from 'lucide-react';
import { Avatar } from '../../componentes/Basicos';
import { CampoAreaTexto, validarImagem } from '../../componentes/Formulario';

// Moldura comum: ícone redondo em cima, título, texto e botão fechar
function JanelaPedido({ icone, corIcone = 'azul', titulo, texto, aoFechar, largura = 480, children }) {
  return (
    <div className="fundo-modal escuro" onClick={aoFechar}>
      <div className="modal" style={{ maxWidth: largura }} onClick={(evento) => evento.stopPropagation()}>
        <button type="button" className="botao-fechar redondo" style={{ position: 'absolute', top: 20, right: 20, width: 28, height: 28 }} onClick={aoFechar}>
          <X size={14} />
        </button>
        <div className={'circulo-icone ' + corIcone} style={{ width: 52, height: 52, margin: 0 }}>{icone}</div>
        <h2 style={{ fontSize: 20, margin: '16px 0 8px' }}>{titulo}</h2>
        <p className="texto-cinza" style={{ fontSize: 12, lineHeight: 1.6 }}>{texto}</p>
        {children}
      </div>
    </div>
  );
}

// Cartão do estafeta escolhido (com distância)
function CartaoEstafetaEscolhido({ estafeta }) {
  return (
    <div className="cartao-estafeta selecionado" style={{ borderWidth: 3, margin: '18px 0' }}>
      <Avatar nome={estafeta.nome} tamanho={34} />
      <div style={{ flex: 1 }}>
        <strong>{estafeta.nome}</strong>
        <small>{estafeta.veiculo}</small>
      </div>
      <div style={{ textAlign: 'right' }}>
        <strong style={{ color: 'var(--azul-medio)', fontSize: 15 }}>{estafeta.distancia}</strong>
        <small>{estafeta.tempo}</small>
      </div>
    </div>
  );
}

function LinhaDetalhe({ rotulo, valor }) {
  return (
    <div className="linha-entre" style={{ fontSize: 12, marginTop: 8 }}>
      <span className="texto-cinza">{rotulo}</span>
      <strong className="texto-escuro">{valor}</strong>
    </div>
  );
}

// ---- L1.1 ----
export function JanelaEncaminharEstafeta({ pedido, estafeta, aoFechar, aoConfirmar }) {
  return (
    <JanelaPedido icone={<Navigation size={22} />} titulo={'Encaminhar pedido ' + pedido.numero + '?'} texto="O estafeta será notificado para fazer a recolha em casa do cliente." aoFechar={aoFechar}>
      <CartaoEstafetaEscolhido estafeta={estafeta} />
      <LinhaDetalhe rotulo="Recolha" valor={pedido.recolhaCurta} />
      <LinhaDetalhe rotulo="Endereço" valor={pedido.enderecoCurto} />
      <div className="grelha-2" style={{ marginTop: 28, gap: 12 }}>
        <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
        <button type="button" className="botao botao-primario" onClick={aoConfirmar}>Confirmar encaminhamento</button>
      </div>
    </JanelaPedido>
  );
}

// ---- L1.3 ----
export function JanelaConfirmarRecolha({ pedido, aoFechar, aoConfirmar }) {
  // Lista de peças conferidas (começam todas marcadas)
  const [conferidas, setConferidas] = useState(pedido.pecas.map(() => true));
  const [observacoes, setObservacoes] = useState('Camisa branca com pequena mancha na gola. Cliente informado.');

  const totalPecas = pedido.pecas.reduce((soma, peca) => soma + peca.quantidade, 0);
  const pecasConferidas = pedido.pecas.reduce((soma, peca, i) => soma + (conferidas[i] ? peca.quantidade : 0), 0);

  function alternar(posicao) {
    const copia = [...conferidas];
    copia[posicao] = !copia[posicao];
    setConferidas(copia);
  }

  return (
    <JanelaPedido icone={<Package size={22} />} corIcone="verde" largura={560} titulo="Confirmar a recolha" texto={'Confira as peças recebidas do estafeta ' + pedido.estafeta.nome + ' antes de confirmar.'} aoFechar={aoFechar}>
      <div className="aviso-verde" style={{ margin: '18px 0 10px' }}>
        <Check size={18} /> {pecasConferidas} de {totalPecas} peças conferidas
        <span style={{ marginLeft: 'auto', fontSize: 11 }}>Pedido {pedido.numero}</span>
      </div>
      <div className="coluna" style={{ gap: 8 }}>
        {pedido.pecas.map((peca, posicao) => (
          <label key={peca.nome} className="cartao-estafeta" style={{ cursor: 'pointer', padding: '8px 12px' }}>
            <input type="checkbox" className="caixa-de-selecao" checked={conferidas[posicao]} onChange={() => alternar(posicao)} />
            <div style={{ flex: 1 }}>
              <strong>{peca.nome}</strong>
              <small>{peca.servico}</small>
            </div>
            <strong style={{ color: 'var(--verde)', fontSize: 12 }}>
              {conferidas[posicao] ? peca.quantidade : 0}/{peca.quantidade}
            </strong>
          </label>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <CampoAreaTexto rotulo="Observações (opcional)" valor={observacoes} aoMudar={setObservacoes} linhas={3} />
      </div>
      <div className="grelha-2" style={{ marginTop: 20, gap: 12 }}>
        <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
        <button type="button" className="botao botao-verde" disabled={pecasConferidas !== totalPecas} onClick={() => aoConfirmar(observacoes)}>
          <Check size={18} /> Confirmar recolha
        </button>
      </div>
    </JanelaPedido>
  );
}

// ---- L2.2 ----
export function JanelaConfirmarExecucao({ pedido, aoFechar, aoConfirmar }) {
  const totalPecas = pedido.pecas.reduce((soma, peca) => soma + peca.quantidade, 0);
  const verificacoes = [
    'Todas as ' + totalPecas + ' peças lavadas e secas',
    'Engomagem concluída',
    'Controlo de qualidade aprovado',
    'Peças embaladas e etiquetadas',
  ];
  const [marcadas, setMarcadas] = useState(verificacoes.map(() => true));
  const [fotos, setFotos] = useState([]); // endereços para pré-visualizar
  const [ficheiros, setFicheiros] = useState([]); // ficheiros a enviar para a API
  const [erroFoto, setErroFoto] = useState('');

  function alternar(posicao) {
    const copia = [...marcadas];
    copia[posicao] = !copia[posicao];
    setMarcadas(copia);
  }

  function juntarFoto(evento) {
    const ficheiro = evento.target.files[0];
    if (!ficheiro) return;
    const mensagem = validarImagem(ficheiro);
    setErroFoto(mensagem);
    if (mensagem) return;
    setFotos([...fotos, URL.createObjectURL(ficheiro)]);
    setFicheiros([...ficheiros, ficheiro]);
  }

  return (
    <JanelaPedido icone={<Loader size={22} />} corIcone="verde" largura={540} titulo="Confirmar execução do serviço" texto={'Confirme que todas as peças do pedido ' + pedido.numero + ' foram tratadas e passaram no controlo de qualidade.'} aoFechar={aoFechar}>
      <div className="coluna" style={{ gap: 8, marginTop: 18 }}>
        {verificacoes.map((texto, posicao) => (
          <label key={texto} className="cartao-estafeta" style={{ cursor: 'pointer', padding: '10px 14px' }}>
            <input type="checkbox" className="caixa-de-selecao" checked={marcadas[posicao]} onChange={() => alternar(posicao)} />
            <strong>{texto}</strong>
          </label>
        ))}
      </div>
      <p className="texto-escuro" style={{ fontSize: 12, margin: '16px 0 8px' }}>Fotos do pedido pronto</p>
      <div className="linha" style={{ gap: 10 }}>
        {fotos.map((foto, posicao) => (
          <img key={posicao} src={foto} alt="" style={{ width: 72, height: 56, borderRadius: 8, objectFit: 'cover' }} />
        ))}
        <label className="escolha" style={{ width: 72, height: 56, cursor: 'pointer' }}>
          <Plus size={20} />
          <input type="file" accept="image/png, image/jpeg" className="ficheiro-escondido" onChange={juntarFoto} />
        </label>
      </div>
      {erroFoto && <p className="mensagem-erro" style={{ marginTop: 8 }}>{erroFoto}</p>}
      <div className="grelha-2" style={{ marginTop: 22, gap: 12 }}>
        <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
        <button type="button" className="botao botao-verde" disabled={marcadas.includes(false)} onClick={() => aoConfirmar(ficheiros)}>
          <Check size={18} /> Confirmar execução
        </button>
      </div>
    </JanelaPedido>
  );
}

// ---- L2.4 ----
export function JanelaEncaminharEntrega({ pedido, estafeta, nomeLavandaria, aoFechar, aoConfirmar }) {
  return (
    <JanelaPedido icone={<Truck size={22} />} titulo="Encaminhar para entrega?" texto="O estafeta irá levantar o pedido na lavandaria e entregá-lo ao cliente." aoFechar={aoFechar}>
      <CartaoEstafetaEscolhido estafeta={estafeta} />
      <LinhaDetalhe rotulo="Levantamento" valor={nomeLavandaria + ' · agora'} />
      <LinhaDetalhe rotulo="Entrega ao cliente" valor={pedido.entregaPrevista} />
      <LinhaDetalhe rotulo="Endereço" valor={pedido.enderecoCurto} />
      <div className="grelha-2" style={{ marginTop: 28, gap: 12 }}>
        <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
        <button type="button" className="botao botao-primario" onClick={aoConfirmar}><Truck size={18} /> Confirmar entrega</button>
      </div>
    </JanelaPedido>
  );
}
