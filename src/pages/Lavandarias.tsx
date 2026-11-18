// Telas Q, Q2, Q2.1, Q3, Q4, Q4.1 e Q5 - Gestão de lavandarias
// - Q   : lista de lavandarias (cartões)
// - Q2  : janela "Adicionar lavandaria"      -> Q2.1 aviso "Lavandaria adicionada"
// - Q3  : janela "Editar lavandaria"
// - Q4  : janela "Remover lavandaria?"       -> Q4.1 aviso "Lavandaria removida"
// - Q5  : painel "Filtrar lavandarias"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock, Filter, MapPin, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { mensagemDeErro } from "@/api/configuracao";
import { listarLavandarias, mudarEstadoLavandaria, removerLavandaria } from "@/api/lavandarias";
import type { Categoria, Lavandaria } from "@/api/tipos";
import { LogoLavandaria } from "@/components/Avatar";
import Aviso, { type DadosAviso } from "@/components/Aviso";
import { EtiquetaAzul } from "@/components/Etiquetas";
import FormularioLavandaria from "@/components/FormularioLavandaria";
import Interruptor from "@/components/Interruptor";
import JanelaConfirmar, { ItemARemover } from "@/components/JanelaConfirmar";
import Layout from "@/components/Layout";
import Pesquisa from "@/components/Pesquisa";
import TituloPagina, { Carregando } from "@/components/TituloPagina";
import { Button } from "@/components/ui/button";

// Opções do painel "Filtrar lavandarias" (Q5)
const FILTRO_CATEGORIAS: Categoria[] = ["Roupa", "Calçados", "Lar"];
const FILTRO_SERVICOS = ["Lavagem + Engomar", "Lavagem a Seco", "Engomar", "Lavagem de Calçado", "Graxa", "Lavagem de Tapete"];
const FILTRO_HORARIOS = ["Seg – Sex", "Seg – Sáb", "Fim de semana", "Aberto agora"];

type FiltrosEscolhidos = { categorias: string[]; servicos: string[]; horarios: string[] };
const SEM_FILTROS: FiltrosEscolhidos = { categorias: [], servicos: [], horarios: [] };

