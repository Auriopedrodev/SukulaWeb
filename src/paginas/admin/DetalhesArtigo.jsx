// =====================================================================
//  Ecrã S1 - Detalhes do artigo
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Palette, Pencil, Ruler, Tag, Trash2, WashingMachine } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento, ListaCores, ListaTamanhos } from '../../componentes/Basicos';
import { ModalConfirmacao } from '../../componentes/Modais';
import JanelaArtigo from './JanelaArtigo';
import { IconeCategoria } from './GestaoArtigos';
import { editarArtigo, listas, obterArtigo, removerArtigo } from '../../servicos/servicosAdmin';
import { corDaCategoria, formatarKz } from '../../utilidades';

export default function DetalhesArtigo() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [artigo, setArtigo] = useState(null);
  const [erro, setErro] = useState('');
  const [editar, setEditar] = useState(false);
  const [remover, setRemover] = useState(false);

  function carregar() {
    obterArtigo(id).then(setArtigo).catch((falha) => setErro(falha.message));
  }

  useEffect(carregar, [id]);

  async function guardarEdicao(dados) {
    await editarArtigo(id, dados);
    setEditar(false);
    carregar();
  }

  async function confirmarRemocao() {
    await removerArtigo(id);
    navegar('/admin/artigos');
  }

  if (!artigo) {
    return (
      <>
        <BarraSuperior titulo="Gestão de artigos" />
        <div className="conteudo"><EstadoCarregamento aCarregar erro={erro} /></div>
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

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'start' }}>
          <div className="cartao" style={{ padding: 24 }}>
            <IconeCategoria categoria={artigo.categoria} tamanho={28} />
            <h3 style={{ fontSize: 18, marginTop: 24 }}>{artigo.nome}</h3>
            <hr className="divisor" style={{ margin: '14px 0 18px' }} />
            <div className="coluna" style={{ gap: 20 }}>
              <div className="info-item"><IconeCategoria categoria={artigo.categoria} /><div><small>Nome do artigo</small><strong>{artigo.nome}</strong></div></div>
              <div className="info-item"><Tag size={18} className="icone" /><div><small>Categoria</small><span className={'etiqueta ' + corDaCategoria(artigo.categoria)}>{artigo.categoria}</span></div></div>
              <div className="info-item"><Palette size={18} className="icone" /><div><small>Cores</small><span style={{ fontSize: 12 }}><ListaCores cores={artigo.cores} /></span></div></div>
              <div className="info-item"><Ruler size={18} className="icone" /><div><small>Tamanhos</small><strong><ListaTamanhos tamanhos={artigo.tamanhos} /></strong></div></div>
            </div>
          </div>

          <div className="coluna" style={{ gap: 20 }}>
            <h3 className="titulo-cartao" style={{ marginBottom: -10 }}>Serviços que incluem este artigo</h3>
            <div className="cartao cartao-sem-espaco">
              <table className="tabela">
                <thead>
                  <tr><th>Serviço</th><th>Categoria</th><th>Preço base</th><th>Lavandarias</th></tr>
                </thead>
                <tbody>
                  {artigo.servicosDetalhados.length === 0 && (
                    <tr><td colSpan={4} className="texto-cinza">Este artigo ainda não pertence a nenhum serviço.</td></tr>
                  )}
                  {artigo.servicosDetalhados.map((servico) => (
                    <tr key={servico.id} style={{ cursor: 'pointer' }} onClick={() => navegar('/admin/servicos/' + servico.id)}>
                      <td><span className="linha forte" style={{ gap: 14 }}><WashingMachine size={18} /> {servico.nome}</span></td>
                      <td><span className={'etiqueta ' + corDaCategoria(servico.categoria)}>{servico.categoria}</span></td>
                      <td className="forte">{formatarKz(servico.precoBase)}</td>
                      <td>{servico.totalLavandarias} lavandarias</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cartao">
              <h3 className="titulo-cartao" style={{ fontSize: 14, marginBottom: 14 }}>Tamanhos e cores aceites</h3>
              <div className="escolhas">
                {listas.tamanhos.map((tamanho) => (
                  <span key={tamanho} className={'escolha' + (artigo.tamanhos.includes(tamanho) ? ' ativo' : '')}>{tamanho}</span>
                ))}
              </div>
              <div className="escolhas" style={{ marginTop: 12 }}>
                {listas.cores.map((cor) => (
                  <span key={cor.nome} className={'escolha' + (artigo.cores.includes(cor.nome) ? ' ativo' : '')}>
                    <span className="bola-cor" style={{ background: cor.codigo }} /> {cor.nome}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {editar && <JanelaArtigo artigo={artigo} aoFechar={() => setEditar(false)} aoGuardar={guardarEdicao} />}

      {remover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover artigo?"
          texto={'O artigo ' + artigo.nome + ' será retirado de todos os serviços em que está incluído. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover artigo"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setRemover(false)}
        />
      )}
    </>
  );
}
