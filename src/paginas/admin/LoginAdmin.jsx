// Ecrã O - Login Administrador
import PaginaLogin from '../../componentes/PaginaLogin';

export default function LoginAdmin() {
  return (
    <PaginaLogin
      tipoUtilizador="Administrador"
      etiqueta="Painel do Administrador"
      titulo={<>Administre a Sukula<br />num só lugar.</>}
      descricao="Faça a gestão de utilizadores, lavandarias e artigos numa única plataforma."
      enderecoDepois="/admin"
      mostrarRedesSociais={false}
      textoRegisto="Ainda não tem conta?"
      textoLigacaoRegisto="Criar conta"
    />
  );
}
