// =====================================================================
//  Gestão de artigos (lista)
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircleCheck, Eye, House, Pencil, Plus, Search, Shirt, Trash2 } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento } from '../../componentes/Basicos';
import { AvisoFlutuante, ModalConfirmacao } from '../../componentes/Modais';
import JanelaArtigo from './JanelaArtigo';
import { adicionarArtigo, editarArtigo, listarArtigos, removerArtigo } from '../../servicos/servicosAdmin';
import { corDaCategoria } from '../../utilidades';

export function IconeCategoria({ categoria, tamanho = 18 }) {
  if (categoria === 'Calçados') return <Box size={tamanho} />;
  if (categoria === 'Lar') return <House size={tamanho} />;
  return <Shirt size={tamanho} />;
}

function contem(texto, pesquisa) {
  return String(texto || '').toLowerCase().includes(String(pesquisa || '').toLowerCase());
}

export default function GestaoArtigos() {
  const navegar = useNavigate();
  const [artigos, setArtigos] = useState(null);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');

  const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
  const [artigoEditar, setArtigoEditar] = useState(null);
  const [artigoRemover, setArtigoRemover] = useState(null);
  const [aviso, setAviso] = useState(null);

  function carregar() {
    setErro('');
    listarArtigos().then(setArtigos).catch((falha) => setErro(falha.message));
  }

  useEffect(carregar, []);

  async function guardarNovo(artigo) {
    await adicionarArtigo(artigo);
    setMostrarAdicionar(false);
    setAviso({ titulo: 'Artigo adicionado', texto: artigo.nome + ' foi adicionado à lista de artigos.' });
    carregar();
  }

  async function guardarEdicao(artigo) {
    await editarArtigo(artigoEditar.idArtigo, artigo);
    setArtigoEditar(null);
    setAviso({ titulo: 'Alterações guardadas', texto: 'O artigo ' + artigo.nome + ' foi atualizado.' });
    carregar();
  }

  async function confirmarRemocao() {
    try {
      await removerArtigo(artigoRemover.idArtigo);
      setAviso({ titulo: 'Artigo removido', texto: artigoRemover.nome + ' foi removido da lista de artigos.', remover: true });
      setArtigoRemover(null);
      carregar();
    } catch (falha) {
      setArtigoRemover(null);
      setErro(falha.message);
    }
  }

  const visiveis = (artigos || []).filter((artigo) => contem(artigo.nome, pesquisa) || contem(artigo.categoria, pesquisa));

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

        <div className="linha-entre" style={{ marginTop: -4 }}>
          <div className="caixa-campo pesquisa" style={{ width: 340 }}>
            <Search size={18} />
            <input
              value={pesquisa}
              placeholder="Pesquisar por nome ou categoria"
              onChange={(evento) => setPesquisa(evento.target.value)}
            />
          </div>
          <span className="texto-cinza" style={{ fontSize: 13 }}>{artigos ? artigos.length : 0} artigos</span>
        </div>

        <EstadoCarregamento aCarregar={!artigos && !erro} erro={erro} />

        {artigos && (
          <div className="cartao cartao-sem-espaco">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Nome do artigo</th>
                  <th>Categoria</th>
                  <th className="acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.length === 0 && (
                  <tr><td colSpan={3} className="texto-cinza">Ainda não há artigos.</td></tr>
                )}
                {visiveis.map((artigo) => (
                  <tr key={artigo.idArtigo}>
                    <td><span className="linha forte" style={{ gap: 14 }}><IconeCategoria categoria={artigo.categoria} /> {artigo.nome}</span></td>
                    <td><span className={'etiqueta ' + corDaCategoria(artigo.categoria)}>{artigo.categoria}</span></td>
                    <td className="acoes">
                      <button type="button" className="botao-icone" title="Ver" onClick={() => navegar('/admin/artigos/' + artigo.idArtigo)}><Eye size={18} /></button>
                      <button type="button" className="botao-icone" title="Editar" onClick={() => setArtigoEditar(artigo)}><Pencil size={18} /></button>
                      <button type="button" className="botao-icone" title="Remover" onClick={() => setArtigoRemover(artigo)}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarAdicionar && <JanelaArtigo aoFechar={() => setMostrarAdicionar(false)} aoGuardar={guardarNovo} />}
      {artigoEditar && <JanelaArtigo artigo={artigoEditar} aoFechar={() => setArtigoEditar(null)} aoGuardar={guardarEdicao} />}

      {artigoRemover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover artigo?"
          texto={'O artigo ' + artigoRemover.nome + ' será removido do catálogo. Esta ação não pode ser anulada.'}
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
