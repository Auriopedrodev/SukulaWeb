// Telas T a T4.1 - Gestão de entregadores
// - T    : lista de entregadores
// - T1   : janela "Detalhes do entregador"
// - T2   : janela "Adicionar entregador"   -> T2.1 aviso "Entregador adicionado"
// - T3   : janela "Editar entregador"      -> T3.1 aviso "Alterações guardadas"
// - T4   : janela "Remover entregador?"    -> T4.1 aviso "Entregador removido"
import { useEffect, useState } from "react";
import { Bike, Calendar, Check, CircleCheck, Clock, CreditCard, Mail, Pencil, Phone, Plus, Star, Trash2, User } from "lucide-react";
import { mensagemDeErro } from "@/api/configuracao";
import {
  adicionarEntregador,
  contarEntregadoresAtivos,
  editarEntregador,
  ENTREGADORES_POR_PAGINA,
  listarEntregadores,
  mudarEstadoEntregador,
  removerEntregador,
} from "@/api/entregadores";
import type { Entregador } from "@/api/tipos";
import Avatar from "@/components/Avatar";
import Aviso, { type DadosAviso } from "@/components/Aviso";
import BotoesAcoes from "@/components/BotoesAcoes";
import { CampoEscolha, CampoTexto } from "@/components/Campo";
import CartaoNumero from "@/components/CartaoNumero";
import InfoLinha from "@/components/InfoLinha";
import Interruptor from "@/components/Interruptor";
import Janela, { BotoesJanela } from "@/components/Janela";
import JanelaConfirmar, { ItemARemover } from "@/components/JanelaConfirmar";
import Layout from "@/components/Layout";
import Paginacao from "@/components/Paginacao";
import Pesquisa from "@/components/Pesquisa";
import TituloPagina, { Carregando } from "@/components/TituloPagina";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Opções da lista "Veículo" (tipo - modelo)
const VEICULOS = ["Mota - Suzuki", "Mota - Honda CG 125", "Carro - Toyota", "Carro - Hyundai", "Bicicleta"];

