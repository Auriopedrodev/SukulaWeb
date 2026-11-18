// =====================================================================
//  Ecrãs P a P5 - Gestão de clientes
//  Lista + janelas: Detalhes, Editar, Confirmar remoção e avisos.
// =====================================================================

import { useEffect, useState } from 'react';
import {
  Calendar, CircleCheck, Clock, Eye, MapPin, Package, Pencil, Search, Shield, Trash2, Upload, User, Check,
} from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Avatar, EstadoCarregamento, Paginacao, Seletor } from '../../componentes/Basicos';
import { CampoFoto, CampoSelecao, CampoTexto } from '../../componentes/Formulario';
import { AvisoFlutuante, Modal, ModalConfirmacao } from '../../componentes/Modais';
import { editarCliente, enviarFotoCliente, listarClientes, removerCliente } from '../../servicos/servicosAdmin';
import { formatarKz, formatarNota, formatarNumero } from '../../utilidades';
import { LINHAS_POR_PAGINA } from '../../configuracao';

export default function GestaoClientes() {
  // ---- Dados da lista ----
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [estado, setEstado] = useState(''); // '' = Todos, 'Ativo', 'Inativo'
  const [pagina, setPagina] = useState(1);

  // ---- Janelas abertas ----
  const [clienteVer, setClienteVer] = useState(null);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteRemover, setClienteRemover] = useState(null);
  const [aviso, setAviso] = useState(null);

  function carregar() {
    listarClientes(pesquisa, estado, pagina)
      .then(setResultado)
      .catch((falha) => setErro(falha.message));
  }

  // Volta a carregar sempre que a pesquisa, o filtro ou a página mudam
  useEffect(carregar, [pesquisa, estado, pagina]);

  async function guardarEdicao(dadosEditados, foto) {
    await editarCliente(clienteEditar.id, dadosEditados);
    if (foto) await enviarFotoCliente(clienteEditar.id, foto);
    setClienteEditar(null);
    setAviso({ titulo: 'Informação alterada com sucesso', texto: 'Os dados de ' + dadosEditados.nomeCompleto + ' foram atualizados.', icone: <CircleCheck size={20} /> });
    carregar();
  }

  async function confirmarRemocao() {
    await removerCliente(clienteRemover.id);
    setAviso({ titulo: 'Cliente removido', texto: clienteRemover.nomeCompleto + ' foi removido da lista de clientes.', icone: <Trash2 size={20} /> });
    setClienteRemover(null);
    carregar();
  }

  const totalPaginas = resultado ? Math.ceil(resultado.total / LINHAS_POR_PAGINA) : 1;
  const primeiro = resultado ? (pagina - 1) * LINHAS_POR_PAGINA + 1 : 0;
  const ultimo = resultado ? primeiro + resultado.itens.length - 1 : 0;

  return (
    <>
      <BarraSuperior titulo="Gestão de clientes" />

      <div className="conteudo">
        <h2 className="titulo-seccao">Clientes</h2>

        {/* Barra de ferramentas */}
        <div className="linha-entre">
          <div className="linha">
            <div className="caixa-campo pesquisa" style={{ width: 340 }}>
              <Search size={18} />
              <input
                value={pesquisa}
                placeholder="Pesquisar por nome"
                onChange={(evento) => {
                  setPesquisa(evento.target.value);
                  setPagina(1);
                }}
              />
            </div>
            <Seletor
              valor={estado}
              aoMudar={(valor) => {
                setEstado(valor);
                setPagina(1);
              }}
              opcoes={[
                { valor: '', texto: 'Todos' },
                { valor: 'Ativo', texto: 'Ativos' },
                { valor: 'Inativo', texto: 'Inativos' },
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
                  <th>Cliente</th>
                  <th>Morada</th>
                  <th>Estado</th>
                  <th className="acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {resultado.itens.map((cliente) => (
                  <tr key={cliente.id} className={clienteRemover && clienteRemover.id === cliente.id ? 'destacada' : ''}>
                    <td>
                      <div className="celula-pessoa">
                        <Avatar nome={cliente.nomeCompleto} fotoUrl={cliente.fotoUrl} tamanho={36} />
                        <strong>{cliente.nomeCompleto}</strong>
                      </div>
                    </td>
                    <td>{cliente.morada}</td>
                    <td>
                      <span className={'estado ' + (cliente.estado === 'Ativo' ? 'ativo' : 'inativo')}>{cliente.estado}</span>
                    </td>
                    <td className="acoes">
                      <button type="button" className="botao-icone" title="Ver detalhes" onClick={() => setClienteVer(cliente)}>
                        <Eye size={18} />
                      </button>
                      <button type="button" className="botao-icone" title="Editar" onClick={() => setClienteEditar(cliente)}>
                        <Pencil size={18} />
                      </button>
                      <button type="button" className="botao-icone" title="Remover" onClick={() => setClienteRemover(cliente)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="rodape-tabela">
              <span>
                A mostrar {primeiro}–{ultimo} de {formatarNumero(resultado.total)} clientes
              </span>
              <Paginacao pagina={pagina} totalPaginas={totalPaginas} aoMudar={setPagina} />
            </div>
          </div>
        )}
      </div>

      {/* ---------- Janela: Detalhes do cliente (P1) ---------- */}
      {clienteVer && (
        <Modal titulo="Detalhes do cliente" aoFechar={() => setClienteVer(null)} largura={1000}>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 18 }}>
            <div className="cartao" style={{ textAlign: 'center' }}>
              <Avatar nome={clienteVer.nomeCompleto} fotoUrl={clienteVer.fotoUrl} tamanho={88} />
              <h3 style={{ fontSize: 18, marginTop: 14 }}>{clienteVer.nomeCompleto}</h3>
              <p style={{ marginTop: 10 }}>
                <span className={'estado ' + (clienteVer.estado === 'Ativo' ? 'ativo' : 'inativo')}>{clienteVer.estado}</span>
              </p>
              <hr className="divisor" style={{ margin: '14px 0' }} />
              <div className="grelha-3" style={{ gap: 4 }}>
                <div>
                  <strong style={{ fontSize: 16 }}>{clienteVer.totalPedidos}</strong>
                  <p className="texto-cinza" style={{ fontSize: 11 }}>Pedidos</p>
                </div>
                <div>
                  <strong style={{ fontSize: 16 }}>{formatarKz(clienteVer.gastoTotal)}</strong>
                  <p className="texto-cinza" style={{ fontSize: 11 }}>Gasto total</p>
                </div>
                <div>
                  <strong style={{ fontSize: 16 }}>{formatarNota(clienteVer.avaliacao)}</strong>
                  <p className="texto-cinza" style={{ fontSize: 11 }}>Avaliação</p>
                </div>
              </div>
              <hr className="divisor" style={{ margin: '14px 0' }} />
              <div className="coluna" style={{ gap: 10, fontSize: 12, textAlign: 'left' }}>
                <span className="linha" style={{ gap: 8 }}><Calendar size={15} /> Cliente desde {clienteVer.clienteDesde}</span>
                <span className="linha" style={{ gap: 8 }}><Clock size={15} /> Último pedido: {clienteVer.ultimoPedido}</span>
                <span className="linha" style={{ gap: 8 }}><Package size={15} /> {clienteVer.pedidosEmProcessamento} pedido em processamento</span>
              </div>
            </div>

            <div className="cartao">
              <h3 className="titulo-cartao">Informações pessoais</h3>
              <div className="grelha-2" style={{ marginTop: 18, rowGap: 22 }}>
                <div className="info-item"><User size={18} className="icone" /><div><small>Nome completo</small><strong>{clienteVer.nomeCompleto}</strong></div></div>
                <div className="info-item"><MapPin size={18} className="icone" /><div><small>Morada</small><strong>{clienteVer.morada}</strong></div></div>
                <div className="info-item"><Shield size={18} className="icone" /><div><small>Perfil</small><strong>{clienteVer.perfil}</strong></div></div>
                <div className="info-item"><CircleCheck size={18} className="icone" /><div><small>Estado do perfil</small><strong>{clienteVer.estado}</strong></div></div>
                <div className="info-item"><Upload size={18} className="icone" /><div><small>Foto de perfil</small><strong>{clienteVer.fotoNome || '—'}</strong></div></div>
              </div>
            </div>
          </div>

          <div className="modal-rodape">
            <button type="button" className="botao botao-perigo-claro" onClick={() => { setClienteRemover(clienteVer); setClienteVer(null); }}>
              <Trash2 size={18} /> Remover
            </button>
            <button type="button" className="botao botao-primario" onClick={() => { setClienteEditar(clienteVer); setClienteVer(null); }}>
              <Pencil size={18} /> Editar cliente
            </button>
          </div>
        </Modal>
      )}

      {/* ---------- Janela: Editar cliente (P2) ---------- */}
      {clienteEditar && (
        <JanelaEditarCliente cliente={clienteEditar} aoFechar={() => setClienteEditar(null)} aoGuardar={guardarEdicao} />
      )}

      {/* ---------- Janela: Confirmar remoção (P4) ---------- */}
      {clienteRemover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover cliente?"
          texto={clienteRemover.nomeCompleto + ' será removido da plataforma Sukula. O histórico de ' + clienteRemover.totalPedidos + ' pedidos será mantido para efeitos de faturação. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover cliente"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setClienteRemover(null)}
        >
          <div className="celula-pessoa" style={{ background: 'var(--fundo)', borderRadius: 12, padding: 12, marginTop: 18, textAlign: 'left' }}>
            <Avatar nome={clienteRemover.nomeCompleto} tamanho={40} />
            <div>
              <strong>{clienteRemover.nomeCompleto}</strong>
              <small>{clienteRemover.morada}</small>
            </div>
          </div>
        </ModalConfirmacao>
      )}

      {/* ---------- Aviso no canto (P3 e P5) ---------- */}
      {aviso && <AvisoFlutuante icone={aviso.icone} titulo={aviso.titulo} texto={aviso.texto} aoFechar={() => setAviso(null)} />}
    </>
  );
}

