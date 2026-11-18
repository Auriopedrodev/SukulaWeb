// Título da secção no topo do conteúdo (ex.: "Clientes") com um botão opcional à direita.
// Também serve para as páginas de detalhes, com a ligação "Voltar".
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

type Props = {
  titulo: string;
  botoes?: ReactNode;
  voltarPara?: { texto: string; endereco: string };
};

export default function TituloPagina({ titulo, botoes, voltarPara }: Props) {
  return (
    <div className="flex items-end justify-between">
      <div>
        {voltarPara && (
          <Link to={voltarPara.endereco} className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-link">
            <ChevronLeft className="size-4" strokeWidth={1.8} />
            {voltarPara.texto}
          </Link>
        )}
        <h2 className="text-xl font-bold text-claro">{titulo}</h2>
      </div>
      {botoes && <div className="flex gap-3">{botoes}</div>}
    </div>
  );
}

// Mensagem enquanto os dados estão a chegar da API (ou se houve erro)
export function Carregando({ erro }: { erro?: string }) {
  return <p className="animar-aparecer py-10 text-center text-sm font-medium text-claro-2">{erro || "A carregar..."}</p>;
}
