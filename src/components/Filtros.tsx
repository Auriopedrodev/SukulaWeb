// Botões de filtro lado a lado: "Todos | Ativos | Inativos" ou "Todos | Roupa | Calçados | Lar"
// Uso: <Filtros opcoes={["Todos","Ativos","Inativos"]} ativo={filtro} aoMudar={setFiltro} />
type Props = {
  opcoes: string[];
  ativo: string;
  aoMudar: (opcao: string) => void;
};

export default function Filtros({ opcoes, ativo, aoMudar }: Props) {
  return (
    <div className="flex h-11 items-center gap-1 rounded-xl border border-painel-borda bg-painel p-[5px]">
      {opcoes.map((opcao) => (
        <button
          key={opcao}
          onClick={() => aoMudar(opcao)}
          className={
            opcao === ativo
              ? "h-[34px] cursor-pointer rounded-[9px] bg-claro px-3.5 text-[13px] font-semibold text-fundo"
              : "h-[34px] cursor-pointer rounded-[9px] px-3.5 text-[13px] font-semibold text-claro-2"
          }
        >
          {opcao}
        </button>
      ))}
    </div>
  );
}
