// =====================================================================
//  Detalhes do artigo
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Pencil, Tag, Trash2 } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento } from '../../componentes/Basicos';
import { ModalConfirmacao } from '../../componentes/Modais';
import JanelaArtigo from './JanelaArtigo';
import { IconeCategoria } from './GestaoArtigos';
import { editarArtigo, obterArtigo, removerArtigo } from '../../servicos/servicosAdmin';
import { corDaCategoria } from '../../utilidades';

export default function DetalhesArtigo() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [artigo, setArtigo] = useState(null);
  const [erro, setErro] = useState('');
  const [editar, setEditar] = useState(false);
  const [remover, setRemover] = useState(false);

  function carregar() {
    setErro('');
    obterArtigo(id).then(setArtigo).catch((falha) => setErro(falha.message));
  }

  useEffect(carregar, [id]);

  async function guardarEdicao(dados) {
    await editarArtigo(id, dados);
    setEditar(false);
    carregar();
  }

  async function confirmarRemocao() {
    try {
      await removerArtigo(id);
      navegar('/admin/artigos');
    } catch (falha) {
      setRemover(false);
      setErro(falha.message);
    }
  }

  if (!artigo) {
    return (
      <>
        <BarraSuperior titulo="Gestão de artigos" />
        <div className="conteudo"><EstadoCarregamento aCarregar={!erro} erro={erro} /></div>
      </>
    );
  }

  return (
    <>
      <BarraSuperior titulo="Gestão de artigos" />

      <div className="conteudo">
        <div className="cabecalho-pagina">
          <div>
            <button type="button" className="ligacao-voltar" onClick={() => navegar('/admin/artigos')}>
              <ChevronLeft size={16} /> Voltar aos artigos
            </button>
            <h2 className="titulo-seccao" style={{ fontSize: 20 }}>{artigo.nome}</h2>
          </div>
          <div className="linha">
            <button type="button" className="botao botao-perigo-claro" onClick={() => setRemover(true)}>
              <Trash2 size={18} /> Remover
            </button>
            <button type="button" className="botao botao-primario" onClick={() => setEditar(true)}>
              <Pencil size={18} /> Editar artigo
            </button>
          </div>
        </div>

        {erro && <EstadoCarregamento erro={erro} />}

        <div className="cartao" style={{ padding: 24, maxWidth: 480 }}>
          <IconeCategoria categoria={artigo.categoria} tamanho={28} />
          <h3 style={{ fontSize: 18, marginTop: 24 }}>{artigo.nome}</h3>
          <hr className="divisor" style={{ margin: '14px 0 18px' }} />
          <div className="coluna" style={{ gap: 20 }}>
            <div className="info-item"><IconeCategoria categoria={artigo.categoria} /><div><small>Nome do artigo</small><strong>{artigo.nome}</strong></div></div>
            <div className="info-item"><Tag size={18} className="icone" /><div><small>Categoria</small><span className={'etiqueta ' + corDaCategoria(artigo.categoria)}>{artigo.categoria}</span></div></div>
          </div>
        </div>
      </div>

      {editar && <JanelaArtigo artigo={artigo} aoFechar={() => setEditar(false)} aoGuardar={guardarEdicao} />}

      {remover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover artigo?"
          texto={'O artigo ' + artigo.nome + ' será removido do catálogo. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover artigo"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setRemover(false)}
        />
      )}
    </>
  );
}
