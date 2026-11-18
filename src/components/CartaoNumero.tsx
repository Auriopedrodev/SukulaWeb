// Cartão com um número (ex.: "Clientes registados 1.248")
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  icone: LucideIcon;
  titulo: string;
  valor: string | number;
};

export default function CartaoNumero({ icone: Icone, titulo, valor }: Props) {
  return (
    <Card className="flex h-[88px] flex-1 items-center gap-3.5 px-[21px]">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl">
        <Icone className="size-[22px] text-cartao-titulo" strokeWidth={1.83} />
      </div>
      <div className="whitespace-nowrap">
        <p className="text-xs font-medium text-cartao-titulo">{titulo}</p>
        <p className="mt-1 text-[22px] font-bold leading-[27px] text-cartao-texto">{valor}</p>
      </div>
    </Card>
  );
}
