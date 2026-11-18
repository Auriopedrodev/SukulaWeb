// =====================================================================
//  DADOS FICTÍCIOS DO PAINEL DA LAVANDARIA (Portal do Parceiro)
//  Usados enquanto a API C# não estiver ligada.
// =====================================================================

export const lavandaria = {
  id: 1,
  nome: 'Lavandaria Lavimpa',
  localizacao: 'Talatona, Luanda',
  moradaCompleta: 'Rua do Talatona, Edifício Belas Business, Loja 4',
  fotoUrl: '/imagens/foto-lavandaria.jpg',
  capaUrl: '/imagens/capa-perfil.jpg',
  verificada: true,
  parceiroDesde: 'Mar 2025',
  horario: 'Seg – Sáb · 07:30 – 19:30',
  servicosOferecidos: 'Lavagem, Engomagem, Limpeza a seco, Calçados, Tapetes',
  descricao: 'Lavandaria em Talatona com lavagem e engomagem de roupa, limpeza a seco e limpeza de calçado. Recolha e entrega ao domicílio.',
  totalEstafetas: 6,
  totalPedidos: '4.812',
  avaliacao: '4,8',
  telefoneApoio: '+244 923 000 111',
  pedidosNovos: 5,
  pedidosEmProcessamento: 4,
};

// Dados do Dashboard para cada período (Dia, Semana, Mês)
export const dashboard = {
  dia: {
    subtitulo: 'Produção total e por período · Hoje, 02 Nov 2026',
    subtituloEstafetas: 'Produção de cada estafeta · Hoje, 02 Nov 2026',
    indicadores: [
      { titulo: 'Pedidos concluídos', valor: '48', variacao: '+12% vs ontem', icone: 'pacote' },
      { titulo: 'Peças lavadas', valor: '312', variacao: '+8% vs ontem', icone: 'camisa' },
      { titulo: 'Receita (Kz)', valor: '486,5 mil', variacao: '+15% vs ontem', icone: 'dinheiro' },
      { titulo: 'Tempo médio de serviço', valor: '18h', variacao: '-2h vs ontem', icone: 'relogio' },
    ],
    grafico: {
      descricao: 'Pedidos concluídos por hora',
      maximo: 12,
      barras: [
        { rotulo: '08h', valor: 2, meta: 9 }, { rotulo: '09h', valor: 4, meta: 9 }, { rotulo: '10h', valor: 6, meta: 9 },
        { rotulo: '11h', valor: 5, meta: 9 }, { rotulo: '12h', valor: 3, meta: 9 }, { rotulo: '13h', valor: 4, meta: 9 },
        { rotulo: '14h', valor: 7, meta: 9 }, { rotulo: '15h', valor: 8, meta: 9, destaque: true }, { rotulo: '16h', valor: 6, meta: 9 },
        { rotulo: '17h', valor: 5, meta: 9 }, { rotulo: '18h', valor: 3, meta: 9 }, { rotulo: '19h', valor: 2, meta: 9 },
      ],
    },
  },
  semana: {
    subtitulo: 'Produção total e por período · 27 Out – 02 Nov 2026',
    subtituloEstafetas: 'Produção de cada estafeta · 27 Out – 02 Nov 2026',
    indicadores: [
      { titulo: 'Pedidos concluídos', valor: '364', variacao: '+9% vs semana ant.', icone: 'pacote' },
      { titulo: 'Peças lavadas', valor: '2.418', variacao: '+6% vs semana ant.', icone: 'camisa' },
      { titulo: 'Receita (Kz)', valor: '3,64 M', variacao: '+11% vs semana ant.', icone: 'dinheiro' },
      { titulo: 'Tempo médio de serviço', valor: '20h', variacao: '-1h vs semana ant.', icone: 'relogio' },
    ],
    grafico: {
      descricao: 'Pedidos concluídos por dia',
      maximo: 80,
      barras: [
        { rotulo: 'Seg', valor: 42, meta: 62 }, { rotulo: 'Ter', valor: 51, meta: 62 }, { rotulo: 'Qua', valor: 47, meta: 62 },
        { rotulo: 'Qui', valor: 58, meta: 62 }, { rotulo: 'Sex', valor: 64, meta: 62 }, { rotulo: 'Sáb', valor: 72, meta: 62, destaque: true },
        { rotulo: 'Dom', valor: 30, meta: 62 },
      ],
    },
  },
  mes: {
    subtitulo: 'Produção total e por período · Novembro 2026',
    subtituloEstafetas: 'Produção de cada estafeta · Novembro 2026',
    indicadores: [
      { titulo: 'Pedidos concluídos', valor: '1.471', variacao: '+14% vs mês ant.', icone: 'pacote' },
      { titulo: 'Peças lavadas', valor: '9.640', variacao: '+10% vs mês ant.', icone: 'camisa' },
      { titulo: 'Receita (Kz)', valor: '14,73 M', variacao: '+18% vs mês ant.', icone: 'dinheiro' },
      { titulo: 'Tempo médio de serviço', valor: '21h', variacao: '-3h vs mês ant.', icone: 'relogio' },
    ],
    grafico: {
      descricao: 'Pedidos concluídos por semana',
      maximo: 400,
      barras: [
        { rotulo: 'Sem 1', valor: 312, meta: 310 }, { rotulo: 'Sem 2', valor: 345, meta: 310 }, { rotulo: 'Sem 3', valor: 330, meta: 310 },
        { rotulo: 'Sem 4', valor: 384, meta: 310, destaque: true }, { rotulo: 'Sem 5', valor: 100, meta: 310 },
      ],
    },
  },
  producaoTotal: {
    desde: 'Desde a adesão · Mar 2025',
    pedidos: '4.812',
    pecas: '31.240',
    categorias: [
      { nome: 'Lavagem e engomagem', percentagem: 52 },
      { nome: 'Limpeza a seco', percentagem: 21 },
      { nome: 'Calçados', percentagem: 15 },
      { nome: 'Tapetes e casa', percentagem: 12 },
    ],
  },
};

