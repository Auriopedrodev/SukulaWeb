// =====================================================================
//  Ecrãs Q, Q2, Q2.1, Q3, Q4, Q4.1 - Gestão de lavandarias (lista em cartões)
// =====================================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CircleCheck, Clock, MapPin, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Avatar, EstadoCarregamento, Interruptor } from '../../componentes/Basicos';
import { AvisoFlutuante, ModalConfirmacao } from '../../componentes/Modais';
import JanelaLavandaria from './JanelaLavandaria';
import {
  adicionarLavandaria, alterarEstadoLavandaria, editarLavandaria, enviarFotoLavandaria, listarLavandarias, removerLavandaria,
} from '../../servicos/servicosAdmin';
import { formatarNota } from '../../utilidades';

export default function GestaoLavandarias() {
  const [lavandarias, setLavandarias] = useState(null);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');

  const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
  const [lavandariaEditar, setLavandariaEditar] = useState(null);
  const [lavandariaRemover, setLavandariaRemover] = useState(null);
  const [aviso, setAviso] = useState(null);

  function carregar() {
    listarLavandarias(pesquisa).then(setLavandarias).catch((falha) => setErro(falha.message));
  }

  useEffect(carregar, [pesquisa]);

  async function guardarNova(dados, foto) {
    const nova = await adicionarLavandaria(dados);
    if (foto) await enviarFotoLavandaria(nova.id, foto);
    setMostrarAdicionar(false);
    setAviso({ titulo: 'Lavandaria adicionada', texto: dados.nome + ' foi adicionada e já aparece na aplicação.' });
    carregar();
  }

  async function guardarEdicao(dados, foto) {
    await editarLavandaria(lavandariaEditar.id, dados);
    if (foto) await enviarFotoLavandaria(lavandariaEditar.id, foto);
    setLavandariaEditar(null);
    setAviso({ titulo: 'Alterações guardadas', texto: 'Os dados de ' + dados.nome + ' foram atualizados.' });
    carregar();
  }

  async function confirmarRemocao() {
    await removerLavandaria(lavandariaRemover.id);
    setAviso({ titulo: 'Lavandaria removida', texto: lavandariaRemover.nome + ' foi removida da plataforma.', remover: true });
    setLavandariaRemover(null);
    carregar();
  }

  async function mudarEstado(lavandaria, ativa) {
    await alterarEstadoLavandaria(lavandaria.id, ativa);
    carregar();
  }

  return (
    <>
      <BarraSuperior titulo="Gestão de lavandarias" />

      <div className="conteudo">
        <div className="linha-entre">
          <h2 className="titulo-seccao">Lavandarias</h2>
          <button type="button" className="botao botao-primario" onClick={() => setMostrarAdicionar(true)}>
            <Plus size={18} /> Adicionar lavandaria
          </button>
        </div>

        <div className="linha-entre" style={{ marginTop: -4 }}>
          <div className="caixa-campo pesquisa" style={{ width: 340 }}>
            <Search size={18} />
            <input value={pesquisa} placeholder="Pesquisar lavandaria ou localização" onChange={(evento) => setPesquisa(evento.target.value)} />
          </div>
        </div>

        <EstadoCarregamento aCarregar={!lavandarias} erro={erro} />

        {lavandarias && (
          <div className="grelha-3">
            {lavandarias.map((lavandaria) => (
              <div
                key={lavandaria.id}
                className="cartao"
                style={{ padding: 18, borderColor: lavandariaRemover && lavandariaRemover.id === lavandaria.id ? 'var(--azul-medio)' : undefined, borderWidth: lavandariaRemover && lavandariaRemover.id === lavandaria.id ? 3 : 1 }}
              >
                <div className="linha" style={{ alignItems: 'flex-start' }}>
                  <Avatar nome={lavandaria.nome} fotoUrl={lavandaria.logoUrl} logo tamanho={44} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 14 }}>{lavandaria.nome}</strong>
                    <p className="linha texto-cinza" style={{ gap: 4, fontSize: 12, marginTop: 3 }}>
                      <MapPin size={13} /> {lavandaria.localizacao}
                    </p>
                  </div>
                  <span className="estrela" style={{ fontSize: 12 }}>
                    <Star size={14} color="var(--azul)" /> {lavandaria.avaliacao ? formatarNota(lavandaria.avaliacao) : '—'}
                  </span>
                </div>

                <p className="linha" style={{ gap: 6, fontSize: 12, marginTop: 14 }}>
                  <Clock size={14} /> {lavandaria.horarioResumo}
                </p>

                <div className="linha-entre" style={{ marginTop: 12 }}>
                  <div className="linha" style={{ gap: 6 }}>
                    {lavandaria.categorias.map((categoria) => (
                      <span key={categoria} className="etiqueta azul">{categoria}</span>
                    ))}
                  </div>
                  <span className="texto-cinza" style={{ fontSize: 12, fontWeight: 600 }}>{lavandaria.totalServicos} serviços</span>
                </div>

                <hr className="divisor" style={{ margin: '14px 0' }} />

                <div className="linha-entre">
                  <Link to={'/admin/lavandarias/' + lavandaria.id} className="botao-ligacao">
                    Ver detalhes <ChevronRight size={14} />
                  </Link>
                  <div className="linha" style={{ gap: 6 }}>
                    <Interruptor ligado={lavandaria.ativa} aoMudar={(valor) => mudarEstado(lavandaria, valor)} />
                    <span className={lavandaria.ativa ? 'texto-verde' : 'texto-cinza'} style={{ fontSize: 12, fontWeight: 700, width: 44 }}>
                      {lavandaria.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                    <button type="button" className="botao-icone" title="Editar" onClick={() => setLavandariaEditar(lavandaria)}>
                      <Pencil size={17} />
                    </button>
                    <button type="button" className="botao-icone" title="Remover" onClick={() => setLavandariaRemover(lavandaria)}>
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {mostrarAdicionar && <JanelaLavandaria aoFechar={() => setMostrarAdicionar(false)} aoGuardar={guardarNova} />}
      {lavandariaEditar && <JanelaLavandaria lavandaria={lavandariaEditar} aoFechar={() => setLavandariaEditar(null)} aoGuardar={guardarEdicao} />}

      {lavandariaRemover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover lavandaria?"
          texto={'A ' + lavandariaRemover.nome + ' deixará de aparecer na aplicação e os seus serviços, artigos e fotografias serão removidos. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover lavandaria"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setLavandariaRemover(null)}
        >
          <div className="celula-pessoa" style={{ background: 'var(--fundo)', borderRadius: 12, padding: 12, marginTop: 18, textAlign: 'left' }}>
            {lavandariaRemover.fotoUrl ? (
              <img src={lavandariaRemover.fotoUrl} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <Avatar nome={lavandariaRemover.nome} tamanho={44} />
            )}
            <div>
              <strong>{lavandariaRemover.nome}</strong>
              <small>{lavandariaRemover.localizacao} · {lavandariaRemover.totalServicos} serviços</small>
            </div>
          </div>
        </ModalConfirmacao>
      )}

      {aviso && (
        <AvisoFlutuante
          icone={aviso.remover ? <Trash2 size={20} /> : <CircleCheck size={20} />}
          titulo={aviso.titulo}
          texto={aviso.texto}
          aoFechar={() => setAviso(null)}
        />
      )}
    </>
  );
}
