// Pequenas etiquetas usadas nas tabelas e cartões.
import type { Categoria } from "@/api/tipos";

// "● Ativo" / "● Inativo"
// vivo = verde mais claro (usado dentro dos cartões azuis)
export function Estado({ ativo, vivo = false, textoAtivo = "Ativo", textoInativo = "Inativo" }: { ativo: boolean; vivo?: boolean; textoAtivo?: string; textoInativo?: string }) {
  const cor = ativo ? (vivo ? "text-sucesso-vivo" : "text-sucesso") : "text-cinza";
  const ponto = ativo ? (vivo ? "bg-sucesso-vivo" : "bg-sucesso") : "bg-cinza";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cor}`}>
      <span className={`size-[7px] rounded-full ${ponto}`} />
      {ativo ? textoAtivo : textoInativo}
    </span>
  );
}

// Categoria nas tabelas: cada categoria tem as suas cores no Figma
const coresCategoria: Record<Categoria, string> = {
  Roupa: "bg-claro text-fundo",
  Calçados: "bg-claro text-azul",
  Lar: "bg-white text-sucesso",
};

export function EtiquetaCategoria({ categoria }: { categoria: Categoria }) {
  return (
    <span className={`inline-flex h-[23px] items-center rounded-lg px-2.5 text-xs font-semibold ${coresCategoria[categoria]}`}>
      {categoria}
    </span>
  );
}

// Categoria nos cartões das lavandarias (fundo azul escuro, letras brancas)
export function EtiquetaAzul({ texto }: { texto: string }) {
  return <span className="inline-flex h-[23px] items-center rounded-lg bg-fundo px-2.5 text-xs font-semibold text-white">{texto}</span>;
}

// Nome de um artigo ou serviço com borda (ex.: "Camisa")
export function Etiqueta({ texto }: { texto: string }) {
  return (
    <span className="inline-flex h-[25px] items-center whitespace-nowrap rounded-lg border border-borda px-2.5 text-xs font-medium text-fundo">
      {texto}
    </span>
  );
}

// "+2" quando há mais itens do que os mostrados
export function EtiquetaMais({ quantidade }: { quantidade: number }) {
  if (quantidade <= 0) return null;
  return <span className="inline-flex h-[23px] items-center rounded-lg bg-claro px-2 text-xs font-semibold text-fundo">+{quantidade}</span>;
}