// Estado do estafeta: 'Em rota', 'Disponível', 'Ocupado' ou 'Offline'
export const estafetas = [
  { id: 1, nome: 'Mateus Kiala', telefone: '+244 937 1124 326', fotoUrl: '/imagens/foto-mateus-kiala.png', estado: 'Em rota', zona: 'Talatona', recolhas: 14, entregas: 12, pedidos: 26, avaliacao: 4.9, producao: 92, email: 'mateus.kiala@sukula.ao', veiculo: 'Motorizada · LD-45-23-AB', zonaAtuacao: 'Talatona / Kilamba', membroDesde: '12 Jan 2026', totalAvaliacoes: 128, distancia: '3,5 km', tempo: '~14 min' },
  { id: 2, nome: 'Joana Sebastião', telefone: '+244 934 1134 324', fotoUrl: '', estado: 'Disponível', zona: 'Kilamba', recolhas: 11, entregas: 13, pedidos: 24, avaliacao: 4.8, producao: 85, email: 'joana.sebastiao@sukula.ao', veiculo: 'Motorizada · LD-12-88-CA', zonaAtuacao: 'Kilamba', membroDesde: '20 Fev 2026', totalAvaliacoes: 96, distancia: '1,2 km', tempo: '~6 min' },
  { id: 3, nome: 'Paulo Neto', telefone: '+244 932 1104 319', fotoUrl: '', estado: 'Ocupado', zona: 'Maianga', recolhas: 9, entregas: 10, pedidos: 19, avaliacao: 4.7, producao: 68, email: 'paulo.neto@sukula.ao', veiculo: 'Carro · LD-18-55-BA', zonaAtuacao: 'Maianga', membroDesde: '03 Mar 2026', totalAvaliacoes: 74, distancia: '4,1 km', tempo: '~17 min' },
  { id: 4, nome: 'Edson Cardoso', telefone: '+244 931 174 315', fotoUrl: '', estado: 'Disponível', zona: 'Morro Bento', recolhas: 8, entregas: 7, pedidos: 15, avaliacao: 4.6, producao: 54, email: 'edson.cardoso@sukula.ao', veiculo: 'Motorizada · LD-42-19-DE', zonaAtuacao: 'Morro Bento', membroDesde: '15 Abr 2026', totalAvaliacoes: 51, distancia: '2,8 km', tempo: '~11 min' },
  { id: 5, nome: 'Wilson Mendes', telefone: '+244 929 154 311', fotoUrl: '', estado: 'Offline', zona: 'Viana', recolhas: 6, entregas: 5, pedidos: 11, avaliacao: 4.5, producao: 40, email: 'wilson.mendes@sukula.ao', veiculo: 'Motorizada · LD-07-63-AA', zonaAtuacao: 'Viana', membroDesde: '01 Mai 2026', totalAvaliacoes: 33, distancia: '9,0 km', tempo: '~30 min' },
  { id: 6, nome: 'Ana Lukeny', telefone: '+244 928 164 311', fotoUrl: '', estado: 'Em rota', zona: 'Benfica', recolhas: 5, entregas: 6, pedidos: 11, avaliacao: 4.8, producao: 40, email: 'ana.lukeny@sukula.ao', veiculo: 'Motorizada · LD-50-11-AF', zonaAtuacao: 'Benfica', membroDesde: '10 Jun 2026', totalAvaliacoes: 29, distancia: '6,2 km', tempo: '~22 min' },
];

