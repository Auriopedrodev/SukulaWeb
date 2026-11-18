// =====================================================================
//  Mapa + lista de estafetas para escolher a quem encaminhar um pedido
//  (usado em "Encaminhar para estafeta" e "Encaminhar para entrega")
// =====================================================================

import { Bike, House } from 'lucide-react';
import { Avatar, Etiqueta } from '../../componentes/Basicos';

// Posições (em %) dos estafetas no mapa ilustrativo
const posicoesNoMapa = [
  { left: '22%', top: '33%' },
  { left: '80%', top: '78%' },
  { left: '15%', top: '85%' },
  { left: '88%', top: '25%' },
];

// Mapa ilustrativo com a casa do cliente ao centro
export function Mapa({ estafetas, pequeno = false, legendaEstafeta }) {
  return (
    <div className={'mapa' + (pequeno ? ' pequeno' : '')}>
      <div className="zona-verde" />
      <div className="casa">
        <div><House size={14} /></div>
      </div>
      {estafetas &&
        estafetas.slice(0, 4).map((estafeta, posicao) => (
          <div key={estafeta.id} className="marcador" style={posicoesNoMapa[posicao]}>
            <div className="pino"><Bike size={14} /></div>
            <span className="distancia">{estafeta.distancia}</span>
          </div>
        ))}
      {legendaEstafeta && (
        <div className="marcador" style={{ left: '62%', top: '45%' }}>
          <div className="pino cheio"><Bike size={14} /></div>
          <span className="distancia">{legendaEstafeta}</span>
        </div>
      )}
    </div>
  );
}

// Lista de estafetas. O primeiro é o "MAIS PRÓXIMO".
export function ListaEscolhaEstafetas({ estafetas, escolhido, aoEscolher }) {
  return (
    <div className="coluna" style={{ gap: 10, marginTop: 14 }}>
      {estafetas.slice(0, 4).map((estafeta, posicao) => (
        <button
          key={estafeta.id}
          type="button"
          className={'cartao-estafeta' + (escolhido && escolhido.id === estafeta.id ? ' selecionado' : '')}
          onClick={() => aoEscolher(estafeta)}
        >
          {posicao === 0 && <span className="selo">MAIS PRÓXIMO</span>}
          <Avatar nome={estafeta.nome} fotoUrl={estafeta.fotoUrl} tamanho={34} />
          <div style={{ flex: 1 }}>
            <strong>{estafeta.nome}</strong>
            <small>{estafeta.distancia} · {estafeta.tempo}</small>
          </div>
          <Etiqueta texto={estafeta.estado} />
        </button>
      ))}
    </div>
  );
}

// Ordena os estafetas do mais perto para o mais longe ("1,2 km" -> 1.2)
export function ordenarPorDistancia(estafetas) {
  return estafetas
    .filter((e) => e.estado !== 'Offline')
    .sort((a, b) => parseFloat(a.distancia.replace(',', '.')) - parseFloat(b.distancia.replace(',', '.')));
}
