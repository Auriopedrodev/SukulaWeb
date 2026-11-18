// =====================================================================
//  Ecrã R2 - Adicionar serviço  (e também Editar serviço)
//  Endereços: /admin/servicos/novo   e   /admin/servicos/5/editar
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, ChevronLeft, CreditCard, House, Plus, Search, Shirt, Tag, WashingMachine } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Interruptor, ListaCores, ListaTamanhos } from '../../componentes/Basicos';
import { CampoSelecao, CampoTexto } from '../../componentes/Formulario';
import JanelaArtigo from './JanelaArtigo';
import { adicionarArtigo, adicionarServico, editarServico, listarTodosArtigos, listas, obterServico } from '../../servicos/servicosAdmin';

export default function FormularioServico() {
  const { id } = useParams(); // se existir, estamos a editar
  const navegar = useNavigate();
  const emEdicao = Boolean(id);

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Lar');
  const [precoBase, setPrecoBase] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [artigosEscolhidos, setArtigosEscolhidos] = useState([]);

  const [todosArtigos, setTodosArtigos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [mostrarNovoArtigo, setMostrarNovoArtigo] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    listarTodosArtigos().then(setTodosArtigos);
    if (emEdicao) {
      obterServico(id).then((servico) => {
        setNome(servico.nome);
        setCategoria(servico.categoria);
        setPrecoBase(servico.precoBase);
        setAtivo(servico.ativo);
        setArtigosEscolhidos(servico.artigos);
      });
    }
  }, [id]);

  function alternarArtigo(nomeArtigo) {
    if (artigosEscolhidos.includes(nomeArtigo)) setArtigosEscolhidos(artigosEscolhidos.filter((a) => a !== nomeArtigo));
    else setArtigosEscolhidos([...artigosEscolhidos, nomeArtigo]);
  }

  async function guardar() {
    if (!nome.trim() || !precoBase) {
      setErro('Preencha o nome e o preço base do serviço.');
      return;
    }
    const dados = { nome, categoria, precoBase: Number(precoBase), ativo, artigos: artigosEscolhidos };
    try {
      if (emEdicao) await editarServico(id, dados);
      else await adicionarServico(dados);
      navegar('/admin/servicos');
    } catch (falha) {
      setErro(falha.message);
    }
  }

  async function guardarNovoArtigo(artigo) {
    await adicionarArtigo(artigo);
    setMostrarNovoArtigo(false);
    setTodosArtigos(await listarTodosArtigos());
    setArtigosEscolhidos([...artigosEscolhidos, artigo.nome]);
  }

  const artigosVisiveis = todosArtigos.filter((a) => a.nome.toLowerCase().includes(pesquisa.toLowerCase()));

  return (
    <>
      <BarraSuperior titulo="Gestão de serviços" />

      <div className="conteudo">
        <div className="cabecalho-pagina">
          <div>
            <button type="button" className="ligacao-voltar" onClick={() => navegar('/admin/servicos')}>
              <ChevronLeft size={16} /> Voltar aos serviços
            </button>
            <h2 className="titulo-seccao" style={{ fontSize: 20 }}>{emEdicao ? 'Editar serviço' : 'Adicionar serviço'}</h2>
          </div>
          <div className="linha">
            <button type="button" className="botao botao-secundario" onClick={() => navegar('/admin/servicos')}>Cancelar</button>
            <button type="button" className="botao botao-primario" onClick={guardar}>
              <Check size={18} /> Guardar serviço
            </button>
          </div>
        </div>
        {erro && <div className="erro-pagina">{erro}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Dados do serviço */}
          <div className="cartao coluna" style={{ padding: 24, gap: 16 }}>
            <h3 className="titulo-cartao">Dados do serviço</h3>
            <CampoTexto rotulo="Nome do serviço" obrigatorio icone={<WashingMachine size={18} />} valor={nome} aoMudar={setNome} placeholder="Ex: Lavagem de Cortinados" />
            <CampoSelecao rotulo="Categoria" obrigatorio icone={<Tag size={18} />} valor={categoria} aoMudar={setCategoria} opcoes={listas.categorias} />
            <CampoTexto rotulo="Preço base" obrigatorio tipo="number" icone={<CreditCard size={18} />} valor={precoBase} aoMudar={setPrecoBase} sufixo="Kz / peça" />
            <div className="linha-entre" style={{ background: 'var(--fundo)', borderRadius: 10, padding: '12px 14px' }}>
              <div>
                <strong style={{ fontSize: 13 }}>Serviço ativo</strong>
                <p className="texto-cinza" style={{ fontSize: 11 }}>Visível para as lavandarias</p>
              </div>
              <Interruptor ligado={ativo} aoMudar={setAtivo} verde />
            </div>
          </div>

          {/* Escolha de artigos */}
          <div className="cartao" style={{ padding: 24 }}>
            <div className="linha-entre">
              <h3 className="titulo-cartao">Artigos</h3>
              <button type="button" className="botao botao-claro" onClick={() => setMostrarNovoArtigo(true)}>
                <Plus size={18} /> Novo artigo
              </button>
            </div>
            <div className="caixa-campo" style={{ margin: '14px 0', height: 44 }}>
              <Search size={18} />
              <input value={pesquisa} placeholder="Pesquisar artigo" onChange={(evento) => setPesquisa(evento.target.value)} />
            </div>

            <div className="cartao cartao-sem-espaco" style={{ boxShadow: 'none' }}>
              <table className="tabela">
                <thead>
                  <tr><th style={{ width: 50 }} /><th>Nome</th><th>Cores</th><th>Tamanhos</th></tr>
                </thead>
                <tbody>
                  {artigosVisiveis.map((artigo) => (
                    <tr key={artigo.id} style={{ cursor: 'pointer' }} onClick={() => alternarArtigo(artigo.nome)}>
                      <td>
                        <input type="checkbox" className="caixa-de-selecao" checked={artigosEscolhidos.includes(artigo.nome)} readOnly />
                      </td>
                      <td>
                        <span className="linha forte" style={{ gap: 14 }}>
                          {artigo.categoria === 'Lar' ? <House size={18} /> : <Shirt size={18} />} {artigo.nome}
                        </span>
                      </td>
                      <td><ListaCores cores={artigo.cores} /></td>
                      <td className="forte"><ListaTamanhos tamanhos={artigo.tamanhos} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {mostrarNovoArtigo && <JanelaArtigo aoFechar={() => setMostrarNovoArtigo(false)} aoGuardar={guardarNovoArtigo} />}
    </>
  );
}
