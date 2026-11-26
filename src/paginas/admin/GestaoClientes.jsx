// =====================================================================
//  Gestão de utilizadores
//  Clientes e gestores vêm de /api/v1/utilizadores.
//  A lista de gestores só é pedida neste ecrã, reservado ao Admin.
// =====================================================================

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Lock, Mail, Phone, Plus, Store, User } from 'lucide-react';
import BarraSuperior from '../../componentes/BarraSuperior';
import { EstadoCarregamento } from '../../componentes/Basicos';
import { CampoPalavraPasse, CampoSelecao, CampoTexto } from '../../componentes/Formulario';
import { Modal } from '../../componentes/Modais';
import ListaClientes from '../utilizadores/ListaClientes';
import { criarGestor, listarGestores, listarLavandarias } from '../../servicos/servicosAdmin';

export default function GestaoClientes() {
  const location = useLocation();
  const navegar = useNavigate();
  const parametros = new URLSearchParams(location.search);
  const lavandariaIdNova = parametros.get('lavandariaId');
  const lavandariaFixa = lavandariaIdNova
    ? { lavandariaId: lavandariaIdNova, nomeLavandaria: parametros.get('nomeLavandaria') ?? '', fixa: true }
    : null;
  const [gestores, setGestores] = useState(null);
  const [erroGestores, setErroGestores] = useState('');
  const [formularioManual, setFormularioManual] = useState(false);
  const formulario = lavandariaFixa || (formularioManual ? { fixa: false } : null);

  function carregarGestores() {
    setErroGestores('');
    listarGestores()
      .then((lista) => setGestores(Array.isArray(lista) ? lista : []))
      .catch((falha) => setErroGestores(falha.message));
  }

  useEffect(carregarGestores, []);

  function fecharFormulario() {
    setFormularioManual(false);
    if (lavandariaIdNova) navegar('/admin/clientes', { replace: true });
  }

  async function guardarGestor(dados) {
    await criarGestor(dados);
    fecharFormulario();
    carregarGestores();
  }

  return (
    <>
      <BarraSuperior titulo="Gestão de utilizadores" />

      <div className="conteudo">
        <ListaClientes />

        <section>
          <div className="linha-entre">
            <h2 className="titulo-seccao">Gestores</h2>
            <button type="button" className="botao botao-primario" onClick={() => setFormularioManual(true)}>
              <Plus size={18} /> Adicionar gestor
            </button>
          </div>

          <EstadoCarregamento aCarregar={!gestores && !erroGestores} erro={erroGestores} />
          {gestores && gestores.length === 0 && (
            <p className="texto-cinza">Não há gestores.</p>
          )}
          {gestores && gestores.length > 0 && (
            <div className="cartao cartao-sem-espaco">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                    <th>Lavandaria</th>
                  </tr>
                </thead>
                <tbody>
                  {gestores.map((gestor) => (
                    <tr key={gestor.id}>
                      <td className="forte">{gestor.nomeCompleto}</td>
                      <td>{gestor.email}</td>
                      <td>{gestor.telefone}</td>
                      <td>{gestor.nomeLavandaria}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {formulario && (
        <JanelaGestor
          lavandariaFixa={formulario.fixa ? formulario : null}
          aoFechar={fecharFormulario}
          aoGuardar={guardarGestor}
        />
      )}
    </>
  );
}

function JanelaGestor({ lavandariaFixa, aoFechar, aoGuardar }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [lavandariaId, setLavandariaId] = useState(lavandariaFixa ? lavandariaFixa.lavandariaId : '');
  const [lavandarias, setLavandarias] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (lavandariaFixa) return;
    listarLavandarias()
      .then((lista) => {
        setLavandarias(lista);
        if (lista[0]) setLavandariaId(lista[0].idLavandaria);
      })
      .catch((falha) => setErro(falha.message));
  }, [lavandariaFixa]);

  async function guardar() {
    if (!nomeCompleto.trim() || !email.trim() || !telefone.trim() || !palavraPasse || !lavandariaId) {
      setErro('Preencha o nome, o email, o telefone, a palavra-passe e a lavandaria.');
      return;
    }
    try {
      await aoGuardar({
        nomeCompleto: nomeCompleto.trim(),
        email: email.trim(),
        telefone: telefone.trim(),
        palavraPasse,
        lavandariaId,
      });
    } catch (falha) {
      setErro(falha.message);
    }
  }

  const opcoes = lavandarias.map((lavandaria) => ({
    valor: lavandaria.idLavandaria,
    texto: lavandaria.nomeLavandaria,
  }));

  return (
    <Modal
      titulo="Adicionar gestor"
      subtitulo={lavandariaFixa ? 'Esta conta fica ligada à lavandaria acabada de criar.' : 'Cada lavandaria só pode ter um gestor.'}
      aoFechar={aoFechar}
      largura={560}
    >
      <div className="coluna" style={{ gap: 14 }}>
        <CampoTexto rotulo="Nome completo" icone={<User size={18} />} valor={nomeCompleto} aoMudar={setNomeCompleto} placeholder="Nome do gestor" obrigatorio />
        <CampoTexto rotulo="E-mail" icone={<Mail size={18} />} tipo="email" valor={email} aoMudar={setEmail} placeholder="gestor@email.com" obrigatorio />
        <CampoTexto rotulo="Telefone" icone={<Phone size={18} />} valor={telefone} aoMudar={setTelefone} placeholder="+244923000000" obrigatorio />
        <CampoPalavraPasse rotulo="Palavra-passe *" icone={<Lock size={18} />} valor={palavraPasse} aoMudar={setPalavraPasse} placeholder="Palavra-passe" />
        {lavandariaFixa ? (
          <CampoTexto rotulo="Lavandaria" icone={<Store size={18} />} valor={lavandariaFixa.nomeLavandaria} aoMudar={() => {}} bloqueado />
        ) : (
          <CampoSelecao
            rotulo="Lavandaria"
            icone={<Store size={18} />}
            valor={lavandariaId}
            aoMudar={setLavandariaId}
            opcoes={opcoes.length ? opcoes : [{ valor: '', texto: 'Sem lavandarias' }]}
            obrigatorio
          />
        )}
        {erro && <p className="mensagem-erro">{erro}</p>}
        <button type="button" className="botao botao-primario botao-largo" onClick={guardar}>
          <Check size={18} /> Adicionar gestor
        </button>
      </div>
    </Modal>
  );
}
