// =====================================================================
//  Ecrãs M a M5 - Perfil da conta da Lavandaria
//  Secções: Dados (ver/editar), Histórico, Descontos, Informações
// =====================================================================

import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Banknote, Bell, Building2, Calendar, Check, ChevronRight, CircleHelp, Clock, Download, FileText, History, Info, Lock, LogOut, MapPin, Pencil, Percent, Phone, Plus, Star, Tag, User, Users, WashingMachine, X,
} from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento, Etiqueta, Interruptor } from '../../componentes/Basicos';
import { CampoTexto, validarImagem } from '../../componentes/Formulario';
import { AvisoFlutuante } from '../../componentes/Modais';
import IconePorNome from '../../componentes/IconePorNome';
import {
  alterarEstadoDesconto, criarDesconto, editarContaLavandaria, enviarFotoContaLavandaria, listarDescontos, obterContaLavandaria, obterHistoricoLavandaria, servicosParaDescontos,
} from '../../servicos/servicosLavandaria';
import { formatarKz } from '../../utilidades';

export default function PerfilLavandaria() {
  const { pedirTerminarSessao, recarregarConta } = useOutletContext(); // vem do LayoutLavandaria
  const [conta, setConta] = useState(null);
  const [erroFoto, setErroFoto] = useState('');

  // Quando se escolhe uma foto nova no lápis do cabeçalho
  async function mudarFoto(evento) {
    const ficheiro = evento.target.files[0];
    if (!ficheiro) return;
    const mensagem = validarImagem(ficheiro);
    setErroFoto(mensagem);
    if (mensagem) return;
    const resposta = await enviarFotoContaLavandaria(ficheiro);
    setConta({ ...conta, fotoUrl: resposta.fotoUrl });
    recarregarConta(); // atualiza a foto na barra lateral
  }
  const [seccao, setSeccao] = useState('dados'); // 'dados', 'historico', 'descontos', 'informacoes'

  useEffect(() => {
    obterContaLavandaria().then(setConta);
  }, []);

  const seccoes = [
    { id: 'dados', texto: 'Dados', icone: User },
    { id: 'historico', texto: 'Histórico da lavandaria', icone: History },
    { id: 'descontos', texto: 'Descontos', icone: Tag },
    { id: 'informacoes', texto: 'Informações', icone: Info },
  ];

  return (
    <>
      <BarraSuperior painel="lavandaria" titulo="Perfil da conta" subtitulo="Gerir os dados e definições da lavandaria" />

      <div className="conteudo" style={{ flex: 1 }}>
        {!conta && <EstadoCarregamento aCarregar />}
        {conta && (
          <>
            {/* ---- Cabeçalho com capa ---- */}
            <div className="cartao cabecalho-capa">
              <div className="capa" style={{ backgroundImage: 'url(' + conta.capaUrl + ')' }} />
              <div className="info">
                <div className="foto-grande">
                  <img src={conta.fotoUrl} alt={conta.nome} />
                  <label className="botao-camara" style={{ right: 0, bottom: 4, width: 28, height: 28, cursor: 'pointer' }} title="Alterar foto">
                    <Pencil size={13} />
                    <input type="file" accept="image/png, image/jpeg" className="ficheiro-escondido" onChange={mudarFoto} />
                  </label>
                </div>
                <div>
                  <div className="linha" style={{ gap: 10 }}>
                    <h2 style={{ fontSize: 19 }}>{conta.nome}</h2>
                    {conta.verificada && <Etiqueta texto="Parceiro verificado" cor="verde" />}
                  </div>
                  <p className="texto-cinza" style={{ fontSize: 12, marginTop: 4 }}>
                    {conta.localizacao} · Parceiro Sukula desde {conta.parceiroDesde}
                  </p>
                  {erroFoto && <p className="mensagem-erro">{erroFoto}</p>}
                </div>
                <div className="numeros">
                  <div><strong>{conta.totalEstafetas}</strong><small>Estafetas</small></div>
                  <div><strong>{conta.totalPedidos}</strong><small>Pedidos</small></div>
                  <div><strong>{conta.avaliacao}</strong><small>Avaliação</small></div>
                </div>
              </div>
            </div>

            <div className="perfil-grelha">
              {/* ---- Menu das secções ---- */}
              <div className="cartao menu-seccoes">
                <p className="titulo-menu">SECÇÕES</p>
                {seccoes.map((item) => (
                  <button key={item.id} type="button" className={'com-barra' + (seccao === item.id ? ' ativo' : '')} onClick={() => setSeccao(item.id)}>
                    <item.icone size={18} /> {item.texto} <ChevronRight size={16} className="seta" />
                  </button>
                ))}
                <hr className="divisor" style={{ margin: '8px 6px' }} />
                <button type="button" className="sair-vermelho" onClick={pedirTerminarSessao}>
                  <LogOut size={18} /> Terminar sessão
                </button>
                <div className="caixa-ajuda">
                  <CircleHelp size={18} />
                  <strong>Precisa de ajuda?</strong>
                  <small>Fale com o apoio ao parceiro</small>
                  <b>{conta.telefoneApoio}</b>
                </div>
              </div>

              {/* ---- Conteúdo da secção ---- */}
              <div className="cartao" style={{ padding: 24 }}>
                {seccao === 'dados' && <SeccaoDados conta={conta} aoGuardar={setConta} />}
                {seccao === 'historico' && <SeccaoHistorico />}
                {seccao === 'descontos' && <SeccaoDescontos />}
                {seccao === 'informacoes' && <SeccaoInformacoes />}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Cabeçalho de cada secção (título + subtítulo + botão à direita)
function CabecalhoSeccao({ titulo, subtitulo, children }) {
  return (
    <div className="linha-entre" style={{ marginBottom: 20 }}>
      <div>
        <h3 className="titulo-cartao" style={{ fontSize: 17 }}>{titulo}</h3>
        <p className="texto-cinza" style={{ fontSize: 12, marginTop: 3 }}>{subtitulo}</p>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------
//  Dados (M) e Editar dados (M1)
// ---------------------------------------------------------------------
function SeccaoDados({ conta, aoGuardar }) {
  const [aEditar, setAEditar] = useState(false);
  const [nome, setNome] = useState(conta.nome);
  const [moradaCompleta, setMoradaCompleta] = useState(conta.moradaCompleta);
  const [horario, setHorario] = useState(conta.horario);
  const [servicosOferecidos, setServicosOferecidos] = useState(conta.servicosOferecidos);
  const [descricao, setDescricao] = useState(conta.descricao);
  const [aviso, setAviso] = useState(false);

  async function guardar() {
    const atualizada = await editarContaLavandaria({ nome, moradaCompleta, horario, servicosOferecidos, descricao });
    aoGuardar({ ...atualizada });
    setAEditar(false);
    setAviso(true);
  }

  if (aEditar) {
    return (
      <>
        <CabecalhoSeccao titulo="Dados da lavandaria" subtitulo="Edite as informações e guarde as alterações" />
        <div className="grelha-2" style={{ rowGap: 18 }}>
          <CampoTexto rotulo="Nome da lavandaria" icone={<Building2 size={18} />} valor={nome} aoMudar={setNome} />
          <CampoTexto rotulo="Localização" icone={<MapPin size={18} />} valor={moradaCompleta} aoMudar={setMoradaCompleta} />
          <CampoTexto rotulo="Horário de funcionamento" icone={<Clock size={18} />} valor={horario} aoMudar={setHorario} />
          <CampoTexto rotulo="Serviços oferecidos" icone={<WashingMachine size={18} />} valor={servicosOferecidos} aoMudar={setServicosOferecidos} />
        </div>
        <div className="campo" style={{ marginTop: 18 }}>
          <label>Descrição</label>
          <textarea className="area-texto" rows={3} value={descricao} onChange={(evento) => setDescricao(evento.target.value)} />
        </div>
        <div className="modal-rodape">
          <button type="button" className="botao botao-secundario" onClick={() => setAEditar(false)}>Cancelar</button>
          <button type="button" className="botao botao-primario" onClick={guardar}>Guardar alterações</button>
        </div>
      </>
    );
  }

  const campos = [
    { rotulo: 'Nome da lavandaria', valor: conta.nome, icone: Building2 },
    { rotulo: 'Localização', valor: conta.moradaCompleta, icone: MapPin },
    { rotulo: 'Horário de funcionamento', valor: conta.horario, icone: Clock },
    { rotulo: 'Serviços oferecidos', valor: conta.servicosOferecidos, icone: WashingMachine },
  ];

  return (
    <>
      <CabecalhoSeccao titulo="Dados da lavandaria" subtitulo="Informações visíveis para clientes e estafetas">
        <button type="button" className="botao botao-secundario" onClick={() => setAEditar(true)}><Pencil size={18} /> Editar dados</button>
      </CabecalhoSeccao>
      <div className="grelha-2" style={{ rowGap: 24 }}>
        {campos.map((campo) => (
          <div key={campo.rotulo} className="linha" style={{ alignItems: 'flex-start' }}>
            <span className="icone-quadrado azul pequeno"><campo.icone size={18} /></span>
            <div><small className="texto-cinza" style={{ fontSize: 11 }}>{campo.rotulo}</small><strong className="texto-escuro" style={{ display: 'block', fontSize: 13, lineHeight: 1.45 }}>{campo.valor}</strong></div>
          </div>
        ))}
      </div>
      <div className="linha" style={{ alignItems: 'flex-start', marginTop: 24 }}>
        <span className="icone-quadrado azul pequeno"><Info size={18} /></span>
        <div><small className="texto-cinza" style={{ fontSize: 11 }}>Descrição</small><strong className="texto-escuro" style={{ display: 'block', fontSize: 13, lineHeight: 1.45 }}>{conta.descricao}</strong></div>
      </div>
      {aviso && <AvisoFlutuante icone={<Check size={20} />} titulo="Alterações guardadas" texto="Os dados da lavandaria foram atualizados." aoFechar={() => setAviso(false)} />}
    </>
  );
}

// ---------------------------------------------------------------------
//  Histórico da lavandaria (M2)
// ---------------------------------------------------------------------
function SeccaoHistorico() {
  const [historico, setHistorico] = useState(null);

  useEffect(() => {
    obterHistoricoLavandaria().then(setHistorico);
  }, []);

  if (!historico) return <EstadoCarregamento aCarregar />;

  // Cor da etiqueta da variação: verde (+), vermelho (-), azul (em curso)
  function corVariacao(texto) {
    if (texto.startsWith('+')) return 'verde';
    if (texto.startsWith('-')) return 'vermelho';
    return 'azul';
  }

  return (
    <>
      <CabecalhoSeccao titulo="Histórico da lavandaria" subtitulo="Atividade e desempenho desde a adesão · Mar 2025">
        <button type="button" className="botao botao-secundario"><Download size={18} /> Exportar</button>
      </CabecalhoSeccao>

      <div className="grelha-4" style={{ gap: 10 }}>
        {historico.resumo.map((item) => (
          <div key={item.titulo} className="cartao-azul-claro">
            <small className="linha" style={{ gap: 6 }}><IconePorNome nome={item.icone} tamanho={14} /> {item.titulo}</small>
            <strong>{item.valor}</strong>
          </div>
        ))}
      </div>

      <div className="cartao cartao-sem-espaco" style={{ marginTop: 16, boxShadow: 'none' }}>
        <table className="tabela">
          <thead>
            <tr><th>Mês</th><th>Pedidos</th><th>Peças</th><th>Receita</th><th>Avaliação</th><th>Variação</th></tr>
          </thead>
          <tbody>
            {historico.meses.map((linha) => (
              <tr key={linha.mes}>
                <td className="forte">{linha.mes}</td>
                <td className="texto-escuro">{linha.pedidos}</td>
                <td className="texto-escuro">{linha.pecas}</td>
                <td className="texto-escuro">{linha.receita}</td>
                <td className="texto-escuro"><span className="estrela"><Star size={14} /> {linha.avaliacao}</span></td>
                <td><Etiqueta texto={linha.variacao} cor={corVariacao(linha.variacao)} semPonto /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="titulo-cartao" style={{ margin: '20px 0 12px' }}>Marcos da lavandaria</h3>
      <div className="grelha-4" style={{ gap: 10 }}>
        {historico.marcos.map((marco) => (
          <div key={marco.titulo} className="cartao-estafeta" style={{ alignItems: 'center' }}>
            <span className="icone-redondo" style={{ width: 34, height: 34 }}><IconePorNome nome={marco.icone} tamanho={16} /></span>
            <div>
              <small style={{ color: 'var(--azul-medio)', fontWeight: 700 }}>{marco.data}</small>
              <strong style={{ fontSize: 12 }}>{marco.titulo}</strong>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------
//  Descontos (M3) e Criar desconto (M3.1)
// ---------------------------------------------------------------------
function SeccaoDescontos() {
  const [dados, setDados] = useState(null);
  const [criar, setCriar] = useState(false);

  function carregar() {
    listarDescontos().then(setDados);
  }

  useEffect(carregar, []);

  async function mudarEstado(desconto, ativo) {
    await alterarEstadoDesconto(desconto.id, ativo);
    carregar();
  }

  async function guardarDesconto(desconto) {
    await criarDesconto(desconto);
    setCriar(false);
    carregar();
  }

  if (!dados) return <EstadoCarregamento aCarregar />;

  return (
    <>
      <CabecalhoSeccao titulo="Descontos" subtitulo="Crie e gira cupões de desconto para os seus clientes">
        <button type="button" className="botao botao-primario" onClick={() => setCriar(true)}><Plus size={18} /> Criar desconto</button>
      </CabecalhoSeccao>

      <div className="grelha-3" style={{ gap: 10 }}>
        <div className="cartao-azul-claro"><small>Cupões ativos</small><strong>{dados.resumo.cupoesAtivos}</strong></div>
        <div className="cartao-azul-claro"><small>Utilizações este mês</small><strong>{dados.resumo.utilizacoesMes}</strong></div>
        <div className="cartao-azul-claro"><small>Desconto concedido</small><strong>{dados.resumo.descontoConcedido}</strong></div>
      </div>

      <div className="grelha-2" style={{ marginTop: 16, gap: 12 }}>
        {dados.itens.map((desconto) => (
          <div key={desconto.id} className={'cupao' + (desconto.expirado ? ' expirado' : '')}>
            <div className="lado-valor">
              <strong>{desconto.tipo === 'percentagem' ? desconto.valor + '%' : formatarKz(desconto.valor)}</strong>
              <small>DESCONTO</small>
            </div>
            <div className="lado-info">
              <div className="linha-entre">
                <strong style={{ fontSize: 14, color: desconto.expirado ? 'var(--texto-cinza)' : 'var(--azul)' }}>{desconto.codigo}</strong>
                <Etiqueta texto={desconto.expirado ? 'Expirado' : desconto.ativo ? 'Ativo' : 'Pausado'} cor={desconto.expirado ? 'cinza' : desconto.ativo ? 'verde' : 'laranja'} />
              </div>
              <p className="texto-escuro" style={{ fontSize: 11, marginTop: 4 }}>{desconto.descricao}</p>
              <p className="texto-cinza" style={{ fontSize: 10, marginTop: 2 }}>{desconto.validade}</p>
              <div style={{ margin: '10px 0 4px' }}>
                <div className="barra-progresso" style={{ height: 5 }}>
                  <div style={{ width: (desconto.limite ? (desconto.utilizacoes / desconto.limite) * 100 : 40) + '%', background: desconto.expirado ? '#c9d3dd' : 'var(--azul-medio)' }} />
                </div>
              </div>
              <div className="linha-entre">
                <small className="texto-cinza" style={{ fontSize: 10 }}>
                  {desconto.limite ? desconto.utilizacoes + ' / ' + desconto.limite + ' utilizações' : 'Sem limite · ' + desconto.utilizacoes + ' usos'}
                </small>
                <Interruptor ligado={desconto.ativo} verde aoMudar={(valor) => !desconto.expirado && mudarEstado(desconto, valor)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="texto-cinza" style={{ fontSize: 11, marginTop: 14 }}>
        Os descontos são suportados pela lavandaria e aplicados automaticamente no checkout do cliente.
      </p>

      {criar && <JanelaCriarDesconto aoFechar={() => setCriar(false)} aoGuardar={guardarDesconto} />}
    </>
  );
}

function JanelaCriarDesconto({ aoFechar, aoGuardar }) {
  const [codigo, setCodigo] = useState('');
  const [tipo, setTipo] = useState('percentagem');
  const [valor, setValor] = useState('');
  const [limite, setLimite] = useState('');
  const [validoDe, setValidoDe] = useState('01 Dez 2026');
  const [validoAte, setValidoAte] = useState('31 Dez 2026');
  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState('');

  function alternarServico(nome) {
    if (servicos.includes(nome)) setServicos(servicos.filter((s) => s !== nome));
    else setServicos([...servicos, nome]);
  }

  async function guardar() {
    if (!codigo.trim() || !valor || servicos.length === 0) {
      setErro('Preencha o código, o valor e escolha pelo menos um serviço.');
      return;
    }
    try {
      await aoGuardar({ codigo: codigo.toUpperCase(), tipo, valor: Number(valor), limite: limite ? Number(limite) : null, validoDe, validoAte, servicos });
    } catch (falha) {
      setErro(falha.message);
    }
  }

  const textoValor = tipo === 'percentagem' ? valor + '%' : formatarKz(valor);

  return (
    <div className="fundo-modal escuro" onClick={aoFechar}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={(evento) => evento.stopPropagation()}>
        <div className="modal-cabecalho">
          <div>
            <h2>Criar desconto</h2>
            <p className="texto-cinza texto-pequeno" style={{ marginTop: 4 }}>Defina as regras do novo cupão</p>
          </div>
          <button type="button" className="botao-fechar redondo" onClick={aoFechar}><X size={16} /></button>
        </div>

        <div className="coluna" style={{ gap: 14 }}>
          <CampoTexto rotulo="Código do cupão" icone={<Tag size={18} />} valor={codigo} aoMudar={setCodigo} placeholder="Ex: NATAL25" />

          <div className="campo">
            <label>Tipo de desconto</label>
            <div className="seletor" style={{ alignSelf: 'flex-start' }}>
              <button type="button" className={tipo === 'percentagem' ? 'ativo' : ''} onClick={() => setTipo('percentagem')}>Percentagem (%)</button>
              <button type="button" className={tipo === 'valor' ? 'ativo' : ''} onClick={() => setTipo('valor')}>Valor fixo (Kz)</button>
            </div>
          </div>

          <div className="grelha-2" style={{ gap: 12 }}>
            <CampoTexto rotulo="Valor" tipo="number" icone={tipo === 'percentagem' ? <Percent size={18} /> : <Banknote size={18} />} valor={valor} aoMudar={setValor} />
            <CampoTexto rotulo="Limite de utilizações" tipo="number" icone={<Users size={18} />} valor={limite} aoMudar={setLimite} placeholder="Sem limite" />
            <CampoTexto rotulo="Válido de" icone={<Calendar size={18} />} valor={validoDe} aoMudar={setValidoDe} />
            <CampoTexto rotulo="Válido até" icone={<Calendar size={18} />} valor={validoAte} aoMudar={setValidoAte} />
          </div>

          <div className="campo">
            <label>Serviços aplicáveis</label>
            <div className="escolhas">
              <button type="button" className={'pilula' + (servicos.length === servicosParaDescontos.length ? ' ativo' : '')} onClick={() => setServicos(servicos.length === servicosParaDescontos.length ? [] : [...servicosParaDescontos])}>
                Todos
              </button>
              {servicosParaDescontos.map((nome) => (
                <button key={nome} type="button" className={'escolha' + (servicos.includes(nome) ? ' ativo-claro' : '')} style={{ height: 34, borderRadius: 17 }} onClick={() => alternarServico(nome)}>
                  {servicos.includes(nome) && <Check size={14} />} {nome}
                </button>
              ))}
            </div>
          </div>

          {valor && servicos.length > 0 && (
            <div className="aviso-verde">
              <Info size={18} /> Clientes poupam {textoValor} em {servicos.length} serviço(s) até {validoAte}.
            </div>
          )}
          {erro && <p className="mensagem-erro">{erro}</p>}
        </div>

        <div className="grelha-2" style={{ marginTop: 20, gap: 12 }}>
          <button type="button" className="botao botao-secundario" onClick={aoFechar}>Cancelar</button>
          <button type="button" className="botao botao-primario" onClick={guardar}><Plus size={18} /> Criar desconto</button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
//  Informações (M4)
// ---------------------------------------------------------------------
function SeccaoInformacoes() {
  const opcoes = [
    { titulo: 'Central de ajuda', texto: 'Perguntas frequentes e guias para parceiros', icone: CircleHelp },
    { titulo: 'Contactar apoio ao parceiro', texto: 'Seg – Sáb · 08:00 – 20:00', icone: Phone },
    { titulo: 'Termos e condições do parceiro', texto: 'Última atualização: 15 Set 2026', icone: FileText },
    { titulo: 'Política de privacidade', texto: 'Como tratamos os dados da lavandaria e clientes', icone: Lock },
    { titulo: 'Taxas, comissões e pagamentos', texto: 'Detalhes de faturação e reembolsos', icone: Banknote },
    { titulo: 'Notificações', texto: 'Pedidos novos, recolhas e entregas', icone: Bell, fim: 'Ativas' },
    { titulo: 'Sobre a Sukula', texto: 'Plataforma de lavandaria a pedido · Luanda', icone: Info, fim: 'v1.0.0' },
  ];

  return (
    <>
      <CabecalhoSeccao titulo="Informações" subtitulo="Ajuda, termos e informações sobre a parceria Sukula" />

      <div className="linha-entre" style={{ background: 'var(--azul)', color: 'var(--branco)', borderRadius: 12, padding: '20px 22px' }}>
        <div className="linha" style={{ alignItems: 'flex-start' }}>
          <Percent size={20} />
          <div>
            <strong style={{ fontSize: 14 }}>Plano Parceiro Standard</strong>
            <p style={{ fontSize: 11, color: '#bfd3e6', marginTop: 4 }}>Comissão de 12% por pedido concluído · Pagamentos semanais às sextas-feiras</p>
          </div>
        </div>
        <button type="button" className="botao botao-secundario" style={{ height: 38 }}>Ver plano</button>
      </div>

      <div className="lista-opcoes" style={{ marginTop: 8 }}>
        {opcoes.map((opcao) => (
          <button key={opcao.titulo} type="button">
            <span className="icone-quadrado azul pequeno"><opcao.icone size={18} /></span>
            <div><strong className="texto-escuro">{opcao.titulo}</strong><small>{opcao.texto}</small></div>
            <span className="fim texto-cinza" style={{ fontWeight: 500 }}>{opcao.fim} <ChevronRight size={16} /></span>
          </button>
        ))}
      </div>
      <p style={{ fontSize: 10, color: 'var(--texto-cinza-claro)', marginTop: 12 }}>© 2026 Sukula, Lda. · NIF 5000 123 456 · Luanda, Angola</p>
    </>
  );
}
