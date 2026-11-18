// =====================================================================
//  Transforma um nome de ícone (que vem nos dados) num ícone desenhado.
//  Exemplo: <IconePorNome nome="pacote" />
//  Para acrescentar um ícone: escolha em https://lucide.dev/icons,
//  importe-o aqui e junte-o à lista "icones".
// =====================================================================

import { Banknote, Building2, Check, Clock, Package, Route, Shirt, Star, Truck, Users, WashingMachine } from 'lucide-react';

const icones = {
  pacote: Package,
  camisa: Shirt,
  dinheiro: Banknote,
  relogio: Clock,
  camiao: Truck,
  rota: Route,
  pessoas: Users,
  edificio: Building2,
  visto: Check,
  estrela: Star,
  maquina: WashingMachine,
};

export default function IconePorNome({ nome, tamanho = 20 }) {
  const Icone = icones[nome] || Package;
  return <Icone size={tamanho} />;
}
