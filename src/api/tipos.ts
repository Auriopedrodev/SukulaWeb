// FORMATO DOS DADOS
// Cada "type" aqui deve ser igual a uma classe (DTO) da API em C#.
// Atenção: o C# (ASP.NET) envia os nomes em camelCase.
//   Exemplo:  public string NomeCompleto { get; set; }  ->  nomeCompleto

export type Categoria = "Roupa" | "Calçados" | "Lar";

// Resposta das listas com páginas (tabelas com "A mostrar 1–8 de 1.248")
export type Pagina<T> = {
  itens: T[];
  total: number;
};

// ---------- Conta / Login ----------
export type Administrador = {
  nome: string;
  morada: string;
  perfil: string; // "Administrador"
  ativo: boolean;
  foto: string; // endereço da imagem
  nomeFoto: string; // "sukulinha.jpg"
  palavraPasseAlterada: string; // "Alterada há 30 dias"
};

export type RespostaLogin = {
  token: string;
  administrador: Administrador;
};

// ---------- Página principal ----------
export type Resumo = {
  clientes: number;
  lavandarias: number;
  servicosAtivos: number;
  artigos: number;
  entregadores: number;
};

// ---------- Clientes ----------
export type Cliente = {
  id: number;
  nome: string;
  zona: string; // "Benfica, Luanda" (aparece na tabela)
  morada: string; // "Rua 21, Casa 14, Benfica, Luanda"
  ativo: boolean;
  foto: string; // endereço da imagem (vazio = mostra as iniciais)
  nomeFoto: string; // "nelson.jpg"
  pedidos: number;
  gastoTotal: number;
  avaliacao: number;
  clienteDesde: string;
  ultimoPedido: string;
  pedidosEmProcessamento: number;
};

// ---------- Lavandarias ----------
export type ServicoDaLavandaria = {
  servico: string; // "Lavagem + Engomar"
  categoria: Categoria;
  artigos: string[];
  preco: number;
};

export type Lavandaria = {
  id: number;
  nome: string;
  zona: string; // "Talatona, Luanda"
  localizacao: string; // morada completa
  descricao: string;
  logo: string; // imagem (vazio = mostra as iniciais)
  foto: string; // fotografia usada nos cartões pequenos
  avaliacao: number | null; // null = ainda sem avaliação
  nova: boolean; // mostra "Nova" em vez da avaliação
  dias: string[]; // ["Seg","Ter",...]
  abertura: string; // "07:30"
  encerramento: string; // "19:30"
  categorias: Categoria[];
  numeroServicos: number;
  servicos: ServicoDaLavandaria[];
  ativa: boolean;
};

// ---------- Serviços ----------
export type ArtigoDoServico = {
  artigo: string;
  preco: number;
};

export type Servico = {
  id: number;
  nome: string;
  categoria: Categoria;
  precoBase: number;
  artigos: ArtigoDoServico[];
  numeroLavandarias: number;
  ativo: boolean;
};

// ---------- Artigos ----------
export type Cor = {
  nome: string; // "Azul"
  codigo: string; // "#1e63d6"
};

export type Artigo = {
  id: number;
  nome: string;
  categoria: Categoria;
  cores: Cor[];
  tamanhos: string[];
  servicos: string[];
};

// ---------- Entregadores ----------
export type Entregador = {
  id: number;
  nome: string;
  utilizador: string; // "@mateus.estafeta"
  telefone: string;
  email: string;
  veiculo: string; // "Mota", "Carro", "Bicicleta"
  modelo: string; // "Suzuki"
  matricula: string;
  avaliacao: number;
  ativo: boolean;
  foto: string; // endereço da imagem (vazio = mostra as iniciais)
  entregas: number;
  sucesso: number; // percentagem
  desde: string;
  ultimaAtividade: string;
  lavandaria: string;
};

// ---------- Informações (Perfil da conta) ----------
export type PerguntaResposta = {
  pergunta: string;
  resposta: string;
};

export type CentralAjuda = {
  perfis: string;
  ultimaAtualizacao: string;
  perguntas: PerguntaResposta[];
};

export type Documento = {
  versao: string;
  data: string; // data de entrada em vigor
  conteudo: string;
  ultimaAtualizacao: string; // texto mostrado na lista "Informações"
};

export type SobreSukula = {
  empresa: string;
  nif: string;
  versao: string;
  sede: string;
  descricao: string;
};

export type Informacoes = {
  centralAjuda: CentralAjuda;
  termos: Documento;
  privacidade: Documento;
  sobre: SobreSukula;
  notificacoesAtivas: boolean;
};