// Formulário da janela "Editar cliente"
function JanelaEditarCliente({ cliente, aoFechar, aoGuardar }) {
  const [nomeCompleto, setNomeCompleto] = useState(cliente.nomeCompleto);
  const [morada, setMorada] = useState(cliente.morada);
  const [estado, setEstado] = useState(cliente.estado);
  const [foto, setFoto] = useState(null); // ficheiro da foto escolhida
  const [erro, setErro] = useState('');

  async function guardar() {
    if (!nomeCompleto.trim()) {
      setErro('O nome completo é obrigatório.');
      return;
    }
    try {
      await aoGuardar({ nomeCompleto, morada, estado }, foto);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <Modal titulo="Editar cliente" aoFechar={aoFechar} largura={780}>
      <div className="grelha-2" style={{ rowGap: 18 }}>
        <CampoTexto rotulo="Nome completo" obrigatorio icone={<User size={18} />} valor={nomeCompleto} aoMudar={setNomeCompleto} />
        <CampoTexto rotulo="Morada" icone={<MapPin size={18} />} valor={morada} aoMudar={setMorada} />
        <CampoTexto rotulo="Perfil" icone={<Shield size={18} />} valor={cliente.perfil} bloqueado aoMudar={() => {}} />
        <CampoSelecao rotulo="Estado do perfil" icone={<CircleCheck size={18} />} valor={estado} aoMudar={setEstado} opcoes={['Ativo', 'Inativo']} />
      </div>
      <div style={{ marginTop: 18 }}>
        <CampoFoto nomeAtual={cliente.fotoNome} aoEscolher={setFoto} />
      </div>
      {erro && <p className="mensagem-erro" style={{ marginTop: 12 }}>{erro}</p>}
      <div className="modal-rodape">
        <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
        <button type="button" className="botao botao-primario" onClick={guardar}>
          <Check size={18} /> Guardar alterações
        </button>
      </div>
    </Modal>
  );
}
