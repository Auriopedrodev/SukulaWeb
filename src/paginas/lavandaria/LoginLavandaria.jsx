// Ecrãs J, J1, J2 - Login da Lavandaria
import PaginaLogin from '../../componentes/PaginaLogin';

export default function LoginLavandaria() {
  return (
    <PaginaLogin
      tipoUtilizador="Lavandaria"
      etiqueta="Portal do Parceiro · Lavandaria"
      titulo={<>Gerencie a sua lavandaria<br />num só lugar.</>}
      descricao="Acompanhe a produção, encaminhe pedidos aos estafetas e controle cada entrega em tempo real."
      enderecoDepois="/lavandaria/controle/dashboard"
      mostrarRedesSociais={true}
      textoRegisto="Ainda não é parceiro?"
      textoLigacaoRegisto="Registe a sua lavandaria"
    />
  );
}
