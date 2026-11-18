// DADOS DE EXEMPLO (os mesmos que aparecem no Figma)
// São usados enquanto a API em C# não estiver pronta
// (no ficheiro ".env": VITE_USAR_DADOS_EXEMPLO=true).
// Voltam ao início sempre que a página é recarregada (F5).
import type { Administrador, Artigo, Cliente, Entregador, Informacoes, Lavandaria, Resumo, Servico } from "./tipos";
import fotoAdministrador from "@/assets/imagens/foto-administrador.png";
import fotoLogin from "@/assets/imagens/foto-login.jpg";
import fotoBonita from "@/assets/imagens/foto-lavandaria-bonita.jpg";
import fotoRoupasEmDia from "@/assets/imagens/foto-lavandaria-roupas-em-dia.png";
import logoBonita from "@/assets/imagens/logo-lavandaria-bonita.png";
import logoRoupasEmDia from "@/assets/imagens/logo-lavandaria-roupas-em-dia.png";
import logoShoesClean from "@/assets/imagens/logo-lavandaria-shoes-clean.png";

// Senha para entrar com os dados de exemplo (qualquer e-mail/telefone)
export const PALAVRA_PASSE_EXEMPLO = "123456";

export const administrador: Administrador = {
  nome: "Sukulinha",
  morada: "Talatona, Luanda",
  perfil: "Administrador",
  ativo: true,
  foto: fotoAdministrador,
  nomeFoto: "sukulinha.jpg",
  palavraPasseAlterada: "Alterada há 30 dias",
};

export const resumo: Resumo = {
  clientes: 1248,
  lavandarias: 24,
  servicosAtivos: 8,
  artigos: 36,
  entregadores: 18,
};

// Totais usados nas tabelas com páginas (iguais ao Figma)
export const totais = { clientes: 1248, artigos: 36, entregadores: 18 };

export const clientes: Cliente[] = [
  { id: 1, nome: "Sukulinha", zona: "Talatona, Luanda", morada: "Rua do Talatona, Casa 3, Talatona, Luanda", ativo: true, foto: fotoAdministrador, nomeFoto: "sukulinha.jpg", pedidos: 22, gastoTotal: 132000, avaliacao: 4.9, clienteDesde: "02 Jan 2026", ultimoPedido: "10 Nov 2026", pedidosEmProcessamento: 0 },
  { id: 2, nome: "Helena Lopes", zona: "Kilamba, Luanda", morada: "Bloco Q3, Apto 12, Kilamba, Luanda", ativo: true, foto: "", nomeFoto: "helena.jpg", pedidos: 9, gastoTotal: 54000, avaliacao: 4.7, clienteDesde: "20 Mar 2026", ultimoPedido: "05 Nov 2026", pedidosEmProcessamento: 1 },
  { id: 3, nome: "Carlos Manuel", zona: "Viana, Luanda", morada: "Rua 5, Casa 40, Viana, Luanda", ativo: true, foto: "", nomeFoto: "carlos.jpg", pedidos: 6, gastoTotal: 31500, avaliacao: 4.5, clienteDesde: "11 Abr 2026", ultimoPedido: "28 Out 2026", pedidosEmProcessamento: 0 },
  { id: 4, nome: "Beatriz Tavares", zona: "Maianga, Luanda", morada: "Rua da Maianga, Prédio 8, Maianga, Luanda", ativo: true, foto: "", nomeFoto: "beatriz.jpg", pedidos: 12, gastoTotal: 70500, avaliacao: 4.8, clienteDesde: "07 Fev 2026", ultimoPedido: "01 Nov 2026", pedidosEmProcessamento: 0 },
  { id: 5, nome: "António Kiluange", zona: "Ingombota, Luanda", morada: "Av. 4 de Fevereiro, 22, Ingombota, Luanda", ativo: false, foto: "", nomeFoto: "antonio.jpg", pedidos: 3, gastoTotal: 12000, avaliacao: 4.2, clienteDesde: "15 Mai 2026", ultimoPedido: "12 Jul 2026", pedidosEmProcessamento: 0 },
  { id: 6, nome: "Rosa Mbala", zona: "Cazenga, Luanda", morada: "Rua 12, Casa 7, Cazenga, Luanda", ativo: true, foto: "", nomeFoto: "rosa.jpg", pedidos: 8, gastoTotal: 41000, avaliacao: 4.6, clienteDesde: "30 Jun 2026", ultimoPedido: "09 Nov 2026", pedidosEmProcessamento: 1 },
  { id: 7, nome: "Nelson Tchipa", zona: "Benfica, Luanda", morada: "Rua 21, Casa 14, Benfica, Luanda", ativo: true, foto: "", nomeFoto: "nelson.jpg", pedidos: 14, gastoTotal: 86500, avaliacao: 4.8, clienteDesde: "15 Out 2026", ultimoPedido: "02 Nov 2026", pedidosEmProcessamento: 1 },
  { id: 8, nome: "Luísa Domingos", zona: "Morro Bento, Luanda", morada: "Rua do Morro Bento, Casa 9, Morro Bento, Luanda", ativo: false, foto: "", nomeFoto: "luisa.jpg", pedidos: 2, gastoTotal: 9000, avaliacao: 4.0, clienteDesde: "18 Ago 2026", ultimoPedido: "20 Ago 2026", pedidosEmProcessamento: 0 },
];

