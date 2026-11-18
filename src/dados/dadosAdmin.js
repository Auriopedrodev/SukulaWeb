// =====================================================================
//  DADOS FICTÍCIOS DO PAINEL DO ADMINISTRADOR
//  São usados enquanto a API C# não estiver ligada
//  (VITE_USAR_DADOS_FICTICIOS=true no ficheiro .env).
//  Os nomes dos campos são os mesmos que a API deve devolver.
// =====================================================================

export const administrador = {
  id: 1,
  nomeCompleto: 'Sukulinha',
  email: 'admin@sukula.ao',
  morada: 'Talatona, Luanda',
  perfil: 'Administrador',
  estado: 'Ativo',
  fotoUrl: '/imagens/foto-administrador.png',
  fotoNome: 'sukulinha.jpg',
  palavraPasseAlteradaHa: 'Alterada há 30 dias',
};

// Lista de cores que um artigo pode ter (nome + código da cor)
export const coresDisponiveis = [
  { nome: 'Vermelho', codigo: '#e5484d' },
  { nome: 'Azul', codigo: '#1e63d6' },
  { nome: 'Verde', codigo: '#2f9e44' },
  { nome: 'Amarelo', codigo: '#f5c518' },
  { nome: 'Laranja', codigo: '#f08c00' },
  { nome: 'Roxo', codigo: '#7b3fbf' },
  { nome: 'Rosa', codigo: '#e8689a' },
  { nome: 'Preto', codigo: '#1e1e1e' },
  { nome: 'Branco', codigo: '#ffffff' },
  { nome: 'Cinzento', codigo: '#9aa3ad' },
  { nome: 'Castanho', codigo: '#7b4a2a' },
  { nome: 'Turquesa', codigo: '#20b2aa' },
];

export const tamanhosDisponiveis = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const categorias = ['Roupa', 'Calçados', 'Lar'];

export const zonas = ['Talatona, Luanda', 'Kilamba, Luanda', 'Viana, Luanda', 'Maianga, Luanda', 'Benfica, Luanda'];

export const clientes = [
  { id: 1, nomeCompleto: 'Sukulinha', morada: 'Talatona, Luanda', estado: 'Ativo', perfil: 'Cliente', fotoNome: 'sukulinha.jpg', totalPedidos: 22, gastoTotal: 132000, avaliacao: 4.9, clienteDesde: '02 Mar 2026', ultimoPedido: '10 Nov 2026', pedidosEmProcessamento: 0 },
  { id: 2, nomeCompleto: 'Helena Lopes', morada: 'Kilamba, Luanda', estado: 'Ativo', perfil: 'Cliente', fotoNome: 'helena.jpg', totalPedidos: 9, gastoTotal: 54000, avaliacao: 4.7, clienteDesde: '11 Nov 2026', ultimoPedido: '11 Nov 2026', pedidosEmProcessamento: 1 },
  { id: 3, nomeCompleto: 'Carlos Manuel', morada: 'Viana, Luanda', estado: 'Ativo', perfil: 'Cliente', fotoNome: 'carlos.jpg', totalPedidos: 5, gastoTotal: 31500, avaliacao: 4.5, clienteDesde: '10 Nov 2026', ultimoPedido: '10 Nov 2026', pedidosEmProcessamento: 0 },
  { id: 4, nomeCompleto: 'Beatriz Tavares', morada: 'Maianga, Luanda', estado: 'Ativo', perfil: 'Cliente', fotoNome: 'beatriz.jpg', totalPedidos: 3, gastoTotal: 18000, avaliacao: 4.8, clienteDesde: '09 Nov 2026', ultimoPedido: '09 Nov 2026', pedidosEmProcessamento: 0 },
  { id: 5, nomeCompleto: 'António Kiluange', morada: 'Ingombota, Luanda', estado: 'Inativo', perfil: 'Cliente', fotoNome: 'antonio.jpg', totalPedidos: 2, gastoTotal: 9800, avaliacao: 4.0, clienteDesde: '20 Ago 2026', ultimoPedido: '01 Set 2026', pedidosEmProcessamento: 0 },
  { id: 6, nomeCompleto: 'Rosa Mbala', morada: 'Cazenga, Luanda', estado: 'Ativo', perfil: 'Cliente', fotoNome: 'rosa.jpg', totalPedidos: 7, gastoTotal: 41200, avaliacao: 4.6, clienteDesde: '05 Set 2026', ultimoPedido: '28 Out 2026', pedidosEmProcessamento: 0 },
  { id: 7, nomeCompleto: 'Nelson Tchipa', morada: 'Benfica, Luanda',estado: 'Ativo', perfil: 'Cliente', fotoNome: 'nelson.jpg', totalPedidos: 14, gastoTotal: 86500, avaliacao: 4.8, clienteDesde: '15 Out 2026', ultimoPedido: '02 Nov 2026', pedidosEmProcessamento: 1 },
  { id: 8, nomeCompleto: 'Luísa Domingos', morada: 'Morro Bento, Luanda', estado: 'Inativo', perfil: 'Cliente', fotoNome: 'luisa.jpg', totalPedidos: 1, gastoTotal: 4500, avaliacao: 5.0, clienteDesde: '12 Jul 2026', ultimoPedido: '12 Jul 2026', pedidosEmProcessamento: 0 },
  { id: 9, nomeCompleto: 'Pedro Kapalo', morada: 'Morro Bento, Luanda', estado: 'Ativo', perfil: 'Cliente', fotoNome: '', totalPedidos: 4, gastoTotal: 24000, avaliacao: 4.4, clienteDesde: '01 Out 2026', ultimoPedido: '02 Nov 2026', pedidosEmProcessamento: 0 },
  { id: 10, nomeCompleto: 'Sofia Cassule', morada: 'Benfica, Luanda', estado: 'Ativo', perfil: 'Cliente', fotoNome: '', totalPedidos: 6, gastoTotal: 30000, avaliacao: 4.9, clienteDesde: '18 Set 2026', ultimoPedido: '02 Nov 2026', pedidosEmProcessamento: 0 },
];

