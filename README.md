# Sukula · Painel do Administrador

Site em **React + TypeScript** feito a partir do ficheiro Figma `SukulaWeb.fig`
(48 telas, todas no tema escuro do Figma: O, N, P, Q, R, S, T e U).

Ferramentas: Node.js (LTS) + npm, Vite, React, TypeScript, Tailwind CSS,
shadcn/ui, lucide-react (ícones), React Router e Axios.

---

## 1. Como abrir o projeto

Precisa de **Node.js (LTS)**, **VS Code** e **Git**.

```bash
npm install      # só da primeira vez (instala as bibliotecas)
npm run dev      # abre o site em http://localhost:5173
npm run build    # cria a versão final na pasta "dist"
```

### Entrar com os dados de exemplo
Enquanto a API em C# não estiver pronta, o site usa dados de exemplo.

- E-mail / telefone: **qualquer um** (ex.: `+244 922 054 500`)
- Palavra-passe: **`123456`** (definida em `src/api/dadosExemplo.ts`, `PALAVRA_PASSE_EXEMPLO`)

A sessão fica guardada enquanto o separador do navegador estiver aberto.

Com outra palavra-passe aparece o erro da tela O2.
Os dados de exemplo voltam ao início quando a página é recarregada (F5).

---

## 2. Fluxo do código

```
index.html → src/main.tsx → src/App.tsx → src/routes/Rotas.tsx → src/pages/ → src/components/ → src/assets/
```

| Passo | Ficheiro | O que faz |
|---|---|---|
| 1 | `index.html` | A página que o navegador abre (tem a `<div id="root">`) |
| 2 | `src/main.tsx` | Liga o React ao `index.html` e carrega as cores (`index.css`) |
| 3 | `src/App.tsx` | Ativa a navegação entre páginas |
| 4 | `src/routes/Rotas.tsx` | Lista das páginas e dos seus endereços |
| 5 | `src/pages/` | Uma página (tela) por ficheiro |
| 6 | `src/components/` | Peças reutilizadas (menu, janelas, campos...) |
| 7 | `src/assets/imagens/` | Imagens do Figma |

A pasta `src/api/` tem a ligação à API em C#.

## 3. Pastas e ficheiros

```
src/
  main.tsx, App.tsx, index.css (cores)
  routes/Rotas.tsx
  pages/
    Login.tsx               O, O1, O2, U4.1
    PaginaPrincipal.tsx     N
    Clientes.tsx            P, P1, P2, P3, P4, P5
    Lavandarias.tsx         Q, Q2, Q2.1, Q3, Q4, Q4.1, Q5
    DetalhesLavandaria.tsx  Q1
    Servicos.tsx            R, R0, R2, R4
    DetalhesServico.tsx     R1
    Artigos.tsx             S, S2, S4 (tabela: nome, categoria, ações)
    DetalhesArtigo.tsx      S1
    Entregadores.tsx        T, T1, T2, T2.1, T3, T3.1, T4, T4.1
    PerfilConta.tsx         U, U1, U2, U3, U3.6, U4
  components/
    ui/                     componentes shadcn/ui (button, card, input, textarea, table, dialog)
    Layout.tsx              menu lateral + barra do topo (todas as páginas)
    Janela.tsx              janela (modal) com título e "X"
    JanelaConfirmar.tsx     "Remover ...?" / "Terminar sessão?"
    Aviso.tsx               aviso no canto ("Cliente removido", ...)
    Campo.tsx               campos dos formulários
    FormularioLavandaria.tsx  Q2 / Q3
    FormularioServico.tsx     R2
    EditarInformacoes.tsx     U3.1, U3.2, U3.3, U3.5
    Avatar, Etiquetas, Filtros, Pesquisa, Paginacao, CartaoNumero,
    Interruptor, InfoLinha, BotoesAcoes, CarregarImagem, TituloPagina
  api/
    configuracao.ts         endereço da API, Axios e token
    tipos.ts                formato dos dados (igual às classes C#)
    dadosExemplo.ts         dados do Figma usados sem API
    conta.ts, clientes.ts, lavandarias.ts, servicos.ts, artigos.ts, entregadores.ts
  assets/imagens/           logótipos e fotografias do Figma
  lib/utils.ts              formatar "1.000 Kz", iniciais "NT"...
```

