// Telas S, S2 e S4 - Gestão de artigos
// - S  : lista de artigos
// - S2 : janela "Adicionar artigo"
// - S4 : janela "Remover artigo?"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Check, House, Plus, Shirt, type LucideIcon } from "lucide-react";
import { adicionarArtigo, ARTIGOS_POR_PAGINA, editarArtigo, listarArtigos, removerArtigo } from "@/api/artigos";
import { mensagemDeErro } from "@/api/configuracao";
import type { Artigo, Categoria } from "@/api/tipos";
import Aviso, { type DadosAviso } from "@/components/Aviso";
import BotoesAcoes from "@/components/BotoesAcoes";
import { CampoTexto, Rotulo } from "@/components/Campo";
import CartaoNumero from "@/components/CartaoNumero";
import { EtiquetaCategoria } from "@/components/Etiquetas";
import Filtros from "@/components/Filtros";
import Janela, { BotoesJanela } from "@/components/Janela";
import JanelaConfirmar, { ItemARemover } from "@/components/JanelaConfirmar";
import Layout from "@/components/Layout";
import Paginacao from "@/components/Paginacao";
import Pesquisa from "@/components/Pesquisa";
import TituloPagina, { Carregando } from "@/components/TituloPagina";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Ícone de cada categoria
export const iconeCategoria: Record<Categoria, LucideIcon> = {
  Roupa: Shirt,
  Calçados: Box,
  Lar: House,
};