// Produção individual do estafeta (página "Produção do estafeta")
export const producaoEstafeta = {
  periodo: '27 Out – 02 Nov 2026',
  indicadores: [
    { titulo: 'Recolhas', valor: '14', icone: 'pacote' },
    { titulo: 'Entregas', valor: '12', icone: 'camiao' },
    { titulo: 'Km percorridos', valor: '86', icone: 'rota' },
    { titulo: 'Tempo médio', valor: '32 min', icone: 'relogio' },
  ],
  grafico: [
    { rotulo: 'Seg', recolhas: 2, entregas: 1 }, { rotulo: 'Ter', recolhas: 3, entregas: 2 },
    { rotulo: 'Qua', recolhas: 1, entregas: 2 }, { rotulo: 'Qui', recolhas: 2, entregas: 2 },
    { rotulo: 'Sex', recolhas: 3, entregas: 2 }, { rotulo: 'Sáb', recolhas: 2, entregas: 2 },
    { rotulo: 'Dom', recolhas: 1, entregas: 1 },
  ],
  ultimosPedidos: [
    { numero: '#SK-10482', cliente: 'Ana Paula Ferreira', tipo: 'Recolha', dataHora: 'Hoje, 14:20', estado: 'Em rota' },
    { numero: '#SK-10479', cliente: 'Carlos Domingos', tipo: 'Entrega', dataHora: 'Hoje, 12:05', estado: 'Entregue' },
    { numero: '#SK-10475', cliente: 'Helena Sousa', tipo: 'Recolha', dataHora: 'Hoje, 10:40', estado: 'Recolhido' },
    { numero: '#SK-10468', cliente: 'Rui Manuel', tipo: 'Entrega', dataHora: 'Ontem, 17:15', estado: 'Entregue' },
    { numero: '#SK-10461', cliente: 'Marta Cassoma', tipo: 'Entrega', dataHora: 'Ontem, 11:30', estado: 'Não realizado' },
  ],
  localizacaoAtual: 'A caminho de Kilamba · ETA 12 min',
};

