// =====================================================================
//  Ecrãs U a U4.1 - Perfil da conta do Administrador
//  Secções: Dados, Histórico da lavandaria, Informações, Terminar sessão
// =====================================================================

import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Bell, Calendar, Check, ChevronRight, CircleCheck, CircleHelp, FileText, History, Info, Lock, LogOut, MapPin, Pencil, Plus, Shield, User,
} from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { Avatar, EstadoCarregamento } from '../../componentes/Basicos';
import { CampoAreaTexto, CampoPalavraPasse, CampoSelecao, CampoTexto, FotoEditavel } from '../../componentes/Formulario';
import { AvisoFlutuante, Modal } from '../../componentes/Modais';
import {
  alterarPalavraPasse, editarPerfil, enviarFotoPerfil, listarInformacoes, obterHistoricoLavandarias, obterPerfil, publicarInformacao,
} from '../../servicos/servicosAdmin';

export default function PerfilAdmin() {
  const { pedirTerminarSessao, recarregarPerfil } = useOutletContext(); // vem do LayoutAdmin
  const [seccao, setSeccao] = useState('dados'); // 'dados', 'historico' ou 'informacoes'

  const seccoes = [
    { id: 'dados', texto: 'Dados', icone: User },
    { id: 'historico', texto: 'Histórico da lavandaria', icone: History },
    { id: 'informacoes', texto: 'Informações', icone: Info },
  ];

  return (
    <>
      <BarraSuperior titulo="Perfil da conta" />

      <div className="conteudo" style={{ flex: 1 }}>
        <div className="perfil-grelha">
          {/* Menu das secções */}
          <div className="cartao menu-seccoes">
            <p className="titulo-menu">SECÇÕES</p>
            {seccoes.map((item) => (
              <button key={item.id} type="button" className={seccao === item.id ? 'ativo' : ''} onClick={() => setSeccao(item.id)}>
                <item.icone size={18} /> {item.texto} <ChevronRight size={16} className="seta" />
              </button>
            ))}
            <hr className="divisor" style={{ margin: '8px 6px' }} />
            <button type="button" className="sair" onClick={pedirTerminarSessao}>
              <LogOut size={18} /> Terminar sessão
            </button>
          </div>

          {/* Conteúdo da secção escolhida */}
          <div className="cartao" style={{ padding: 24 }}>
            {seccao === 'dados' && <SeccaoDados aoAlterar={recarregarPerfil} />}
            {seccao === 'historico' && <SeccaoHistorico />}
            {seccao === 'informacoes' && <SeccaoInformacoes />}
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------
//  Secção "Dados da conta" (U) + janela "Editar dados" (U1)
// ---------------------------------------------------------------------
function SeccaoDados({ aoAlterar }) {
  const [perfil, setPerfil] = useState(null);
  const [editar, setEditar] = useState(false);
  const [aviso, setAviso] = useState(false);

  useEffect(() => {
    obterPerfil().then(setPerfil);
  }, []);

  if (!perfil) return <EstadoCarregamento aCarregar />;

  async function guardar(dados, palavraPasseAtual, novaPalavraPasse, foto) {
    const atualizado = await editarPerfil(dados);
    if (novaPalavraPasse) await alterarPalavraPasse(palavraPasseAtual, novaPalavraPasse);
    let fotoUrl = atualizado.fotoUrl;
    if (foto) {
      const resposta = await enviarFotoPerfil(foto);
      fotoUrl = resposta.fotoUrl;
    }
    setPerfil({ ...atualizado, fotoUrl: fotoUrl });
    aoAlterar(); // atualiza a foto e o nome na barra lateral
    setEditar(false);
    setAviso(true);
  }

  return (
    <>
      <div className="linha-entre">
        <h3 className="titulo-cartao" style={{ fontSize: 17 }}>Dados da conta</h3>
        <button type="button" className="botao botao-secundario" onClick={() => setEditar(true)}>
          <Pencil size={18} /> Editar dados
        </button>
      </div>

      {/* Foto de perfil (aparece a imagem, não o nome do ficheiro) */}
      <div className="linha" style={{ marginTop: 18, gap: 16 }}>
        <Avatar nome={perfil.nomeCompleto} fotoUrl={perfil.fotoUrl} tamanho={72} />
        <div>
          <small className="texto-cinza" style={{ fontSize: 12 }}>Foto de perfil</small>
          <strong style={{ display: 'block', fontSize: 14 }}>{perfil.nomeCompleto}</strong>
        </div>
      </div>

      <div className="grelha-2" style={{ marginTop: 18, rowGap: 22 }}>
        <div className="info-item"><User size={18} className="icone" /><div><small>Nome completo</small><strong>{perfil.nomeCompleto}</strong></div></div>
        <div className="info-item"><MapPin size={18} className="icone" /><div><small>Morada</small><strong>{perfil.morada}</strong></div></div>
        <div className="info-item"><Shield size={18} className="icone" /><div><small>Perfil</small><strong>{perfil.perfil}</strong></div></div>
        <div className="info-item"><CircleCheck size={18} className="icone" /><div><small>Estado do perfil</small><strong>{perfil.estado}</strong></div></div>
      </div>

      <hr className="divisor" style={{ margin: '22px 0' }} />
      <h3 className="titulo-cartao" style={{ fontSize: 14 }}>Segurança</h3>
      <div className="linha-entre" style={{ background: 'var(--fundo)', borderRadius: 12, padding: '16px 20px', marginTop: 14 }}>
        <div className="linha" style={{ gap: 18 }}>
          <Lock size={18} />
          <div>
            <strong style={{ fontSize: 14 }}>Palavra-passe</strong>
            <p className="texto-cinza" style={{ fontSize: 12 }}>{perfil.palavraPasseAlteradaHa}</p>
          </div>
        </div>
        <button type="button" className="botao-ligacao" onClick={() => setEditar(true)}>Alterar</button>
      </div>

      {editar && <JanelaEditarDados perfil={perfil} aoFechar={() => setEditar(false)} aoGuardar={guardar} />}
      {aviso && <AvisoFlutuante icone={<CircleCheck size={20} />} titulo="Dados guardados" texto="Os dados da sua conta foram atualizados." aoFechar={() => setAviso(false)} />}
    </>
  );
}

function JanelaEditarDados({ perfil, aoFechar, aoGuardar }) {
  const [nomeCompleto, setNomeCompleto] = useState(perfil.nomeCompleto);
  const [morada, setMorada] = useState(perfil.morada);
  const [palavraPasseAtual, setPalavraPasseAtual] = useState('');
  const [novaPalavraPasse, setNovaPalavraPasse] = useState('');
  const [foto, setFoto] = useState(null); // ficheiro da foto escolhida
  const [erro, setErro] = useState('');

  async function guardar() {
    if (novaPalavraPasse && novaPalavraPasse.length < 8) {
      setErro('A nova palavra-passe deve ter pelo menos 8 caracteres.');
      return;
    }
    try {
      await aoGuardar({ nomeCompleto, morada }, palavraPasseAtual, novaPalavraPasse, foto);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <Modal titulo="Editar dados" aoFechar={aoFechar} largura={960}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24 }}>
        <div className="grelha-2" style={{ rowGap: 18, alignContent: 'start' }}>
          <CampoTexto rotulo="Nome completo" obrigatorio icone={<User size={18} />} valor={nomeCompleto} aoMudar={setNomeCompleto} />
          <CampoTexto rotulo="Morada" icone={<MapPin size={18} />} valor={morada} aoMudar={setMorada} />
          <CampoTexto rotulo="Perfil" icone={<Shield size={18} />} valor={perfil.perfil} bloqueado aoMudar={() => {}} />
        </div>

        {/* Foto de perfil: clicar na foto para escolher uma imagem nova */}
        <div className="cartao" style={{ alignSelf: 'start' }}>
          <h3 className="titulo-cartao" style={{ textAlign: 'center' }}>Foto de perfil</h3>
          <div style={{ margin: '16px 0 10px' }}>
            <FotoEditavel nome={nomeCompleto} fotoUrl={perfil.fotoUrl} tamanho={104} aoEscolher={setFoto} />
          </div>
          <p className="texto-cinza" style={{ fontSize: 11, textAlign: 'center' }}>Clique na foto para escolher · JPG ou PNG · máx. 5 MB</p>
        </div>
      </div>
      <hr className="divisor" style={{ margin: '20px 0' }} />
      <h3 className="titulo-cartao" style={{ fontSize: 14, marginBottom: 14 }}>Alterar palavra-passe</h3>
      <div className="grelha-2">
        <CampoPalavraPasse rotulo="Palavra-passe atual" icone={<Lock size={18} />} valor={palavraPasseAtual} aoMudar={setPalavraPasseAtual} />
        <CampoPalavraPasse rotulo="Nova palavra-passe" icone={<Lock size={18} />} valor={novaPalavraPasse} aoMudar={setNovaPalavraPasse} placeholder="Mínimo 8 caracteres" />
      </div>
      {erro && <p className="mensagem-erro" style={{ marginTop: 12 }}>{erro}</p>}
      <div className="modal-rodape">
        <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
        <button type="button" className="botao botao-primario" onClick={guardar}><Check size={18} /> Guardar</button>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------
//  Secção "Histórico da lavandaria" (U2)
// ---------------------------------------------------------------------
function SeccaoHistorico() {
  const [lista, setLista] = useState(null);

  useEffect(() => {
    obterHistoricoLavandarias().then(setLista);
  }, []);

  return (
    <>
      <h3 className="titulo-cartao" style={{ fontSize: 17, marginBottom: 18 }}>Histórico da lavandaria</h3>
      {!lista && <EstadoCarregamento aCarregar />}
      {lista && (
        <div className="cartao cartao-sem-espaco" style={{ boxShadow: 'none' }}>
          <table className="tabela">
            <thead>
              <tr><th style={{ width: 80 }}>Logo</th><th>Lavandaria</th></tr>
            </thead>
            <tbody>
              {lista.map((lavandaria) => (
                <tr key={lavandaria.id}>
                  <td><Avatar nome={lavandaria.nome} fotoUrl={lavandaria.logoUrl} logo={Boolean(lavandaria.logoUrl)} tamanho={32} /></td>
                  <td className="forte">{lavandaria.nome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------
//  Secção "Informações" (U3) + janelas de edição (U3.1 a U3.5) + aviso (U3.6)
// ---------------------------------------------------------------------
function SeccaoInformacoes() {
  const [informacoes, setInformacoes] = useState(null);
  const [aEditar, setAEditar] = useState(null);
  const [aviso, setAviso] = useState('');

  function carregar() {
    listarInformacoes().then(setInformacoes);
  }

  useEffect(carregar, []);

  async function publicar(dados) {
    await publicarInformacao(aEditar.id, dados);
    setAviso('Os ' + aEditar.titulo + ' já estão visíveis para clientes, lavandarias e entregadores.');
    setAEditar(null);
    carregar();
  }

  if (!informacoes) return <EstadoCarregamento aCarregar />;

  const encontrar = (id) => informacoes.find((i) => i.id === id);
  const icones = { 'central-de-ajuda': CircleHelp, 'termos-e-condicoes': FileText, 'politica-de-privacidade': Lock, 'sobre-a-sukula': Info };

  return (
    <>
      <h3 className="titulo-cartao" style={{ fontSize: 17, marginBottom: 12 }}>Informações</h3>
      <div className="lista-opcoes">
        {['central-de-ajuda', 'termos-e-condicoes', 'politica-de-privacidade'].map((id) => {
          const item = encontrar(id);
          const Icone = icones[id];
          return (
            <button key={id} type="button" onClick={() => setAEditar(item)}>
              <Icone size={18} />
              <div><strong>{item.titulo}</strong><small>{item.descricao}</small></div>
              <span className="fim"><ChevronRight size={18} /></span>
            </button>
          );
        })}
        <div>
          <Bell size={18} />
          <div><strong>Notificações</strong><small>Novos registos, lavandarias pendentes e alertas</small></div>
          <span className="fim"><span className="estado ativo">Ativas</span></span>
        </div>
        <button type="button" onClick={() => setAEditar(encontrar('sobre-a-sukula'))}>
          <Info size={18} />
          <div><strong>Sobre a Sukula</strong><small>{encontrar('sobre-a-sukula').descricao}</small></div>
          <span className="fim">{encontrar('sobre-a-sukula').versao}</span>
        </button>
      </div>
      <p className="texto-cinza" style={{ fontSize: 11, marginTop: 18, color: 'var(--texto-cinza-claro)' }}>
        © 2026 Sukula, Lda. · NIF 5000 123 456 · Luanda, Angola
      </p>

      {aEditar && <JanelaEditarInformacao informacao={aEditar} aoFechar={() => setAEditar(null)} aoPublicar={publicar} />}
      {aviso && <AvisoFlutuante icone={<CircleCheck size={20} />} titulo="Alterações publicadas" texto={aviso} aoFechar={() => setAviso('')} />}
    </>
  );
}

// Janela para editar uma página de informação.
// A "Central de ajuda" tem perguntas e respostas; as outras têm só um texto.
function JanelaEditarInformacao({ informacao, aoFechar, aoPublicar }) {
  const temPerguntas = Boolean(informacao.perguntas);
  const [perfisAbrangidos, setPerfisAbrangidos] = useState(informacao.perfisAbrangidos);
  const [versao, setVersao] = useState(informacao.versao);
  const [texto, setTexto] = useState(informacao.texto || '');
  const [perguntas, setPerguntas] = useState(informacao.perguntas || []);

  function mudarPergunta(posicao, campo, valor) {
    const copia = [...perguntas];
    copia[posicao] = { ...copia[posicao], [campo]: valor };
    setPerguntas(copia);
  }

  function publicar() {
    if (temPerguntas) aoPublicar({ perfisAbrangidos, perguntas });
    else aoPublicar({ perfisAbrangidos, versao, texto });
  }

  return (
    <Modal titulo={'Editar ' + informacao.titulo} aoFechar={aoFechar} largura={780}>
      <div className="grelha-2">
        {temPerguntas ? (
          <CampoSelecao rotulo="Perfis abrangidos" valor={perfisAbrangidos} aoMudar={setPerfisAbrangidos} opcoes={['Todos os perfis', 'Clientes', 'Lavandarias', 'Entregadores']} />
        ) : (
          <CampoTexto rotulo="Versão" valor={versao} aoMudar={setVersao} />
        )}
        <CampoTexto rotulo={temPerguntas ? 'Última atualização' : 'Data de entrada em vigor'} icone={<Calendar size={18} />} valor="12 Nov 2026" bloqueado aoMudar={() => {}} />
      </div>

      {temPerguntas ? (
        <div className="coluna" style={{ gap: 14, marginTop: 16 }}>
          {perguntas.map((item, posicao) => (
            <div key={posicao} className="coluna" style={{ gap: 14 }}>
              <CampoTexto rotulo={'Pergunta ' + (posicao + 1)} valor={item.pergunta} aoMudar={(valor) => mudarPergunta(posicao, 'pergunta', valor)} />
              <CampoAreaTexto rotulo={'Resposta ' + (posicao + 1)} valor={item.resposta} aoMudar={(valor) => mudarPergunta(posicao, 'resposta', valor)} linhas={2} />
            </div>
          ))}
          <button type="button" className="botao botao-claro" style={{ alignSelf: 'flex-start' }} onClick={() => setPerguntas([...perguntas, { pergunta: '', resposta: '' }])}>
            <Plus size={18} /> Adicionar pergunta
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <CampoAreaTexto rotulo={'Conteúdo d' + (informacao.id === 'sobre-a-sukula' ? 'e ' : 'os ') + informacao.titulo.toLowerCase()} valor={texto} aoMudar={setTexto} linhas={8} />
        </div>
      )}

      <div className="aviso-azul" style={{ marginTop: 16 }}>
        <Info size={16} style={{ flexShrink: 0 }} />
        Ao publicar, esta informação fica visível para todos os perfis: clientes, lavandarias e entregadores.
      </div>

      <div className="modal-rodape">
        <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
        <button type="button" className="botao botao-primario" onClick={publicar}><Check size={18} /> Publicar alterações</button>
      </div>
    </Modal>
  );
}
