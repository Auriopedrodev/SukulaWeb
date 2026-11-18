// =====================================================================
//  Ecrãs S, S2 e S4 - Gestão de artigos (lista)
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircleCheck, Eye, House, Pencil, Plus, Search, Shirt, Trash2 } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento, ListaCores, ListaTamanhos, Paginacao, Seletor } from '../../componentes/Basicos';
import { AvisoFlutuante, ModalConfirmacao } from '../../componentes/Modais';
import JanelaArtigo from './JanelaArtigo';
import { adicionarArtigo, editarArtigo, listarArtigos, listarTodosArtigos, removerArtigo } from '../../servicos/servicosAdmin';
import { corDaCategoria } from '../../utilidades';

// Ícone de cada categoria
export function IconeCategoria({ categoria, tamanho = 18 }) {
  if (categoria === 'Calçados') return <Box size={tamanho} />;
  if (categoria === 'Lar') return <House size={tamanho} />;
  return <Shirt size={tamanho} />;
}

export default function GestaoArtigos() {
  const navegar = useNavigate();
  const [resultado, setResultado] = useState(null);
  const [todos, setTodos] = useState([]);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [categoria, setCategoria] = useState('');
  const [pagina, setPagina] = useState(1);

  const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
  const [artigoEditar, setArtigoEditar] = useState(null);
  const [artigoRemover, setArtigoRemover] = useState(null);
  const [aviso, setAviso] = useState(null);

  function carregar() {
    listarArtigos(pesquisa, categoria, pagina).then(setResultado).catch((falha) => setErro(falha.message));
    listarTodosArtigos().then(setTodos);
  }

  useEffect(carregar, [pesquisa, categoria, pagina]);

  async function guardarNovo(artigo) {
    await adicionarArtigo(artigo);
    setMostrarAdicionar(false);
    setAviso({ titulo: 'Artigo adicionado', texto: artigo.nome + ' foi adicionado à lista de artigos.' });
    carregar();
  }

  async function guardarEdicao(artigo) {
    await editarArtigo(artigoEditar.id, artigo);
    setArtigoEditar(null);
    setAviso({ titulo: 'Alterações guardadas', texto: 'O artigo ' + artigo.nome + ' foi atualizado.' });
    carregar();
  }

  async function confirmarRemocao() {
    await removerArtigo(artigoRemover.id);
    setAviso({ titulo: 'Artigo removido', texto: artigoRemover.nome + ' foi removido da lista de artigos.', remover: true });
    setArtigoRemover(null);
    carregar();
  }

  const contar = (cat) => todos.filter((a) => a.categoria === cat).length;
  const indicadores = [
    { titulo: 'Total de artigos', valor: todos.length, icone: Shirt },
    { titulo: 'Roupa', valor: contar('Roupa'), icone: Shirt },
    { titulo: 'Calçados', valor: contar('Calçados'), icone: Box },
    { titulo: 'Lar', valor: contar('Lar'), icone: House },
  ];

  const totalPaginas = resultado ? Math.ceil(resultado.total / resultado.tamanhoPagina) : 1;
  const primeiro = resultado ? (pagina - 1) * resultado.tamanhoPagina + 1 : 0;

  return (
    <>
      <BarraSuperior titulo="Gestão de artigos" />

      <div className="conteudo">
        <div className="linha-entre">
          <h2 className="titulo-seccao">Artigos</h2>
          <button type="button" className="botao botao-primario" onClick={() => setMostrarAdicionar(true)}>
            <Plus size={18} /> Adicionar artigo
          </button>
        </div>

        <div className="grelha-4" style={{ marginTop: -4 }}>
          {indicadores.map((item) => (
            <div key={item.titulo} className="cartao cartao-indicador">
              <span className="icone-quadrado"><item.icone size={22} /></span>
              <div>
                <p className="rotulo">{item.titulo}</p>
                <p className="valor">{item.valor}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="linha-entre">
          <div className="linha">
            <div className="caixa-campo pesquisa" style={{ width: 340 }}>
              <Search size={18} />
              <input
                value={pesquisa}
                placeholder="Pesquisar artigo por nome ou cor"
                onChange={(evento) => {
                  setPesquisa(evento.target.value);
                  setPagina(1);
                }}
              />
            </div>
            <Seletor
              valor={categoria}
              aoMudar={(valor) => {
                setCategoria(valor);
                setPagina(1);
              }}
              opcoes={[
                { valor: '', texto: 'Todos' },
                { valor: 'Roupa', texto: 'Roupa' },
                { valor: 'Calçados', texto: 'Calçados' },
                { valor: 'Lar', texto: 'Lar' },
              ]}
            />
          </div>
        </div>

        <EstadoCarregamento aCarregar={!resultado} erro={erro} />

        {resultado && (
          <div className="cartao cartao-sem-espaco">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome do artigo</th>
                  <th>Categoria</th>
                  <th>Cores</th>
                  <th>Tamanhos</th>
                  <th>Serviços</th>
                  <th className="acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {resultado.itens.map((artigo) => (
                  <tr key={artigo.id}>
                    <td><span className="linha forte" style={{ gap: 14 }}><IconeCategoria categoria={artigo.categoria} /> {artigo.nome}</span></td>
                    <td><span className={'etiqueta ' + corDaCategoria(artigo.categoria)}>{artigo.categoria}</span></td>
                    <td><ListaCores cores={artigo.cores} /></td>
                    <td className="forte"><ListaTamanhos tamanhos={artigo.tamanhos} /></td>
                    <td>
                      <div className="linha" style={{ gap: 6 }}>
                        {artigo.servicos.slice(0, 1).map((s) => <span key={s} className="etiqueta contorno">{s}</span>)}
                        {artigo.servicos.length > 1 && <span className="etiqueta azul">+{artigo.servicos.length - 1}</span>}
                      </div>
                    </td>
                    <td className="acoes">
                      <button type="button" className="botao-icone" title="Ver" onClick={() => navegar('/admin/artigos/' + artigo.id)}><Eye size={18} /></button>
                      <button type="button" className="botao-icone" title="Editar" onClick={() => setArtigoEditar(artigo)}><Pencil size={18} /></button>
                      <button type="button" className="botao-icone" title="Remover" onClick={() => setArtigoRemover(artigo)}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="rodape-tabela">
              <span>A mostrar {primeiro}–{primeiro + resultado.itens.length - 1} de {resultado.total} artigos</span>
              <Paginacao pagina={pagina} totalPaginas={totalPaginas} aoMudar={setPagina} />
            </div>
          </div>
        )}
      </div>

      {mostrarAdicionar && <JanelaArtigo aoFechar={() => setMostrarAdicionar(false)} aoGuardar={guardarNovo} />}
      {artigoEditar && <JanelaArtigo artigo={artigoEditar} aoFechar={() => setArtigoEditar(null)} aoGuardar={guardarEdicao} />}

      {artigoRemover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover artigo?"
          texto={'O artigo ' + artigoRemover.nome + ' será retirado de todos os serviços em que está incluído. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover artigo"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setArtigoRemover(null)}
        />
      )}

      {aviso && (
        <AvisoFlutuante icone={aviso.remover ? <Trash2 size={20} /> : <CircleCheck size={20} />} titulo={aviso.titulo} texto={aviso.texto} aoFechar={() => setAviso(null)} />
      )}
    </>
  );
}
