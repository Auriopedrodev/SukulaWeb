// =====================================================================
//  Ecrãs T a T4.1 - Gestão de entregadores
//  Lista + janelas: Detalhes, Adicionar, Editar, Remover e avisos.
// =====================================================================

import { useEffect, useState } from 'react';
import {
  Bike, Calendar, Car, Check, CircleCheck, Clock, CreditCard, Eye, IdCard, Info, Lock, Mail, MapPin, Pencil, Phone, Plus, Search, Star, Store, Trash2, User,
} from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Avatar, EstadoCarregamento, Interruptor, Paginacao } from '../../componentes/Basicos';
import { CampoPalavraPasse, CampoSelecao, CampoTexto, FotoEditavel } from '../../componentes/Formulario';
import { AvisoFlutuante, Modal, ModalConfirmacao } from '../../componentes/Modais';
import {
  adicionarEntregador, editarEntregador, enviarFotoEntregador, listarEntregadores, listarLavandarias, listas, removerEntregador,
} from '../../servicos/servicosAdmin';
import { formatarNota } from '../../utilidades';
import { LINHAS_POR_PAGINA } from '../../configuracao';

export default function GestaoEntregadores() {
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [pagina, setPagina] = useState(1);

  const [entregadorVer, setEntregadorVer] = useState(null);
  const [mostrarAdicionar, setMostrarAdicionar] = useState(false);
  const [entregadorEditar, setEntregadorEditar] = useState(null);
  const [entregadorRemover, setEntregadorRemover] = useState(null);
  const [aviso, setAviso] = useState(null);

  function carregar() {
    listarEntregadores(pesquisa, pagina).then(setResultado).catch((falha) => setErro(falha.message));
  }

  useEffect(carregar, [pesquisa, pagina]);

  async function guardarNovo(dados, foto) {
    const novo = await adicionarEntregador(dados);
    if (foto) await enviarFotoEntregador(novo.id, foto);
    setMostrarAdicionar(false);
    setAviso({ titulo: 'Entregador adicionado', texto: dados.nomeCompleto + ' foi adicionado e vai receber os dados de acesso por SMS.' });
    carregar();
  }

  async function guardarEdicao(dados, foto) {
    await editarEntregador(entregadorEditar.id, dados);
    if (foto) await enviarFotoEntregador(entregadorEditar.id, foto);
    setEntregadorEditar(null);
    setAviso({ titulo: 'Alterações guardadas', texto: 'Os dados de ' + dados.nomeCompleto + ' foram atualizados.' });
    carregar();
  }

  async function confirmarRemocao() {
    await removerEntregador(entregadorRemover.id);
    setAviso({ titulo: 'Entregador removido', texto: entregadorRemover.nomeCompleto + ' foi removido da lista de entregadores.', remover: true });
    setEntregadorRemover(null);
    carregar();
  }

  const totalPaginas = resultado ? Math.ceil(resultado.total / LINHAS_POR_PAGINA) : 1;
  const primeiro = (pagina - 1) * LINHAS_POR_PAGINA + 1;

  return (
    <>
      <BarraSuperior titulo="Gestão de entregadores" />

      <div className="conteudo">
        <div className="linha-entre">
          <h2 className="titulo-seccao">Entregadores</h2>
          <button type="button" className="botao botao-primario" onClick={() => setMostrarAdicionar(true)}>
            <Plus size={18} /> Adicionar entregador
          </button>
        </div>

        {resultado && (
          <div className="grelha-4" style={{ marginTop: -4 }}>
            <div className="cartao cartao-indicador">
              <span className="icone-quadrado"><Bike size={22} /></span>
              <div><p className="rotulo">Total</p><p className="valor">{resultado.total}</p></div>
            </div>
          </div>
        )}

        <div className="caixa-campo pesquisa" style={{ width: 340 }}>
          <Search size={18} />
          <input
            value={pesquisa}
            placeholder="Pesquisar entregador ou telefone"
            onChange={(evento) => {
              setPesquisa(evento.target.value);
              setPagina(1);
            }}
          />
        </div>

        <EstadoCarregamento aCarregar={!resultado} erro={erro} />

        {resultado && (
          <div className="cartao cartao-sem-espaco">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Entregador</th>
                  <th>Veículo</th>
                  <th>Matrícula</th>
                  <th>Avaliação</th>
                  <th>Estado</th>
                  <th className="acoes">Ações</th>
                </tr>
              </thead>
              <tbody>
                {resultado.itens.map((entregador) => (
                  <tr key={entregador.id}>
                    <td>
                      <div className="celula-pessoa">
                        <Avatar nome={entregador.nomeCompleto} fotoUrl={entregador.fotoUrl} tamanho={36} />
                        <div>
                          <strong>{entregador.nomeCompleto}</strong>
                          <small>{entregador.telefone}</small>
                        </div>
                      </div>
                    </td>
                    <td>{entregador.tipoVeiculo}</td>
                    <td>{entregador.matricula || '—'}</td>
                    <td><span className="estrela" style={{ color: 'var(--azul)' }}><Star size={15} color="var(--azul)" /> {formatarNota(entregador.avaliacao)}</span></td>
                    <td>
                      {/* Só mostra o estado. Para o mudar, use "Editar entregador". */}
                      <span className={'estado ' + (entregador.ativo ? 'ativo' : 'inativo')}>{entregador.ativo ? 'Ativo' : 'Inativo'}</span>
                    </td>
                    <td className="acoes">
                      <button type="button" className="botao-icone" title="Ver" onClick={() => setEntregadorVer(entregador)}><Eye size={18} /></button>
                      <button type="button" className="botao-icone" title="Editar" onClick={() => setEntregadorEditar(entregador)}><Pencil size={18} /></button>
                      <button type="button" className="botao-icone" title="Remover" onClick={() => setEntregadorRemover(entregador)}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="rodape-tabela">
              <span>A mostrar {primeiro}–{primeiro + resultado.itens.length - 1} de {resultado.total} entregadores</span>
              <Paginacao pagina={pagina} totalPaginas={totalPaginas} aoMudar={setPagina} />
            </div>
          </div>
        )}
      </div>

      {/* ---------- Janela: Detalhes do entregador (T1) ---------- */}
      {entregadorVer && (
        <Modal titulo="Detalhes do entregador" aoFechar={() => setEntregadorVer(null)} largura={1000}>
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 18 }}>
            <div className="cartao" style={{ textAlign: 'center' }}>
              <Avatar nome={entregadorVer.nomeCompleto} fotoUrl={entregadorVer.fotoUrl} tamanho={88} />
              <h3 style={{ fontSize: 18, marginTop: 14 }}>{entregadorVer.nomeCompleto}</h3>
              <p className="texto-cinza" style={{ fontSize: 12, marginTop: 4 }}>{entregadorVer.utilizador}</p>
              <p style={{ marginTop: 10 }}>
                <span className={'estado ' + (entregadorVer.ativo ? 'ativo' : 'inativo')}>{entregadorVer.ativo ? 'Ativo' : 'Inativo'}</span>
              </p>
              <hr className="divisor" style={{ margin: '14px 0' }} />
              <div className="grelha-3" style={{ gap: 4 }}>
                <div><strong style={{ fontSize: 16 }}>{entregadorVer.totalEntregas}</strong><p className="texto-cinza" style={{ fontSize: 11 }}>Entregas</p></div>
                <div><strong style={{ fontSize: 16 }}>{formatarNota(entregadorVer.avaliacao)}</strong><p className="texto-cinza" style={{ fontSize: 11 }}>Avaliação</p></div>
                <div><strong style={{ fontSize: 16 }}>{entregadorVer.taxaSucesso}%</strong><p className="texto-cinza" style={{ fontSize: 11 }}>Sucesso</p></div>
              </div>
              <hr className="divisor" style={{ margin: '14px 0' }} />
              <div className="coluna" style={{ gap: 10, fontSize: 12, textAlign: 'left' }}>
                <span className="linha" style={{ gap: 8 }}><Calendar size={15} /> Entregador desde {entregadorVer.membroDesde}</span>
                <span className="linha" style={{ gap: 8 }}><Clock size={15} /> Última atividade: {entregadorVer.ultimaAtividade}</span>
              </div>
            </div>

            <div className="cartao">
              <h3 className="titulo-cartao">Informações do entregador</h3>
              <div className="grelha-2" style={{ marginTop: 18, rowGap: 22 }}>
                <div className="info-item"><User size={18} className="icone" /><div><small>Nome completo</small><strong>{entregadorVer.nomeCompleto}</strong></div></div>
                <div className="info-item"><Phone size={18} className="icone" /><div><small>Telefone</small><strong>{entregadorVer.telefone}</strong></div></div>
                <div className="info-item"><Mail size={18} className="icone" /><div><small>E-mail</small><strong>{entregadorVer.email}</strong></div></div>
                <div className="info-item"><IdCard size={18} className="icone" /><div><small>Nº do BI</small><strong>{entregadorVer.numeroBi}</strong></div></div>
                <div className="info-item"><MapPin size={18} className="icone" /><div><small>Zona de atuação</small><strong>{entregadorVer.zona}</strong></div></div>
                <div className="info-item"><Store size={18} className="icone" /><div><small>Lavandaria associada</small><strong>{entregadorVer.lavandaria}</strong></div></div>
                <div className="info-item"><Bike size={18} className="icone" /><div><small>Veículo</small><strong>{entregadorVer.tipoVeiculo}{entregadorVer.modeloVeiculo ? ' · ' + entregadorVer.modeloVeiculo : ''}</strong></div></div>
                <div className="info-item"><CreditCard size={18} className="icone" /><div><small>Matrícula</small><strong>{entregadorVer.matricula || '—'}</strong></div></div>
              </div>
            </div>
          </div>
          <div className="modal-rodape">
            <button type="button" className="botao botao-perigo-claro" onClick={() => { setEntregadorRemover(entregadorVer); setEntregadorVer(null); }}>
              <Trash2 size={18} /> Remover
            </button>
            <button type="button" className="botao botao-primario" onClick={() => { setEntregadorEditar(entregadorVer); setEntregadorVer(null); }}>
              <Pencil size={18} /> Editar entregador
            </button>
          </div>
        </Modal>
      )}

      {/* ---------- Janelas: Adicionar (T2) e Editar (T3) ---------- */}
      {mostrarAdicionar && <JanelaEntregador aoFechar={() => setMostrarAdicionar(false)} aoGuardar={guardarNovo} />}
      {entregadorEditar && <JanelaEntregador entregador={entregadorEditar} aoFechar={() => setEntregadorEditar(null)} aoGuardar={guardarEdicao} />}

      {/* ---------- Janela: Remover (T4) ---------- */}
      {entregadorRemover && (
        <ModalConfirmacao
          icone={<Trash2 size={26} />}
          titulo="Remover entregador?"
          texto={entregadorRemover.nomeCompleto + ' deixará de receber pedidos e perderá o acesso à aplicação. O histórico de ' + entregadorRemover.totalEntregas + ' entregas será mantido. Esta ação não pode ser anulada.'}
          textoConfirmar="Sim, remover entregador"
          aoConfirmar={confirmarRemocao}
          aoCancelar={() => setEntregadorRemover(null)}
        >
          <div className="celula-pessoa" style={{ background: 'var(--fundo)', borderRadius: 12, padding: 12, marginTop: 18, textAlign: 'left' }}>
            <Avatar nome={entregadorRemover.nomeCompleto} fotoUrl={entregadorRemover.fotoUrl} tamanho={40} />
            <div>
              <strong>{entregadorRemover.nomeCompleto}</strong>
              <small>{entregadorRemover.telefone}</small>
            </div>
          </div>
        </ModalConfirmacao>
      )}

      {aviso && (
        <AvisoFlutuante icone={aviso.remover ? <Trash2 size={20} /> : <CircleCheck size={20} />} titulo={aviso.titulo} texto={aviso.texto} aoFechar={() => setAviso(null)} />
      )}
    </>
  );
}

// Formulário "Adicionar entregador" / "Editar entregador"
function JanelaEntregador({ entregador, aoFechar, aoGuardar }) {
  const emEdicao = Boolean(entregador);
  const [nomeCompleto, setNomeCompleto] = useState(entregador ? entregador.nomeCompleto : '');
  const [telefone, setTelefone] = useState(entregador ? entregador.telefone : '');
  const [email, setEmail] = useState(entregador ? entregador.email : '');
  const [numeroBi, setNumeroBi] = useState(entregador ? entregador.numeroBi : '');
  const [zona, setZona] = useState(entregador ? entregador.zona : listas.zonas[0]);
  const [lavandaria, setLavandaria] = useState(entregador ? entregador.lavandaria : '');
  const [tipoVeiculo, setTipoVeiculo] = useState(entregador ? entregador.tipoVeiculo : 'Mota');
  const [modeloVeiculo, setModeloVeiculo] = useState(entregador ? entregador.modeloVeiculo : '');
  const [matricula, setMatricula] = useState(entregador ? entregador.matricula : '');
  const [palavraPasseTemporaria, setPalavraPasseTemporaria] = useState('');
  const [ativo, setAtivo] = useState(entregador ? entregador.ativo : true); // só aparece ao editar
  const [foto, setFoto] = useState(null); // ficheiro da foto escolhida
  const [nomesLavandarias, setNomesLavandarias] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    listarLavandarias('').then((lista) => {
      setNomesLavandarias(lista.map((l) => l.nome));
      if (!lavandaria && lista.length) setLavandaria(lista[0].nome);
    });
  }, []);

  const tiposVeiculo = [
    { nome: 'Mota', icone: Bike },
    { nome: 'Carro', icone: Car },
    { nome: 'Bicicleta', icone: Bike },
  ];

  async function guardar() {
    if (!nomeCompleto.trim() || !telefone.trim() || !numeroBi.trim()) {
      setErro('Preencha os campos obrigatórios (*).');
      return;
    }
    try {
      const dados = { nomeCompleto, telefone, email, numeroBi, zona, lavandaria, tipoVeiculo, modeloVeiculo, matricula, palavraPasseTemporaria };
      if (emEdicao) dados.ativo = ativo;
      await aoGuardar(dados, foto);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <Modal titulo={emEdicao ? 'Editar entregador' : 'Adicionar entregador'} aoFechar={aoFechar} largura={1080}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div className="coluna" style={{ gap: 16 }}>
          <h3 className="titulo-cartao">Dados pessoais</h3>
          <div className="grelha-2">
            <CampoTexto rotulo="Nome completo" obrigatorio icone={<User size={18} />} valor={nomeCompleto} aoMudar={setNomeCompleto} />
            <CampoTexto rotulo="Telefone" obrigatorio icone={<Phone size={18} />} valor={telefone} aoMudar={setTelefone} placeholder="+244 9XX XXX XXX" />
            <CampoTexto rotulo="E-mail" tipo="email" icone={<Mail size={18} />} valor={email} aoMudar={setEmail} />
            <CampoTexto rotulo="Nº do BI" obrigatorio icone={<IdCard size={18} />} valor={numeroBi} aoMudar={setNumeroBi} />
          </div>

          <hr className="divisor" />
          <h3 className="titulo-cartao">Atividade e veículo</h3>
          <div className="grelha-2">
            <CampoSelecao rotulo="Zona de atuação" obrigatorio icone={<MapPin size={18} />} valor={zona} aoMudar={setZona} opcoes={listas.zonas} />
            <CampoSelecao rotulo="Lavandaria associada" obrigatorio icone={<Store size={18} />} valor={lavandaria} aoMudar={setLavandaria} opcoes={nomesLavandarias.length ? nomesLavandarias : [lavandaria]} />
          </div>
          <div className="campo">
            <label>Tipo de veículo *</label>
            <div className="grelha-3" style={{ gap: 10 }}>
              {tiposVeiculo.map((tipo) => (
                <button
                  key={tipo.nome}
                  type="button"
                  className={'escolha' + (tipoVeiculo === tipo.nome ? ' ativo-claro' : '')}
                  style={{ height: 46 }}
                  onClick={() => setTipoVeiculo(tipo.nome)}
                >
                  <tipo.icone size={18} /> {tipo.nome}
                </button>
              ))}
            </div>
          </div>
          <div className="grelha-2">
            <CampoTexto rotulo="Modelo do veículo" icone={<Bike size={18} />} valor={modeloVeiculo} aoMudar={setModeloVeiculo} />
            <CampoTexto rotulo="Matrícula" icone={<CreditCard size={18} />} valor={matricula} aoMudar={setMatricula} />
          </div>

          {/* O estado (ativo/inativo) só se altera aqui, no formulário de edição */}
          {emEdicao && (
            <div className="linha-entre" style={{ background: 'var(--fundo)', borderRadius: 10, padding: '12px 14px' }}>
              <div>
                <strong style={{ fontSize: 13 }}>Estado do entregador</strong>
                <p className="texto-cinza" style={{ fontSize: 11 }}>
                  {ativo ? 'Ativo · pode receber pedidos' : 'Inativo · não recebe pedidos'}
                </p>
              </div>
              <div className="linha" style={{ gap: 8 }}>
                <span className={ativo ? 'texto-verde' : 'texto-cinza'} style={{ fontSize: 12, fontWeight: 700 }}>{ativo ? 'Ativo' : 'Inativo'}</span>
                <Interruptor ligado={ativo} aoMudar={setAtivo} />
              </div>
            </div>
          )}
        </div>

        <div className="cartao" style={{ alignSelf: 'start' }}>
          <h3 className="titulo-cartao" style={{ textAlign: 'center' }}>Foto de perfil</h3>
          <div style={{ margin: '18px 0 10px' }}>
            <FotoEditavel nome={nomeCompleto} fotoUrl={entregador ? entregador.fotoUrl : ''} aoEscolher={setFoto} />
          </div>
          <p className="texto-cinza" style={{ fontSize: 11, textAlign: 'center' }}>Clique na foto para escolher · JPG ou PNG · máx. 5 MB</p>
          <hr className="divisor" style={{ margin: '16px 0' }} />
          <h3 className="titulo-cartao" style={{ fontSize: 14, marginBottom: 10 }}>Acesso à aplicação</h3>
          <CampoPalavraPasse rotulo="Palavra-passe temporária" icone={<Lock size={18} />} valor={palavraPasseTemporaria} aoMudar={setPalavraPasseTemporaria} placeholder="Ex: Sk#2026entrega" />
          <div className="aviso-azul" style={{ marginTop: 14 }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            O entregador recebe os dados de acesso por SMS e altera a palavra-passe no primeiro login.
          </div>
        </div>
      </div>

      {erro && <p className="mensagem-erro" style={{ marginTop: 12 }}>{erro}</p>}
      <div className="modal-rodape">
        <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
        <button type="button" className="botao botao-primario" onClick={guardar}>
          <Check size={18} /> {emEdicao ? 'Guardar alterações' : 'Guardar entregador'}
        </button>
      </div>
    </Modal>
  );
}