// Estados possíveis de um pedido (o C# deve usar os mesmos textos):
// 'Novo', 'Aguarda recolha', 'Recolhido', 'Em processamento',
// 'Pronto para entrega', 'Em entrega', 'Entregue', 'Não realizado', 'Cancelado'
export const pedidosNovos = [
  { id: 10491, numero: '#SK-10491', cliente: 'Ana Paula Ferreira', bairro: 'Talatona', servico: 'Lavagem + Calçados', pecas: 7, recolhaAgendada: 'Hoje, 15:00 – 16:00', valor: 19500, estado: 'Novo' },
  { id: 10490, numero: '#SK-10490', cliente: 'Domingos Bento', bairro: 'Kilamba, Bloco Q', servico: 'Limpeza a seco', pecas: 3, recolhaAgendada: 'Hoje, 16:00 – 17:00', valor: 12000, estado: 'Novo' },
  { id: 10488, numero: '#SK-10488', cliente: 'Luísa Neto', bairro: 'Maianga', servico: 'Lavagem e engomagem', pecas: 12, recolhaAgendada: 'Hoje, 17:30 – 18:30', valor: 15800, estado: 'Novo' },
  { id: 10486, numero: '#SK-10486', cliente: 'Pedro Kapalo', bairro: 'Morro Bento', servico: 'Tapetes', pecas: 2, recolhaAgendada: 'Hoje, 14:00 – 15:00', valor: 24000, estado: 'Aguarda recolha' },
  { id: 10484, numero: '#SK-10484', cliente: 'Sofia Cassule', bairro: 'Benfica', servico: 'Calçados', pecas: 2, recolhaAgendada: 'Hoje, 13:30 – 14:30', valor: 10000, estado: 'Aguarda recolha' },
];

// Etapa: 'Lavagem', 'Engomagem' ou 'Pronto p/ entrega'
export const pedidosEmProcessamento = [
  { id: 10476, numero: '#SK-10476', cliente: 'Helena Sousa', bairro: 'Talatona', servico: 'Lavagem + engomagem', pecas: 9, recebidoEm: 'Hoje, 10:40', etapa: 'Engomagem', progresso: 70 },
  { id: 10473, numero: '#SK-10473', cliente: 'Carlos Domingos', bairro: 'Kilamba', servico: 'Limpeza a seco', pecas: 4, recebidoEm: 'Hoje, 09:15', etapa: 'Pronto p/ entrega', progresso: 100 },
  { id: 10470, numero: '#SK-10470', cliente: 'Rui Manuel', bairro: 'Maianga', servico: 'Lavagem e engomagem', pecas: 11, recebidoEm: 'Ontem, 17:20', etapa: 'Lavagem', progresso: 35 },
  { id: 10465, numero: '#SK-10465', cliente: 'Marta Cassoma', bairro: 'Viana', servico: 'Tapetes', pecas: 2, recebidoEm: 'Ontem, 15:05', etapa: 'Lavagem', progresso: 50 },
];

export const resumoProcessamento = { emLavagem: 2, emEngomagem: 1, prontosParaEntrega: 1, atrasados: 0 };

// Resultado: 'Entregue', 'Não realizado' ou 'Cancelado'
export const historicoPedidos = [
  { id: 10479, numero: '#SK-10479', cliente: 'Carlos Domingos', bairro: 'Kilamba', servico: 'Limpeza a seco', data: '02 Nov, 12:05', estafeta: 'Mateus Kiala', valor: 12000, resultado: 'Entregue' },
  { id: 10474, numero: '#SK-10474', cliente: 'Joaquim Lopes', bairro: 'Talatona', servico: 'Lavagem e engomagem', data: '02 Nov, 09:30', estafeta: 'Joana Sebastião', valor: 18200, resultado: 'Entregue' },
  { id: 10468, numero: '#SK-10468', cliente: 'Rui Manuel', bairro: 'Maianga', servico: 'Lavagem + Calçados', data: '01 Nov, 17:15', estafeta: 'Mateus Kiala', valor: 21500, resultado: 'Entregue' },
  { id: 10461, numero: '#SK-10461', cliente: 'Marta Cassoma', bairro: 'Viana', servico: 'Lavagem + Calçados', data: '01 Nov, 11:30', estafeta: 'Mateus Kiala', valor: 19500, resultado: 'Não realizado' },
  { id: 10457, numero: '#SK-10457', cliente: 'Beatriz Quintas', bairro: 'Benfica', servico: 'Lavagem e engomagem', data: '31 Out, 16:40', estafeta: 'Paulo Neto', valor: 9800, resultado: 'Entregue' },
  { id: 10452, numero: '#SK-10452', cliente: 'Nelson Afonso', bairro: 'Morro Bento', servico: 'Calçados', data: '31 Out, 10:10', estafeta: 'Edson Cardoso', valor: 10000, resultado: 'Cancelado' },
  { id: 10449, numero: '#SK-10449', cliente: 'Rosa Fernandes', bairro: 'Kilamba', servico: 'Lavagem especial', data: '30 Out, 18:20', estafeta: 'Joana Sebastião', valor: 6500, resultado: 'Entregue' },
  { id: 10445, numero: '#SK-10445', cliente: 'Mário Gaspar', bairro: 'Talatona', servico: 'Limpeza a seco', data: '30 Out, 14:05', estafeta: 'Wilson Mendes', valor: 15000, resultado: 'Não realizado' },
];

