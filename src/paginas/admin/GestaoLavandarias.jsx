// =====================================================================
//  Gestão de lavandarias
// =====================================================================

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CircleCheck, Clock, MapPin, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento } from '../../componentes/Basicos';
import { AvisoFlutuante, ModalConfirmacao } from '../../componentes/Modais';
import JanelaLavandaria from './JanelaLavandaria';
import { adicionarLavandaria, editarLavandaria, listarLavandarias, removerLavandaria, urlDaFoto } from '../../servicos/servicosAdmin';

function contem(texto, pesquisa) {
  return String(texto || '').toLowerCase().includes(String(pesquisa || '').toLowerCase());
}

export default function GestaoLavandarias() {
  const navegar = useNavigate();
  const [lavandarias, setLavandarias] = useState(null);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');

  const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
  const [lavandariaEditar, setLavandariaEditar] = useState(null);
  const [lavandariaRemover, setLavandariaRemover] = useState(null);
  const [aviso, setAviso] = useState(null);

  function carregar() {
    setErro('');
    listarLavandarias().then(setLavandarias).catch((falha) => setErro(falha.message));
  }

  useEffect(carregar, []);

  async function guardarNova(dados, foto) {
    const criada = await adicionarLavandaria(dados, foto);
    setMostrarAdicionar(false);
    const destino = new URLSearchParams({
      lavandariaId: criada.idLavandaria,
      nomeLavandaria: criada.nomeLavandaria || '',
    });
    navegar('/admin/clientes?' + destino.toString());
  }

  async function guardarEdicao(dados, foto) {
    await editarLavandaria(lavandariaEditar.idLavandaria, dados, foto);
    setLavandariaEditar(null);
    setAviso({ titulo: 'Alterações guardadas', texto: 'Os dados de ' + dados.nomeLavandaria + ' foram atualizados.' });
    carregar();
  }

  async function confirmarRemocao() {
    try {
      await removerLavandaria(lavandariaRemover.idLavandaria);
      setAviso({ titulo: 'Lavandaria removida', texto: lavandariaRemover.nomeLavandaria + ' foi removida.', remover: true });
      setLavandariaRemover(null);
      carregar();
    } catch (falha) {
      setLavandariaRemover(null);
      setErro(falha.message);
    }
  }

  const visiveis = (lavandarias || []).filter((lavandaria) => contem(lavandaria.nomeLavandaria, pesquisa) || contem(lavandaria.endereco, pesquisa) || contem(lavandaria.descricao, pesquisa));

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
            <input value={pesquisa} placeholder="Pesquisar por nome ou endereço" onChange={(evento) => setPesquisa(evento.target.value)} />
          </div>
        </div>

        <EstadoCarregamento aCarregar={!lavandarias && !erro} erro={erro} />

        {lavandarias && visiveis.length === 0 && (
          <p className="texto-cinza">Não há lavandarias.</p>
        )}

        {lavandarias && (
          <div className="grelha-3">
            {visiveis.map((lavandaria) => (
              <div key={lavandaria.idLavandaria} className="cartao" style={{ padding: 18 }}>
                <div className="linha" style={{ alignItems: 'flex-start', gap: 12 }}>
                  {lavandaria.foto ? (
                    <img src={urlDaFoto(lavandaria.foto)} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                  ) : (
                    <span className="icone-quadrado"><MapPin size={22} /></span>
                  )}
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: 14 }}>{lavandaria.nomeLavandaria}</strong>
                    <p className="texto-cinza" style={{ fontSize: 12, marginTop: 4 }}>{lavandaria.endereco}</p>
                    <p className="linha texto-cinza" style={{ gap: 4, fontSize: 12, marginTop: 6 }}>
                      <Clock size={13} /> {lavandaria.horarioFuncionamento}
                    </p>
                  </div>
                </div>

                <p className="texto-cinza" style={{ fontSize: 13, marginTop: 12 }}>{lavandaria.descricao}</p>
                <p className="texto-cinza" style={{ fontSize: 12, marginTop: 8 }}>
                  {lavandaria.latitude}, {lavandaria.longitude}
                </p>

                <hr className="divisor" style={{ margin: '14px 0' }} />

                <div className="linha-entre">
                  <Link to={'/admin/lavandarias/' + lavandaria.idLavandaria} className="botao-ligacao">
                    Ver detalhes <ChevronRight size={14} />
                  </Link>
                  <div className="linha" style={{ gap: 6 }}>
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
          texto={'A lavandaria ' + lavandariaRemover.nomeLavandaria + ' e a sua fotografia serão removidas. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover lavandaria"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setLavandariaRemover(null)}
        />
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
