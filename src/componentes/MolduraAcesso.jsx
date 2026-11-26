// Moldura das páginas de conta (registo, esqueci, redefinir).
// O lado esquerdo é a mesma fotografia do login.
import fotoLogin from '../assets/imagens/foto-login.jpg';
import logoSukula from '../assets/imagens/logo-sukula.png';

export default function MolduraAcesso({ etiqueta, titulo, descricao, children }) {
  return (
    <div className="pagina-login">
      <section className="login-imagem" style={{ backgroundImage: `url(${fotoLogin})` }}>
        <div className="fundo-logo">
          <img src={logoSukula} alt="Sukula" />
        </div>
        <span className="chip">{etiqueta}</span>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </section>

      <section className="login-formulario">
        {children}
        <p className="rodape-login">© 2026 Sukula · Termos · Privacidade</p>
      </section>
    </div>
  );
}
