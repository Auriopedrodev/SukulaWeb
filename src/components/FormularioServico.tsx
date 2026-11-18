// Tela R2 - Janela "Adicionar serviço" (também usada para "Editar serviço")
import { useEffect, useState } from "react";
import { Check, Plus, Shirt, Trash2, WashingMachine } from "lucide-react";
import { listarArtigos } from "@/api/artigos";
import { mensagemDeErro } from "@/api/configuracao";
import { adicionarServico, editarServico } from "@/api/servicos";
import type { Artigo, ArtigoDoServico, Servico } from "@/api/tipos";
import { CampoEscolha, CampoTexto } from "./Campo";
import Janela, { BotoesJanela } from "./Janela";
import { Button } from "@/components/ui/button";
import { formatarNumero } from "@/lib/utils";

type Props = {
  servico: Servico | null; // null = adicionar um novo
  aoFechar: () => void;
  aoGuardar: (servico: Servico) => void;
};

export default function FormularioServico({ servico, aoFechar, aoGuardar }: Props) {
  const editar = servico !== null;
  const [nome, setNome] = useState(servico?.nome ?? "");
  const [linhas, setLinhas] = useState<ArtigoDoServico[]>(servico?.artigos ?? [{ artigo: "Camisa", preco: 1000 }]);
  const [artigosExistentes, setArtigosExistentes] = useState<Artigo[]>([]);
  const [erroNome, setErroNome] = useState("");
  const [erroArtigos, setErroArtigos] = useState("");
  const [erroGeral, setErroGeral] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  // Lista de artigos para escolher
  useEffect(() => {
    listarArtigos(1, "", "Todos")
      .then((r) => setArtigosExistentes(r.itens))
      .catch(() => setArtigosExistentes([]));
  }, []);

  const nomesArtigos = artigosExistentes.length ? artigosExistentes.map((a) => a.nome) : linhas.map((l) => l.artigo);

  function mudarLinha(posicao: number, nova: ArtigoDoServico) {
    setLinhas(linhas.map((l, i) => (i === posicao ? nova : l)));
  }

  async function guardar() {
    // Validação
    let valido = true;
    setErroNome("");
    setErroArtigos("");
    if (nome.trim() === "") {
      setErroNome("Indique o nome do serviço.");
      valido = false;
    }
    if (linhas.length === 0 || linhas.some((l) => !l.preco)) {
      setErroArtigos("Cada artigo precisa de um preço.");
      valido = false;
    }
    if (!valido) return;

    // A categoria do serviço é a do primeiro artigo
    const primeiro = artigosExistentes.find((a) => a.nome === linhas[0].artigo);
    const dados: Servico = {
      id: servico?.id ?? 0,
      nome: nome.trim(),
      categoria: primeiro?.categoria ?? servico?.categoria ?? "Roupa",
      precoBase: linhas[0].preco,
      artigos: linhas,
      numeroLavandarias: servico?.numeroLavandarias ?? 0,
      ativo: servico?.ativo ?? true,
    };

    setAGuardar(true);
    try {
      aoGuardar(editar ? await editarServico(dados) : await adicionarServico(dados));
    } catch (e) {
      setErroGeral(mensagemDeErro(e));
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <Janela aberta aoFechar={aoFechar} titulo={editar ? "Editar serviço" : "Adicionar serviço"} largura={720}>
      <CampoTexto titulo="Nome do serviço *" icone={WashingMachine} valor={nome} aoMudar={setNome} erro={erroNome} />

      <div className="mt-5 flex flex-col gap-2">
        {linhas.map((linha, posicao) => (
          <div key={posicao} className="flex items-end gap-3">
            <div className="flex-1">
              <CampoEscolha
                titulo={posicao === 0 ? "Artigo *" : ""}
                icone={Shirt}
                valor={linha.artigo}
                aoMudar={(artigo) => mudarLinha(posicao, { ...linha, artigo })}
                opcoes={nomesArtigos}
              />
            </div>
            <div className="w-[200px]">
              <CampoTexto
                titulo={posicao === 0 ? "Preço do artigo *" : ""}
                valor={linha.preco ? formatarNumero(linha.preco) : ""}
                aoMudar={(valor) => mudarLinha(posicao, { ...linha, preco: Number(valor.replace(/\D/g, "")) })}
                depois={<span className="text-[13px] font-semibold text-cinza">Kz</span>}
              />
            </div>
            <button
              type="button"
              onClick={() => setLinhas(linhas.filter((_, i) => i !== posicao))}
              className="mb-0.5 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#f3c2c2] text-perigo"
              aria-label="Remover artigo"
            >
              <Trash2 className="size-4" strokeWidth={1.6} />
            </button>
          </div>
        ))}
      </div>
      {erroArtigos && <p className="mt-2 text-xs font-medium text-perigo">{erroArtigos}</p>}

      <button
        type="button"
        onClick={() => setLinhas([...linhas, { artigo: nomesArtigos[0] ?? "", preco: 0 }])}
        className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold text-azul"
      >
        <Plus className="size-4" strokeWidth={1.8} /> Adicionar outro artigo
      </button>

      {erroGeral && <p className="mt-4 text-sm font-medium text-perigo">{erroGeral}</p>}

      <BotoesJanela>
        <Button variant="branco" onClick={aoFechar}>
          Cancelar
        </Button>
        <Button variant="escuro" onClick={guardar} disabled={aGuardar}>
          <Check /> {aGuardar ? "A guardar..." : editar ? "Guardar alterações" : "Guardar serviço"}
        </Button>
      </BotoesJanela>
    </Janela>
  );
}
