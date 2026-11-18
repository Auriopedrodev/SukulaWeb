// =====================================================================
//  PEQUENAS FUNÇÕES DE AJUDA usadas em várias páginas
// =====================================================================

// 19500 -> "19.500 Kz"
export function formatarKz(valor) {
  if (valor === null || valor === undefined || valor === '') return '—';
  return formatarNumero(valor) + ' Kz';
}

// 4.8 -> "4,8"
export function formatarNota(valor) {
  if (valor === null || valor === undefined) return '—';
  return Number(valor).toFixed(1).replace('.', ',');
}

// 1248 -> "1.248"
export function formatarNumero(valor) {
  // Coloca um ponto a cada 3 algarismos
  return String(Math.round(Number(valor))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// "Nelson Tchipa" -> "NT"   "Ana Paula Ferreira" -> "AP"   "Lavandaria Sol Nascente" -> "SN"
export function iniciais(nome) {
  if (!nome) return '';
  let partes = nome.trim().split(' ');
  if (partes.length >= 3 && partes[0] === 'Lavandaria') partes = partes.slice(1);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

// Escolhe a cor da etiqueta conforme o texto do estado.
export function corDoEstado(estado) {
  const cores = {
    'Novo': 'roxo',
    'Aguarda recolha': 'laranja',
    'Recolhido': 'azul',
    'Em processamento': 'azul',
    'Em rota': 'azul',
    'Em entrega': 'azul',
    'Lavagem': 'azul',
    'Engomagem': 'roxo',
    'Pronto p/ entrega': 'verde',
    'Pronto para entrega': 'verde',
    'Disponível': 'verde',
    'Entregue': 'verde',
    'Ativo': 'verde',
    'Ocupado': 'laranja',
    'Não realizado': 'vermelho',
    'Offline': 'cinza',
    'Cancelado': 'cinza',
    'Expirado': 'cinza',
  };
  return cores[estado] || 'azul';
}

// Cor da etiqueta de categoria (Roupa / Calçados / Lar)
export function corDaCategoria(categoria) {
  return categoria === 'Lar' ? 'verde' : 'azul';
}
