// Lista de clientes de GET /api/v1/utilizadores/clientes.
// Não pede gestores.

import { useEffect, useState } from 'react';
import { EstadoCarregamento } from '../../componentes/Basicos';
import { listarClientesDaApi } from '../../servicos/servicosAdmin';

export default function ListaClientes() {
  const [clientes, setClientes] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    listarClientesDaApi()
      .then((lista) => setClientes(Array.isArray(lista) ? lista : []))
      .catch((falha) => setErro(falha.message));
  }, []);

  return (
    <section>
      <h2 className="titulo-seccao">Clientes</h2>
      <EstadoCarregamento aCarregar={!clientes && !erro} erro={erro} />
      {clientes && clientes.length === 0 && (
        <p className="texto-cinza">Não há clientes.</p>
      )}
      {clientes && clientes.length > 0 && (
        <div className="cartao cartao-sem-espaco">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Morada</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="forte">{cliente.nomeCompleto}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.morada}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
