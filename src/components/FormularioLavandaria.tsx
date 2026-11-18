// Telas Q2 e Q3 - Janela "Adicionar lavandaria" / "Editar lavandaria"
// Uso:
//   <FormularioLavandaria lavandaria={null} aoFechar={...} aoGuardar={...} />   -> Adicionar (Q2)
//   <FormularioLavandaria lavandaria={lav}  aoFechar={...} aoGuardar={...} />   -> Editar (Q3)
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Clock, MapPin, Plus, Store, Tag, Trash2, Upload, WashingMachine, X } from "lucide-react";
import { mensagemDeErro } from "@/api/configuracao";
import { adicionarLavandaria, editarLavandaria } from "@/api/lavandarias";
import { listarServicos } from "@/api/servicos";
import type { Categoria, Lavandaria, Servico, ServicoDaLavandaria } from "@/api/tipos";
import Avatar from "./Avatar";
import { CampoEscolha, CampoTexto, CampoTextoLongo, Rotulo } from "./Campo";
import { BotaoEscolherFicheiro, EscolhedorEscondido } from "./CarregarImagem";
import Janela, { BotoesJanela } from "./Janela";
import { Button } from "@/components/ui/button";
import { formatarNumero } from "@/lib/utils";

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

// Horas de 30 em 30 minutos: "06:00", "06:30", ... "22:00"
const HORAS: string[] = [];
for (let h = 6; h <= 22; h++) {
  HORAS.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 22) HORAS.push(`${String(h).padStart(2, "0")}:30`);
}

type Props = {
  lavandaria: Lavandaria | null; // null = adicionar uma nova
  aoFechar: () => void;
  aoGuardar: (lavandaria: Lavandaria) => void;
};

