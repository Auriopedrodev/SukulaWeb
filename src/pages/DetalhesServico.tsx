// Tela R1 - Detalhes do serviço
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreditCard, Pencil, Shirt, Store, Trash2, WashingMachine } from "lucide-react";
import { mensagemDeErro } from "@/api/configuracao";
import { listarLavandarias } from "@/api/lavandarias";
import { obterServico, removerServico } from "@/api/servicos";
import type { Lavandaria, Servico } from "@/api/tipos";
import Aviso, { type DadosAviso } from "@/components/Aviso";
import { Estado, EtiquetaCategoria } from "@/components/Etiquetas";
import FormularioServico from "@/components/FormularioServico";
import InfoLinha from "@/components/InfoLinha";
import JanelaConfirmar, { ItemARemover } from "@/components/JanelaConfirmar";
import Layout from "@/components/Layout";
import TituloPagina, { Carregando } from "@/components/TituloPagina";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarKz } from "@/lib/utils";

export default function DetalhesServico() {
  const { id } = useParams();
  const navegar = useNavigate();
  const [servico, setServico] = useState<Servico | null>(null);
  const [lavandarias, setLavandarias] = useState<Lavandaria[]>([]);
  const [erro, setErro] = useState("");
  const [janela, setJanela] = useState<"" | "editar" | "remover">("");
  const [aRemover, setARemover] = useState(false);
  const [aviso, setAviso] = useState<DadosAviso | null>(null);

  useEffect(() => {
    obterServico(Number(id))
      .then((s) => (s ? setServico(s) : setErro("Serviço não encontrado.")))
      .catch((e) => setErro(mensagemDeErro(e)));
    // Lavandarias que oferecem este serviço (mostramos as 3 primeiras)
    listarLavandarias()
      .then(setLavandarias)
      .catch(() => setLavandarias([]));
  }, [id]);

  if (!servico) {
    return (
      <Layout titulo="Gestão de serviços">
        <Carregando erro={erro} />
      </Layout>
    );
  }

  async function confirmarRemocao() {
    if (!servico) return;
    setARemover(true);
    try {
      await removerServico(servico.id);
      navegar("/servicos");
    } catch (e) {
      setAviso({ titulo: "Não foi possível remover", texto: mensagemDeErro(e) });
      setARemover(false);
    }
  }

  const comEsteServico = lavandarias.filter((l) => l.servicos.some((s) => s.servico === servico.nome)).slice(0, 3);

  return (
    <Layout titulo="Gestão de serviços">
      <TituloPagina
        titulo={servico.nome}
        voltarPara={{ texto: "Voltar aos serviços", endereco: "/servicos" }}
        botoes={
          <>
            <Button variant="perigo" onClick={() => setJanela("remover")}>
              <Trash2 /> Remover
            </Button>
            <Button variant="claro" onClick={() => setJanela("editar")}>
              <Pencil /> Editar serviço
            </Button>
          </>
        }
      />

      <div className="mt-5 flex items-start gap-5">
        {/* Informações do serviço */}
        <div className="h-[380px] w-[360px] shrink-0 rounded-2xl border border-painel-borda bg-white p-[25px]">
          <div className="flex size-14 items-center justify-center rounded-[14px]">
            <WashingMachine className="size-7 text-cartao-titulo" strokeWidth={1.4} />
          </div>
          <p className="mt-5 text-lg font-bold text-cartao-titulo">{servico.nome}</p>
          <div className="mt-2">
            <Estado ativo={servico.ativo} vivo />
          </div>
          <div className="mt-5 border-t border-painel-borda" />
          <div className="mt-5 flex flex-col gap-5">
            <InfoLinha icone={WashingMachine} titulo="Nome do serviço">{servico.nome}</InfoLinha>
            <InfoLinha icone={CreditCard} titulo="Artigos">{servico.artigos.length} artigos</InfoLinha>
            <InfoLinha icone={Store} titulo="Disponível em">{servico.numeroLavandarias} lavandarias</InfoLinha>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {/* Artigos do serviço */}
          <h3 className="text-base font-bold text-claro">Artigos do serviço</h3>
          <div className="mt-3 overflow-hidden rounded-2xl border border-borda bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[308px]">Artigo</TableHead>
                  <TableHead className="w-[230px]">Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servico.artigos.map((linha) => (
                  <TableRow key={linha.artigo} className="h-[52px]">
                    <TableCell>
                      <div className="flex items-center gap-2.5 font-semibold">
                        <span className="flex size-8 items-center justify-center">
                          <Shirt className="size-4" strokeWidth={1.6} />
                        </span>
                        {linha.artigo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <EtiquetaCategoria categoria={servico.categoria} />
                    </TableCell>
                    <TableCell className="text-xs font-semibold">{formatarKz(linha.preco)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Lavandarias que oferecem este serviço */}
          <div className="mt-5 rounded-2xl border border-painel-borda bg-white p-[21px]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-cartao-titulo">Lavandarias que oferecem este serviço</p>
              <button onClick={() => navegar("/lavandarias")} className="cursor-pointer text-xs font-semibold text-cartao-titulo">
                Ver todas ({servico.numeroLavandarias})
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {comEsteServico.map((l) => (
                <button
                  key={l.id}
                  onClick={() => navegar(`/lavandarias/${l.id}`)}
                  className="flex h-[60px] cursor-pointer items-center gap-2.5 rounded-xl bg-fundo px-2.5 text-left"
                >
                  <img src={l.foto} alt="" className="size-10 shrink-0 rounded-lg bg-white object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-claro">{l.nome}</p>
                    <p className="mt-0.5 truncate text-[11px] text-claro-2">{l.zona}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editar serviço */}
      {janela === "editar" && (
        <FormularioServico
          servico={servico}
          aoFechar={() => setJanela("")}
          aoGuardar={(guardado) => {
            setServico(guardado);
            setJanela("");
            setAviso({ titulo: "Alterações guardadas", texto: `O serviço ${guardado.nome} foi atualizado.` });
          }}
        />
      )}

      {/* R4 - Remover serviço? */}
      <JanelaConfirmar
        aberta={janela === "remover"}
        aoFechar={() => setJanela("")}
        aoConfirmar={confirmarRemocao}
        aCarregar={aRemover}
        titulo="Remover serviço?"
        texto={`O serviço ${servico.nome} será removido do catálogo e deixará de estar disponível nas ${servico.numeroLavandarias} lavandarias que o oferecem. Esta ação não pode ser anulada.`}
        textoBotao="Sim, remover serviço"
      >
        <ItemARemover
          imagem={
            <span className="flex size-10 items-center justify-center text-claro">
              <WashingMachine className="size-[18px]" strokeWidth={1.6} />
            </span>
          }
          titulo={servico.nome}
          texto={`${servico.categoria} · ${formatarKz(servico.precoBase)} · ${servico.artigos.map((a) => a.artigo).join(", ")}`}
        />
      </JanelaConfirmar>

      <Aviso aviso={aviso} aoFechar={() => setAviso(null)} />
    </Layout>
  );
}