## 4. Onde mudar cada coisa

| Quero mudar... | Ficheiro |
|---|---|
| Uma cor do site | `src/index.css` (secção `@theme`) |
| Um texto de uma tela | o ficheiro da tela em `src/pages/` |
| As opções do menu lateral | `src/components/Layout.tsx` (lista `opcoesMenu`) |
| Criar uma página nova | criar em `src/pages/` e juntar em `src/routes/Rotas.tsx` |
| O endereço da API | ficheiro `.env` (`VITE_API_URL`) |
| Os dados de exemplo | `src/api/dadosExemplo.ts` |
| Uma imagem | substituir o ficheiro em `src/assets/imagens/` (mesmo nome) |

---

## 5. Ligar à API em C#

1. No ficheiro **`.env`** ponha o endereço da API e desligue os dados de exemplo:
   ```
   VITE_API_URL=https://localhost:7001/api
   VITE_USAR_DADOS_EXEMPLO=false
   ```
2. Reinicie o `npm run dev`.
3. Na API (ASP.NET) ative o **CORS** para `http://localhost:5173`:
   ```csharp
   builder.Services.AddCors(o => o.AddPolicy("site", p =>
       p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));
   // ...
   app.UseCors("site");
   ```
4. O site envia o token em `Authorization: Bearer <token>`.
   Se a API responder **401**, o site volta ao Login.
5. Os nomes dos campos estão em `src/api/tipos.ts`. O ASP.NET já envia em camelCase
   (`NomeCompleto` → `nomeCompleto`). Os erros podem vir como `{ "mensagem": "..." }`.

### Endereços que o site usa

| Método | Endereço | Para quê |
|---|---|---|
| POST | `/autenticacao/login` | Entrar → devolve `{ token, administrador }` |
| GET | `/dashboard/resumo` | Números da página principal |
| GET / PUT | `/conta` | Dados do administrador |
| GET | `/conta/historico-lavandarias` | Histórico da lavandaria |
| GET | `/informacoes` | Central de ajuda, Termos, Privacidade, Sobre |
| PUT | `/informacoes/central-ajuda` · `/termos` · `/privacidade` · `/sobre` | Publicar alterações |
| GET | `/clientes?pagina=&porPagina=&pesquisa=&estado=` | Lista → `{ itens, total }` |
| PUT / DELETE | `/clientes/{id}` | Editar / remover cliente |
| GET / POST | `/lavandarias` | Lista / adicionar |
| GET / PUT / DELETE | `/lavandarias/{id}` | Detalhes / editar / remover |
| PATCH | `/lavandarias/{id}/estado` | `{ ativa }` (interruptor) |
| GET / POST | `/servicos` | Lista / adicionar |
| GET / PUT / DELETE | `/servicos/{id}` | Detalhes / editar / remover |
| GET | `/artigos?pagina=&porPagina=&pesquisa=&categoria=` | Lista → `{ itens, total }` |
| POST | `/artigos` | Adicionar |
| GET / PUT / DELETE | `/artigos/{id}` | Detalhes / editar / remover |
| GET | `/entregadores?pagina=&porPagina=&pesquisa=` | Lista → `{ itens, total }` |
| GET | `/entregadores/ativos/total` | Número de entregadores ativos |
| POST | `/entregadores` | Adicionar |
| PUT / DELETE | `/entregadores/{id}` | Editar / remover |
| PATCH | `/entregadores/{id}/estado` | `{ ativo }` (interruptor) |

---

## 6. Cores das letras nos cartões brancos

| Uso | Cor | Classe Tailwind |
|---|---|---|
| Títulos dos cartões | `#0080CB` | `text-cartao-titulo` |
| Informações dos cartões | `#0E3553` | `text-cartao-texto` |

Para mudar, altere `--color-cartao-titulo` e `--color-cartao-texto` em `src/index.css`.
Os cartões azuis (ex.: janela "Detalhes do cliente") continuam com letras claras.