export default function Lavandarias() {
  const [lavandarias, setLavandarias] = useState<Lavandaria[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  // Filtros (Q5)
  const [painelFiltro, setPainelFiltro] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosEscolhidos>(SEM_FILTROS);

  // Janelas
  const [escolhida, setEscolhida] = useState<Lavandaria | null>(null);
  const [janela, setJanela] = useState<"" | "adicionar" | "editar" | "remover">("");
  const [aRemover, setARemover] = useState(false);
  const [destacada, setDestacada] = useState<number | null>(null); // cartão com borda clara (nova ou a remover)
  const [aviso, setAviso] = useState<DadosAviso | null>(null);

  useEffect(() => {
    listarLavandarias()
      .then(setLavandarias)
      .catch((e) => setErro(mensagemDeErro(e)))
      .finally(() => setACarregar(false));
  }, []);

  async function mudarEstado(lavandaria: Lavandaria, ativa: boolean) {
    setLavandarias(lavandarias.map((l) => (l.id === lavandaria.id ? { ...l, ativa } : l)));
    try {
      await mudarEstadoLavandaria(lavandaria.id, ativa);
    } catch (e) {
      setAviso({ titulo: "Não foi possível alterar", texto: mensagemDeErro(e) });
    }
  }

  async function confirmarRemocao() {
    if (!escolhida) return;
    setARemover(true);
    try {
      await removerLavandaria(escolhida.id);
      setLavandarias(lavandarias.filter((l) => l.id !== escolhida.id));
      setJanela("");
      setAviso({ titulo: "Lavandaria removida", texto: `A ${escolhida.nome} foi removida da plataforma.` }); // Q4.1
    } catch (e) {
      setAviso({ titulo: "Não foi possível remover", texto: mensagemDeErro(e) });
    } finally {
      setARemover(false);
    }
  }

  // Quantos filtros estão escolhidos (aparece ao lado do botão "Filtrar")
  const totalFiltros = filtros.categorias.length + filtros.servicos.length + filtros.horarios.length;

  // Aplica a pesquisa e os filtros à lista
  const texto = pesquisa.toLowerCase();
  const visiveis = lavandarias.filter((l) => {
    if (!l.nome.toLowerCase().includes(texto) && !l.zona.toLowerCase().includes(texto)) return false;
    if (filtros.categorias.length && !l.categorias.some((c) => filtros.categorias.includes(c))) return false;
    if (filtros.servicos.length && !l.servicos.some((s) => filtros.servicos.includes(s.servico))) return false;
    if (filtros.horarios.length && !filtros.horarios.some((h) => cumpreHorario(l, h))) return false;
    return true;
  });

  return (
    <Layout titulo="Gestão de lavandarias">
      <TituloPagina
        titulo="Lavandarias"
        botoes={
          <Button variant="claro" onClick={() => setJanela("adicionar")}>
            <Plus /> Adicionar lavandaria
          </Button>
        }
      />

      <div className="relative mt-5 flex items-center justify-between">
        <Pesquisa valor={pesquisa} aoMudar={setPesquisa} textoExemplo="Pesquisar lavandaria ou localização" />
        <div className="flex items-center gap-3">
          {/* Sinal de filtros escolhidos: "2 filtros ativos · Limpar" */}
          {totalFiltros > 0 && (
            <span className="text-[13px] font-medium text-claro">
              {totalFiltros} {totalFiltros === 1 ? "filtro ativo" : "filtros ativos"} ·{" "}
              <button onClick={() => setFiltros(SEM_FILTROS)} className="cursor-pointer font-semibold text-link underline">
                Limpar
              </button>
            </span>
          )}
          <Button
            variant="painel"
            className={painelFiltro || totalFiltros > 0 ? "bg-azul" : ""}
            onClick={() => setPainelFiltro(!painelFiltro)}
          >
            <Filter /> Filtrar
            {/* Número de filtros escolhidos dentro do botão */}
            {totalFiltros > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-fundo">
                {totalFiltros}
              </span>
            )}
          </Button>
        </div>

        {/* Q5 - Filtrar lavandarias */}
        {painelFiltro && (
          <PainelFiltro
            filtros={filtros}
            aoFechar={() => setPainelFiltro(false)}
            aoAplicar={(novos) => {
              setFiltros(novos);
              setPainelFiltro(false);
            }}
          />
        )}
      </div>

      {/* Cartões das lavandarias */}
      {aCarregar || erro ? (
        <Carregando erro={erro} />
      ) : (
        <div className="mt-5 grid grid-cols-3 gap-5">
          {visiveis.map((lavandaria) => (
            <CartaoLavandaria
              key={lavandaria.id}
              lavandaria={lavandaria}
              destacada={destacada === lavandaria.id}
              aoMudarEstado={(ativa) => mudarEstado(lavandaria, ativa)}
              aoEditar={() => {
                setEscolhida(lavandaria);
                setJanela("editar");
              }}
              aoRemover={() => {
                setEscolhida(lavandaria);
                setDestacada(lavandaria.id);
                setJanela("remover");
              }}
            />
          ))}
        </div>
      )}

      {/* Q2 - Adicionar / Q3 - Editar */}
      {(janela === "adicionar" || janela === "editar") && (
        <FormularioLavandaria
          lavandaria={janela === "editar" ? escolhida : null}
          aoFechar={() => setJanela("")}
          aoGuardar={(guardada) => {
            if (janela === "adicionar") {
              setLavandarias([guardada, ...lavandarias]);
              setDestacada(guardada.id);
              setAviso({ titulo: "Lavandaria adicionada", texto: `${guardada.nome} já está disponível na plataforma.` }); // Q2.1
            } else {
              setLavandarias(lavandarias.map((l) => (l.id === guardada.id ? guardada : l)));
              setAviso({ titulo: "Alterações guardadas", texto: `Os dados da ${guardada.nome} foram atualizados.` });
            }
            setJanela("");
          }}
        />
      )}

      {/* Q4 - Remover lavandaria? */}
      <JanelaConfirmar
        aberta={janela === "remover"}
        aoFechar={() => {
          setJanela("");
          setDestacada(null);
        }}
        aoConfirmar={confirmarRemocao}
        aCarregar={aRemover}
        titulo="Remover lavandaria?"
        texto={`A ${escolhida?.nome} deixará de aparecer na aplicação e os seus serviços, artigos e fotografias serão removidos. Esta ação não pode ser anulada.`}
        textoBotao="Sim, remover lavandaria"
      >
        {escolhida && (
          <ItemARemover
            imagem={<img src={escolhida.foto} alt="" className="h-11 w-14 rounded-lg bg-white object-cover" />}
            titulo={escolhida.nome}
            texto={`${escolhida.zona} · ${escolhida.numeroServicos} serviços`}
          />
        )}
      </JanelaConfirmar>

      <Aviso aviso={aviso} aoFechar={() => setAviso(null)} />
    </Layout>
  );
}