const servicosLavimpa: Lavandaria["servicos"] = [
  { servico: "Lavagem + Engomar", categoria: "Roupa", artigos: ["Camisa", "Calça", "Camisola", "Calção"], preco: 1000 },
  { servico: "Lavagem a Seco", categoria: "Roupa", artigos: ["Camisa", "Calça", "Camisola"], preco: 2500 },
  { servico: "Engomar", categoria: "Roupa", artigos: ["Camisa", "Calça"], preco: 500 },
  { servico: "Lavagem de Calçado", categoria: "Calçados", artigos: ["Tênis", "Loafers", "Chinelos", "Chuteiras"], preco: 1000 },
];

export const lavandarias: Lavandaria[] = [
  { id: 1, nome: "Lavandaria Lavimpa", zona: "Talatona, Luanda", localizacao: "Rua do Talatona, Edifício Belas Business, Loja 4 · Talatona, Luanda", descricao: "Lavandaria em Talatona com lavagem e engomagem de roupa, limpeza a seco e limpeza de calçado. Recolha e entrega ao domicílio.", logo: "", foto: fotoLogin, avaliacao: 4.8, nova: false, dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"], abertura: "07:30", encerramento: "19:30", categorias: ["Roupa", "Calçados", "Lar"], numeroServicos: 6, servicos: servicosLavimpa, ativa: true },
  { id: 2, nome: "Lavandaria Bonita", zona: "Cruzeiro, Luanda", localizacao: "Rua do Cruzeiro, 15 · Cruzeiro, Luanda", descricao: "Lavagem, engomagem e lavagem de artigos do lar.", logo: logoBonita, foto: fotoBonita, avaliacao: 4.6, nova: false, dias: ["Seg", "Ter", "Qua", "Qui", "Sex"], abertura: "08:00", encerramento: "18:00", categorias: ["Roupa", "Lar"], numeroServicos: 4, servicos: servicosLavimpa.slice(0, 3), ativa: true },
  { id: 3, nome: "Lavandaria Roupas em Dia", zona: "Vila Alice, Luanda", localizacao: "Rua da Vila Alice, 40 · Vila Alice, Luanda", descricao: "Cuidamos da sua roupa do dia a dia.", logo: logoRoupasEmDia, foto: fotoRoupasEmDia, avaliacao: 4.7, nova: false, dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"], abertura: "08:00", encerramento: "20:00", categorias: ["Roupa"], numeroServicos: 3, servicos: servicosLavimpa.slice(0, 3), ativa: true },
  { id: 4, nome: "Lavandaria Shoes Clean", zona: "Projecto Nova Vida, Luanda", localizacao: "Rua 50, Projecto Nova Vida, Luanda", descricao: "Especialistas em limpeza de calçado.", logo: logoShoesClean, foto: fotoLogin, avaliacao: 4.9, nova: false, dias: ["Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"], abertura: "09:00", encerramento: "19:00", categorias: ["Calçados"], numeroServicos: 4, servicos: servicosLavimpa.slice(3), ativa: true },
  { id: 5, nome: "Lava Express Kilamba", zona: "Kilamba, Luanda", localizacao: "Bloco R12, Loja 3, Kilamba, Luanda", descricao: "Lavandaria de bairro com lavagem, engomagem e limpeza de calçado. Recolha e entrega no Kilamba e arredores.", logo: "", foto: fotoLogin, avaliacao: null, nova: false, dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"], abertura: "08:00", encerramento: "19:00", categorias: ["Roupa", "Calçados"], numeroServicos: 3, servicos: [servicosLavimpa[0], servicosLavimpa[3]], ativa: false },
  { id: 6, nome: "Lavandaria Sol Nascente", zona: "Viana, Luanda", localizacao: "Estrada de Viana, Km 12 · Viana, Luanda", descricao: "Lavandaria de roupa e artigos do lar em Viana.", logo: "", foto: fotoLogin, avaliacao: 4.2, nova: false, dias: ["Seg", "Ter", "Qua", "Qui", "Sex"], abertura: "08:00", encerramento: "17:00", categorias: ["Roupa", "Lar"], numeroServicos: 2, servicos: servicosLavimpa.slice(0, 2), ativa: false },
];

export const servicos: Servico[] = [
  { id: 1, nome: "Lavagem + Engomar", categoria: "Roupa", precoBase: 1000, artigos: [{ artigo: "Camisa", preco: 1000 }, { artigo: "Calça", preco: 1000 }, { artigo: "Camisola", preco: 1200 }, { artigo: "Calção", preco: 800 }], numeroLavandarias: 18, ativo: true },
  { id: 2, nome: "Lavagem a Seco", categoria: "Roupa", precoBase: 2500, artigos: [{ artigo: "Camisa", preco: 2500 }, { artigo: "Calça", preco: 2500 }, { artigo: "Camisola", preco: 3000 }], numeroLavandarias: 11, ativo: true },
  { id: 3, nome: "Engomar", categoria: "Roupa", precoBase: 500, artigos: [{ artigo: "Camisa", preco: 500 }, { artigo: "Calça", preco: 500 }], numeroLavandarias: 20, ativo: true },
  { id: 4, nome: "Lavagem de Calçado", categoria: "Calçados", precoBase: 1000, artigos: [{ artigo: "Tênis", preco: 1000 }, { artigo: "Loafers", preco: 1000 }, { artigo: "Chinelos", preco: 800 }, { artigo: "Chuteiras", preco: 1200 }, { artigo: "Sabrinas", preco: 1000 }], numeroLavandarias: 7, ativo: true },
  { id: 5, nome: "Graxa", categoria: "Calçados", precoBase: 800, artigos: [{ artigo: "Loafers", preco: 800 }, { artigo: "Sabrinas", preco: 800 }], numeroLavandarias: 5, ativo: true },
  { id: 6, nome: "Personalização", categoria: "Calçados", precoBase: 5000, artigos: [{ artigo: "Tênis", preco: 5000 }], numeroLavandarias: 2, ativo: false },
  { id: 7, nome: "Lavagem de Tapete", categoria: "Lar", precoBase: 2000, artigos: [{ artigo: "Tapete de Lã", preco: 2000 }], numeroLavandarias: 9, ativo: true },
  { id: 8, nome: "Lavagem de Edredão", categoria: "Lar", precoBase: 4000, artigos: [{ artigo: "Edredão", preco: 4000 }], numeroLavandarias: 8, ativo: true },
];

// Cores usadas nas bolinhas da tabela de artigos
const cor = {
  branco: { nome: "Branco", codigo: "#ffffff" },
  azul: { nome: "Azul", codigo: "#1e63d6" },
  preto: { nome: "Preto", codigo: "#1e1e1e" },
  cinzento: { nome: "Cinzento", codigo: "#9aa3ad" },
  vermelho: { nome: "Vermelho", codigo: "#e53935" },
  castanho: { nome: "Castanho", codigo: "#7b4a2a" },
  laranja: { nome: "Laranja", codigo: "#f57c00" },
  rosa: { nome: "Rosa", codigo: "#f06292" },
};

export const artigos: Artigo[] = [
  { id: 1, nome: "Camisa", categoria: "Roupa", cores: [cor.branco, cor.azul, cor.preto, cor.cinzento], tamanhos: ["S", "M", "L", "XL"], servicos: ["Lavagem + Engomar", "Lavagem a Seco", "Engomar"] },
  { id: 2, nome: "Calça", categoria: "Roupa", cores: [cor.azul, cor.preto, cor.cinzento], tamanhos: ["38", "40", "42", "44"], servicos: ["Lavagem + Engomar", "Lavagem a Seco", "Engomar"] },
  { id: 3, nome: "Camisola", categoria: "Roupa", cores: [cor.cinzento, cor.preto, cor.vermelho], tamanhos: ["S", "M", "L"], servicos: ["Lavagem + Engomar", "Lavagem a Seco"] },
  { id: 4, nome: "Calção", categoria: "Roupa", cores: [cor.castanho, cor.azul], tamanhos: ["M", "L"], servicos: ["Lavagem + Engomar"] },
  { id: 5, nome: "Tênis", categoria: "Calçados", cores: [cor.branco, cor.preto, cor.azul], tamanhos: ["39", "40", "41", "42"], servicos: ["Lavagem de Calçado", "Personalização"] },
  { id: 6, nome: "Loafers", categoria: "Calçados", cores: [cor.castanho, cor.preto], tamanhos: ["40", "41", "42"], servicos: ["Lavagem de Calçado", "Graxa"] },
  { id: 7, nome: "Chinelos", categoria: "Calçados", cores: [cor.preto, cor.azul], tamanhos: ["39", "40"], servicos: ["Lavagem de Calçado"] },
  { id: 8, nome: "Chuteiras", categoria: "Calçados", cores: [cor.laranja, cor.preto, cor.branco], tamanhos: ["41", "42", "43"], servicos: ["Lavagem de Calçado"] },
  { id: 9, nome: "Sabrinas", categoria: "Calçados", cores: [cor.rosa, cor.preto], tamanhos: ["36", "37", "38"], servicos: ["Graxa", "Lavagem de Calçado"] },
];

export const entregadores: Entregador[] = [
  { id: 1, nome: "Mateus Kiala", utilizador: "@mateus.estafeta", telefone: "+244 937 112 432", email: "mateus.kiala@sukula.ao", veiculo: "Mota", modelo: "Suzuki", matricula: "LD-24-87-AB", avaliacao: 4.9, ativo: true, foto: "", entregas: 312, sucesso: 98, desde: "08 Abr 2025", ultimaAtividade: "há 6 min", lavandaria: "Lavandaria Lavimpa" },
  { id: 2, nome: "Joana Sebastião", utilizador: "@joana.estafeta", telefone: "+244 934 113 432", email: "joana.sebastiao@sukula.ao", veiculo: "Mota", modelo: "Suzuki", matricula: "LD-31-02-CF", avaliacao: 4.8, ativo: true, foto: "", entregas: 280, sucesso: 97, desde: "15 Mai 2025", ultimaAtividade: "há 12 min", lavandaria: "Lavandaria Bonita" },
  { id: 3, nome: "Paulo Neto", utilizador: "@paulo.estafeta", telefone: "+244 932 110 431", email: "paulo.neto@sukula.ao", veiculo: "Carro", modelo: "Toyota", matricula: "LD-18-55-BA", avaliacao: 4.7, ativo: true, foto: "", entregas: 198, sucesso: 96, desde: "02 Jun 2025", ultimaAtividade: "há 1 h", lavandaria: "Lavandaria Lavimpa" },
  { id: 4, nome: "Edson Cardoso", utilizador: "@edson.estafeta", telefone: "+244 931 174 315", email: "edson.cardoso@sukula.ao", veiculo: "Mota", modelo: "Honda CG 125", matricula: "LD-42-19-DE", avaliacao: 4.6, ativo: true, foto: "", entregas: 150, sucesso: 95, desde: "20 Jul 2025", ultimaAtividade: "há 2 h", lavandaria: "Lavandaria Roupas em Dia" },
  { id: 5, nome: "Wilson Mendes", utilizador: "@wilson.estafeta", telefone: "+244 929 154 311", email: "wilson.mendes@sukula.ao", veiculo: "Mota", modelo: "Suzuki", matricula: "LD-07-63-AA", avaliacao: 4.5, ativo: false, foto: "", entregas: 96, sucesso: 93, desde: "11 Ago 2025", ultimaAtividade: "há 3 dias", lavandaria: "Lavandaria Sol Nascente" },
  { id: 6, nome: "Rui Lourenço", utilizador: "@rui.estafeta", telefone: "+244 923 640 118", email: "rui.lourenco@sukula.ao", veiculo: "Bicicleta", modelo: "", matricula: "", avaliacao: 4.7, ativo: true, foto: "", entregas: 120, sucesso: 97, desde: "03 Set 2025", ultimaAtividade: "há 25 min", lavandaria: "Lavandaria Bonita" },
  { id: 7, nome: "Domingas Paulo", utilizador: "@domingas.estafeta", telefone: "+244 935 902 741", email: "domingas.paulo@sukula.ao", veiculo: "Mota", modelo: "Suzuki", matricula: "LD-29-40-CB", avaliacao: 4.8, ativo: true, foto: "", entregas: 240, sucesso: 98, desde: "19 Out 2025", ultimaAtividade: "há 40 min", lavandaria: "Lava Express Kilamba" },
  { id: 8, nome: "Ivo Fernandes", utilizador: "@ivo.estafeta", telefone: "+244 927 418 205", email: "ivo.fernandes@sukula.ao", veiculo: "Carro", modelo: "Hyundai", matricula: "LD-11-76-EE", avaliacao: 4.4, ativo: false, foto: "", entregas: 64, sucesso: 92, desde: "01 Dez 2025", ultimaAtividade: "há 1 semana", lavandaria: "Lavandaria Shoes Clean" },
];

// "Histórico da lavandaria" (Perfil da conta)
export const historicoLavandarias = [
  { nome: "Lava Express Kilamba", logo: "" },
  { nome: "Lavandaria Lavimpa", logo: "" },
  { nome: "Lavandaria Sol Nascente", logo: "" },
  { nome: "Lavandaria Bonita", logo: logoBonita },
  { nome: "Lavandaria Shoes Clean", logo: logoShoesClean },
  { nome: "Lavandaria Mar Azul", logo: "" },
];

export const informacoes: Informacoes = {
  centralAjuda: {
    perfis: "Todos os perfis",
    ultimaAtualizacao: "12 Nov 2026",
    perguntas: [
      { pergunta: "Como faço um pedido de recolha?", resposta: "Na página inicial escolha a lavandaria, selecione o serviço e as peças, indique o endereço de recolha e confirme o pedido." },
      { pergunta: "Quanto tempo demora a entrega?", resposta: "O prazo depende do serviço escolhido. Em regra, as peças são entregues entre 24 e 72 horas após a recolha." },
    ],
  },
  termos: {
    versao: "v2.1",
    data: "15 Nov 2026",
    ultimaAtualizacao: "15 Set 2026",
    conteudo:
      "1. Objeto — Os presentes Termos regulam a utilização da plataforma Sukula por clientes, lavandarias parceiras e entregadores.\n2. Pedidos — O cliente é responsável pela informação indicada no pedido e pela disponibilidade no endereço de recolha e entrega.\n3. Pagamentos — Os preços são apresentados em Kwanzas (Kz) e incluem as taxas aplicáveis.\n4. Responsabilidade — A lavandaria parceira responde pelo tratamento das peças durante o serviço.",
  },
  privacidade: {
    versao: "v1.4",
    data: "15 Nov 2026",
    ultimaAtualizacao: "15 Set 2026",
    conteudo:
      "A Sukula recolhe apenas os dados necessários para prestar o serviço: nome, telefone, e-mail e endereços de recolha e entrega.\nOs dados são partilhados com a lavandaria e o entregador associados a cada pedido e não são vendidos a terceiros.\nO titular pode pedir a consulta, correção ou eliminação dos seus dados através da Central de ajuda.",
  },
  sobre: {
    empresa: "Sukula, Lda.",
    nif: "5000 123 456",
    versao: "v1.0.0",
    sede: "Luanda, Angola",
    descricao:
      "A Sukula é uma plataforma de lavandaria a pedido que liga clientes a lavandarias parceiras e entregadores em Luanda, com recolha e entrega ao domicílio.",
  },
  notificacoesAtivas: true,
};
