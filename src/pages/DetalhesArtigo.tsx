// Tela S1 - Detalhes do artigo
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Tag, Trash2, WashingMachine } from "lucide-react";
import { obterArtigo, removerArtigo } from "@/api/artigos";
import { mensagemDeErro } from "@/api/configuracao";
import { listarServicos } from "@/api/servicos";
import type { Artigo, Servico } from "@/api/tipos";
import Aviso, { type DadosAviso } from "@/components/Aviso";
import { EtiquetaAzul, EtiquetaCategoria } from "@/components/Etiquetas";
import InfoLinha from "@/components/InfoLinha";
import JanelaConfirmar from "@/components/JanelaConfirmar";
import Layout from "@/components/Layout";
import TituloPagina, { Carregando } from "@/components/TituloPagina";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarKz } from "@/lib/utils";
import { iconeCategoria, ItemArtigo, JanelaArtigo } from "./Artigos";

export default function DetalhesArtigo() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [erro, setErro] = useState("");
  const [janela, setJanela] = useState<"" | "editar" | "remover">("");
  const [aRemover, setARemover] = useState(false);
  const [aviso, setAviso] = useState<DadosAviso | null>(null);

  useEffect(() => {
    obterArtigo(Number(id))
      .then((a) => (a ? setArtigo(a) : setErro("Artigo não encontrado.")))
      .catch((e) => setErro(mensagemDeErro(e)));
    listarServicos()
      .then(setServicos)
      .catch(() => setServicos([]));
  }, [id]);

  if (!artigo) {
    return (
      <Layout titulo="Gestão de artigos">
        <Carregando erro={erro} />
      </Layout>
    );
  }

  async function confirmarRemocao() {
    if (!artigo) return;
    setARemover(true);
    try {
      await removerArtigo(artigo.id);
      navegar("/artigos");
    } catch (e) {
      setAviso({ titulo: "Não foi possível remover", texto: mensagemDeErro(e) });
      setARemover(false);
    }
  }

  // Serviços que têm este artigo
  const comEsteArtigo = servicos.filter((s) => s.artigos.some((a) => a.artigo === artigo.nome));
  const Icone = iconeCategoria[artigo.categoria];

  return (
    <Layout titulo="Gestão de artigos">
      <TituloPagina
        titulo={artigo.nome}
        voltarPara={{ texto: "Voltar aos artigos", endereco: "/artigos" }}
        botoes={
          <>
            <Button variant="perigo" onClick={() => setJanela("remover")}>
              <Trash2 /> Remover
            </Button>
            <Button variant="claro" onClick={() => setJanela("editar")}>
              <Pencil /> Editar artigo
            </Button>
          </>
        }
      />

      <div className="mt-5 flex items-start gap-5">
        {/* Informações do artigo */}
        <div className="w-[360px] shrink-0 rounded-2xl border border-painel-borda bg-white p-[25px]">
          <div className="flex size-14 items-center justify-center rounded-[14px]">
            <Icone className="size-7 text-cartao-titulo" strokeWidth={1.4} />
          </div>
          <p className="mt-5 text-lg font-bold text-cartao-titulo">{artigo.nome}</p>
          <div className="mt-5 border-t border-fundo" />
          <div className="mt-5 flex flex-col gap-5">
            <InfoLinha icone={Tag} titulo="Categoria">
              <EtiquetaAzul texto={artigo.categoria} />
            </InfoLinha>
            <InfoLinha icone={Icone} titulo="Nome do artigo">{artigo.nome}</InfoLinha>
          </div>
        </div>

        {/* Serviços que incluem este artigo */}
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-claro">Serviços que incluem este artigo</h3>
          <div className="mt-3 overflow-hidden rounded-2xl border border-borda bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[284px]">Serviço</TableHead>
                  <TableHead className="w-[142px]">Categoria</TableHead>
                  <TableHead className="w-[142px]">Preço base</TableHead>
                  <TableHead>Lavandarias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comEsteArtigo.map((servico) => (
                  <TableRow key={servico.id} className="h-[52px]">
                    <TableCell>
                      <button onClick={() => navegar(`/servicos/${servico.id}`)} className="flex cursor-pointer items-center gap-2.5 font-semibold">
                        <span className="flex size-8 items-center justify-center">
                          <WashingMachine className="size-4" strokeWidth={1.6} />
                        </span>
                        {servico.nome}
                      </button>
                    </TableCell>
                    <TableCell>
                      <EtiquetaCategoria categoria={servico.categoria} />
                    </TableCell>
                    <TableCell className="font-bold">{formatarKz(servico.precoBase)}</TableCell>
                    <TableCell className="font-medium">{servico.numeroLavandarias} lavandarias</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {janela === "editar" && (
        <JanelaArtigo
          artigo={artigo}
          aoFechar={() => setJanela("")}
          aoGuardar={(guardado) => {
            setArtigo(guardado);
            setJanela("");
            setAviso({ titulo: "Alterações guardadas", texto: `O artigo ${guardado.nome} foi atualizado.` });
          }}
        />
      )}

      {/* S4 - Remover artigo? */}
      <JanelaConfirmar
        aberta={janela === "remover"}
        aoFechar={() => setJanela("")}
        aoConfirmar={confirmarRemocao}
        aCarregar={aRemover}
        titulo="Remover artigo?"
        texto={`O artigo ${artigo.nome} será removido e deixará de estar disponível ${
          artigo.servicos.length > 1 ? "nos serviços" : "no serviço"
        } ${artigo.servicos.join(", ")}. Esta ação não pode ser anulada.`}
        textoBotao="Sim, remover artigo"
      >
        <ItemArtigo artigo={artigo} />
      </JanelaConfirmar>

      <Aviso aviso={aviso} aoFechar={() => setAviso(null)} />
    </Layout>
  );
}