// "Seg – Sáb · 07:30 – 19:30"
export function textoHorario(lavandaria: Lavandaria) {
  const dias = lavandaria.dias;
  const intervalo = dias.length > 1 ? `${dias[0]} – ${dias[dias.length - 1]}` : dias[0] ?? "";
  return `${intervalo} · ${lavandaria.abertura} – ${lavandaria.encerramento}`;
}

// Verifica se a lavandaria cumpre a opção de horário escolhida no filtro
function cumpreHorario(lavandaria: Lavandaria, opcao: string) {
  const dias = lavandaria.dias;
  if (opcao === "Seg – Sex") return ["Seg", "Ter", "Qua", "Qui", "Sex"].every((d) => dias.includes(d));
  if (opcao === "Seg – Sáb") return ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].every((d) => dias.includes(d));
  if (opcao === "Fim de semana") return dias.includes("Sáb") || dias.includes("Dom");
  // "Aberto agora": hoje é dia de funcionamento e a hora está dentro do horário
  const agora = new Date();
  const hoje = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][agora.getDay()];
  const hora = `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`;
  return dias.includes(hoje) && hora >= lavandaria.abertura && hora <= lavandaria.encerramento;
}

// ---------------------------------------------------------
// Cartão de uma lavandaria
// ---------------------------------------------------------
type CartaoProps = {
  lavandaria: Lavandaria;
  destacada: boolean;
  aoMudarEstado: (ativa: boolean) => void;
  aoEditar: () => void;
  aoRemover: () => void;
};

