// =====================================================================
//  CAMPOS DE FORMULÁRIO
// =====================================================================

import { useState } from 'react';
import { Camera, ChevronDown, Eye, EyeOff, Upload } from 'lucide-react';
import { Avatar } from './Basicos';

// Tamanho máximo das imagens (5 MB)
const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

// Verifica se o ficheiro escolhido é uma imagem JPG/PNG com até 5 MB.
// Devolve um texto de erro, ou '' se estiver tudo bem.
export function validarImagem(ficheiro) {
  if (!['image/jpeg', 'image/png'].includes(ficheiro.type)) return 'A imagem tem de ser JPG ou PNG.';
  if (ficheiro.size > TAMANHO_MAXIMO_IMAGEM) return 'A imagem não pode ter mais de 5 MB.';
  return '';
}

// Campo para escolher uma foto (mostra o nome do ficheiro).
// nomeAtual: nome da foto que já existe (ex: "nelson.jpg")
// aoEscolher: recebe o ficheiro escolhido (objeto File)
export function CampoFoto({ rotulo = 'Foto de perfil', nomeAtual, aoEscolher }) {
  const [nomeEscolhido, setNomeEscolhido] = useState('');
  const [erro, setErro] = useState('');

  function escolher(evento) {
    const ficheiro = evento.target.files[0];
    if (!ficheiro) return;
    const mensagem = validarImagem(ficheiro);
    setErro(mensagem);
    if (mensagem) return;
    setNomeEscolhido(ficheiro.name);
    aoEscolher(ficheiro);
  }

  return (
    <div className="campo">
      <label>{rotulo}</label>
      <label className="caixa-campo" style={{ cursor: 'pointer' }} title="Escolher imagem">
        <Upload size={18} />
        <span style={{ flex: 1, fontWeight: 500, color: nomeEscolhido || nomeAtual ? 'var(--azul)' : 'var(--texto-cinza-claro)' }}>
          {nomeEscolhido || nomeAtual || 'Escolher imagem (JPG ou PNG · máx. 5 MB)'}
        </span>
        <span className="sufixo" style={{ color: 'var(--azul-medio)' }}>Alterar</span>
        <input type="file" accept="image/png, image/jpeg" className="ficheiro-escondido" onChange={escolher} />
      </label>
      {erro && <p className="mensagem-erro">{erro}</p>}
    </div>
  );
}

// Foto redonda que se pode clicar para escolher uma imagem nova.
// Mostra logo a pré-visualização da imagem escolhida.
export function FotoEditavel({ nome, fotoUrl, tamanho = 112, aoEscolher }) {
  const [previsualizacao, setPrevisualizacao] = useState('');
  const [erro, setErro] = useState('');

  function escolher(evento) {
    const ficheiro = evento.target.files[0];
    if (!ficheiro) return;
    const mensagem = validarImagem(ficheiro);
    setErro(mensagem);
    if (mensagem) return;
    setPrevisualizacao(URL.createObjectURL(ficheiro));
    aoEscolher(ficheiro);
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <label style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} title="Escolher foto">
        <Avatar nome={nome || '?'} fotoUrl={previsualizacao || fotoUrl} tamanho={tamanho} />
        <span className="botao-camara">
          <Camera size={15} />
        </span>
        <input type="file" accept="image/png, image/jpeg" className="ficheiro-escondido" onChange={escolher} />
      </label>
      {erro && <p className="mensagem-erro" style={{ justifyContent: 'center' }}>{erro}</p>}
    </div>
  );
}

// Campo de texto com ícone à esquerda.
// Exemplo: <CampoTexto rotulo="Nome" icone={<User size={18}/>} valor={nome} aoMudar={setNome} />
export function CampoTexto({ rotulo, icone, valor, aoMudar, tipo = 'text', placeholder, bloqueado = false, erro = false, sufixo, obrigatorio = false }) {
  return (
    <div className="campo">
      {rotulo && (
        <label>
          {rotulo}
          {obrigatorio && ' *'}
        </label>
      )}
      <div className={'caixa-campo' + (bloqueado ? ' bloqueado' : '') + (erro ? ' erro' : '')}>
        {icone}
        <input
          type={tipo}
          value={valor ?? ''}
          placeholder={placeholder}
          disabled={bloqueado}
          onChange={(evento) => aoMudar(evento.target.value)}
        />
        {sufixo && <span className="sufixo">{sufixo}</span>}
      </div>
    </div>
  );
}

// Campo de palavra-passe com o botão do "olho" para mostrar/esconder
export function CampoPalavraPasse({ rotulo, icone, valor, aoMudar, placeholder, erro = false }) {
  const [mostrar, setMostrar] = useState(false);
  return (
    <div className="campo">
      {rotulo && <label>{rotulo}</label>}
      <div className={'caixa-campo' + (erro ? ' erro' : '')}>
        {icone}
        <input
          type={mostrar ? 'text' : 'password'}
          value={valor}
          placeholder={placeholder}
          onChange={(evento) => aoMudar(evento.target.value)}
        />
        <button type="button" className="botao-icone" onClick={() => setMostrar(!mostrar)} title="Mostrar palavra-passe">
          {mostrar ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

// Lista de escolha (select) com ícone e seta.
// opcoes pode ser ['A', 'B'] ou [{ valor: 'a', texto: 'A' }]
export function CampoSelecao({ rotulo, icone, valor, aoMudar, opcoes, obrigatorio = false }) {
  return (
    <div className="campo">
      {rotulo && (
        <label>
          {rotulo}
          {obrigatorio && ' *'}
        </label>
      )}
      <div className="caixa-campo">
        {icone}
        <select value={valor} onChange={(evento) => aoMudar(evento.target.value)}>
          {opcoes.map((opcao) => {
            const valorOpcao = typeof opcao === 'string' ? opcao : opcao.valor;
            const textoOpcao = typeof opcao === 'string' ? opcao : opcao.texto;
            return (
              <option key={valorOpcao} value={valorOpcao}>
                {textoOpcao}
              </option>
            );
          })}
        </select>
        <ChevronDown size={18} />
      </div>
    </div>
  );
}

// Caixa de texto grande (várias linhas)
export function CampoAreaTexto({ rotulo, valor, aoMudar, placeholder, linhas = 3 }) {
  return (
    <div className="campo">
      {rotulo && <label>{rotulo}</label>}
      <textarea
        className="area-texto"
        rows={linhas}
        value={valor}
        placeholder={placeholder}
        onChange={(evento) => aoMudar(evento.target.value)}
      />
    </div>
  );
}

// Campo de pesquisa simples (com lupa)
export function CampoPesquisa({ valor, aoMudar, placeholder, largura = 340, icone }) {
  return (
    <div className="caixa-campo pesquisa" style={{ width: largura }}>
      {icone}
      <input value={valor} placeholder={placeholder} onChange={(evento) => aoMudar(evento.target.value)} />
    </div>
  );
}
