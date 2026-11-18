// Telas U3.1, U3.2, U3.3 e U3.5 - Janelas para editar as "Informações" do Perfil da conta
// - U3.1: Editar Central de ajuda
// - U3.2: Editar Termos e condições
// - U3.3: Editar Política de privacidade
// - U3.5: Editar Sobre a Sukula
import { useState, type ReactNode } from "react";
import { Calendar, Check, Info, Plus } from "lucide-react";
import { publicarCentralAjuda, publicarDocumento, publicarSobre } from "@/api/conta";
import { mensagemDeErro } from "@/api/configuracao";
import type { Informacoes } from "@/api/tipos";
import { CampoEscolha, CampoTexto, CampoTextoLongo } from "./Campo";
import Janela, { BotoesJanela } from "./Janela";
import { Button } from "@/components/ui/button";

export type QualInformacao = "centralAjuda" | "termos" | "privacidade" | "sobre";

type Props = {
  qual: QualInformacao;
  informacoes: Informacoes;
  aoFechar: () => void;
  aoPublicar: (textoAviso: string) => void; // texto do aviso U3.6
};

export default function EditarInformacoes(props: Props) {
  if (props.qual === "centralAjuda") return <EditarCentralAjuda {...props} />;
  if (props.qual === "sobre") return <EditarSobre {...props} />;
  return <EditarDocumento {...props} />;
}

// Caixa azul clara "Ao publicar, ..." + botões Cancelar / Publicar alterações
function FundoDaJanela({ aoFechar, aoPublicar, aPublicar, erro }: { aoFechar: () => void; aoPublicar: () => void; aPublicar: boolean; erro: string }) {
  return (
    <>
      <div className="mt-5 flex h-[46px] items-center gap-2.5 rounded-xl bg-claro px-3.5 text-xs font-medium text-fundo">
        <Info className="size-[18px] shrink-0" strokeWidth={1.6} />
        Ao publicar, esta informação fica visível para todos os perfis: clientes, lavandarias e entregadores.
      </div>
      {erro && <p className="mt-3 text-sm font-medium text-perigo">{erro}</p>}
      <BotoesJanela>
        <Button variant="branco" onClick={aoFechar}>
          Cancelar
        </Button>
        <Button variant="escuro" onClick={aoPublicar} disabled={aPublicar}>
          <Check /> {aPublicar ? "A publicar..." : "Publicar alterações"}
        </Button>
      </BotoesJanela>
    </>
  );
}

