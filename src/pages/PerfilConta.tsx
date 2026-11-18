// Telas U a U4 - Perfil da conta
// - U    : separador "Dados" (cartão pequeno com os dados da conta)
// - U1   : janela "Editar dados"
// - U2   : separador "Histórico da lavandaria" (tabela)
// - U3   : separador "Informações" (tabela) - U3.1 a U3.5 = janelas de edição, U3.6 = aviso
// - U4   : janela "Terminar sessão?"
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CircleCheck,
  CircleHelp,
  File,
  History,
  Info,
  Lock,
  LogOut,
  MapPin,
  Pencil,
  Shield,
  Upload,
  User,
  type LucideIcon,
} from "lucide-react";
import { guardarConta, listarHistoricoLavandarias, obterConta, obterInformacoes, terminarSessao } from "@/api/conta";
import { mensagemDeErro } from "@/api/configuracao";
import type { Administrador, Informacoes } from "@/api/tipos";
import Avatar from "@/components/Avatar";
import Aviso, { type DadosAviso } from "@/components/Aviso";
import { CampoEscolha, CampoTexto, Rotulo } from "@/components/Campo";
import CarregarImagem from "@/components/CarregarImagem";
import EditarInformacoes, { type QualInformacao } from "@/components/EditarInformacoes";
import InfoLinha from "@/components/InfoLinha";
import Janela, { BotoesJanela } from "@/components/Janela";
import JanelaConfirmar from "@/components/JanelaConfirmar";
import Layout from "@/components/Layout";
import { Carregando } from "@/components/TituloPagina";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Separador = "dados" | "historico" | "informacoes";

export default function PerfilConta() {
  const navegar = useNavigate();
  const [separador, setSeparador] = useState<Separador>("dados");
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [aviso, setAviso] = useState<DadosAviso | null>(null);

  function sair() {
    terminarSessao();
    navegar("/login", { state: { sessaoTerminada: true } });
  }

  const separadores: { valor: Separador; texto: string; icone: LucideIcon }[] = [
    { valor: "dados", texto: "Dados", icone: User },
    { valor: "historico", texto: "Histórico da lavandaria", icone: History },
    { valor: "informacoes", texto: "Informações", icone: Info },
  ];

  return (
    <Layout titulo="Perfil da conta">
      {/* Menu do perfil (separadores) */}
      <div className="flex h-[68px] items-center gap-2 rounded-2xl border border-painel-borda bg-white px-[13px]">
        {separadores.map((s) => {
          const Icone = s.icone;
          const ativo = s.valor === separador;
          return (
            <button
              key={s.valor}
              onClick={() => setSeparador(s.valor)}
              className={`flex h-[46px] cursor-pointer items-center gap-2.5 rounded-xl px-4 text-[13.5px] ${
                ativo ? "bg-azul font-bold text-claro" : "font-medium text-cartao-texto"
              }`}
            >
              <Icone className="size-5" strokeWidth={1.6} />
              {s.texto}
            </button>
          );
        })}
        <button
          onClick={() => setConfirmarSaida(true)}
          className="ml-auto flex h-[46px] cursor-pointer items-center gap-2.5 rounded-xl px-4 text-[13.5px] font-semibold text-cartao-texto"
        >
          <LogOut className="size-5" strokeWidth={1.6} />
          Terminar sessão
        </button>
      </div>

      {/* Conteúdo do separador escolhido */}
      <div className="mt-5">
        {separador === "dados" && <SeparadorDados aoGuardar={() => setAviso({ titulo: "Alterações guardadas", texto: "Os seus dados foram atualizados." })} />}
        {separador === "historico" && <SeparadorHistorico />}
        {separador === "informacoes" && <SeparadorInformacoes aoPublicar={(texto) => setAviso({ titulo: "Alterações publicadas", texto })} />}
      </div>

      {/* U4 - Terminar sessão? */}
      <JanelaConfirmar
        aberta={confirmarSaida}
        aoFechar={() => setConfirmarSaida(false)}
        aoConfirmar={sair}
        tipo="sair"
        titulo="Terminar sessão?"
        texto="Terá de iniciar sessão novamente para aceder ao painel de administração da Sukula."
        textoBotao="Sim, terminar sessão"
      />

      <Aviso aviso={aviso} aoFechar={() => setAviso(null)} />
    </Layout>
  );
}

// Título de cada separador (fica sobre o fundo azul)
function TituloSeparador({ texto }: { texto: string }) {
  return <h2 className="text-lg font-bold text-claro">{texto}</h2>;
}

