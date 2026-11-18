// Estrutura de TODAS as páginas do painel:
// menu lateral à esquerda + barra do topo + conteúdo da página.
// Uso numa página:
//   <Layout titulo="Gestão de clientes"> ...conteúdo... </Layout>
import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Bike, House, LogOut, Shirt, Store, User, Users, WashingMachine } from "lucide-react";
import logoSukula from "@/assets/imagens/logo-sukula.png";
import { obterConta, terminarSessao } from "@/api/conta";
import type { Administrador } from "@/api/tipos";
import JanelaConfirmar from "./JanelaConfirmar";

// Opções do menu lateral. Para juntar uma página nova ao menu, acrescente uma linha.
const opcoesMenu = [
  { texto: "Página principal", endereco: "/", icone: House },
  { texto: "Gestão de clientes", endereco: "/clientes", icone: Users },
  { texto: "Gestão de lavandarias", endereco: "/lavandarias", icone: Store },
  { texto: "Gestão de serviços", endereco: "/servicos", icone: WashingMachine },
  { texto: "Gestão de artigos", endereco: "/artigos", icone: Shirt },
  { texto: "Gestão de entregadores", endereco: "/entregadores", icone: Bike },
  { texto: "Perfil da conta", endereco: "/perfil", icone: User },
];

type Props = {
  titulo: string;
  children: ReactNode;
};

export default function Layout({ titulo, children }: Props) {
  return (
    <div className="min-h-screen bg-fundo">
      <MenuLateral />
      <div className="ml-[264px]">
        <BarraTopo titulo={titulo} />
        <main key={titulo} className="animar-pagina px-8 pb-8 pt-7">{children}</main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Menu lateral (Sidebar)
// ---------------------------------------------------------
function MenuLateral() {
  const enderecoAtual = useLocation().pathname;
  const navegar = useNavigate();
  const [conta, setConta] = useState<Administrador | null>(null);
  const [confirmarSaida, setConfirmarSaida] = useState(false);

  useEffect(() => {
    obterConta().then(setConta).catch(() => setConta(null));
  }, []);

  function sair() {
    terminarSessao();
    navegar("/login", { state: { sessaoTerminada: true } });
  }

  // A "Página principal" só fica ativa no endereço "/".
  // As outras ficam ativas também nas páginas de detalhes (ex.: /lavandarias/3).
  function estaAtiva(endereco: string) {
    if (endereco === "/") return enderecoAtual === "/";
    return enderecoAtual.startsWith(endereco);
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[264px] flex-col border-r border-painel-borda bg-painel px-4 pb-7 pt-[26px]">
      {/* Logótipo */}
      <img src={logoSukula} alt="Sukula" className="ml-2.5 h-[30px] w-[156px] object-fill" />

      {/* Perfil do administrador */}
      <div className="mt-[34px] flex h-[76px] items-center gap-3 px-3.5">
        <div className="relative shrink-0">
          {conta?.foto ? (
            <img src={conta.foto} alt="" className="size-12 rounded-full bg-white object-cover" />
          ) : (
            <div className="size-12 rounded-full bg-white" />
          )}
          <span className="absolute left-9 top-9 size-3 rounded-full border-2 border-painel bg-sucesso-vivo" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-claro">{conta?.nome ?? "Sukulinha"}</p>
          <p className="mt-[3px] text-[11px] text-claro-2">Administrador</p>
        </div>
      </div>

      <p className="ml-3 mt-[30px] text-[11px] font-semibold tracking-[0.06em] text-claro-2">MENU</p>

      {/* Opções do menu */}
      <nav className="mt-1.5 flex flex-col gap-1.5">
        {opcoesMenu.map((opcao) => {
          const Icone = opcao.icone;
          const ativa = estaAtiva(opcao.endereco);
          return (
            <Link
              key={opcao.endereco}
              to={opcao.endereco}
              className={
                ativa
                  ? "flex h-11 items-center gap-3 whitespace-nowrap rounded-xl bg-claro px-3.5 text-sm font-semibold text-fundo"
                  : "flex h-11 items-center gap-3 whitespace-nowrap rounded-xl px-3.5 text-sm font-medium text-claro hover:bg-fundo/40"
              }
            >
              <Icone className="size-5" strokeWidth={1.67} />
              {opcao.texto}
            </Link>
          );
        })}
      </nav>

      {/* Terminar sessão (fica no fundo do menu) */}
      <div className="mt-auto border-t border-painel-borda pt-5">
        <button
          onClick={() => setConfirmarSaida(true)}
          className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-claro hover:bg-fundo/40"
        >
          <LogOut className="size-5" strokeWidth={1.67} />
          Terminar sessão
        </button>
      </div>

      {/* U4 - Terminar sessão? */}
      <JanelaConfirmar
        aberta={confirmarSaida}
        aoFechar={() => setConfirmarSaida(false)}
        aoConfirmar={sair}
        tipo="sair"
        titulo="Terminar sessão?"
        texto="Terá de iniciar sessão novamente para aceder ao painel de administração da Sukula."
        textoBotao="Sim, terminar sessão"
      />
    </aside>
  );
}

// ---------------------------------------------------------
// Barra do topo (Topbar)
// ---------------------------------------------------------
function BarraTopo({ titulo }: { titulo: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-[84px] items-center justify-between border-b border-painel-borda bg-painel px-8">
      <h1 className="text-[22px] font-bold text-claro">{titulo}</h1>

      <div className="flex items-center gap-3">
        {/* Notificações */}
        <button className="relative flex size-11 cursor-pointer items-center justify-center rounded-full" aria-label="Notificações">
          <Bell className="size-5 text-claro" strokeWidth={1.67} />
          <span className="absolute left-[27px] top-2.5 size-2 rounded-full bg-link" />
        </button>
      </div>
    </header>
  );
}
