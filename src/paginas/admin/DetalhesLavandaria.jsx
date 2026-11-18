// =====================================================================
//  Ecrã Q1 - Detalhes da lavandaria
// =====================================================================

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Clock, Info, MapPin, Pencil, Plus, Store, Trash2, WashingMachine } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Avatar, EstadoCarregamento, Interruptor } from '../../componentes/Basicos';
import { ModalConfirmacao } from '../../componentes/Modais';
import JanelaLavandaria from './JanelaLavandaria';
import { alterarEstadoLavandaria, editarLavandaria, enviarFotoLavandaria, obterLavandaria, removerLavandaria } from '../../servicos/servicosAdmin';
import { corDaCategoria, formatarKz } from '../../utilidades';

export default function DetalhesLavandaria() {
  const { id } = useParams(); // número que vem no endereço /admin/lavandarias/1
  const navegar = useNavigate();

  const [lavandaria, setLavandaria] = useState(null);
  const [erro, setErro] = useState('');
  const [editar, setEditar] = useState(false);
  const [remover, setRemover] = useState(false);

  function carregar() {
    obterLavandaria(id).then(setLavandaria).catch((falha) => setErro(falha.message));
  }

  useEffect(carregar, [id]);

  async function guardarEdicao(dados, foto) {
    await editarLavandaria(lavandaria.id, dados);
    if (foto) await enviarFotoLavandaria(lavandaria.id, foto);
    setEditar(false);
    carregar();
  }

  async function confirmarRemocao() {
    await removerLavandaria(lavandaria.id);
    navegar('/admin/lavandarias');
  }

  async function mudarEstado(ativa) {
    await alterarEstadoLavandaria(lavandaria.id, ativa);
    carregar();
  }

  if (!lavandaria) {
    return (
      <>
        <BarraSuperior titulo="Gestão de lavandarias" />
        <div className="conteudo"><EstadoCarregamento aCarregar erro={erro} /></div>
      </>
    );
  }

  return (
    <>
      <BarraSuperior titulo="Gestão de lavandarias" />

      <div className="conteudo">
        <div className="cabecalho-pagina">
          <div>
            <button type="button" className="ligacao-voltar" onClick={() => navegar('/admin/lavandarias')}>
              <ChevronLeft size={16} /> Voltar às lavandarias
            </button>
            <h2 className="titulo-seccao" style={{ fontSize: 20 }}>{lavandaria.nome}</h2>
          </div>
          <div className="linha">
            <button type="button" className="botao botao-perigo-claro" onClick={() => setRemover(true)}>
              <Trash2 size={18} /> Remover
            </button>
            <button type="button" className="botao botao-primario" onClick={() => setEditar(true)}>
              <Pencil size={18} /> Editar lavandaria
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16 }}>
          {/* Foto de perfil */}
          <div className="cartao" style={{ padding: 24, textAlign: 'center' }}>
            <h3 className="titulo-cartao" style={{ textAlign: 'left' }}>Foto de perfil</h3>
            <div style={{ margin: '24px 0 16px' }}>
              <Avatar nome={lavandaria.nome} fotoUrl={lavandaria.logoUrl} logo={Boolean(lavandaria.logoUrl)} tamanho={140} />
            </div>
            <strong style={{ fontSize: 16 }}>{lavandaria.nome}</strong>
            <p className="texto-cinza" style={{ fontSize: 13, margin: '10px 0' }}>{lavandaria.localizacao}</p>
            <div className="linha" style={{ justifyContent: 'center', gap: 8 }}>
              <Interruptor ligado={lavandaria.ativa} aoMudar={mudarEstado} />
              <span className={lavandaria.ativa ? 'texto-verde' : 'texto-cinza'} style={{ fontSize: 12, fontWeight: 700 }}>
                {lavandaria.ativa ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          </div>

          {/* Informações */}
          <div className="cartao" style={{ padding: 24 }}>
            <h3 className="titulo-cartao">Informações</h3>
            <div className="coluna" style={{ gap: 18, marginTop: 20 }}>
              <div className="info-item"><Store size={18} className="icone" /><div><small>Nome</small><strong>{lavandaria.nome}</strong></div></div>
              <div className="info-item"><MapPin size={18} className="icone" /><div><small>Localização</small><strong>{lavandaria.moradaCompleta}</strong></div></div>
              <div className="info-item"><Info size={18} className="icone" /><div><small>Descrição</small><strong>{lavandaria.descricao}</strong></div></div>
              <div className="info-item">
                <Clock size={18} className="icone" />
                <div style={{ flex: 1 }}>
                  <small>Horário de funcionamento</small>
                  {lavandaria.horario.map((linha) => (
                    <div key={linha.dias} className="linha-entre" style={{ fontSize: 13, marginTop: 6 }}>
                      <span className="texto-cinza">{linha.dias}</span>
                      <strong style={{ fontSize: 13 }}>{linha.horas}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Serviços da lavandaria */}
        <div className="linha-entre">
          <h3 className="titulo-cartao" style={{ fontSize: 16 }}>Serviços da lavandaria</h3>
          <button type="button" className="botao botao-claro" onClick={() => setEditar(true)}>
            <Plus size={18} /> Adicionar serviço
          </button>
        </div>

        <div className="cartao cartao-sem-espaco" style={{ marginTop: -6 }}>
          <table className="tabela">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Categoria</th>
                <th>Artigos</th>
                <th>Preço</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lavandaria.servicos.length === 0 && (
                <tr><td colSpan={5} className="texto-cinza">Esta lavandaria ainda não tem serviços.</td></tr>
              )}
              {lavandaria.servicos.map((servico) => (
                <tr key={servico.id}>
                  <td>
                    <span className="linha forte" style={{ gap: 14 }}><WashingMachine size={18} /> {servico.nome}</span>
                  </td>
                  <td><span className={'etiqueta ' + corDaCategoria(servico.categoria)}>{servico.categoria}</span></td>
                  <td>
                    <div className="linha" style={{ gap: 6, flexWrap: 'wrap' }}>
                      {servico.artigos.map((artigo) => <span key={artigo} className="etiqueta contorno">{artigo}</span>)}
                    </div>
                  </td>
                  <td>
                    <strong>{formatarKz(servico.preco)}</strong> <span className="texto-cinza" style={{ fontSize: 11 }}>/ peça</span>
                  </td>
                  <td className="acoes">
                    <button type="button" className="botao-icone" onClick={() => setEditar(true)}><Pencil size={17} /></button>
                    <button type="button" className="botao-icone" onClick={() => setEditar(true)}><Trash2 size={17} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editar && <JanelaLavandaria lavandaria={lavandaria} aoFechar={() => setEditar(false)} aoGuardar={guardarEdicao} />}

      {remover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover lavandaria?"
          texto={'A ' + lavandaria.nome + ' deixará de aparecer na aplicação e os seus serviços, artigos e fotografias serão removidos. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover lavandaria"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setRemover(false)}
        />
      )}
    </>
  );
}