export const resumoHistorico = { todos: 128, realizados: 119, naoRealizados: 9, periodo: '01 Out – 02 Nov 2026' };

// Peças de um pedido (iguais em todos os exemplos para simplificar)
const pecasExemplo = [
  { nome: 'Camisa', servico: 'Lavagem e engomagem', quantidade: 3, valor: 4500, icone: 'camisa' },
  { nome: 'Calça', servico: 'Lavagem e engomagem', quantidade: 2, valor: 4000, icone: 'camisa' },
  { nome: 'Ténis', servico: 'Limpeza de calçados', quantidade: 1, valor: 5000, icone: 'pacote' },
  { nome: 'Edredom (casal)', servico: 'Lavagem especial', quantidade: 1, valor: 6500, icone: 'maquina' },
];

// Detalhes completos de um pedido (página "Detalhes do pedido")
export function criarDetalhesPedido(id) {
  const naoRealizado = Number(id) === 10461;

  // Descobre o estado do pedido procurando-o nas listas
  let estado = 'Novo';
  const novo = pedidosNovos.find((p) => p.id === Number(id));
  const emProcessamento = pedidosEmProcessamento.find((p) => p.id === Number(id));
  const doHistorico = historicoPedidos.find((p) => p.id === Number(id));
  if (novo) estado = novo.estado;
  else if (emProcessamento) estado = emProcessamento.etapa === 'Pronto p/ entrega' ? 'Pronto para entrega' : 'Em processamento';
  else if (doHistorico) estado = doHistorico.resultado;

  return {
    id: Number(id),
    numero: '#SK-' + id,
    estado: estado,
    criadoEm: naoRealizado ? 'Criado a 31 Out às 20:15' : 'Criado hoje às 13:42',
    resumoServico: naoRealizado ? 'Lavagem + Calçados · 7 peças' : 'Lavagem e engomagem + Calçados · 7 peças',
    cliente: naoRealizado
      ? { nome: 'Marta Cassoma', iniciais: 'MC', telefone: '+244 935 118 902', clienteDesde: 'Jun 2026' }
      : { nome: 'Ana Paula Ferreira', iniciais: 'AP', telefone: '+244 923 456 781', clienteDesde: 'Mar 2026' },
    endereco: naoRealizado ? 'Rua 21 de Janeiro, Prédio 7, 3º Esq. · Viana' : 'Rua do Talatona, Cond. Jardim de Rosas, Casa 14 · Talatona',
    enderecoCurto: 'Cond. Jardim de Rosas, Casa 14',
    tipoResidencia: naoRealizado ? 'Prédio · 3º andar, sem elevador' : 'Vivenda · Portão azul',
    recolhaAgendada: naoRealizado ? '01 Nov · 11:00 – 12:00' : 'Hoje, 02 Nov · 15:00 – 16:00',
    recolhaCurta: 'Hoje, 15:00 – 16:00',
    entregaPrevista: naoRealizado ? '—' : 'Qua, 04 Nov · 10:00 – 12:00',
    pagamento: naoRealizado ? 'Multicaixa Express · Reembolsado' : 'Multicaixa Express · Pago',
    pecas: pecasExemplo,
    subtotal: 20000,
    taxaRecolha: 1500,
    desconto: 2000,
    cupao: 'SUKULA10',
    total: 19500,
    estafeta: { nome: 'Joana Sebastião', iniciais: 'JS', veiculo: 'Motorizada · LD-12-88-CA', distancia: '1,2 km', tempo: '~6 min' },
    responsavel: { nome: 'Teresa Manuel', iniciais: 'TM', funcao: 'Operadora · Turno da manhã' },
    prazoConclusao: 'Ter, 03 Nov · 18:00',
    avaliacao: { estrelas: 5, nota: '5,0', comentario: '"Roupa impecável e entrega antes do horário. O edredom ficou como novo!"', autor: 'Ana Paula Ferreira · 04 Nov' },
    tempoTotal: '44h 52min',
    naoRealizado: naoRealizado
      ? {
          motivo: 'O cliente não se encontrava no local e não atendeu às chamadas do estafeta. O pedido foi cancelado automaticamente após 30 minutos.',
          reembolso: '19.500 Kz · Multicaixa Express',
          notaInterna: 'Cliente pediu para reagendar via apoio. Aguardar novo pedido.',
        }
      : null,
  };
}