function DuasColunas({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

// ---------------------------------------------------------
// U3.1 - Editar Central de ajuda
// ---------------------------------------------------------
function EditarCentralAjuda({ informacoes, aoFechar, aoPublicar }: Props) {
  const central = informacoes.centralAjuda;
  const [perfis, setPerfis] = useState(central.perfis);
  const [perguntas, setPerguntas] = useState(central.perguntas);
  const [erro, setErro] = useState("");
  const [aPublicar, setAPublicar] = useState(false);

  function mudar(posicao: number, campo: "pergunta" | "resposta", valor: string) {
    setPerguntas(perguntas.map((p, i) => (i === posicao ? { ...p, [campo]: valor } : p)));
  }

  async function publicar() {
    if (perguntas.some((p) => p.pergunta.trim() === "" || p.resposta.trim() === "")) {
      setErro("Preencha todas as perguntas e respostas.");
      return;
    }
    setAPublicar(true);
    try {
      await publicarCentralAjuda({ perfis, ultimaAtualizacao: central.ultimaAtualizacao, perguntas });
      aoPublicar("A Central de ajuda já está visível para clientes, lavandarias e entregadores.");
    } catch (e) {
      setErro(mensagemDeErro(e));
      setAPublicar(false);
    }
  }

  return (
    <Janela aberta aoFechar={aoFechar} titulo="Editar Central de ajuda" largura={780}>
      <DuasColunas>
        <CampoEscolha titulo="Perfis abrangidos" valor={perfis} aoMudar={setPerfis} opcoes={["Todos os perfis", "Clientes", "Lavandarias", "Entregadores"]} />
        <CampoTexto titulo="Última atualização" icone={Calendar} valor={central.ultimaAtualizacao} bloqueado />
      </DuasColunas>

      {perguntas.map((p, i) => (
        <div key={i}>
          <div className="mt-5">
            <CampoTexto titulo={`Pergunta ${i + 1}`} valor={p.pergunta} aoMudar={(v) => mudar(i, "pergunta", v)} />
          </div>
          <div className="mt-5">
            <CampoTextoLongo titulo={`Resposta ${i + 1}`} valor={p.resposta} aoMudar={(v) => mudar(i, "resposta", v)} altura={72} />
          </div>
        </div>
      ))}

      <Button variant="azul" className="mt-5 h-[38px]" onClick={() => setPerguntas([...perguntas, { pergunta: "", resposta: "" }])}>
        <Plus /> Adicionar pergunta
      </Button>

      <FundoDaJanela aoFechar={aoFechar} aoPublicar={publicar} aPublicar={aPublicar} erro={erro} />
    </Janela>
  );
}

// ---------------------------------------------------------
// U3.2 e U3.3 - Editar Termos e condições / Política de privacidade
// ---------------------------------------------------------
function EditarDocumento({ qual, informacoes, aoFechar, aoPublicar }: Props) {
  const termos = qual === "termos";
  const documento = termos ? informacoes.termos : informacoes.privacidade;
  const [versao, setVersao] = useState(documento.versao);
  const [conteudo, setConteudo] = useState(documento.conteudo);
  const [erro, setErro] = useState("");
  const [aPublicar, setAPublicar] = useState(false);

  async function publicar() {
    if (versao.trim() === "" || conteudo.trim() === "") {
      setErro("Preencha a versão e o conteúdo.");
      return;
    }
    setAPublicar(true);
    try {
      await publicarDocumento(termos ? "termos" : "privacidade", { ...documento, versao, conteudo });
      aoPublicar(
        termos
          ? "Os Termos e condições já estão visíveis para clientes, lavandarias e entregadores."
          : "A Política de privacidade já está visível para clientes, lavandarias e entregadores."
      );
    } catch (e) {
      setErro(mensagemDeErro(e));
      setAPublicar(false);
    }
  }

  return (
    <Janela aberta aoFechar={aoFechar} titulo={termos ? "Editar Termos e condições" : "Editar Política de privacidade"} largura={780}>
      <DuasColunas>
        <CampoTexto titulo="Versão" valor={versao} aoMudar={setVersao} />
        <CampoTexto titulo="Data de entrada em vigor" icone={Calendar} valor={documento.data} bloqueado />
      </DuasColunas>
      <div className="mt-5">
        <CampoTextoLongo
          titulo={termos ? "Conteúdo dos termos e condições" : "Conteúdo da política de privacidade"}
          valor={conteudo}
          aoMudar={setConteudo}
          altura={termos ? 220 : 200}
        />
      </div>
      <FundoDaJanela aoFechar={aoFechar} aoPublicar={publicar} aPublicar={aPublicar} erro={erro} />
    </Janela>
  );
}

// ---------------------------------------------------------
// U3.5 - Editar Sobre a Sukula
// ---------------------------------------------------------
function EditarSobre({ informacoes, aoFechar, aoPublicar }: Props) {
  const [dados, setDados] = useState(informacoes.sobre);
  const [erro, setErro] = useState("");
  const [aPublicar, setAPublicar] = useState(false);

  async function publicar() {
    if (dados.empresa.trim() === "" || dados.nif.trim() === "") {
      setErro("O nome da empresa e o NIF são obrigatórios.");
      return;
    }
    setAPublicar(true);
    try {
      await publicarSobre(dados);
      aoPublicar("As informações Sobre a Sukula já estão visíveis para clientes, lavandarias e entregadores.");
    } catch (e) {
      setErro(mensagemDeErro(e));
      setAPublicar(false);
    }
  }

  return (
    <Janela aberta aoFechar={aoFechar} titulo="Editar Sobre a Sukula" largura={780}>
      <DuasColunas>
        <CampoTexto titulo="Nome da empresa" valor={dados.empresa} aoMudar={(v) => setDados({ ...dados, empresa: v })} />
        <CampoTexto titulo="NIF" valor={dados.nif} aoMudar={(v) => setDados({ ...dados, nif: v })} />
      </DuasColunas>
      <div className="mt-5">
        <DuasColunas>
          <CampoTexto titulo="Versão da aplicação" valor={dados.versao} aoMudar={(v) => setDados({ ...dados, versao: v })} />
          <CampoTexto titulo="Sede" valor={dados.sede} aoMudar={(v) => setDados({ ...dados, sede: v })} />
        </DuasColunas>
      </div>
      <div className="mt-5">
        <CampoTextoLongo titulo="Descrição" valor={dados.descricao} aoMudar={(v) => setDados({ ...dados, descricao: v })} altura={96} />
      </div>
      <FundoDaJanela aoFechar={aoFechar} aoPublicar={publicar} aPublicar={aPublicar} erro={erro} />
    </Janela>
  );
}