function CartaoLavandaria({ lavandaria, destacada, aoMudarEstado, aoEditar, aoRemover }: CartaoProps) {
  let avaliacao = "—";
  if (lavandaria.nova) avaliacao = "Nova";
  else if (lavandaria.avaliacao !== null) avaliacao = lavandaria.avaliacao.toLocaleString("pt-PT");

  return (
    <div className={`rounded-2xl bg-white px-[19px] pb-[18px] pt-[17px] ${destacada ? "border-2 border-link" : "border border-painel-borda"}`}>
      {/* Logótipo, nome e avaliação */}
      <div className="flex items-start gap-3">
        <LogoLavandaria nome={lavandaria.nome} logo={lavandaria.logo} />
        <div className="min-w-0 flex-1 pt-[5px]">
          <p className="truncate text-sm font-bold text-cartao-titulo">{lavandaria.nome}</p>
          <p className="mt-[3px] flex items-center gap-1 truncate text-xs text-cartao-texto">
            <MapPin className="size-[13px] shrink-0" strokeWidth={1.6} /> {lavandaria.zona}
          </p>
        </div>
        <span className="mt-[15px] flex items-center gap-1 text-xs font-semibold text-cartao-texto">
          <Star className="size-3.5" strokeWidth={1.6} /> {avaliacao}
        </span>
      </div>

      {/* Horário */}
      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-cartao-texto">
        <Clock className="size-3.5" strokeWidth={1.6} /> {textoHorario(lavandaria)}
      </p>

      {/* Categorias e número de serviços */}
      <div className="mt-3 flex items-center gap-1.5">
        {lavandaria.categorias.map((c) => (
          <EtiquetaAzul key={c} texto={c} />
        ))}
        <span className="ml-auto text-xs font-semibold text-cartao-texto">
          {lavandaria.numeroServicos} {lavandaria.numeroServicos === 1 ? "serviço" : "serviços"}
        </span>
      </div>

      <div className="mt-3 border-t border-painel-borda" />

      {/* Ações */}
      <div className="mt-3 flex items-center">
        <Link to={`/lavandarias/${lavandaria.id}`} className="flex items-center gap-1 text-xs font-semibold text-cartao-titulo">
          Ver detalhes <ChevronRight className="size-3.5" strokeWidth={1.8} />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Interruptor ligado={lavandaria.ativa} aoMudar={aoMudarEstado} />
          <span className={`w-[38px] text-xs font-semibold ${lavandaria.ativa ? "text-sucesso-vivo" : "text-cinza"}`}>
            {lavandaria.ativa ? "Ativa" : "Inativa"}
          </span>
          <button onClick={aoEditar} className="flex size-[34px] cursor-pointer items-center justify-center text-cartao-texto" aria-label="Editar">
            <Pencil className="size-4" strokeWidth={1.6} />
          </button>
          <button onClick={aoRemover} className="flex size-[34px] cursor-pointer items-center justify-center text-perigo" aria-label="Remover">
            <Trash2 className="size-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Q5 - Painel "Filtrar lavandarias"
// ---------------------------------------------------------
type PainelProps = {
  filtros: FiltrosEscolhidos;
  aoFechar: () => void;
  aoAplicar: (filtros: FiltrosEscolhidos) => void;
};

function PainelFiltro({ filtros, aoFechar, aoAplicar }: PainelProps) {
  // Cópia dos filtros: só passam a valer quando se carrega em "Aplicar filtros"
  const [escolhidos, setEscolhidos] = useState<FiltrosEscolhidos>(filtros);

  function alternar(grupo: keyof FiltrosEscolhidos, opcao: string) {
    const lista = escolhidos[grupo];
    const nova = lista.includes(opcao) ? lista.filter((o) => o !== opcao) : [...lista, opcao];
    setEscolhidos({ ...escolhidos, [grupo]: nova });
  }

  function Grupo({ titulo, grupo, opcoes }: { titulo: string; grupo: keyof FiltrosEscolhidos; opcoes: string[] }) {
    return (
      <div className="mt-5">
        <p className="text-[13px] font-semibold text-cinza">{titulo}</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {opcoes.map((opcao) => (
            <button
              key={opcao}
              onClick={() => alternar(grupo, opcao)}
              className={
                escolhidos[grupo].includes(opcao)
                  ? "h-[34px] cursor-pointer rounded-[10px] border border-fundo bg-fundo px-3.5 text-[13px] font-semibold text-white"
                  : "h-[34px] cursor-pointer rounded-[10px] border border-borda bg-white px-3.5 text-[13px] font-medium text-fundo"
              }
            >
              {opcao}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-[52px] z-20 w-[380px] rounded-[20px] border border-borda bg-white p-[25px] shadow-[0_12px_32px_rgba(0,71,128,0.16)]">
      <div className="flex items-center justify-between">
        <p className="text-base font-bold text-fundo">Filtrar lavandarias</p>
        <button onClick={aoFechar} className="cursor-pointer text-fundo" aria-label="Fechar">
          <X className="size-5" strokeWidth={1.8} />
        </button>
      </div>

      <Grupo titulo="Categoria" grupo="categorias" opcoes={FILTRO_CATEGORIAS} />
      <Grupo titulo="Serviços" grupo="servicos" opcoes={FILTRO_SERVICOS} />
      <Grupo titulo="Horários" grupo="horarios" opcoes={FILTRO_HORARIOS} />

      <div className="mt-5 border-t border-borda" />
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="branco" size="pequeno" onClick={() => setEscolhidos(SEM_FILTROS)}>
          Limpar
        </Button>
        <Button variant="escuro" size="pequeno" onClick={() => aoAplicar(escolhidos)}>
          Aplicar filtros
        </Button>
      </div>
    </div>
  );
}