export default function FormularioLavandaria({ lavandaria, aoFechar, aoGuardar }: Props) {
  const editar = lavandaria !== null;

  // Valores do formulário
  const [nome, setNome] = useState(lavandaria?.nome ?? "");
  const [localizacao, setLocalizacao] = useState(lavandaria?.localizacao ?? "");
  const [descricao, setDescricao] = useState(lavandaria?.descricao ?? "");
  const [dias, setDias] = useState<string[]>(lavandaria?.dias ?? ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]);
  const [abertura, setAbertura] = useState(lavandaria?.abertura ?? "08:00");
  const [encerramento, setEncerramento] = useState(lavandaria?.encerramento ?? "19:00");
  const [servicosEscolhidos, setServicosEscolhidos] = useState<ServicoDaLavandaria[]>(lavandaria?.servicos ?? []);
  const [nomeFoto, setNomeFoto] = useState("");

  // Serviços que existem na plataforma (para as listas de escolha)
  const [catalogo, setCatalogo] = useState<Servico[]>([]);

  // Erros
  const [erros, setErros] = useState<{ nome?: string; localizacao?: string; geral?: string }>({});
  const [aGuardar, setAGuardar] = useState(false);
  const escolhedor = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listarServicos().then(setCatalogo).catch(() => setCatalogo([]));
  }, []);

  function mudarDia(dia: string) {
    if (dias.includes(dia)) setDias(dias.filter((d) => d !== dia));
    else setDias(DIAS.filter((d) => dias.includes(d) || d === dia)); // mantém a ordem Seg..Dom
  }

  // ----- Serviços da lavandaria -----
  function adicionarLinhaServico() {
    const primeiro = catalogo[0];
    if (!primeiro) return;
    setServicosEscolhidos([
      ...servicosEscolhidos,
      { servico: primeiro.nome, categoria: primeiro.categoria, artigos: primeiro.artigos.map((a) => a.artigo), preco: primeiro.precoBase },
    ]);
  }

  function mudarLinha(posicao: number, nova: ServicoDaLavandaria) {
    setServicosEscolhidos(servicosEscolhidos.map((linha, i) => (i === posicao ? nova : linha)));
  }

  function escolherServico(posicao: number, nomeServico: string) {
    const servico = catalogo.find((s) => s.nome === nomeServico);
    if (!servico) return;
    mudarLinha(posicao, {
      servico: servico.nome,
      categoria: servico.categoria,
      artigos: servico.artigos.map((a) => a.artigo),
      preco: servico.precoBase,
    });
  }

  function removerLinha(posicao: number) {
    setServicosEscolhidos(servicosEscolhidos.filter((_, i) => i !== posicao));
  }

  // ----- Guardar -----
  async function guardar() {
    // Validação: nome e localização são obrigatórios
    const novosErros: typeof erros = {};
    if (nome.trim() === "") novosErros.nome = "Indique o nome da lavandaria.";
    if (localizacao.trim() === "") novosErros.localizacao = "Indique a localização.";
    setErros(novosErros);
    if (novosErros.nome || novosErros.localizacao) return;

    // A "zona" é a parte final da localização (ex.: "Kilamba, Luanda")
    const partes = localizacao.split(",").map((p) => p.trim());
    const zona = partes.length >= 2 ? partes.slice(-2).join(", ") : localizacao;
    const categorias = [...new Set(servicosEscolhidos.map((s) => s.categoria))] as Categoria[];

    const dados: Lavandaria = {
      id: lavandaria?.id ?? 0,
      nome: nome.trim(),
      zona: lavandaria?.zona ?? zona,
      localizacao,
      descricao,
      logo: lavandaria?.logo ?? "",
      foto: lavandaria?.foto ?? "",
      avaliacao: lavandaria?.avaliacao ?? null,
      nova: lavandaria?.nova ?? true,
      dias,
      abertura,
      encerramento,
      categorias,
      numeroServicos: servicosEscolhidos.length,
      servicos: servicosEscolhidos,
      ativa: lavandaria?.ativa ?? true,
    };

    setAGuardar(true);
    try {
      const guardada = editar ? await editarLavandaria(dados) : await adicionarLavandaria(dados);
      aoGuardar(guardada);
    } catch (e) {
      setErros({ geral: mensagemDeErro(e) });
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <Janela aberta aoFechar={aoFechar} titulo={editar ? "Editar lavandaria" : "Adicionar lavandaria"} largura={1120}>
      <div className="flex gap-5">
        {/* ---------- Coluna da esquerda: dados ---------- */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4">
            <CampoTexto titulo="Nome da lavandaria *" icone={Store} valor={nome} aoMudar={setNome} erro={erros.nome} />
            <CampoTexto titulo="Localização *" icone={MapPin} valor={localizacao} aoMudar={setLocalizacao} erro={erros.localizacao} />
          </div>
          <div className="mt-5">
            <CampoTextoLongo titulo="Descrição" valor={descricao} aoMudar={setDescricao} />
          </div>

          <div className="mt-4 border-t border-borda" />

          <p className="mt-6 text-base font-bold text-fundo">Horário de funcionamento</p>
          <div className="mt-4">
            <Rotulo titulo="Dias de funcionamento">
              <div className="flex gap-2">
                {DIAS.map((dia) => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => mudarDia(dia)}
                    className={
                      dias.includes(dia)
                        ? "h-10 w-14 cursor-pointer rounded-[10px] bg-fundo text-[13px] font-semibold text-white"
                        : "h-10 w-14 cursor-pointer rounded-[10px] border border-borda-campo bg-white text-[13px] font-medium text-cinza"
                    }
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </Rotulo>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <CampoEscolha titulo="Abertura" icone={Clock} valor={abertura} aoMudar={setAbertura} opcoes={HORAS} />
            <CampoEscolha titulo="Encerramento" icone={Clock} valor={encerramento} aoMudar={setEncerramento} opcoes={HORAS} />
          </div>
        </div>

        {/* ---------- Coluna da direita: foto de perfil ---------- */}
        <div className="h-fit w-[300px] shrink-0 rounded-2xl border border-borda p-6">
          <p className="text-base font-bold text-fundo">Foto de perfil</p>
          <div className="mt-[18px] flex flex-col items-center rounded-xl border border-borda-upload bg-campo-bloqueado px-2 pb-6 pt-[18px] text-center">
            {editar ? (
              <Avatar nome={nome || "?"} tamanho={88} tipo="suave" />
            ) : (
              <Upload className="mt-5 size-5 text-fundo" strokeWidth={1.6} />
            )}
            <p className={`text-[13px] font-semibold text-fundo ${editar ? "mt-2.5" : "mt-5"}`}>
              {nomeFoto || (editar ? "Importar nova imagem" : "Importar imagem")}
            </p>
            <p className="mb-4 mt-1.5 whitespace-nowrap text-[11px] text-cinza">JPG ou PNG · até 5 MB · formato quadrado</p>
            <BotaoEscolherFicheiro texto={editar ? "Alterar imagem" : "Escolher ficheiro"} aoClicar={() => escolhedor.current?.click()} />
            <EscolhedorEscondido referencia={escolhedor} aoEscolher={(f) => setNomeFoto(f.name)} />
          </div>
        </div>
      </div>

      {/* ---------- Serviços ---------- */}
      <div className="mt-[18px] border-t border-borda" />
      <div className="mt-4 flex items-center justify-between">
        <p className="text-base font-bold text-fundo">Serviços</p>
        <Button variant="azul" className="h-[38px]" onClick={adicionarLinhaServico}>
          <Plus /> Adicionar serviço
        </Button>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {servicosEscolhidos.map((linha, posicao) => (
          <div key={posicao} className="flex items-end gap-3">
            <div className="w-[270px]">
              <CampoEscolha
                titulo="Serviço"
                icone={WashingMachine}
                valor={linha.servico}
                aoMudar={(valor) => escolherServico(posicao, valor)}
                opcoes={catalogo.length ? catalogo.map((s) => s.nome) : [linha.servico]}
              />
            </div>
            <div className="w-[160px]">
              <CampoEscolha
                titulo="Categoria"
                icone={Tag}
                valor={linha.categoria}
                aoMudar={(valor) => mudarLinha(posicao, { ...linha, categoria: valor as Categoria })}
                opcoes={["Roupa", "Calçados", "Lar"]}
              />
            </div>
            <div className="min-w-0 flex-1">
              <EscolherArtigos
                escolhidos={linha.artigos}
                disponiveis={catalogo.find((s) => s.nome === linha.servico)?.artigos.map((a) => a.artigo) ?? linha.artigos}
                aoMudar={(artigos) => mudarLinha(posicao, { ...linha, artigos })}
              />
            </div>
            <div className="w-[130px]">
              <CampoTexto
                titulo="Preço"
                valor={linha.preco ? formatarNumero(linha.preco) : ""}
                aoMudar={(valor) => mudarLinha(posicao, { ...linha, preco: Number(valor.replace(/\D/g, "")) })}
                depois={<span className="text-[13px] font-semibold text-cinza">Kz</span>}
              />
            </div>
            <button
              type="button"
              onClick={() => removerLinha(posicao)}
              className="mb-[11px] flex size-[26px] cursor-pointer items-center justify-center text-perigo"
              aria-label="Remover serviço"
            >
              <Trash2 className="size-[18px]" strokeWidth={1.6} />
            </button>
          </div>
        ))}
      </div>

      {erros.geral && <p className="mt-4 text-sm font-medium text-perigo">{erros.geral}</p>}

      <BotoesJanela>
        <Button variant="branco" onClick={aoFechar}>
          Cancelar
        </Button>
        <Button variant="escuro" onClick={guardar} disabled={aGuardar}>
          <Check /> {aGuardar ? "A guardar..." : editar ? "Guardar alterações" : "Guardar lavandaria"}
        </Button>
      </BotoesJanela>
    </Janela>
  );
}

// Campo "Artigos": etiquetas com "x" + lista para acrescentar mais
function EscolherArtigos({ escolhidos, disponiveis, aoMudar }: { escolhidos: string[]; disponiveis: string[]; aoMudar: (artigos: string[]) => void }) {
  const porEscolher = disponiveis.filter((a) => !escolhidos.includes(a));
  return (
    <Rotulo titulo="Artigos">
      <div className="relative flex h-12 items-center gap-1.5 overflow-hidden rounded-xl border border-borda-campo bg-white pl-[11px] pr-10">
        {escolhidos.map((artigo) => (
          <span key={artigo} className="flex h-[23px] shrink-0 items-center gap-1 rounded-lg bg-claro pl-2.5 pr-1.5 text-xs font-semibold text-fundo">
            {artigo}
            <button type="button" onClick={() => aoMudar(escolhidos.filter((a) => a !== artigo))} className="cursor-pointer" aria-label={`Tirar ${artigo}`}>
              <X className="size-3" strokeWidth={2} />
            </button>
          </span>
        ))}
        {/* Lista escondida por cima da seta, para acrescentar um artigo */}
        <select
          value=""
          onChange={(e) => e.target.value && aoMudar([...escolhidos, e.target.value])}
          className="absolute right-0 top-0 h-full w-10 cursor-pointer opacity-0"
          aria-label="Acrescentar artigo"
        >
          <option value="">Escolher artigo</option>
          {porEscolher.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-[15px] size-[18px] text-fundo" strokeWidth={1.6} />
      </div>
    </Rotulo>
  );
}