export default function Entregadores() {
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [total, setTotal] = useState(0);
  const [ativos, setAtivos] = useState(0);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [pagina, setPagina] = useState(1);

  const [escolhido, setEscolhido] = useState<Entregador | null>(null);
  const [janela, setJanela] = useState<"" | "detalhes" | "adicionar" | "editar" | "remover">("");
  const [aRemover, setARemover] = useState(false);
  const [aviso, setAviso] = useState<DadosAviso | null>(null);

  useEffect(() => {
    setACarregar(true);
    listarEntregadores(pagina, pesquisa)
      .then((r) => {
        setEntregadores(r.itens);
        setTotal(r.total);
        setErro("");
      })
      .catch((e) => setErro(mensagemDeErro(e)))
      .finally(() => setACarregar(false));
  }, [pagina, pesquisa]);

  useEffect(() => {
    contarEntregadoresAtivos().then(setAtivos).catch(() => setAtivos(0));
  }, []);

  function abrir(entregador: Entregador, qual: "detalhes" | "editar" | "remover") {
    setEscolhido(entregador);
    setJanela(qual);
  }

  async function mudarEstado(entregador: Entregador, ativo: boolean) {
    setEntregadores(entregadores.map((e) => (e.id === entregador.id ? { ...e, ativo } : e)));
    if (escolhido?.id === entregador.id) setEscolhido({ ...entregador, ativo });
    try {
      await mudarEstadoEntregador(entregador.id, ativo);
    } catch (e) {
      setAviso({ titulo: "Não foi possível alterar", texto: mensagemDeErro(e) });
    }
  }

  async function confirmarRemocao() {
    if (!escolhido) return;
    setARemover(true);
    try {
      await removerEntregador(escolhido.id);
      setEntregadores(entregadores.filter((e) => e.id !== escolhido.id));
      setTotal(total - 1);
      setJanela("");
      setAviso({ titulo: "Entregador removido", texto: `${escolhido.nome} foi removido dos entregadores.` }); // T4.1
    } catch (e) {
      setAviso({ titulo: "Não foi possível remover", texto: mensagemDeErro(e) });
    } finally {
      setARemover(false);
    }
  }

  return (
    <Layout titulo="Gestão de entregadores">
      <TituloPagina
        titulo="Entregadores"
        botoes={
          <Button variant="claro" onClick={() => setJanela("adicionar")}>
            <Plus /> Adicionar entregador
          </Button>
        }
      />

      <div className="mt-5 flex gap-4">
        <CartaoNumero icone={Bike} titulo="Total" valor={total} />
        <CartaoNumero icone={CircleCheck} titulo="Ativos" valor={ativos} />
      </div>

      <div className="mt-5">
        <Pesquisa
          valor={pesquisa}
          aoMudar={(t) => {
            setPesquisa(t);
            setPagina(1);
          }}
          textoExemplo="Pesquisar entregador ou telefone"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-borda bg-white">
        {aCarregar || erro ? (
          <Carregando erro={erro} />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Entregador</TableHead>
                  <TableHead className="w-[263px]">Veículo</TableHead>
                  <TableHead className="w-[166px]">Avaliação</TableHead>
                  <TableHead className="w-[170px]">Estado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entregadores.map((entregador) => (
                  <TableRow key={entregador.id} className="h-[58px]">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar nome={entregador.nome} tamanho={36} imagem={entregador.foto} />
                        <div>
                          <p className="font-semibold">{entregador.nome}</p>
                          <p className="mt-0.5 text-xs text-cinza">{entregador.telefone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{textoVeiculo(entregador)}</TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 font-semibold">
                        <Star className="size-3.5" strokeWidth={1.8} />
                        {entregador.avaliacao.toLocaleString("pt-PT")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Interruptor ligado={entregador.ativo} aoMudar={(ativo) => mudarEstado(entregador, ativo)} />
                        <span className={`text-xs font-semibold ${entregador.ativo ? "text-sucesso" : "text-cinza"}`}>
                          {entregador.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <BotoesAcoes
                        aoVer={() => abrir(entregador, "detalhes")}
                        aoEditar={() => abrir(entregador, "editar")}
                        aoRemover={() => abrir(entregador, "remover")}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Paginacao
              pagina={pagina}
              porPagina={ENTREGADORES_POR_PAGINA}
              total={total}
              quantidadeNaPagina={entregadores.length}
              nome="entregadores"
              aoMudar={setPagina}
            />
          </>
        )}
      </div>

      {/* T1 - Detalhes do entregador */}
      {escolhido && (
        <JanelaDetalhes
          aberta={janela === "detalhes"}
          entregador={escolhido}
          aoFechar={() => setJanela("")}
          aoMudarEstado={(ativo) => mudarEstado(escolhido, ativo)}
          aoEditar={() => setJanela("editar")}
          aoRemover={() => setJanela("remover")}
        />
      )}

      {/* T2 - Adicionar / T3 - Editar */}
      {(janela === "adicionar" || janela === "editar") && (
        <JanelaFormulario
          entregador={janela === "editar" ? escolhido : null}
          aoFechar={() => setJanela("")}
          aoGuardar={(guardado) => {
            if (janela === "adicionar") {
              setEntregadores([...entregadores, guardado]);
              setTotal(total + 1);
              setAviso({ titulo: "Entregador adicionado", texto: `${guardado.nome} recebeu os dados de acesso por SMS.` }); // T2.1
            } else {
              setEntregadores(entregadores.map((e) => (e.id === guardado.id ? guardado : e)));
              setAviso({ titulo: "Alterações guardadas", texto: `A zona de atuação de ${guardado.nome} foi atualizada.` }); // T3.1
            }
            setJanela("");
          }}
        />
      )}

      {/* T4 - Remover entregador? */}
      <JanelaConfirmar
        aberta={janela === "remover"}
        aoFechar={() => setJanela("")}
        aoConfirmar={confirmarRemocao}
        aCarregar={aRemover}
        titulo="Remover entregador?"
        texto={`${escolhido?.nome} perderá o acesso à aplicação de entregas e deixará de receber pedidos de recolha e entrega. Esta ação não pode ser anulada.`}
        textoBotao="Sim, remover entregador"
      >
        {escolhido && (
          <ItemARemover
            imagem={<Avatar nome={escolhido.nome} tamanho={40} tipo="escuro" imagem={escolhido.foto} />}
            titulo={escolhido.nome}
            texto={`${escolhido.telefone} · ${escolhido.lavandaria}`}
          />
        )}
      </JanelaConfirmar>

      <Aviso aviso={aviso} aoFechar={() => setAviso(null)} />
    </Layout>
  );
}

// "Mota · LD-24-87-AB" (ou só "Bicicleta")
function textoVeiculo(entregador: Entregador) {
  return entregador.matricula ? `${entregador.veiculo} · ${entregador.matricula}` : entregador.veiculo;
}

// ---------------------------------------------------------
// T1 - Janela "Detalhes do entregador"
// ---------------------------------------------------------
type DetalhesProps = {
  aberta: boolean;
  entregador: Entregador;
  aoFechar: () => void;
  aoMudarEstado: (ativo: boolean) => void;
  aoEditar: () => void;
  aoRemover: () => void;
};

function JanelaDetalhes({ aberta, entregador: e, aoFechar, aoMudarEstado, aoEditar, aoRemover }: DetalhesProps) {
  return (
    <Janela aberta={aberta} aoFechar={aoFechar} titulo="Detalhes do entregador" largura={1000} tituloClaro>
      <div className="flex gap-5">
        {/* Cartão do entregador */}
        <div className="flex h-[370px] w-[320px] shrink-0 flex-col items-center rounded-2xl border border-painel-borda bg-painel px-3.5 pt-[29px]">
          <Avatar nome={e.nome} tamanho={88} tipo="escuro" imagem={e.foto} />
          <p className="mt-3.5 text-lg font-bold text-claro">{e.nome}</p>
          <p className="mt-1 text-[13px] text-claro-2">{e.utilizador}</p>
          <div className="mt-3 flex items-center gap-2">
            <Interruptor ligado={e.ativo} aoMudar={aoMudarEstado} />
            <span className={`text-xs font-semibold ${e.ativo ? "text-sucesso-vivo" : "text-claro-2"}`}>{e.ativo ? "Ativo" : "Inativo"}</span>
          </div>

          <div className="mt-3.5 w-full border-t border-painel-borda" />
          <div className="grid w-full grid-cols-3 px-[11px] py-3.5 text-center">
            <Numero valor={String(e.entregas)} titulo="Entregas" />
            <Numero valor={e.avaliacao.toLocaleString("pt-PT")} titulo="Avaliação" />
            <Numero valor={`${e.sucesso}%`} titulo="Sucesso" />
          </div>
          <div className="w-full border-t border-painel-borda" />

          <div className="flex w-full flex-col gap-2.5 px-[11px] pt-3.5 text-xs font-medium text-claro">
            <p className="flex items-center gap-2.5">
              <Calendar className="size-4" strokeWidth={1.6} /> Entregador desde {e.desde}
            </p>
            <p className="flex items-center gap-2.5">
              <Clock className="size-4" strokeWidth={1.6} /> Última atividade: {e.ultimaAtividade}
            </p>
          </div>
        </div>

        {/* Informações do entregador */}
        <div className="h-[370px] flex-1 rounded-2xl border border-painel-borda bg-painel p-[25px]">
          <p className="text-base font-bold text-claro">Informações do entregador</p>
          <div className="mt-[22px] grid grid-cols-2 gap-x-6 gap-y-[22px]">
            <InfoLinha escuro icone={User} titulo="Nome completo">{e.nome}</InfoLinha>
            <InfoLinha escuro icone={Mail} titulo="E-mail">{e.email}</InfoLinha>
            <InfoLinha escuro icone={Phone} titulo="Telefone">{e.telefone}</InfoLinha>
            <InfoLinha escuro icone={Bike} titulo="Veículo">{e.modelo ? `${e.veiculo} · ${e.modelo}` : e.veiculo}</InfoLinha>
            <InfoLinha escuro icone={CreditCard} titulo="Matrícula">{e.matricula || "—"}</InfoLinha>
          </div>
        </div>
      </div>

      <BotoesJanela>
        <Button variant="perigo" onClick={aoRemover}>
          <Trash2 /> Remover
        </Button>
        <Button variant="claro" onClick={aoEditar}>
          <Pencil /> Editar entregador
        </Button>
      </BotoesJanela>
    </Janela>
  );
}

function Numero({ valor, titulo }: { valor: string; titulo: string }) {
  return (
    <div>
      <p className="text-base font-bold text-claro">{valor}</p>
      <p className="mt-1 text-[11px] text-claro-2">{titulo}</p>
    </div>
  );
}

// ---------------------------------------------------------
// T2 / T3 - Janela "Adicionar entregador" / "Editar entregador"
// ---------------------------------------------------------
type FormularioProps = {
  entregador: Entregador | null; // null = adicionar
  aoFechar: () => void;
  aoGuardar: (entregador: Entregador) => void;
};

function JanelaFormulario({ entregador, aoFechar, aoGuardar }: FormularioProps) {
  const editar = entregador !== null;
  const veiculoAtual = entregador ? (entregador.modelo ? `${entregador.veiculo} - ${entregador.modelo}` : entregador.veiculo) : VEICULOS[0];

  const [nome, setNome] = useState(entregador?.nome ?? "");
  const [email, setEmail] = useState(entregador?.email ?? "");
  const [telefone, setTelefone] = useState(entregador?.telefone ?? "");
  const [veiculo, setVeiculo] = useState(VEICULOS.includes(veiculoAtual) ? veiculoAtual : VEICULOS[0]);
  const [matricula, setMatricula] = useState(entregador?.matricula ?? "");
  const [erros, setErros] = useState<{ nome?: string; email?: string; telefone?: string; matricula?: string; geral?: string }>({});
  const [aGuardar, setAGuardar] = useState(false);

  async function guardar() {
    // Validação dos campos obrigatórios (*)
    const novos: typeof erros = {};
    if (nome.trim() === "") novos.nome = "Indique o nome completo.";
    if (email && !email.includes("@")) novos.email = "E-mail inválido.";
    if (telefone.replace(/\D/g, "").length < 9) novos.telefone = "Indique um telefone válido.";
    if (veiculo !== "Bicicleta" && matricula.trim() === "") novos.matricula = "Indique a matrícula.";
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    const [tipo, modelo = ""] = veiculo.split(" - ");
    const nomeLimpo = nome.trim();
    const dados: Entregador = {
      id: entregador?.id ?? 0,
      nome: nomeLimpo,
      utilizador: entregador?.utilizador ?? `@${nomeLimpo.split(" ")[0].toLowerCase()}.estafeta`,
      telefone,
      email,
      veiculo: tipo,
      modelo,
      matricula: veiculo === "Bicicleta" ? "" : matricula.trim(),
      avaliacao: entregador?.avaliacao ?? 0,
      ativo: entregador?.ativo ?? true,
      foto: entregador?.foto ?? "",
      entregas: entregador?.entregas ?? 0,
      sucesso: entregador?.sucesso ?? 0,
      desde: entregador?.desde ?? "hoje",
      ultimaAtividade: entregador?.ultimaAtividade ?? "—",
      lavandaria: entregador?.lavandaria ?? "",
    };

    setAGuardar(true);
    try {
      aoGuardar(editar ? await editarEntregador(dados) : await adicionarEntregador(dados));
    } catch (e) {
      setErros({ geral: mensagemDeErro(e) });
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <Janela aberta aoFechar={aoFechar} titulo={editar ? "Editar entregador" : "Adicionar entregador"} largura={760}>
      <CampoTexto titulo="Nome completo *" icone={User} valor={nome} aoMudar={setNome} erro={erros.nome} />
      <div className="mt-5 grid grid-cols-2 gap-4">
        <CampoTexto titulo="E-mail" icone={Mail} tipo="email" valor={email} aoMudar={setEmail} erro={erros.email} />
        <CampoTexto titulo="Telefone *" icone={Phone} tipo="tel" valor={telefone} aoMudar={setTelefone} erro={erros.telefone} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <CampoEscolha titulo="Veículo *" icone={Bike} valor={veiculo} aoMudar={setVeiculo} opcoes={VEICULOS} />
        <CampoTexto titulo="Matrícula *" icone={CreditCard} valor={matricula} aoMudar={setMatricula} erro={erros.matricula} />
      </div>

      {erros.geral && <p className="mt-4 text-sm font-medium text-perigo">{erros.geral}</p>}

      <BotoesJanela>
        <Button variant="branco" onClick={aoFechar}>
          Cancelar
        </Button>
        <Button variant="escuro" onClick={guardar} disabled={aGuardar}>
          <Check /> {aGuardar ? "A guardar..." : editar ? "Guardar alterações" : "Guardar entregador"}
        </Button>
      </BotoesJanela>
    </Janela>
  );
}