export default function Artigos() {
  const navegar = useNavigate();
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [total, setTotal] = useState(0);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState("Todos");
  const [pagina, setPagina] = useState(1);

  const [escolhido, setEscolhido] = useState<Artigo | null>(null);
  const [janela, setJanela] = useState<"" | "adicionar" | "editar" | "remover">("");
  const [aRemover, setARemover] = useState(false);
  const [aviso, setAviso] = useState<DadosAviso | null>(null);

  useEffect(() => {
    setACarregar(true);
    listarArtigos(pagina, pesquisa, filtro)
      .then((r) => {
        setArtigos(r.itens);
        setTotal(r.total);
        setErro("");
      })
      .catch((e) => setErro(mensagemDeErro(e)))
      .finally(() => setACarregar(false));
  }, [pagina, pesquisa, filtro]);

  async function confirmarRemocao() {
    if (!escolhido) return;
    setARemover(true);
    try {
      await removerArtigo(escolhido.id);
      setArtigos(artigos.filter((a) => a.id !== escolhido.id));
      setTotal(total - 1);
      setJanela("");
      setAviso({ titulo: "Artigo removido", texto: `O artigo ${escolhido.nome} foi removido.` });
    } catch (e) {
      setAviso({ titulo: "Não foi possível remover", texto: mensagemDeErro(e) });
    } finally {
      setARemover(false);
    }
  }

  // Números dos cartões (exemplo do Figma: 36 / 14 / 12 / 10). Com a API, venha do servidor.
  const totais = { total: 36, roupa: 14, calcados: 12, lar: 10 };

  return (
    <Layout titulo="Gestão de artigos">
      <TituloPagina
        titulo="Artigos"
        botoes={
          <Button variant="claro" onClick={() => setJanela("adicionar")}>
            <Plus /> Adicionar artigo
          </Button>
        }
      />

      <div className="mt-5 flex gap-4">
        <CartaoNumero icone={Shirt} titulo="Total de artigos" valor={totais.total} />
        <CartaoNumero icone={Shirt} titulo="Roupa" valor={totais.roupa} />
        <CartaoNumero icone={Box} titulo="Calçados" valor={totais.calcados} />
        <CartaoNumero icone={House} titulo="Lar" valor={totais.lar} />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Pesquisa
          valor={pesquisa}
          aoMudar={(t) => {
            setPesquisa(t);
            setPagina(1);
          }}
          textoExemplo="Pesquisar artigo por nome"
        />
        <Filtros
          opcoes={["Todos", "Roupa", "Calçados", "Lar"]}
          ativo={filtro}
          aoMudar={(f) => {
            setFiltro(f);
            setPagina(1);
          }}
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
                  <TableHead className="w-[450px]">Nome do artigo</TableHead>
                  <TableHead className="w-[450px]">Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artigos.map((artigo) => {
                  const Icone = iconeCategoria[artigo.categoria];
                  return (
                    <TableRow key={artigo.id} className="h-[54px]">
                      <TableCell>
                        <div className="flex items-center gap-2.5 font-semibold">
                          <span className="flex size-9 items-center justify-center">
                            <Icone className="size-[18px]" strokeWidth={1.6} />
                          </span>
                          {artigo.nome}
                        </div>
                      </TableCell>
                      <TableCell>
                        <EtiquetaCategoria categoria={artigo.categoria} />
                      </TableCell>
                      <TableCell>
                        <BotoesAcoes
                          aoVer={() => navegar(`/artigos/${artigo.id}`)}
                          aoEditar={() => {
                            setEscolhido(artigo);
                            setJanela("editar");
                          }}
                          aoRemover={() => {
                            setEscolhido(artigo);
                            setJanela("remover");
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Paginacao
              pagina={pagina}
              porPagina={ARTIGOS_POR_PAGINA}
              total={total}
              quantidadeNaPagina={artigos.length}
              nome="artigos"
              aoMudar={setPagina}
            />
          </>
        )}
      </div>

      {/* S2 - Adicionar artigo (e editar) */}
      {(janela === "adicionar" || janela === "editar") && (
        <JanelaArtigo
          artigo={janela === "editar" ? escolhido : null}
          aoFechar={() => setJanela("")}
          aoGuardar={(guardado) => {
            if (janela === "adicionar") {
              setArtigos([...artigos, guardado]);
              setAviso({ titulo: "Artigo adicionado", texto: `${guardado.nome} foi adicionado aos artigos.` });
            } else {
              setArtigos(artigos.map((a) => (a.id === guardado.id ? guardado : a)));
              setAviso({ titulo: "Alterações guardadas", texto: `O artigo ${guardado.nome} foi atualizado.` });
            }
            setJanela("");
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
        texto={`O artigo ${escolhido?.nome} será removido e deixará de estar disponível ${
          (escolhido?.servicos.length ?? 0) > 1 ? "nos serviços" : "no serviço"
        } ${escolhido?.servicos.join(", ")}. Esta ação não pode ser anulada.`}
        textoBotao="Sim, remover artigo"
      >
        {escolhido && <ItemArtigo artigo={escolhido} />}
      </JanelaConfirmar>

      <Aviso aviso={aviso} aoFechar={() => setAviso(null)} />
    </Layout>
  );
}

// Caixa azul da janela "Remover artigo?"
function ItemArtigo({ artigo }: { artigo: Artigo }) {
  const Icone = iconeCategoria[artigo.categoria];
  return (
    <ItemARemover
      imagem={
        <span className="flex size-10 items-center justify-center text-claro">
          <Icone className="size-[18px]" strokeWidth={1.6} />
        </span>
      }
      titulo={artigo.nome}
      texto={`${artigo.cores[0]?.nome ?? ""} · Tamanho ${artigo.tamanhos[artigo.tamanhos.length - 1] ?? ""} · ${artigo.categoria}`}
    />
  );
}

// ---------------------------------------------------------
// S2 - Janela "Adicionar artigo"
// ---------------------------------------------------------
type JanelaArtigoProps = {
  artigo: Artigo | null;
  aoFechar: () => void;
  aoGuardar: (artigo: Artigo) => void;
};

export function JanelaArtigo({ artigo, aoFechar, aoGuardar }: JanelaArtigoProps) {
  const editar = artigo !== null;
  const [categoria, setCategoria] = useState<Categoria>(artigo?.categoria ?? "Roupa");
  const [nome, setNome] = useState(artigo?.nome ?? "");
  const [erroNome, setErroNome] = useState("");
  const [erroGeral, setErroGeral] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  async function guardar() {
    if (nome.trim() === "") {
      setErroNome("Indique o nome do artigo.");
      return;
    }
    setErroNome("");
    const dados: Artigo = {
      id: artigo?.id ?? 0,
      nome: nome.trim(),
      categoria,
      cores: artigo?.cores ?? [],
      tamanhos: artigo?.tamanhos ?? [],
      servicos: artigo?.servicos ?? [],
    };
    setAGuardar(true);
    try {
      aoGuardar(editar ? await editarArtigo(dados) : await adicionarArtigo(dados));
    } catch (e) {
      setErroGeral(mensagemDeErro(e));
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <Janela aberta aoFechar={aoFechar} titulo={editar ? "Editar artigo" : "Adicionar artigo"} largura={720}>
      <Rotulo titulo="Categoria *">
        <div className="grid grid-cols-3 gap-2.5">
          {(["Roupa", "Calçados", "Lar"] as Categoria[]).map((opcao) => {
            const Icone = iconeCategoria[opcao];
            const escolhida = opcao === categoria;
            return (
              <button
                key={opcao}
                type="button"
                onClick={() => setCategoria(opcao)}
                className={
                  escolhida
                    ? "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-azul bg-claro text-sm font-semibold text-fundo"
                    : "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border border-borda bg-white text-sm font-medium text-fundo"
                }
              >
                <Icone className="size-[18px]" strokeWidth={1.6} />
                {opcao}
              </button>
            );
          })}
        </div>
      </Rotulo>

      <div className="mt-5">
        <CampoTexto titulo="Nome do artigo *" icone={iconeCategoria[categoria]} valor={nome} aoMudar={setNome} erro={erroNome} />
      </div>

      {erroGeral && <p className="mt-4 text-sm font-medium text-perigo">{erroGeral}</p>}

      <BotoesJanela>
        <Button variant="branco" onClick={aoFechar}>
          Cancelar
        </Button>
        <Button variant="escuro" onClick={guardar} disabled={aGuardar}>
          <Check /> {aGuardar ? "A guardar..." : editar ? "Guardar alterações" : "Guardar artigo"}
        </Button>
      </BotoesJanela>
    </Janela>
  );
}

export { ItemArtigo };
