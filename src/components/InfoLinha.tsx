// Uma informação com ícone, título pequeno e valor. Ex.:
//   [ícone]  Nome completo
//            Nelson Tchipa
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Props = {
  escuro?: boolean; // true = dentro de um cartão azul (letras claras)
  icone: LucideIcon;
  titulo: string;
  children: ReactNode; // o valor
};

export default function InfoLinha({ escuro = false, icone: Icone, titulo, children }: Props) {
  // Cartões brancos: título #0080CB e informação #0E3553. Cartões azuis: letras claras.
  const corTitulo = escuro ? "text-claro-2" : "text-cartao-titulo";
  const corTexto = escuro ? "text-claro" : "text-cartao-texto";
  const corIcone = escuro ? "text-claro" : "text-cartao-titulo";
  return (
    <div className="flex min-w-0 gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px]">
        <Icone className={`size-[18px] ${corIcone}`} strokeWidth={1.6} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-xs ${corTitulo}`}>{titulo}</p>
        <div className={`mt-1 text-sm font-semibold leading-5 ${corTexto}`}>{children}</div>
      </div>
    </div>
  );
}
