# Sukula Web — Painel do Administrador e Portal da Lavandaria

Site feito em **React** a partir do ficheiro Figma `SukulaWebAdmin.fig`.
Tem dois painéis:

| Painel | Endereço de entrada | Telas do Figma |
|---|---|---|
| Administrador | `http://localhost:3000/admin/login` | O, N, P, Q, R, S, T, U |
| Lavandaria (parceiro) | `http://localhost:3000/lavandaria/login` | J, K, L, M |

---

## 1. Como pôr o site a funcionar

1. Instale o **Node.js** (versão 18 ou mais recente): https://nodejs.org
2. Abra uma janela de comandos **dentro desta pasta** e escreva:

   ```
   npm install
   npm run dev
   ```

3. Abra no navegador: `http://localhost:3000`

Enquanto o site usa **dados fictícios**, qualquer e-mail e uma palavra-passe com
6 ou mais caracteres servem para entrar.

Para gerar a versão final (para pôr num servidor): `npm run build` → cria a pasta `dist/`.

---

## 2. Ligar à API em C#

Abra o ficheiro **`.env`** (na raiz do projeto) e altere:

```
VITE_URL_API=https://localhost:7001/api
VITE_USAR_DADOS_FICTICIOS=false
```

Depois pare o site (`Ctrl + C`) e volte a correr `npm run dev`.

A lista completa de endereços (endpoints) que a API deve ter, com exemplos de
classes em C#, está em **`docs/API-CSharp.md`**.

---

## 3. Onde está cada coisa

```
sukula-web/
├── .env                      ← endereço da API e modo de dados fictícios
├── public/imagens/           ← TODAS as imagens do Figma (logótipos, fotos)
└── src/
    ├── App.jsx               ← lista de páginas e endereços (rotas)
    ├── configuracao.js       ← lê o .env (não precisa de mexer)
    ├── utilidades.js         ← formatar dinheiro (Kz), iniciais, cores de estado
    ├── estilos/global.css    ← TODAS as cores, tamanhos e estilos
    ├── servicos/             ← comunicação com a API C#
    │   ├── api.js                  (envio de pedidos + token de sessão)
    │   ├── autenticacao.js         (iniciar / terminar sessão)
    │   ├── servicosAdmin.js        (clientes, lavandarias, serviços, artigos, entregadores, perfil)
    │   └── servicosLavandaria.js   (dashboard, estafetas, pedidos, descontos)
    ├── dados/                ← dados fictícios (usados sem API)
    ├── componentes/          ← peças reutilizáveis (barra lateral, janelas, campos...)
    └── paginas/
        ├── admin/            ← páginas do Administrador
        └── lavandaria/       ← páginas da Lavandaria
```

### Correspondência entre telas do Figma e ficheiros

| Figma | Ficheiro |
|---|---|
| O, O1, O2 Login Administrador | `paginas/admin/LoginAdmin.jsx` |
| N Página principal | `paginas/admin/PaginaPrincipal.jsx` |
| P a P5 Gestão de clientes | `paginas/admin/GestaoClientes.jsx` |
| Q, Q2, Q3, Q4 Gestão de lavandarias | `paginas/admin/GestaoLavandarias.jsx` + `JanelaLavandaria.jsx` |
| Q1 Detalhes da lavandaria | `paginas/admin/DetalhesLavandaria.jsx` |
| R, R4 Gestão de serviços | `paginas/admin/GestaoServicos.jsx` |
| R1 Detalhes do serviço | `paginas/admin/DetalhesServico.jsx` |
| R2 Adicionar serviço | `paginas/admin/FormularioServico.jsx` |
| S, S2, S4 Gestão de artigos | `paginas/admin/GestaoArtigos.jsx` + `JanelaArtigo.jsx` |
| S1 Detalhes do artigo | `paginas/admin/DetalhesArtigo.jsx` |
| T a T4.1 Gestão de entregadores | `paginas/admin/GestaoEntregadores.jsx` |
| U a U4.1 Perfil da conta | `paginas/admin/PerfilAdmin.jsx` |
| J, J1, J2 Login Lavandaria | `paginas/lavandaria/LoginLavandaria.jsx` |
| K, K1, K2 Dashboard (Dia/Semana/Mês) | `paginas/lavandaria/Dashboard.jsx` |
| K3 Lista de estafetas | `paginas/lavandaria/ListaEstafetas.jsx` |
| K4 Produção do estafeta | `paginas/lavandaria/ProducaoEstafeta.jsx` |
| L Pedidos novos | `paginas/lavandaria/PedidosNovos.jsx` |
| L2 Em processamento | `paginas/lavandaria/PedidosEmProcessamento.jsx` |
| L3 Histórico | `paginas/lavandaria/HistoricoPedidos.jsx` |
| L1 a L1.4, L2.1 a L2.5, L3.1, L3.2 Detalhes do pedido | `paginas/lavandaria/DetalhesPedido.jsx` (+ `JanelasPedido.jsx`, `PainelEstafetas.jsx`) |
| M a M5.1 Perfil da conta | `paginas/lavandaria/PerfilLavandaria.jsx` |
| Barra lateral Administrador | `componentes/LayoutAdmin.jsx` |
| Barra lateral Lavandaria | `componentes/LayoutLavandaria.jsx` |

---

## 4. Alterações comuns (sem saber programar muito)

**Mudar uma cor do site inteiro** → `src/estilos/global.css`, no topo (`:root`).
Exemplo: `--azul: #00477f;` é o azul principal.

**Mudar um texto** → procure o texto (Ctrl+Shift+F no VS Code) e altere-o entre as aspas
ou entre as etiquetas `>texto<`.

**Trocar uma imagem** → substitua o ficheiro em `public/imagens/` mantendo o mesmo nome.

**Acrescentar um item ao menu do Administrador** → `src/componentes/LayoutAdmin.jsx`,
lista `itensDoMenu`. Depois crie a página e junte a rota em `src/App.jsx`.

**Mudar quantas linhas aparecem nas tabelas** → `src/configuracao.js`, `LINHAS_POR_PAGINA`.

**Mudar os dados de exemplo** → `src/dados/dadosAdmin.js` e `src/dados/dadosLavandaria.js`.

**Ícones** → vêm da biblioteca *lucide-react*. Lista de ícones: https://lucide.dev/icons
(use o nome em formato `NomeDoIcone`, ex.: `<Trash2 size={18} />`).

### Como funciona uma página (padrão repetido em todas)

```jsx
const [clientes, setClientes] = useState(null);   // 1. guardar os dados

useEffect(() => {                                  // 2. ao abrir a página,
  listarClientes().then(setClientes);              //    pedir os dados à API
}, []);

return <table>... {clientes.map(...)} ...</table>; // 3. mostrar os dados
```