export const lavandarias = [
  {
    id: 1, nome: 'Lavandaria Lavimpa', localizacao: 'Talatona, Luanda', moradaCompleta: 'Rua do Talatona, Edifício Belas Business, Loja 4 · Talatona, Luanda',
    logoUrl: '', fotoUrl: '/imagens/foto-lavandaria.jpg', avaliacao: 4.8, ativa: true,
    descricao: 'Lavandaria em Talatona com lavagem e engomagem de roupa, limpeza a seco e limpeza de calçado. Recolha e entrega ao domicílio.',
    diasFuncionamento: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], abertura: '07:30', encerramento: '19:30',
    horarioResumo: 'Seg – Sáb · 07:30 – 19:30', categorias: ['Roupa', 'Calçados', 'Lar'], totalServicos: 6,
    horario: [
      { dias: 'Segunda a Sexta', horas: '07:30 – 19:30' },
      { dias: 'Sábado', horas: '07:30 – 19:30' },
      { dias: 'Domingo', horas: 'Encerrado' },
    ],
    servicos: [
      { id: 1, nome: 'Lavagem + Engomar', categoria: 'Roupa', artigos: ['Camisa', 'Calça', 'Camisola', 'Calção'], preco: 1000 },
      { id: 2, nome: 'Lavagem a Seco', categoria: 'Roupa', artigos: ['Camisa', 'Calça', 'Camisola'], preco: 2500 },
      { id: 3, nome: 'Engomar', categoria: 'Roupa', artigos: ['Camisa', 'Calça'], preco: 500 },
      { id: 4, nome: 'Lavagem de Calçado', categoria: 'Calçados', artigos: ['Ténis', 'Loafers', 'Chinelos', 'Chuteiras'], preco: 1000 },
    ],
  },
  {
    id: 2, nome: 'Lavandaria Bonita', localizacao: 'Cruzeiro, Luanda', moradaCompleta: 'Rua do Cruzeiro, 12 · Cruzeiro, Luanda',
    logoUrl: '/imagens/logo-lavandaria-bonita.png', fotoUrl: '/imagens/foto-lavandaria-bonita.jpg', avaliacao: 4.6, ativa: true,
    descricao: 'Lavandaria familiar com serviços de lavagem e cuidados para o lar.',
    diasFuncionamento: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'], abertura: '08:00', encerramento: '18:00',
    horarioResumo: 'Seg – Sex · 08:00 – 18:00', categorias: ['Roupa', 'Lar'], totalServicos: 4,
    horario: [{ dias: 'Segunda a Sexta', horas: '08:00 – 18:00' }, { dias: 'Sábado', horas: 'Encerrado' }, { dias: 'Domingo', horas: 'Encerrado' }],
    servicos: [],
  },
  {
    id: 3, nome: 'Lavandaria Roupas em Dia', localizacao: 'Vila Alice, Luanda', moradaCompleta: 'Rua da Vila Alice, 45 · Vila Alice, Luanda',
    logoUrl: '/imagens/logo-lavandaria-roupas-em-dia.png', fotoUrl: '/imagens/foto-lavandaria-roupas-em-dia.jpg', avaliacao: 4.7, ativa: true,
    descricao: 'Lavagem e engomagem de roupa com recolha ao domicílio.',
    diasFuncionamento: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], abertura: '08:00', encerramento: '20:00',
    horarioResumo: 'Seg – Sáb · 08:00 – 20:00', categorias: ['Roupa'], totalServicos: 3,
    horario: [{ dias: 'Segunda a Sexta', horas: '08:00 – 20:00' }, { dias: 'Sábado', horas: '08:00 – 20:00' }, { dias: 'Domingo', horas: 'Encerrado' }],
    servicos: [],
  },
  {
    id: 4, nome: 'Lavandaria Shoes Clean', localizacao: 'Projecto Nova Vida, Luanda', moradaCompleta: 'Projecto Nova Vida, Rua 30 · Luanda',
    logoUrl: '/imagens/logo-lavandaria-shoes-clean.png', fotoUrl: '', avaliacao: 4.9, ativa: true,
    descricao: 'Especialistas em limpeza e restauro de calçado.',
    diasFuncionamento: ['Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], abertura: '09:00', encerramento: '19:00',
    horarioResumo: 'Ter – Dom · 09:00 – 19:00', categorias: ['Calçados'], totalServicos: 4,
    horario: [{ dias: 'Terça a Domingo', horas: '09:00 – 19:00' }, { dias: 'Segunda', horas: 'Encerrado' }],
    servicos: [],
  },
  {
    id: 5, nome: 'Lava Express Kilamba', localizacao: 'Kilamba, Luanda', moradaCompleta: 'Bloco R12, Loja 3, Kilamba, Luanda',
    logoUrl: '', fotoUrl: '', avaliacao: null, ativa: false,
    descricao: 'Lavandaria de bairro com lavagem, engomagem e limpeza de calçado. Recolha e entrega no Kilamba e arredores.',
    diasFuncionamento: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], abertura: '08:00', encerramento: '19:00',
    horarioResumo: 'Seg – Sáb · 08:00 – 19:00', categorias: ['Roupa', 'Calçados'], totalServicos: 3,
    horario: [{ dias: 'Segunda a Sexta', horas: '08:00 – 19:00' }, { dias: 'Sábado', horas: '08:00 – 19:00' }, { dias: 'Domingo', horas: 'Encerrado' }],
    servicos: [
      { id: 1, nome: 'Lavagem + Engomar', categoria: 'Roupa', artigos: ['Camisa', 'Calça', 'Camisola', 'Calção'], preco: 1000 },
      { id: 4, nome: 'Lavagem de Calçado', categoria: 'Calçados', artigos: ['Ténis', 'Chinelos'], preco: 1000 },
    ],
  },
  {
    id: 6, nome: 'Lavandaria Sol Nascente', localizacao: 'Viana, Luanda', moradaCompleta: 'Estrada de Viana, Km 12 · Viana, Luanda',
    logoUrl: '', fotoUrl: '/imagens/foto-lavandaria.jpg', avaliacao: 4.2, ativa: false,
    descricao: 'Lavandaria em Viana com lavagem de roupa e artigos do lar.',
    diasFuncionamento: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'], abertura: '08:00', encerramento: '17:00',
    horarioResumo: 'Seg – Sex · 08:00 – 17:00', categorias: ['Roupa', 'Lar'], totalServicos: 2,
    horario: [{ dias: 'Segunda a Sexta', horas: '08:00 – 17:00' }, { dias: 'Sábado', horas: 'Encerrado' }, { dias: 'Domingo', horas: 'Encerrado' }],
    servicos: [],
  },
];