// ---------------------------------------------------------
// U - Separador "Dados" (cartão pequeno)
// ---------------------------------------------------------
function SeparadorDados({ aoGuardar }: { aoGuardar: () => void }) {
  const [conta, setConta] = useState<Administrador | null>(null);
  const [erro, setErro] = useState("");
  const [editar, setEditar] = useState(false);

  useEffect(() => {
    obterConta()
      .then(setConta)
      .catch((e) => setErro(mensagemDeErro(e)));
  }, []);

  if (!conta) return <Carregando erro={erro} />;

  return (
    <>
      <Card className="w-[480px] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-cartao-titulo">Dados da conta</h2>
          <Button variant="painel" size="pequeno" onClick={() => setEditar(true)}>
            <Pencil /> Editar dados
          </Button>
        </div>

        <div className="mt-5 flex items-center gap-3.5 border-b border-borda pb-5">
          <Avatar nome={conta.nome} tamanho={56} imagem={conta.foto} />
          <div>
            <p className="text-base font-bold text-cartao-titulo">{conta.nome}</p>
            <p className="mt-0.5 text-xs text-cartao-texto">{conta.perfil}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
          <InfoLinha icone={User} titulo="Nome completo">{conta.nome}</InfoLinha>
          <InfoLinha icone={MapPin} titulo="Morada">{conta.morada}</InfoLinha>
          <InfoLinha icone={Shield} titulo="Perfil">{conta.perfil}</InfoLinha>
          <InfoLinha icone={CircleCheck} titulo="Estado do perfil">{conta.ativo ? "Ativo" : "Inativo"}</InfoLinha>
          <InfoLinha icone={Upload} titulo="Foto de perfil">{conta.nomeFoto}</InfoLinha>
        </div>
      </Card>

      {/* U1 - Editar dados */}
      {editar && (
        <JanelaEditarDados
          conta={conta}
          aoFechar={() => setEditar(false)}
          aoGuardar={(atualizada) => {
            setConta({ ...atualizada });
            setEditar(false);
            aoGuardar();
          }}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------
// U1 - Janela "Editar dados"
// ---------------------------------------------------------
type EditarDadosProps = {
  conta: Administrador;
  aoFechar: () => void;
  aoGuardar: (conta: Administrador) => void;
};

function JanelaEditarDados({ conta, aoFechar, aoGuardar }: EditarDadosProps) {
  const [nome, setNome] = useState(conta.nome);
  const [morada, setMorada] = useState(conta.morada);
  const [estado, setEstado] = useState(conta.ativo ? "Ativo" : "Inativo");
  const [nomeFoto, setNomeFoto] = useState("");
  const [erros, setErros] = useState<{ nome?: string; geral?: string }>({});
  const [aGuardar, setAGuardar] = useState(false);

  async function guardar() {
    // Validação: o nome é obrigatório
    if (nome.trim() === "") {
      setErros({ nome: "O nome completo é obrigatório." });
      return;
    }
    setErros({});
    setAGuardar(true);
    try {
      const atualizada = await guardarConta({ nome: nome.trim(), morada, ativo: estado === "Ativo" });
      aoGuardar(nomeFoto ? { ...atualizada, nomeFoto } : atualizada);
    } catch (e) {
      setErros({ geral: mensagemDeErro(e) });
      setAGuardar(false);
    }
  }

  return (
    <Janela aberta aoFechar={aoFechar} titulo="Editar dados" largura={780}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        <CampoTexto titulo="Nome completo *" icone={User} valor={nome} aoMudar={setNome} erro={erros.nome} />
        <CampoTexto titulo="Morada" icone={MapPin} valor={morada} aoMudar={setMorada} />
        <CampoTexto titulo="Perfil" icone={Shield} valor={conta.perfil} bloqueado />
        <CampoEscolha titulo="Estado do perfil" icone={CircleCheck} valor={estado} aoMudar={setEstado} opcoes={["Ativo", "Inativo"]} />
        <div className="col-span-2">
          <Rotulo titulo="Foto de perfil">
            <CarregarImagem
              previsualizacao={<Avatar nome={conta.nome} tamanho={56} imagem={conta.foto} />}
              textoBotao="Alterar imagem"
              nomeFicheiro={nomeFoto}
              aoEscolher={(f) => setNomeFoto(f.name)}
            />
          </Rotulo>
        </div>
      </div>

      {erros.geral && <p className="mt-4 text-sm font-medium text-perigo">{erros.geral}</p>}

      <BotoesJanela>
        <Button variant="branco" size="pequeno" onClick={aoFechar}>
          Cancelar
        </Button>
        <Button variant="escuro" size="pequeno" onClick={guardar} disabled={aGuardar}>
          <Check /> {aGuardar ? "A guardar..." : "Guardar"}
        </Button>
      </BotoesJanela>
    </Janela>
  );
}

// ---------------------------------------------------------
// U2 - Separador "Histórico da lavandaria" (tabela)
// ---------------------------------------------------------
function SeparadorHistorico() {
  const [lista, setLista] = useState<{ nome: string; logo: string }[] | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    listarHistoricoLavandarias()
      .then(setLista)
      .catch((e) => setErro(mensagemDeErro(e)));
  }, []);

  return (
    <>
      <TituloSeparador texto="Histórico da lavandaria" />
      <div className="mt-5 overflow-hidden rounded-2xl border border-borda bg-white">
        {!lista ? (
          <Carregando erro={erro} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Logo</TableHead>
                <TableHead>Lavandaria</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((l) => (
                <TableRow key={l.nome} className="h-[60px]">
                  <TableCell>
                    {l.logo ? (
                      <div className="flex size-10 items-center justify-center rounded-[10px] border border-borda-pesquisa bg-white">
                        <img src={l.logo} alt="" className="w-[33px] object-contain" />
                      </div>
                    ) : (
                      <Avatar nome={l.nome} tamanho={40} />
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">{l.nome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}

// ---------------------------------------------------------
// U3 - Separador "Informações" (tabela)
// ---------------------------------------------------------
function SeparadorInformacoes({ aoPublicar }: { aoPublicar: (texto: string) => void }) {
  const [informacoes, setInformacoes] = useState<Informacoes | null>(null);
  const [erro, setErro] = useState("");
  const [aEditar, setAEditar] = useState<QualInformacao | null>(null);

  function carregar() {
    obterInformacoes()
      .then((i) => setInformacoes({ ...i }))
      .catch((e) => setErro(mensagemDeErro(e)));
  }
  useEffect(carregar, []);

  if (!informacoes) return <Carregando erro={erro} />;

  // Uma linha da tabela por informação. "qual" = janela de edição (null = não se edita)
  const linhas: { qual: QualInformacao | null; icone: LucideIcon; titulo: string; texto: string; estado: ReactNode }[] = [
    { qual: "centralAjuda", icone: CircleHelp, titulo: "Central de ajuda", texto: "Guias e perguntas frequentes para administradores", estado: "—" },
    { qual: "termos", icone: File, titulo: "Termos e condições", texto: `Última atualização: ${informacoes.termos.ultimaAtualizacao}`, estado: informacoes.termos.versao },
    { qual: "privacidade", icone: Lock, titulo: "Política de privacidade", texto: "Como tratamos os dados de clientes, lavandarias e entregadores", estado: informacoes.privacidade.versao },
    {
      qual: null,
      icone: Bell,
      titulo: "Notificações",
      texto: "Novos registos, lavandarias pendentes e alertas",
      estado: (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sucesso">
          <span className="size-[7px] rounded-full bg-sucesso" />
          {informacoes.notificacoesAtivas ? "Ativas" : "Desativadas"}
        </span>
      ),
    },
    {
      qual: "sobre",
      icone: Info,
      titulo: "Sobre a Sukula",
      texto: `Plataforma de lavandaria a pedido · ${informacoes.sobre.sede.split(",")[0]}`,
      estado: informacoes.sobre.versao,
    },
  ];

  return (
    <>
      <TituloSeparador texto="Informações" />
      <div className="mt-5 overflow-hidden rounded-2xl border border-borda bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Informação</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[140px]">Versão / Estado</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {linhas.map((linha) => {
              const Icone = linha.icone;
              return (
                <TableRow key={linha.titulo} className="h-[60px]">
                  <TableCell>
                    <div className="flex items-center gap-2.5 font-semibold">
                      <span className="flex size-9 items-center justify-center">
                        <Icone className="size-[18px]" strokeWidth={1.6} />
                      </span>
                      {linha.titulo}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{linha.texto}</TableCell>
                  <TableCell className="font-semibold">{linha.estado}</TableCell>
                  <TableCell>
                    {linha.qual && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => setAEditar(linha.qual)}
                          className="flex size-[34px] cursor-pointer items-center justify-center rounded-[10px] text-fundo hover:bg-borda/60"
                          aria-label={`Editar ${linha.titulo}`}
                        >
                          <Pencil className="size-4" strokeWidth={1.6} />
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <p className="mt-4 text-xs text-claro-2">
        © 2026 {informacoes.sobre.empresa} · NIF {informacoes.sobre.nif} · {informacoes.sobre.sede}
      </p>

      {/* U3.1 a U3.5 - Janelas de edição */}
      {aEditar && (
        <EditarInformacoes
          qual={aEditar}
          informacoes={informacoes}
          aoFechar={() => setAEditar(null)}
          aoPublicar={(texto) => {
            setAEditar(null);
            carregar();
            aoPublicar(texto); // U3.6 - aviso "Alterações publicadas"
          }}
        />
      )}
    </>
  );
}