// Histórico mensal da lavandaria (Perfil > Histórico da lavandaria)
export const historicoLavandaria = {
  resumo: [
    { titulo: 'Pedidos totais', valor: '4.812', icone: 'pacote' },
    { titulo: 'Peças lavadas', valor: '31.240', icone: 'camisa' },
    { titulo: 'Receita total', valor: '98,4 M Kz', icone: 'dinheiro' },
    { titulo: 'Clientes atendidos', valor: '1.236', icone: 'pessoas' },
  ],
  meses: [
    { mes: 'Novembro 2026*', pedidos: '48', pecas: '312', receita: '486.500 Kz', avaliacao: '4,9', variacao: 'Em curso' },
    { mes: 'Outubro 2026', pedidos: '1.471', pecas: '9.640', receita: '14.725.000 Kz', avaliacao: '4,8', variacao: '+18%' },
    { mes: 'Setembro 2026', pedidos: '1.247', pecas: '8.105', receita: '12.480.000 Kz', avaliacao: '4,8', variacao: '+9%' },
    { mes: 'Agosto 2026', pedidos: '1.142', pecas: '7.520', receita: '11.452.000 Kz', avaliacao: '4,7', variacao: '+4%' },
    { mes: 'Julho 2026', pedidos: '1.098', pecas: '7.031', receita: '11.010.000 Kz', avaliacao: '4,7', variacao: '-2%' },
    { mes: 'Junho 2026', pedidos: '1.120', pecas: '7.214', receita: '11.236.000 Kz', avaliacao: '4,6', variacao: '+6%' },
  ],
  marcos: [
    { data: 'Mar 2025', titulo: 'Adesão à Sukula', icone: 'edificio' },
    { data: 'Ago 2025', titulo: '1.000 pedidos concluídos', icone: 'pacote' },
    { data: 'Jan 2026', titulo: 'Parceiro verificado', icone: 'visto' },
    { data: 'Out 2026', titulo: 'Top 3 em Luanda', icone: 'estrela' },
  ],
};

// Cupões de desconto. tipo: 'percentagem' ou 'valor'
export const descontos = [
  { id: 1, codigo: 'SUKULA10', tipo: 'percentagem', valor: 10, descricao: 'Desconto em todos os serviços', validade: 'Válido até 30 Nov 2026', utilizacoes: 62, limite: 100, ativo: true, expirado: false },
  { id: 2, codigo: 'PRIMEIRA20', tipo: 'percentagem', valor: 20, descricao: 'Primeira lavagem de novos clientes', validade: 'Válido até 31 Dez 2026', utilizacoes: 24, limite: 100, ativo: true, expirado: false },
  { id: 3, codigo: 'FIDELIDADE', tipo: 'valor', valor: 2000, descricao: 'Clientes com mais de 5 pedidos', validade: 'Sem data de fim', utilizacoes: 40, limite: null, ativo: true, expirado: false },
  { id: 4, codigo: 'EDREDOM15', tipo: 'percentagem', valor: 15, descricao: 'Lavagem de edredons e tapetes', validade: 'Expirou a 31 Out 2026', utilizacoes: 50, limite: 50, ativo: false, expirado: true },
];

export const resumoDescontos = { cupoesAtivos: 3, utilizacoesMes: 86, descontoConcedido: '172.000 Kz' };

export const servicosParaDescontos = ['Lavagem e engomagem', 'Limpeza a seco', 'Calçados', 'Tapetes e casa'];