export const artigos = [
  { id: 1, nome: 'Camisa', categoria: 'Roupa', cores: ['Branco', 'Azul', 'Preto', 'Cinzento'], tamanhos: ['S', 'M', 'L', 'XL'], servicos: ['Lavagem + Engomar', 'Lavagem a Seco', 'Engomar'] },
  { id: 2, nome: 'Calça', categoria: 'Roupa', cores: ['Azul', 'Preto', 'Cinzento'], tamanhos: ['38', '40', '42', '44'], servicos: ['Lavagem + Engomar', 'Lavagem a Seco', 'Engomar'] },
  { id: 3, nome: 'Camisola', categoria: 'Roupa', cores: ['Cinzento', 'Preto', 'Vermelho'], tamanhos: ['S', 'M', 'L'], servicos: ['Lavagem + Engomar', 'Lavagem a Seco'] },
  { id: 4, nome: 'Calção', categoria: 'Roupa', cores: ['Castanho', 'Azul'], tamanhos: ['M', 'L'], servicos: ['Lavagem + Engomar'] },
  { id: 5, nome: 'Ténis', categoria: 'Calçados', cores: ['Branco', 'Preto', 'Azul'], tamanhos: ['39', '40', '41', '42'], servicos: ['Lavagem de Calçado', 'Personalização'] },
  { id: 6, nome: 'Loafers', categoria: 'Calçados', cores: ['Castanho', 'Preto'], tamanhos: ['40', '41', '42'], servicos: ['Lavagem de Calçado', 'Graxa'] },
  { id: 7, nome: 'Chinelos', categoria: 'Calçados', cores: ['Preto', 'Azul'], tamanhos: ['39', '40'], servicos: ['Lavagem de Calçado'] },
  { id: 8, nome: 'Chuteiras', categoria: 'Calçados', cores: ['Laranja', 'Preto', 'Branco'], tamanhos: ['41', '42', '43'], servicos: ['Lavagem de Calçado'] },
  { id: 9, nome: 'Sabrinas', categoria: 'Calçados', cores: ['Rosa', 'Preto'], tamanhos: ['36', '37', '38'], servicos: ['Graxa', 'Lavagem de Calçado'] },
  { id: 10, nome: 'Cortinado', categoria: 'Lar', cores: ['Branco', 'Cinzento'], tamanhos: ['2,5 m', '3 m'], servicos: [] },
  { id: 11, nome: 'Edredão', categoria: 'Lar', cores: ['Azul', 'Branco'], tamanhos: ['Solteiro', 'Casal'], servicos: ['Lavagem de Edredão'] },
  { id: 12, nome: 'Tapete de Lã', categoria: 'Lar', cores: ['Vermelho', 'Castanho'], tamanhos: ['1×2 m', '2×3 m'], servicos: ['Lavagem de Tapete'] },
];

