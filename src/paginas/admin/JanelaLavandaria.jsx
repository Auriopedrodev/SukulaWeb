// =====================================================================
//  Janela "Adicionar lavandaria" / "Editar lavandaria"
//  O horário entra como hora e sai com segundos (08:00:00).
//  A foto só vai no pedido quando houver um ficheiro novo.
// =====================================================================

import { useState } from 'react';
import { Check, Clock, MapPin, Store } from 'lucide-react';
import { Modal } from '../../componentes/Modais';
import { CampoAreaTexto, CampoFoto, CampoTexto } from '../../componentes/Formulario';
import { urlDaFoto } from '../../servicos/servicosAdmin';

function comSegundos(hora) {
  if (!hora) return '';
  return hora.split(':').length === 2 ? hora + ':00' : hora;
}

export default function JanelaLavandaria({ lavandaria, aoFechar, aoGuardar }) {
  const emEdicao = Boolean(lavandaria);
  const [nomeLavandaria, setNomeLavandaria] = useState(lavandaria ? lavandaria.nomeLavandaria || '' : '');
  const [horarioFuncionamento, setHorarioFuncionamento] = useState(
    lavandaria?.horarioFuncionamento ? String(lavandaria.horarioFuncionamento).slice(0, 5) : '08:00'
  );
  const [endereco, setEndereco] = useState(lavandaria ? lavandaria.endereco : '');
  const [latitude, setLatitude] = useState(lavandaria ? String(lavandaria.latitude) : '');
  const [longitude, setLongitude] = useState(lavandaria ? String(lavandaria.longitude) : '');
  const [descricao, setDescricao] = useState(lavandaria ? lavandaria.descricao : '');
  const [foto, setFoto] = useState(null);
  const [erro, setErro] = useState('');

  async function guardar() {
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!nomeLavandaria.trim()) {
      setErro('O nome da lavandaria é obrigatório.');
      return;
    }
    if (!endereco.trim() || !descricao.trim() || !horarioFuncionamento) {
      setErro('Preencha o endereço, a descrição e o horário.');
      return;
    }
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setErro('Indique a latitude e a longitude.');
      return;
    }
    try {
      await aoGuardar({
        nomeLavandaria: nomeLavandaria.trim(),
        horarioFuncionamento: comSegundos(horarioFuncionamento),
        endereco: endereco.trim(),
        latitude: lat,
        longitude: lng,
        descricao: descricao.trim(),
      }, foto);
    } catch (falha) {
      setErro(falha.message);
    }
  }

  return (
    <Modal
      titulo={emEdicao ? 'Editar lavandaria' : 'Adicionar lavandaria'}
      subtitulo="O horário é enviado com segundos. Sem foto nova, a actual mantém-se."
      aoFechar={aoFechar}
      largura={560}
    >
      <div className="coluna" style={{ gap: 14 }}>
        <CampoTexto rotulo="Nome" icone={<Store size={18} />} valor={nomeLavandaria} aoMudar={setNomeLavandaria} placeholder="Lavandaria da Missão" obrigatorio />
        <CampoTexto rotulo="Endereço" icone={<MapPin size={18} />} valor={endereco} aoMudar={setEndereco} placeholder="Rua da Missão, Luanda" obrigatorio />
        <CampoTexto
          rotulo="Horário de funcionamento"
          icone={<Clock size={18} />}
          tipo="time"
          valor={horarioFuncionamento}
          aoMudar={setHorarioFuncionamento}
          obrigatorio
        />
        <div className="linha" style={{ gap: 12, alignItems: 'flex-start' }}>
          <CampoTexto rotulo="Latitude" icone={<MapPin size={18} />} tipo="number" valor={latitude} aoMudar={setLatitude} placeholder="-8.838" obrigatorio />
          <CampoTexto rotulo="Longitude" icone={<MapPin size={18} />} tipo="number" valor={longitude} aoMudar={setLongitude} placeholder="13.234" obrigatorio />
        </div>
        <CampoAreaTexto rotulo="Descrição" valor={descricao} aoMudar={setDescricao} placeholder="O que esta lavandaria faz" linhas={3} />
        <CampoFoto
          rotulo="Foto"
          nomeAtual={lavandaria?.foto ? urlDaFoto(lavandaria.foto).split('/').pop() : ''}
          aoEscolher={setFoto}
        />
        {lavandaria?.foto && !foto && (
          <img src={urlDaFoto(lavandaria.foto)} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12 }} />
        )}
        {erro && <p className="mensagem-erro">{erro}</p>}
        <button type="button" className="botao botao-primario botao-largo" onClick={guardar}>
          {emEdicao ? <Check size={18} /> : <Store size={18} />} {emEdicao ? 'Guardar alterações' : 'Adicionar lavandaria'}
        </button>
      </div>
    </Modal>
  );
}
