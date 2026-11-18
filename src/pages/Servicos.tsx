// Telas R, R0, R2 e R4 - Gestão de serviços
// - R  : lista de serviços (com os cartões dos totais)
// - R0 : lista filtrada por Roupa / Calçados / Lar (os cartões dos totais escondem-se)
// - R2 : janela "Adicionar serviço"
// - R4 : janela "Remover serviço?"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, House, Plus, Shirt, WashingMachine } from "lucide-react";
import { mensagemDeErro } from "@/api/configuracao";
import { listarServicos, removerServico } from "@/api/servicos";
import type { Servico } from "@/api/tipos";
import Aviso, { type DadosAviso } from "@/components/Aviso";
import BotoesAcoes from "@/components/BotoesAcoes";
import CartaoNumero from "@/components/CartaoNumero";
import { Estado, Etiqueta, EtiquetaCategoria, EtiquetaMais } from "@/components/Etiquetas";
import Filtros from "@/components/Filtros";
import FormularioServico from "@/components/FormularioServico";
import JanelaConfirmar, { ItemARemover } from "@/components/JanelaConfirmar";
import Layout from "@/components/Layout";
import Pesquisa from "@/components/Pesquisa";
import TituloPagina, { Carregando } from "@/components/TituloPagina";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarKz } from "@/lib/utils";

export default function Servicos() {
  const navegar = useNavigate();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  const [escolhido, setEscolhido] = useState<Servico | null>(null);
  const [janela, setJanela] = useState<"" | "adicionar" | "editar" | "remover">("");
  const [aRemover, setARemover] = useState(false);
  const [aviso, setAviso] = useState<DadosAviso | null>(null);

  useEffect(() => {
    listarServicos()
      .then(setServicos)
      .catch((e) => setErro(mensagemDeErro(e)))
      .finally(() => setACarregar(false));
  }, []);

  async function confirmarRemocao() {
    if (!escolhido) return;
    setARemover(true);
    try {
      await removerServico(escolhido.id);
      setServicos(servicos.filter((s) => s.id !== escolhido.id));
      setJanela("");
      setAviso({ titulo: "Serviço removido", texto: `O serviço ${escolhido.nome} foi removido do catálogo.` });
    } catch (e) {
      setAviso({ titulo: "Não foi possível remover", texto: mensagemDeErro(e) });
    } finally {
      setARemover(false);
    }
  }

  const visiveis = servicos.filter(
    (s) => s.nome.toLowerCase().includes(pesquisa.toLowerCase()) && (filtro === "Todos" || s.categoria === filtro)
  );
  const contar = (categoria: string) => servicos.filter((s) => s.categoria === categoria).length;

  return (
    <Layout titulo="Gestão de serviços">
      <TituloPagina
        titulo="Serviços"
        botoes={
          <Button variant="claro" onClick={() => setJanela("adicionar")}>
            <Plus /> Adicionar serviço
          </Button>
        }
      />

      {/* Totais (só aparecem em "Todos", como no Figma) */}
      {filtro === "Todos" && (
        <div className="mt-5 flex gap-4">
          <CartaoNumero icone={WashingMachine} titulo="Total de serviços" valor={servicos.length} />
          <CartaoNumero icone={Shirt} titulo="Roupa" valor={contar("Roupa")} />
          <CartaoNumero icone={Box} titulo="Calçados" valor={contar("Calçados")} />
          <CartaoNumero icone={House} titulo="Lar" valor={contar("Lar")} />
        </div>
      )}

      <div className="mt-5 flex gap-3">
        <Pesquisa valor={pesquisa} aoMudar={setPesquisa} textoExemplo="Pesquisar serviço" />
        <Filtros opcoes={["Todos", "Roupa", "Calçados", "Lar"]} ativo={filtro} aoMudar={setFiltro} />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-borda bg-white">
        {aCarregar || erro ? (
          <Carregando erro={erro} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[280px]">Nome do serviço</TableHead>
                <TableHead className="w-[150px]">Categoria</TableHead>
                <TableHead className="w-[360px]">Artigos</TableHead>
                <TableHead className="w-[130px]">Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiveis.map((servico) => (
                <TableRow key={servico.id} className="h-[58px]">
                  <TableCell>
                    <div className="flex items-center gap-2.5 font-semibold">
                      <span className="flex size-9 items-center justify-center">
                        <WashingMachine className="size-[18px]" strokeWidth={1.6} />
                      </span>
                      {servico.nome}
                    </div>
                  </TableCell>
                  <TableCell>
                    <EtiquetaCategoria categoria={servico.categoria} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {servico.artigos.slice(0, 3).map((a) => (
                        <Etiqueta key={a.artigo} texto={a.artigo} />
                      ))}
                      <EtiquetaMais quantidade={servico.artigos.length - 3} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Estado ativo={servico.ativo} />
                  </TableCell>
                  <TableCell>
                    <BotoesAcoes
                      aoVer={() => navegar(`/servicos/${servico.id}`)}
                      aoEditar={() => {
                        setEscolhido(servico);
                        setJanela("editar");
                      }}
                      aoRemover={() => {
                        setEscolhido(servico);
                        setJanela("remover");
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* R2 - Adicionar serviço (e editar) */}
      {(janela === "adicionar" || janela === "editar") && (
        <FormularioServico
          servico={janela === "editar" ? escolhido : null}
          aoFechar={() => setJanela("")}
          aoGuardar={(guardado) => {
            if (janela === "adicionar") {
              setServicos([...servicos, guardado]);
              setAviso({ titulo: "Serviço adicionado", texto: `${guardado.nome} já está disponível no catálogo.` });
            } else {
              setServicos(servicos.map((s) => (s.id === guardado.id ? guardado : s)));
              setAviso({ titulo: "Alterações guardadas", texto: `O serviço ${guardado.nome} foi atualizado.` });
            }
            setJanela("");
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
        texto={`O serviço ${escolhido?.nome} será removido do catálogo e deixará de estar disponível nas ${escolhido?.numeroLavandarias} lavandarias que o oferecem. Esta ação não pode ser anulada.`}
        textoBotao="Sim, remover serviço"
      >
        {escolhido && (
          <ItemARemover
            imagem={
              <span className="flex size-10 items-center justify-center text-claro">
                <WashingMachine className="size-[18px]" strokeWidth={1.6} />
              </span>
            }
            titulo={escolhido.nome}
            texto={`${escolhido.categoria} · ${formatarKz(escolhido.precoBase)} · ${escolhido.artigos.map((a) => a.artigo).join(", ")}`}
          />
        )}
      </JanelaConfirmar>

      <Aviso aviso={aviso} aoFechar={() => setAviso(null)} />
    </Layout>
  );
}