export const servicos = [
  { id: 1, nome: 'Lavagem + Engomar', categoria: 'Roupa', precoBase: 1000, artigos: ['Camisa', 'Calça', 'Camisola', 'Calção'], totalLavandarias: 18, ativo: true },
  { id: 2, nome: 'Lavagem a Seco', categoria: 'Roupa', precoBase: 2500, artigos: ['Camisa', 'Calça', 'Camisola'], totalLavandarias: 11, ativo: true },
  { id: 3, nome: 'Engomar', categoria: 'Roupa', precoBase: 500, artigos: ['Camisa', 'Calça'], totalLavandarias: 20, ativo: true },
  { id: 4, nome: 'Lavagem de Calçado', categoria: 'Calçados', precoBase: 1000, artigos: ['Ténis', 'Loafers', 'Chinelos', 'Chuteiras', 'Sabrinas'], totalLavandarias: 7, ativo: true },
  { id: 5, nome: 'Graxa', categoria: 'Calçados', precoBase: 800, artigos: ['Loafers', 'Sabrinas'], totalLavandarias: 5, ativo: true },
  { id: 6, nome: 'Personalização', categoria: 'Calçados', precoBase: 5000, artigos: ['Ténis'], totalLavandarias: 2, ativo: false },
  { id: 7, nome: 'Lavagem de Tapete', categoria: 'Lar', precoBase: 2000, artigos: ['Tapete de Lã'], totalLavandarias: 9, ativo: true },
  { id: 8, nome: 'Lavagem de Edredão', categoria: 'Lar', precoBase: 4000, artigos: ['Edredão'], totalLavandarias: 8, ativo: true },
];

