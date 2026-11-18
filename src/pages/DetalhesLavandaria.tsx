// Tela Q1 - Detalhes da lavandaria
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Info, MapPin, Pencil, Plus, Store, Trash2, WashingMachine } from "lucide-react";
import { mensagemDeErro } from "@/api/configuracao";
import { editarLavandaria, mudarEstadoLavandaria, obterLavandaria, removerLavandaria } from "@/api/lavandarias";
import type { Lavandaria } from "@/api/tipos";
import Avatar from "@/components/Avatar";
import Aviso, { type DadosAviso } from "@/components/Aviso";
import BotoesAcoes from "@/components/BotoesAcoes";
import { Etiqueta, EtiquetaCategoria } from "@/components/Etiquetas";
import FormularioLavandaria from "@/components/FormularioLavandaria";
import InfoLinha from "@/components/InfoLinha";
import Interruptor from "@/components/Interruptor";
import JanelaConfirmar, { ItemARemover } from "@/components/JanelaConfirmar";
import Layout from "@/components/Layout";
import TituloPagina, { Carregando } from "@/components/TituloPagina";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatarKz } from "@/lib/utils";

export default function DetalhesLavandaria() {
  const { id } = useParams(); // número que vem no endereço: /lavandarias/1
  const navegar = useNavigate();
  const [lavandaria, setLavandaria] = useState<Lavandaria | null>(null);
  const [erro, setErro] = useState("");
  const [janela, setJanela] = useState<"" | "editar" | "remover">("");
  const [aRemover, setARemover] = useState(false);
  const [aviso, setAviso] = useState<DadosAviso | null>(null);

  useEffect(() => {
    obterLavandaria(Number(id))
      .then((l) => (l ? setLavandaria(l) : setErro("Lavandaria não encontrada.")))
      .catch((e) => setErro(mensagemDeErro(e)));
  }, [id]);

  if (!lavandaria) {
    return (
      <Layout titulo="Gestão de lavandarias">
        <Carregando erro={erro} />
      </Layout>
    );
  }

  async function mudarEstado(ativa: boolean) {
    if (!lavandaria) return;
    setLavandaria({ ...lavandaria, ativa });
    await mudarEstadoLavandaria(lavandaria.id, ativa);
  }

  // Tira um serviço da lavandaria (lixo na tabela)
  async function tirarServico(posicao: number) {
    if (!lavandaria) return;
    const servicos = lavandaria.servicos.filter((_, i) => i !== posicao);
    const atualizada = { ...lavandaria, servicos, numeroServicos: servicos.length };
    try {
      setLavandaria(await editarLavandaria(atualizada));
    } catch (e) {
      setAviso({ titulo: "Não foi possível remover", texto: mensagemDeErro(e) });
    }
  }

  async function confirmarRemocao() {
    if (!lavandaria) return;
    setARemover(true);
    try {
      await removerLavandaria(lavandaria.id);
      navegar("/lavandarias");
    } catch (e) {
      setAviso({ titulo: "Não foi possível remover", texto: mensagemDeErro(e) });
      setARemover(false);
    }
  }

  // Horário dividido em "Segunda a Sexta", "Sábado" e "Domingo"
  const horas = `${lavandaria.abertura} – ${lavandaria.encerramento}`;
  const diasUteis = ["Seg", "Ter", "Qua", "Qui", "Sex"].every((d) => lavandaria.dias.includes(d));
  const horario = [
    { dia: "Segunda a Sexta", horas: diasUteis ? horas : "Encerrado" },
    { dia: "Sábado", horas: lavandaria.dias.includes("Sáb") ? horas : "Encerrado" },
    { dia: "Domingo", horas: lavandaria.dias.includes("Dom") ? horas : "Encerrado" },
  ];

  return (
    <Layout titulo="Gestão de lavandarias">
      <TituloPagina
        titulo={lavandaria.nome}
        voltarPara={{ texto: "Voltar às lavandarias", endereco: "/lavandarias" }}
        botoes={
          <>
            <Button variant="perigo" onClick={() => setJanela("remover")}>
              <Trash2 /> Remover
            </Button>
            <Button variant="claro" onClick={() => setJanela("editar")}>
              <Pencil /> Editar lavandaria
            </Button>
          </>
        }
      />

      <div className="mt-5 flex gap-5">
        {/* Foto de perfil */}
        <div className="flex h-[360px] w-[340px] shrink-0 flex-col items-center rounded-2xl border border-borda-pesquisa bg-white p-[25px]">
          <p className="self-start text-base font-bold text-cartao-titulo">Foto de perfil</p>
          <div className="mt-8">
            {lavandaria.logo ? (
              <div className="flex size-[140px] items-center justify-center rounded-full border border-borda-pesquisa bg-white">
                <img src={lavandaria.logo} alt="" className="w-[100px] object-contain" />
              </div>
            ) : (
              <Avatar nome={lavandaria.nome} tamanho={140} tipo="forte" />
            )}
          </div>
          <p className="mt-3 text-base font-bold text-cartao-titulo">{lavandaria.nome}</p>
          <p className="mt-3 text-[13px] text-cartao-texto">{lavandaria.zona}</p>
          <div className="mt-3 flex items-center gap-2">
            <Interruptor ligado={lavandaria.ativa} aoMudar={mudarEstado} />
            <span className={`text-xs font-semibold ${lavandaria.ativa ? "text-sucesso-escuro" : "text-cinza"}`}>
              {lavandaria.ativa ? "Ativa" : "Inativa"}
            </span>
          </div>
        </div>

        {/* Informações */}
        <div className="flex-1 rounded-2xl border border-painel-borda bg-white p-[25px]">
          <p className="text-base font-bold text-cartao-titulo">Informações</p>
          <div className="mt-[18px] flex flex-col gap-[18px]">
            <InfoLinha icone={Store} titulo="Nome">{lavandaria.nome}</InfoLinha>
            <InfoLinha icone={MapPin} titulo="Localização">{lavandaria.localizacao}</InfoLinha>
            <InfoLinha icone={Info} titulo="Descrição">{lavandaria.descricao}</InfoLinha>
            <InfoLinha icone={Clock} titulo="Horário de funcionamento">
              <div className="flex flex-col gap-1.5">
                {horario.map((linha) => (
                  <div key={linha.dia} className="flex justify-between text-[13px]">
                    <span className="font-medium text-cartao-texto">{linha.dia}</span>
                    <span className="font-semibold text-cartao-texto">{linha.horas}</span>
                  </div>
                ))}
              </div>
            </InfoLinha>
          </div>
        </div>
      </div>

      {/* Serviços da lavandaria */}
      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-base font-bold text-claro">Serviços da lavandaria</h3>
        <Button variant="azul" className="h-[38px]" onClick={() => setJanela("editar")}>
          <Plus /> Adicionar serviço
        </Button>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl border border-borda bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[257px]">Serviço</TableHead>
              <TableHead className="w-[144px]">Categoria</TableHead>
              <TableHead className="w-[453px]">Artigos</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {lavandaria.servicos.map((linha, posicao) => (
              <TableRow key={linha.servico + posicao} className="h-[50px]">
                <TableCell>
                  <div className="flex items-center gap-4 pl-2.5 font-semibold">
                    <WashingMachine className="size-[18px]" strokeWidth={1.6} />
                    {linha.servico}
                  </div>
                </TableCell>
                <TableCell>
                  <EtiquetaCategoria categoria={linha.categoria} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {linha.artigos.map((a) => (
                      <Etiqueta key={a} texto={a} />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-bold">{formatarKz(linha.preco)}</span>
                  <span className="text-[11px] text-cinza"> / peça</span>
                </TableCell>
                <TableCell>
                  <BotoesAcoes aoEditar={() => setJanela("editar")} aoRemover={() => tirarServico(posicao)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Q3 - Editar lavandaria */}
      {janela === "editar" && (
        <FormularioLavandaria
          lavandaria={lavandaria}
          aoFechar={() => setJanela("")}
          aoGuardar={(guardada) => {
            setLavandaria(guardada);
            setJanela("");
            setAviso({ titulo: "Alterações guardadas", texto: `Os dados da ${guardada.nome} foram atualizados.` });
          }}
        />
      )}

      {/* Q4 - Remover lavandaria? */}
      <JanelaConfirmar
        aberta={janela === "remover"}
        aoFechar={() => setJanela("")}
        aoConfirmar={confirmarRemocao}
        aCarregar={aRemover}
        titulo="Remover lavandaria?"
        texto={`A ${lavandaria.nome} deixará de aparecer na aplicação e os seus serviços, artigos e fotografias serão removidos. Esta ação não pode ser anulada.`}
        textoBotao="Sim, remover lavandaria"
      >
        <ItemARemover
          imagem={<img src={lavandaria.foto} alt="" className="h-11 w-14 rounded-lg bg-white object-cover" />}
          titulo={lavandaria.nome}
          texto={`${lavandaria.zona} · ${lavandaria.numeroServicos} serviços`}
        />
      </JanelaConfirmar>

      <Aviso aviso={aviso} aoFechar={() => setAviso(null)} />
    </Layout>
  );
}
