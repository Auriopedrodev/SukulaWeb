// =====================================================================
//  JANELAS POR CIMA DA PÁGINA (MODAIS) E AVISOS FLUTUANTES
// =====================================================================

import { useEffect } from 'react';
import { X } from 'lucide-react';

// Janela com título e botão de fechar.
// Exemplo: <Modal titulo="Editar cliente" aoFechar={fechar} largura={720}> ... </Modal>
export function Modal({ titulo, subtitulo, aoFechar, largura = 720, escuro = false, fecharRedondo = false, children }) {
  return (
    <div className={'fundo-modal' + (escuro ? ' escuro' : '')} onClick={aoFechar}>
      <div className="modal" style={{ maxWidth: largura }} onClick={(evento) => evento.stopPropagation()}>
        {titulo && (
          <div className="modal-cabecalho">
            <div>
              <h2>{titulo}</h2>
              {subtitulo && <p className="texto-cinza texto-pequeno" style={{ marginTop: 4 }}>{subtitulo}</p>}
            </div>
            <button type="button" className={'botao-fechar' + (fecharRedondo ? ' redondo' : '')} onClick={aoFechar} title="Fechar">
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// Janela de confirmação centrada (Remover? / Terminar sessão?)
// cor: 'vermelho' (perigo) ou 'azul'
export function ModalConfirmacao({ icone, titulo, texto, textoConfirmar, aoConfirmar, aoCancelar, cor = 'vermelho', iconeComFundo = false, escuro = false, children }) {
  return (
    <div className={'fundo-modal' + (escuro ? ' escuro' : '')} onClick={aoCancelar}>
      <div className="modal modal-centrado" style={{ maxWidth: 460 }} onClick={(evento) => evento.stopPropagation()}>
        {iconeComFundo ? (
          <div className={'circulo-icone ' + cor}>{icone}</div>
        ) : (
          <div style={{ color: 'var(--azul)', display: 'flex', justifyContent: 'center' }}>{icone}</div>
        )}
        <h2>{titulo}</h2>
        <p>{texto}</p>
        {children}
        <div className="botoes-empilhados">
          <button type="button" className={'botao botao-largo ' + (cor === 'vermelho' ? 'botao-perigo' : 'botao-primario')} onClick={aoConfirmar}>
            {textoConfirmar}
          </button>
          <button type="button" className="botao botao-secundario botao-largo" onClick={aoCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// Janela de sucesso com o visto verde ("Pedido encaminhado!")
export function ModalSucesso({ icone, titulo, texto, textoPrincipal, aoPrincipal, textoSecundario, aoSecundario }) {
  return (
    <div className="fundo-modal escuro">
      <div className="modal modal-centrado" style={{ maxWidth: 460 }}>
        <div className="circulo-icone sucesso">
          <div>{icone}</div>
        </div>
        <h2>{titulo}</h2>
        <p>{texto}</p>
        <div className="botoes-empilhados">
          <button type="button" className="botao botao-primario botao-largo" onClick={aoPrincipal}>
            {textoPrincipal}
          </button>
          {textoSecundario && (
            <button type="button" className="botao botao-secundario botao-largo" onClick={aoSecundario}>
              {textoSecundario}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Aviso no canto do ecrã que desaparece sozinho ("Cliente removido")
export function AvisoFlutuante({ icone, titulo, texto, aoFechar, emCima = false }) {
  useEffect(() => {
    const temporizador = setTimeout(aoFechar, 5000);
    return () => clearTimeout(temporizador);
  }, [aoFechar]);

  return (
    <div className={'aviso-flutuante' + (emCima ? ' em-cima' : '')}>
      <span style={{ color: 'var(--azul)', marginTop: 8 }}>{icone}</span>
      <div>
        <strong>{titulo}</strong>
        <p>{texto}</p>
      </div>
      <button type="button" className="botao-fechar" onClick={aoFechar}>
        <X size={16} />
      </button>
    </div>
  );
}