export const entregadores = [
  { id: 1, nomeCompleto: 'Mateus Kiala', utilizador: '@mateus.estafeta', telefone: '+244 937 112 432', email: 'mateus.kiala@sukula.ao', numeroBi: '006734512LA041', zona: 'Talatona, Luanda', lavandaria: 'Lavandaria Lavimpa', tipoVeiculo: 'Mota', modeloVeiculo: 'Honda CG 125', matricula: 'LD-24-87-AB', avaliacao: 4.9, ativo: true, totalEntregas: 312, taxaSucesso: 98, membroDesde: '08 Abr 2025', ultimaAtividade: 'há 6 min' },
  { id: 2, nomeCompleto: 'Joana Sebastião', utilizador: '@joana.estafeta', telefone: '+244 934 113 432', email: 'joana.sebastiao@sukula.ao', numeroBi: '005123456LA032', zona: 'Kilamba, Luanda', lavandaria: 'Lavandaria Lavimpa', tipoVeiculo: 'Mota', modeloVeiculo: 'Yamaha Crypton 110', matricula: 'LD-31-02-CF', avaliacao: 4.8, ativo: true, totalEntregas: 270, taxaSucesso: 97, membroDesde: '12 Mai 2025', ultimaAtividade: 'há 2 min' },
  { id: 3, nomeCompleto: 'Paulo Neto', utilizador: '@paulo.estafeta', telefone: '+244 932 110 431', email: 'paulo.neto@sukula.ao', numeroBi: '004998123LA011', zona: 'Maianga, Luanda', lavandaria: 'Lavandaria Bonita', tipoVeiculo: 'Carro', modeloVeiculo: 'Toyota Corolla', matricula: 'LD-18-55-BA', avaliacao: 4.7, ativo: true, totalEntregas: 198, taxaSucesso: 96, membroDesde: '20 Jun 2025', ultimaAtividade: 'há 15 min' },
  { id: 4, nomeCompleto: 'Edson Cardoso', utilizador: '@edson.estafeta', telefone: '+244 931 174 315', email: 'edson.cardoso@sukula.ao', numeroBi: '003456789LA022', zona: 'Morro Bento, Luanda', lavandaria: 'Lavandaria Lavimpa', tipoVeiculo: 'Mota', modeloVeiculo: 'Honda CG 150', matricula: 'LD-42-19-DE', avaliacao: 4.6, ativo: true, totalEntregas: 150, taxaSucesso: 95, membroDesde: '02 Ago 2025', ultimaAtividade: 'há 1 h' },
  { id: 5, nomeCompleto: 'Wilson Mendes', utilizador: '@wilson.estafeta', telefone: '+244 929 154 311', email: 'wilson.mendes@sukula.ao', numeroBi: '002345678LA099', zona: 'Viana, Luanda', lavandaria: 'Lavandaria Sol Nascente', tipoVeiculo: 'Mota', modeloVeiculo: 'Suzuki AX 100', matricula: 'LD-07-63-AA', avaliacao: 4.5, ativo: false, totalEntregas: 88, taxaSucesso: 93, membroDesde: '15 Set 2025', ultimaAtividade: 'há 3 dias' },
  { id: 6, nomeCompleto: 'Rui Lourenço', utilizador: '@rui.estafeta', telefone: '+244 923 640 118', email: 'rui.lourenco@sukula.ao', numeroBi: '001234567LA055', zona: 'Ingombota, Luanda', lavandaria: 'Lavandaria Roupas em Dia', tipoVeiculo: 'Bicicleta', modeloVeiculo: '', matricula: '', avaliacao: 4.7, ativo: true, totalEntregas: 64, taxaSucesso: 97, membroDesde: '01 Out 2025', ultimaAtividade: 'há 20 min' },
  { id: 7, nomeCompleto: 'Domingas Paulo', utilizador: '@domingas.estafeta', telefone: '+244 935 902 741', email: 'domingas.paulo@sukula.ao', numeroBi: '007654321LA012', zona: 'Cazenga, Luanda', lavandaria: 'Lavandaria Bonita', tipoVeiculo: 'Mota', modeloVeiculo: 'Honda CG 125', matricula: 'LD-29-40-CB', avaliacao: 4.8, ativo: true, totalEntregas: 120, taxaSucesso: 98, membroDesde: '10 Nov 2025', ultimaAtividade: 'há 8 min' },
  { id: 8, nomeCompleto: 'Ivo Fernandes', utilizador: '@ivo.estafeta', telefone: '+244 927 418 205', email: 'ivo.fernandes@sukula.ao', numeroBi: '008765432LA077', zona: 'Benfica, Luanda', lavandaria: 'Lavandaria Shoes Clean', tipoVeiculo: 'Carro', modeloVeiculo: 'Hyundai i10', matricula: 'LD-11-76-EE', avaliacao: 4.4, ativo: false, totalEntregas: 45, taxaSucesso: 91, membroDesde: '05 Jan 2026', ultimaAtividade: 'há 5 dias' },
];

