// =====================================================================
//  COMPONENTES PEQUENOS usados em todo o site
//  (avatar, etiqueta, interruptor, paginação, estrela, cores...)
// =====================================================================

import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { iniciais, corDoEstado, formatarNota } from '../utilidades';
import { coresDisponiveis } from '../dados/dadosAdmin';

// Foto redonda. Se não houver foto mostra as iniciais do nome.
// logo = true mostra um quadrado branco com o logótipo dentro.
export function Avatar({ nome, fotoUrl, tamanho = 36, logo = false }) {
  const estilo = { width: tamanho, height: tamanho, fontSize: Math.round(tamanho / 2.8) };

  if (fotoUrl && logo) {
    return (
      <span className="avatar com-logo" style={estilo}>
        <img src={fotoUrl} alt={nome} />
      </span>
    );
  }
  if (fotoUrl) {
    return <img className="avatar" src={fotoUrl} alt={nome} style={estilo} />;
  }
  return (
    <span className="avatar" style={estilo}>
      {iniciais(nome)}
    </span>
  );
}

// Etiqueta colorida com um ponto. A cor é escolhida pelo texto.
export function Etiqueta({ texto, cor, semPonto = false }) {
  const classe = 'etiqueta ' + (cor || corDoEstado(texto)) + (semPonto ? '' : ' com-ponto');
  return <span className={classe}>{texto}</span>;
}

// Botão de ligar/desligar
export function Interruptor({ ligado, aoMudar, verde = false }) {
  return (
    <button
      type="button"
      className={'interruptor' + (ligado ? ' ligado' : '') + (verde ? ' verde' : '')}
      onClick={() => aoMudar(!ligado)}
      aria-pressed={ligado}
    />
  );
}

// Estrela amarela + nota
export function Nota({ valor, tamanho = 14 }) {
  return (
    <span className="estrela">
      <Star size={tamanho} />
      {formatarNota(valor)}
    </span>
  );
}

// Bolinhas de cor + texto "Branco, Azul +2"
export function ListaCores({ cores }) {
  const mostrar = cores.slice(0, 2).join(', ') + (cores.length > 2 ? ' +' + (cores.length - 2) : '');
  return (
    <span>
      <span className="bolas-cores">
        {cores.map((nomeCor) => (
          <span key={nomeCor} className="bola-cor" style={{ background: codigoDaCor(nomeCor) }} />
        ))}
      </span>
      {mostrar}
    </span>
  );
}

export function codigoDaCor(nomeCor) {
  const cor = coresDisponiveis.find((c) => c.nome === nomeCor);
  return cor ? cor.codigo : '#cccccc';
}

// Lista de tamanhos separados por vírgula: S, M, L, XL
export function ListaTamanhos({ tamanhos }) {
  return <span>{tamanhos.join(', ')}</span>;
}

// Barra de progresso horizontal. percentagem: 0 a 100
export function BarraProgresso({ percentagem, cor }) {
  return (
    <div className="barra-progresso">
      <div style={{ width: percentagem + '%', background: cor }} />
    </div>
  );
}

// Cor da barra de produção conforme a percentagem (igual ao Figma)
export function corDaProducao(percentagem) {
  if (percentagem >= 85) return 'var(--azul-medio)';
  if (percentagem >= 60) return '#1e63d6';
  return '#8db8e4';
}

// Paginação: ‹ 1 2 3 … ›
export function Paginacao({ pagina, totalPaginas, aoMudar, comFim = false }) {
  if (totalPaginas <= 1) totalPaginas = 1;
  const numeros = [];
  for (let i = 1; i <= Math.min(3, totalPaginas); i++) numeros.push(i);

  return (
    <div className="paginacao">
      <button type="button" className={comFim ? '' : 'sem-borda'} disabled={pagina === 1} onClick={() => aoMudar(pagina - 1)}>
        <ChevronLeft size={16} />
      </button>
      {numeros.map((numero) => (
        <button key={numero} type="button" className={numero === pagina ? 'ativo' : ''} onClick={() => aoMudar(numero)}>
          {numero}
        </button>
      ))}
      {totalPaginas > 3 && <button type="button">…</button>}
      {comFim && totalPaginas > 3 && (
        <button type="button" onClick={() => aoMudar(totalPaginas)}>
          {totalPaginas}
        </button>
      )}
      <button type="button" className={comFim ? '' : 'sem-borda'} disabled={pagina >= totalPaginas} onClick={() => aoMudar(pagina + 1)}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// Seletor do tipo "Todos | Ativos | Inativos"
export function Seletor({ opcoes, valor, aoMudar }) {
  return (
    <div className="seletor">
      {opcoes.map((opcao) => (
        <button key={opcao.valor} type="button" className={valor === opcao.valor ? 'ativo' : ''} onClick={() => aoMudar(opcao.valor)}>
          {opcao.texto}
        </button>
      ))}
    </div>
  );
}

// Mostra "A carregar..." ou uma mensagem de erro
export function EstadoCarregamento({ aCarregar, erro }) {
  if (erro) return <div className="erro-pagina">{erro}</div>;
  if (aCarregar) return <div className="a-carregar">A carregar...</div>;
  return null;
}
