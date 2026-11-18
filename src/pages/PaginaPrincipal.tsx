// Tela N - Página principal
// Cartões com os totais + atalhos para as secções de gestão.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bike, ChevronRight, Shirt, Store, Users, WashingMachine, type LucideIcon } from "lucide-react";
import { obterResumo } from "@/api/conta";
import { mensagemDeErro } from "@/api/configuracao";
import type { Resumo } from "@/api/tipos";
import CartaoNumero from "@/components/CartaoNumero";
import Layout from "@/components/Layout";
import { Carregando } from "@/components/TituloPagina";
import { Card } from "@/components/ui/card";
import { formatarNumero } from "@/lib/utils";

export default function PaginaPrincipal() {
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [erro, setErro] = useState("");

  // Pede os números à API quando a página abre
  useEffect(() => {
    obterResumo()
      .then(setResumo)
      .catch((e) => setErro(mensagemDeErro(e)));
  }, []);

  if (!resumo) {
    return (
      <Layout titulo="Página principal">
        <Carregando erro={erro} />
      </Layout>
    );
  }

  // Atalhos para as secções (cartões grandes)
  const atalhos: { titulo: string; texto: string; endereco: string; icone: LucideIcon }[] = [
    { titulo: "Gestão de clientes", texto: `${formatarNumero(resumo.clientes)} clientes`, endereco: "/clientes", icone: Users },
    { titulo: "Gestão de lavandarias", texto: `${resumo.lavandarias} lavandarias`, endereco: "/lavandarias", icone: Store },
    { titulo: "Gestão de serviços", texto: `${resumo.servicosAtivos} serviços`, endereco: "/servicos", icone: WashingMachine },
    { titulo: "Gestão de artigos", texto: `${resumo.artigos} artigos`, endereco: "/artigos", icone: Shirt },
    { titulo: "Gestão de entregadores", texto: `${resumo.entregadores} entregadores`, endereco: "/entregadores", icone: Bike },
  ];

  return (
    <Layout titulo="Página principal">
      {/* Totais */}
      <div className="flex gap-4">
        <CartaoNumero icone={Users} titulo="Clientes registados" valor={formatarNumero(resumo.clientes)} />
        <CartaoNumero icone={Store} titulo="Lavandarias" valor={resumo.lavandarias} />
        <CartaoNumero icone={WashingMachine} titulo="Serviços ativos" valor={resumo.servicosAtivos} />
        <CartaoNumero icone={Shirt} titulo="Artigos" valor={resumo.artigos} />
        <CartaoNumero icone={Bike} titulo="Entregadores" valor={resumo.entregadores} />
      </div>

      {/* Secções de gestão */}
      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-claro">Secções de gestão</h2>
        <span className="text-xs font-medium text-claro-2">{atalhos.length} secções</span>
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-4">
        {atalhos.map((atalho) => {
          const Icone = atalho.icone;
          return (
            <Link key={atalho.endereco} to={atalho.endereco}>
              <Card className="h-[143px] p-[21px] hover:opacity-95">
                <div className="flex size-11 items-center justify-center rounded-xl">
                  <Icone className="size-[22px] text-cartao-titulo" strokeWidth={1.83} />
                </div>
                <p className="mt-3 text-[15px] font-bold text-cartao-titulo">{atalho.titulo}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-cartao-texto">{atalho.texto}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-cartao-titulo">
                    Abrir <ChevronRight className="size-3.5" strokeWidth={1.8} />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
}
