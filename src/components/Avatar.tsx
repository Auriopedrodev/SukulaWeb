// Círculo com as iniciais do nome (ex.: "NT") ou com uma imagem.
// Cores do Figma:
//   tipo "tabela"  -> fundo azul claro, letras brancas (tabelas)
//   tipo "escuro"  -> fundo azul, letras azul claro (cartões e janelas)
//   tipo "forte"   -> fundo azul, letras brancas (detalhe da lavandaria)
import { iniciais } from "@/lib/utils";

type Props = {
  nome: string;
  tamanho: number; // em píxeis
  tipo?: "tabela" | "escuro" | "forte" | "suave";
  imagem?: string;
};

const cores = {
  tabela: "bg-claro text-white",
  escuro: "bg-azul text-link",
  forte: "bg-azul text-white",
  suave: "bg-claro text-azul",
};

export default function Avatar({ nome, tamanho, tipo = "tabela", imagem }: Props) {
  if (imagem) {
    return <img src={imagem} alt={nome} className="shrink-0 rounded-full object-cover" style={{ width: tamanho, height: tamanho }} />;
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${cores[tipo]}`}
      style={{ width: tamanho, height: tamanho, fontSize: Math.round(tamanho / 2.9) }}
    >
      {iniciais(nome)}
    </div>
  );
}

// Logótipo quadrado da lavandaria (cartões). Se não tiver logótipo, mostra as iniciais.
export function LogoLavandaria({ nome, logo, tamanho = 44 }: { nome: string; logo: string; tamanho?: number }) {
  if (!logo) return <Avatar nome={nome} tamanho={tamanho} tipo="escuro" />;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[10px] border border-borda-pesquisa bg-white"
      style={{ width: tamanho, height: tamanho }}
    >
      <img src={logo} alt={nome} className="h-[73%] w-[82%] object-contain" />
    </div>
  );
}