// Lavandarias por onde o administrador passou (Perfil > Histórico da lavandaria)
export const historicoLavandarias = [
  { id: 5, nome: 'Lava Express Kilamba', logoUrl: '' },
  { id: 1, nome: 'Lavandaria Lavimpa', logoUrl: '' },
  { id: 6, nome: 'Lavandaria Sol Nascente', logoUrl: '' },
  { id: 2, nome: 'Lavandaria Bonita', logoUrl: '/imagens/logo-lavandaria-bonita.png' },
  { id: 4, nome: 'Lavandaria Shoes Clean', logoUrl: '/imagens/logo-lavandaria-shoes-clean.png' },
  { id: 7, nome: 'Lavandaria Mar Azul', logoUrl: '' },
];

// Páginas de informação que o administrador pode editar
export const informacoes = [
  {
    id: 'central-de-ajuda', titulo: 'Central de ajuda', descricao: 'Guias e perguntas frequentes para administradores',
    perfisAbrangidos: 'Todos os perfis', ultimaAtualizacao: '12 Nov 2026', versao: '',
    perguntas: [
      { pergunta: 'Como faço um pedido de recolha?', resposta: 'Na página inicial escolha a lavandaria, selecione o serviço e as peças, indique o endereço de recolha e confirme o pedido.' },
      { pergunta: 'Quanto tempo demora a entrega?', resposta: 'O prazo depende do serviço escolhido. Em regra, as peças são entregues entre 24 e 72 horas após a recolha.' },
    ],
  },
  {
    id: 'termos-e-condicoes', titulo: 'Termos e condições', descricao: 'Última atualização: 15 Set 2026',
    perfisAbrangidos: 'Todos os perfis', ultimaAtualizacao: '15 Set 2026', versao: 'v2.0',
    texto: 'Ao utilizar a plataforma Sukula, o utilizador aceita os presentes termos e condições...',
  },
  {
    id: 'politica-de-privacidade', titulo: 'Política de privacidade', descricao: 'Como tratamos os dados de clientes, lavandarias e entregadores',
    perfisAbrangidos: 'Todos os perfis', ultimaAtualizacao: '15 Set 2026', versao: 'v1.3',
    texto: 'A Sukula recolhe apenas os dados necessários para prestar o serviço de lavandaria a pedido...',
  },
  {
    id: 'sobre-a-sukula', titulo: 'Sobre a Sukula', descricao: 'Plataforma de lavandaria a pedido · Luanda · v1.0.0',
    perfisAbrangidos: 'Todos os perfis', ultimaAtualizacao: '01 Mar 2026', versao: 'v1.0.0',
    texto: 'A Sukula liga clientes, lavandarias e entregadores numa única plataforma em Luanda.',
  },
];
