// =====================================================================
//  Ecrãs Q2 e Q3 - Janela "Adicionar lavandaria" / "Editar lavandaria"
//  Se receber uma "lavandaria", a janela fica em modo de edição.
// =====================================================================

import { useEffect, useState } from 'react';
import { Check, Clock, MapPin, Plus, Store, Tag, Trash2, Upload, WashingMachine, X } from 'lucide-react';
import { Modal } from '../../componentes/Modais';
import { CampoAreaTexto, CampoSelecao, CampoTexto, validarImagem } from '../../componentes/Formulario';
import { listarServicos, listarTodosArtigos, listas } from '../../servicos/servicosAdmin';

const diasDaSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const horas = ['06:00', '07:00', '07:30', '08:00', '09:00', '10:00', '17:00', '18:00', '19:00', '19:30', '20:00', '21:00'];

export default function JanelaLavandaria({ lavandaria, aoFechar, aoGuardar }) {
  const emEdicao = Boolean(lavandaria);

  // Listas de serviços e artigos que existem na plataforma (vêm da API)
  const [todosServicos, setTodosServicos] = useState([]);
  const [todosArtigos, setTodosArtigos] = useState([]);
  useEffect(() => {
    listarServicos('', '').then(setTodosServicos);
    listarTodosArtigos().then(setTodosArtigos);
  }, []);

  const [nome, setNome] = useState(lavandaria ? lavandaria.nome : '');
  const [localizacao, setLocalizacao] = useState(lavandaria ? lavandaria.localizacao : '');
  const [descricao, setDescricao] = useState(lavandaria ? lavandaria.descricao : '');
  const [dias, setDias] = useState(lavandaria ? lavandaria.diasFuncionamento : ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']);
  const [abertura, setAbertura] = useState(lavandaria ? lavandaria.abertura : '08:00');
  const [encerramento, setEncerramento] = useState(lavandaria ? lavandaria.encerramento : '19:00');
  const [foto, setFoto] = useState(null); // ficheiro escolhido
  const [previsualizacao, setPrevisualizacao] = useState(lavandaria ? lavandaria.logoUrl || lavandaria.fotoUrl : '');
  const [erroFoto, setErroFoto] = useState('');

  function escolherFoto(evento) {
    const ficheiro = evento.target.files[0];
    if (!ficheiro) return;
    const mensagem = validarImagem(ficheiro);
    setErroFoto(mensagem);
    if (mensagem) return;
    setFoto(ficheiro);
    setPrevisualizacao(URL.createObjectURL(ficheiro));
  }
  const [erro, setErro] = useState('');

  // Cada linha de serviço: { nome, categoria, artigos: [...], preco }
  const [linhasServico, setLinhasServico] = useState(
    lavandaria && lavandaria.servicos.length > 0
      ? lavandaria.servicos.map((s) => ({ nome: s.nome, categoria: s.categoria, artigos: s.artigos, preco: s.preco }))
      : [{ nome: 'Lavagem + Engomar', categoria: 'Roupa', artigos: [], preco: 1000 }]
  );

  function ligarDesligarDia(dia) {
    if (dias.includes(dia)) setDias(dias.filter((d) => d !== dia));
    else setDias(diasDaSemana.filter((d) => dias.includes(d) || d === dia));
  }

  // Muda um campo de uma linha de serviço
  function mudarLinha(posicao, campo, valor) {
    const copia = [...linhasServico];
    copia[posicao] = { ...copia[posicao], [campo]: valor };
    setLinhasServico(copia);
  }

  function adicionarLinha() {
    setLinhasServico([...linhasServico, { nome: 'Lavagem + Engomar', categoria: 'Roupa', artigos: [], preco: 1000 }]);
  }

  function removerLinha(posicao) {
    setLinhasServico(linhasServico.filter((_, i) => i !== posicao));
  }

  async function guardar() {
    if (!nome.trim() || !localizacao.trim()) {
      setErro('Preencha o nome e a localização da lavandaria.');
      return;
    }
    try {
      await aoGuardar(
        {
          nome,
          localizacao,
          descricao,
          diasFuncionamento: dias,
          abertura,
          encerramento,
          servicos: linhasServico.map((linha) => ({ ...linha, preco: Number(linha.preco) })),
        },
        foto
      );
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <Modal titulo={emEdicao ? 'Editar lavandaria' : 'Adicionar lavandaria'} aoFechar={aoFechar} largura={1120}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* ---- Coluna da esquerda: dados ---- */}
        <div className="coluna" style={{ gap: 16 }}>
          <div className="grelha-2">
            <CampoTexto rotulo="Nome da lavandaria" obrigatorio icone={<Store size={18} />} valor={nome} aoMudar={setNome} />
            <CampoTexto rotulo="Localização" obrigatorio icone={<MapPin size={18} />} valor={localizacao} aoMudar={setLocalizacao} />
          </div>
          <CampoAreaTexto rotulo="Descrição" valor={descricao} aoMudar={setDescricao} linhas={2} />

          <hr className="divisor" />
          <h3 className="titulo-cartao">Horário de funcionamento</h3>
          <div className="campo">
            <label>Dias de funcionamento</label>
            <div className="escolhas">
              {diasDaSemana.map((dia) => (
                <button key={dia} type="button" className={'escolha' + (dias.includes(dia) ? ' ativo' : '')} onClick={() => ligarDesligarDia(dia)}>
                  {dia}
                </button>
              ))}
            </div>
          </div>
          <div className="grelha-2">
            <CampoSelecao rotulo="Abertura" icone={<Clock size={18} />} valor={abertura} aoMudar={setAbertura} opcoes={horas} />
            <CampoSelecao rotulo="Encerramento" icone={<Clock size={18} />} valor={encerramento} aoMudar={setEncerramento} opcoes={horas} />
          </div>
        </div>

        {/* ---- Coluna da direita: foto ---- */}
        <div className="cartao" style={{ alignSelf: 'start' }}>
          <h3 className="titulo-cartao" style={{ marginBottom: 16 }}>Foto de perfil</h3>
          <label className="zona-upload" style={{ cursor: 'pointer' }}>
            {previsualizacao ? <img src={previsualizacao} alt="Pré-visualização" /> : <Upload size={22} />}
            <strong style={{ fontSize: 13 }}>{previsualizacao ? 'Alterar imagem' : 'Importar imagem'}</strong>
            <small>JPG ou PNG · até 5 MB · formato quadrado</small>
            <span className="botao botao-secundario">
              <Upload size={18} /> Escolher ficheiro
            </span>
            <input type="file" accept="image/png, image/jpeg" className="ficheiro-escondido" onChange={escolherFoto} />
          </label>
          {erroFoto && <p className="mensagem-erro" style={{ marginTop: 8 }}>{erroFoto}</p>}
        </div>
      </div>

      {/* ---- Serviços oferecidos ---- */}
      <hr className="divisor" style={{ margin: '20px 0' }} />
      <div className="linha-entre" style={{ marginBottom: 14 }}>
        <h3 className="titulo-cartao">Serviços</h3>
        <button type="button" className="botao botao-claro" onClick={adicionarLinha}>
          <Plus size={18} /> Adicionar serviço
        </button>
      </div>

      <div className="coluna" style={{ gap: 14 }}>
        {linhasServico.map((linha, posicao) => (
          <div key={posicao} style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.75fr 1.9fr 0.62fr 32px', gap: 10, alignItems: 'end' }}>
            <CampoSelecao rotulo="Serviço" icone={<WashingMachine size={18} />} valor={linha.nome} aoMudar={(v) => mudarLinha(posicao, 'nome', v)} opcoes={todosServicos.map((s) => s.nome)} />
            <CampoSelecao rotulo="Categoria" icone={<Tag size={18} />} valor={linha.categoria} aoMudar={(v) => mudarLinha(posicao, 'categoria', v)} opcoes={listas.categorias} />
            <div className="campo">
              <label>Artigos</label>
              <EscolherArtigos todosArtigos={todosArtigos} escolhidos={linha.artigos} categoria={linha.categoria} aoMudar={(lista) => mudarLinha(posicao, 'artigos', lista)} />
            </div>
            <CampoTexto rotulo="Preço" tipo="number" valor={linha.preco} aoMudar={(v) => mudarLinha(posicao, 'preco', v)} sufixo="Kz" />
            <button type="button" className="botao-icone" style={{ marginBottom: 7 }} title="Remover serviço" onClick={() => removerLinha(posicao)}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {erro && <p className="mensagem-erro" style={{ marginTop: 12 }}>{erro}</p>}
      <div className="modal-rodape">
        <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
        <button type="button" className="botao botao-primario" onClick={guardar}>
          <Check size={18} /> {emEdicao ? 'Guardar alterações' : 'Guardar lavandaria'}
        </button>
      </div>
    </Modal>
  );
}

// Caixa com os artigos escolhidos (etiquetas com "x") + lista para juntar mais
function EscolherArtigos({ todosArtigos, escolhidos, categoria, aoMudar }) {
  const disponiveis = todosArtigos.filter((a) => a.categoria === categoria && !escolhidos.includes(a.nome));
  return (
    <div className="caixa-etiquetas">
      {escolhidos.map((nomeArtigo) => (
        <span key={nomeArtigo} className="etiqueta azul">
          {nomeArtigo}
          <button type="button" onClick={() => aoMudar(escolhidos.filter((a) => a !== nomeArtigo))}>
            <X size={12} />
          </button>
        </span>
      ))}
      <select value="" onChange={(evento) => evento.target.value && aoMudar([...escolhidos, evento.target.value])}>
        <option value="">{escolhidos.length ? '' : 'Escolher artigos'}</option>
        {disponiveis.map((a) => (
          <option key={a.id} value={a.nome}>{a.nome}</option>
        ))}
      </select>
    </div>
  );
}
