// Lista de clientes no portal da lavandaria.
// Não pede nem mostra gestores.

import BarraSuperior from '../../componentes/BarraSuperior';
import ListaClientes from '../utilizadores/ListaClientes';

export default function UtilizadoresLavandaria() {
  return (
    <>
      <BarraSuperior painel="lavandaria" titulo="Gestão de utilizadores" />
      <div className="conteudo">
        <ListaClientes />
      </div>
    </>
  );
}
