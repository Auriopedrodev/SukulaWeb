// Caixa de pesquisa branca das páginas (ex.: "Pesquisar por nome")
import { Search } from "lucide-react";

type Props = {
  valor: string;
  aoMudar: (valor: string) => void;
  textoExemplo: string;
};

export default function Pesquisa({ valor, aoMudar, textoExemplo }: Props) {
  return (
    <label className="flex h-11 w-[340px] items-center gap-2.5 rounded-xl border border-borda-pesquisa bg-white px-[15px]">
      <Search className="size-[18px] shrink-0 text-icone-pesquisa" strokeWidth={1.5} />
      <input
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={textoExemplo}
        className="w-full bg-transparent text-[13px] text-fundo outline-none placeholder:text-cinza-pesquisa"
      />
    </label>
  );
}
