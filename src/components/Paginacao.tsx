// Fundo das tabelas: "A mostrar 1–8 de 1.248 clientes" + botões das páginas
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatarNumero } from "@/lib/utils";

type Props = {
  pagina: number;
  porPagina: number;
  total: number;
  quantidadeNaPagina: number;
  nome: string; // "clientes", "artigos", "entregadores"
  aoMudar: (pagina: number) => void;
};

export default function Paginacao({ pagina, porPagina, total, quantidadeNaPagina, nome, aoMudar }: Props) {
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  const primeiro = total === 0 ? 0 : (pagina - 1) * porPagina + 1;
  const ultimo = (pagina - 1) * porPagina + quantidadeNaPagina;

  // Mostra no máximo 3 números e "…" quando há mais páginas (como no Figma)
  const numeros: number[] = [];
  const inicio = Math.max(1, Math.min(pagina - 1, totalPaginas - 2));
  for (let n = inicio; n <= Math.min(totalPaginas, inicio + 2); n++) numeros.push(n);

  const estiloNumero = "flex size-[34px] cursor-pointer items-center justify-center rounded-[10px] text-[13px] font-semibold";

  return (
    <div className="flex h-[60px] items-center justify-between border-t border-borda px-5">
      <p className="text-[13px] text-cinza">
        A mostrar {primeiro}–{ultimo} de {formatarNumero(total)} {nome}
      </p>

      <div className="flex items-center gap-1.5">
        <button className={`${estiloNumero} text-fundo`} onClick={() => aoMudar(Math.max(1, pagina - 1))} aria-label="Página anterior">
          <ChevronLeft className="size-4" strokeWidth={1.8} />
        </button>
        {numeros.map((n) => (
          <button
            key={n}
            onClick={() => aoMudar(n)}
            className={n === pagina ? `${estiloNumero} bg-fundo text-white` : `${estiloNumero} border border-borda bg-white text-fundo`}
          >
            {n}
          </button>
        ))}
        {totalPaginas > numeros[numeros.length - 1] && (
          <span className={`${estiloNumero} cursor-default border border-borda bg-white text-fundo`}>…</span>
        )}
        <button
          className={`${estiloNumero} text-fundo`}
          onClick={() => aoMudar(Math.min(totalPaginas, pagina + 1))}
          aria-label="Página seguinte"
        >
          <ChevronRight className="size-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
