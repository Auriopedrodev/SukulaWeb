// =====================================================================
//  Ecrã R1 - Detalhes do serviço
// =====================================================================

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CreditCard, Pencil, Shirt, Store, Tag, Trash2, WashingMachine } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Avatar, EstadoCarregamento, ListaCores, ListaTamanhos } from '../../componentes/Basicos';
import { ModalConfirmacao } from '../../componentes/Modais';
import { obterServico, removerServico } from '../../servicos/servicosAdmin';
import { corDaCategoria, formatarKz } from '../../utilidades';

export default function DetalhesServico() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [servico, setServico] = useState(null);
  const [erro, setErro] = useState('');
  const [remover, setRemover] = useState(false);

  useEffect(() => {
    obterServico(id).then(setServico).catch((falha) => setErro(falha.message));
  }, [id]);

  async function confirmarRemocao() {
    await removerServico(id);
    navegar('/admin/servicos');
  }

  if (!servico) {
    return (
      <>
        <BarraSuperior titulo="Gestão de serviços" />
        <div className="conteudo"><EstadoCarregamento aCarregar erro={erro} /></div>
      </>
    );
  }

  return (
    <>
      <BarraSuperior titulo="Gestão de serviços" />

      <div className="conteudo">
        <div className="cabecalho-pagina">
          <div>
            <button type="button" className="ligacao-voltar" onClick={() => navegar('/admin/servicos')}>
              <ChevronLeft size={16} /> Voltar aos serviços
            </button>
            <h2 className="titulo-seccao" style={{ fontSize: 20 }}>{servico.nome}</h2>
          </div>
          <div className="linha">
            <button type="button" className="botao botao-perigo-claro" onClick={() => setRemover(true)}>
              <Trash2 size={18} /> Remover
            </button>
            <button type="button" className="botao botao-primario" onClick={() => navegar('/admin/servicos/' + id + '/editar')}>
              <Pencil size={18} /> Editar serviço
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Cartão com o resumo do serviço */}
          <div className="cartao" style={{ padding: 24 }}>
            <WashingMachine size={28} />
            <h3 style={{ fontSize: 18, marginTop: 24 }}>{servico.nome}</h3>
            <p style={{ marginTop: 8 }}>
              <span className={'estado ' + (servico.ativo ? 'ativo' : 'inativo')}>{servico.ativo ? 'Ativo' : 'Inativo'}</span>
            </p>
            <hr className="divisor" style={{ margin: '18px 0' }} />
            <div className="coluna" style={{ gap: 20 }}>
              <div className="info-item"><WashingMachine size={18} className="icone" /><div><small>Nome do serviço</small><strong>{servico.nome}</strong></div></div>
              <div className="info-item"><Tag size={18} className="icone" /><div><small>Categoria</small><span className={'etiqueta ' + corDaCategoria(servico.categoria)}>{servico.categoria}</span></div></div>
              <div className="info-item"><CreditCard size={18} className="icone" /><div><small>Preço base</small><strong>{formatarKz(servico.precoBase)} / peça</strong></div></div>
              <div className="info-item"><Store size={18} className="icone" /><div><small>Disponível em</small><strong>{servico.totalLavandarias} lavandarias</strong></div></div>
            </div>
          </div>

          <div className="coluna" style={{ gap: 20 }}>
            <h3 className="titulo-cartao" style={{ marginBottom: -10 }}>Artigos do serviço</h3>
            <div className="cartao cartao-sem-espaco">
              <table className="tabela">
                <thead>
                  <tr><th>Nome</th><th>Cores</th><th>Tamanhos</th></tr>
                </thead>
                <tbody>
                  {servico.artigosDetalhados.map((artigo) => (
                    <tr key={artigo.id}>
                      <td><span className="linha forte" style={{ gap: 14 }}><Shirt size={18} /> {artigo.nome}</span></td>
                      <td><ListaCores cores={artigo.cores} /></td>
                      <td className="forte"><ListaTamanhos tamanhos={artigo.tamanhos} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cartao">
              <div className="linha-entre">
                <h3 className="titulo-cartao" style={{ fontSize: 14 }}>Lavandarias que oferecem este serviço</h3>
                <Link to="/admin/lavandarias" className="texto-pequeno">Ver todas ({servico.totalLavandarias})</Link>
              </div>
              <div className="grelha-3" style={{ marginTop: 14, gap: 10 }}>
                {servico.lavandarias.map((lavandaria) => (
                  <Link key={lavandaria.id} to={'/admin/lavandarias/' + lavandaria.id} className="celula-pessoa" style={{ background: 'var(--fundo)', borderRadius: 10, padding: 10, color: 'var(--azul)' }}>
                    {lavandaria.fotoUrl ? (
                      <img src={lavandaria.fotoUrl} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <Avatar nome={lavandaria.nome} tamanho={40} />
                    )}
                    <div>
                      <strong style={{ fontSize: 12 }}>{lavandaria.nome}</strong>
                      <small>{lavandaria.localizacao}</small>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {remover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover serviço?"
          texto={'O serviço ' + servico.nome + ' deixará de estar disponível nas ' + servico.totalLavandarias + ' lavandarias que o oferecem. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover serviço"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setRemover(false)}
        />
      )}
    </>
  );
}
