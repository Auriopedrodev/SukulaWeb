# Contrato da API (C# / ASP.NET Core) usado pelo site Sukula Web

O site chama os endereços abaixo a partir de `VITE_URL_API` (ex.: `https://localhost:7001/api`).
Todas as funções que fazem estas chamadas estão em `src/servicos/`.

## Regras gerais

- **JSON em camelCase.** O ASP.NET Core já faz isto por defeito:
  a propriedade C# `NomeCompleto` é enviada/recebida como `nomeCompleto`.
- **Autenticação JWT.** Depois do login, o site envia em todos os pedidos:
  `Authorization: Bearer <token>`. Se a API responder **401**, o site volta ao login.
- **Erros.** Devolva `{ "mensagem": "texto para o utilizador" }` ou o formato
  `ProblemDetails`/`ValidationProblem` do ASP.NET (o site lê `errors` e `title`).
- **Listas com páginas** devolvem:
  `{ "itens": [...], "total": 120, "pagina": 1, "tamanhoPagina": 8 }`
- **Ficheiros (fotos)** são enviados como `multipart/form-data`, campo **`ficheiro`** (`IFormFile`).
  Só JPG ou PNG até 5 MB (o site já verifica, mas a API deve verificar também).

```csharp
[HttpPost("{id}/foto")]
public async Task<IActionResult> EnviarFoto(int id, IFormFile ficheiro)
{
    var nome = Guid.NewGuid() + Path.GetExtension(ficheiro.FileName);
    var caminho = Path.Combine("wwwroot", "fotos", nome);
    using (var destino = System.IO.File.Create(caminho)) await ficheiro.CopyToAsync(destino);
    // guardar "/fotos/" + nome na base de dados ...
    return Ok(new { fotoUrl = "/fotos/" + nome });
}
```
- **Sucesso sem conteúdo** (PUT/DELETE) pode devolver `204 No Content`.

## CORS (obrigatório para o navegador aceitar as respostas)

```csharp
// Program.cs
builder.Services.AddCors(o => o.AddPolicy("SukulaWeb", p => p
    .WithOrigins("http://localhost:3000")   // endereço do site React
    .AllowAnyHeader()
    .AllowAnyMethod()));

builder.Services.AddControllers();          // camelCase já é o padrão

var app = builder.Build();
app.UseCors("SukulaWeb");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```

---

## 1. Autenticação

| Método | Endereço | Envia | Recebe |
|---|---|---|---|
| POST | `/autenticacao/login` | `{ emailOuTelefone, palavraPasse, manterSessao, tipoUtilizador }` | `{ token, utilizador: { id, nome, perfil, fotoUrl } }` |

`tipoUtilizador` é `"Administrador"` ou `"Lavandaria"`.
Em caso de palavra-passe errada devolva **400** com
`{ "mensagem": "Palavra-passe incorreta. Verifique os dados e tente novamente." }`.

```csharp
public class PedidoLogin
{
    public string EmailOuTelefone { get; set; }
    public string PalavraPasse { get; set; }
    public bool ManterSessao { get; set; }
    public string TipoUtilizador { get; set; }
}
```

---

## 2. Painel do Administrador

### Página principal
| Método | Endereço | Recebe |
|---|---|---|
| GET | `/admin/resumo` | `{ totalClientes, totalLavandarias, servicosAtivos, totalArtigos, totalEntregadores }` |

### Clientes
| Método | Endereço | Notas |
|---|---|---|
| GET | `/clientes?pesquisa=&estado=&pagina=1&tamanhoPagina=8` | `estado`: vazio, `Ativo` ou `Inativo`. Devolve lista paginada |
| PUT | `/clientes/{id}` | Envia `{ nomeCompleto, morada, estado }` |
| DELETE | `/clientes/{id}` | |
| POST | `/clientes/{id}/foto` | `multipart/form-data`, campo `ficheiro`. Recebe `{ fotoUrl }` |

```csharp
public class Cliente
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; }
    public string Morada { get; set; }
    public string Estado { get; set; }          // "Ativo" / "Inativo"
    public string Perfil { get; set; }          // "Cliente"
    public string FotoNome { get; set; }
    public int TotalPedidos { get; set; }
    public decimal GastoTotal { get; set; }
    public double Avaliacao { get; set; }
    public string ClienteDesde { get; set; }    // "15 Out 2026"
    public string UltimoPedido { get; set; }
    public int PedidosEmProcessamento { get; set; }
}
```

### Lavandarias
| Método | Endereço | Notas |
|---|---|---|
| GET | `/lavandarias?pesquisa=` | Lista (sem páginas) |
| GET | `/lavandarias/{id}` | Inclui `servicos` e `horario` |
| POST | `/lavandarias` | Devolve a lavandaria criada (com `id`) |
| PUT | `/lavandarias/{id}` | |
| PUT | `/lavandarias/{id}/estado` | Envia `{ ativa: true/false }` |
| DELETE | `/lavandarias/{id}` | |
| POST | `/lavandarias/{id}/foto` | `multipart/form-data`, campo `ficheiro` |

```csharp
public class Lavandaria
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Localizacao { get; set; }        // "Talatona, Luanda"
    public string MoradaCompleta { get; set; }
    public string Descricao { get; set; }
    public string LogoUrl { get; set; }
    public string FotoUrl { get; set; }
    public double? Avaliacao { get; set; }
    public bool Ativa { get; set; }
    public List<string> DiasFuncionamento { get; set; }   // ["Seg","Ter",...]
    public string Abertura { get; set; }                  // "08:00"
    public string Encerramento { get; set; }              // "19:00"
    public string HorarioResumo { get; set; }             // "Seg – Sáb · 08:00 – 19:00"
    public List<LinhaHorario> Horario { get; set; }       // [{ dias, horas }]
    public List<string> Categorias { get; set; }          // ["Roupa","Lar"]
    public int TotalServicos { get; set; }
    public List<ServicoDaLavandaria> Servicos { get; set; }
}
public class LinhaHorario { public string Dias { get; set; } public string Horas { get; set; } }
public class ServicoDaLavandaria
{
    public int Id { get; set; }
    public string Nome { get; set; }
    public string Categoria { get; set; }
    public List<string> Artigos { get; set; }
    public decimal Preco { get; set; }
}
```

### Serviços (Lavagem + Engomar, Lavagem a Seco, ...)
| Método | Endereço | Notas |
|---|---|---|
| GET | `/servicos?pesquisa=&categoria=` | `categoria`: `Roupa`, `Calçados`, `Lar` ou vazio |
| GET | `/servicos/{id}` | Inclui `artigosDetalhados: [Artigo]` e `lavandarias: [{ id, nome, localizacao, fotoUrl }]` |
| POST | `/servicos` | Envia `{ nome, categoria, precoBase, ativo, artigos: ["Camisa", ...] }` |
| PUT | `/servicos/{id}` | Igual ao POST |
| DELETE | `/servicos/{id}` | |

Campos de um serviço: `id, nome, categoria, precoBase, artigos (lista de nomes), totalLavandarias, ativo`.

### Artigos (Camisa, Calça, Ténis, ...)
| Método | Endereço | Notas |
|---|---|---|
| GET | `/artigos?pesquisa=&categoria=&pagina=1&tamanhoPagina=9` | Lista paginada |
| GET | `/artigos/todos` | Lista completa, sem páginas (usada nos formulários) |
| GET | `/artigos/{id}` | Inclui `servicosDetalhados: [Servico]` |
| POST | `/artigos` | Envia `{ nome, categoria, cores: ["Azul"], tamanhos: ["M"], servicos: ["Lavagem a Seco"] }` |
| PUT | `/artigos/{id}` | Igual ao POST |
| DELETE | `/artigos/{id}` | |

Cores aceites: Vermelho, Azul, Verde, Amarelo, Laranja, Roxo, Rosa, Preto, Branco, Cinzento, Castanho, Turquesa.

### Entregadores
| Método | Endereço | Notas |
|---|---|---|
| GET | `/entregadores?pesquisa=&pagina=1&tamanhoPagina=8` | Lista paginada **+ `totalAtivos`** |
| POST | `/entregadores` | Ver campos abaixo (+ `palavraPasseTemporaria`) |
| PUT | `/entregadores/{id}` | Mesmos campos + `ativo` (o estado **só** se altera no formulário de edição) |
| DELETE | `/entregadores/{id}` | |
| POST | `/entregadores/{id}/foto` | `multipart/form-data`, campo `ficheiro`. Recebe `{ fotoUrl }` |

```csharp
public class Entregador
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; }
    public string Utilizador { get; set; }      // "@mateus.estafeta"
    public string Telefone { get; set; }
    public string Email { get; set; }
    public string NumeroBi { get; set; }
    public string Zona { get; set; }
    public string Lavandaria { get; set; }      // nome da lavandaria associada
    public string FotoUrl { get; set; }
    public string TipoVeiculo { get; set; }     // "Mota", "Carro", "Bicicleta"
    public string ModeloVeiculo { get; set; }
    public string Matricula { get; set; }
    public double Avaliacao { get; set; }
    public bool Ativo { get; set; }
    public int TotalEntregas { get; set; }
    public int TaxaSucesso { get; set; }        // 98  (percentagem)
    public string MembroDesde { get; set; }
    public string UltimaAtividade { get; set; }
}
```

### Perfil do administrador e Informações
| Método | Endereço | Notas |
|---|---|---|
| GET | `/perfil` | `{ id, nomeCompleto, email, morada, perfil, estado, fotoUrl, fotoNome, palavraPasseAlteradaHa }` |
| PUT | `/perfil` | Envia `{ nomeCompleto, morada }` |
| PUT | `/perfil/palavra-passe` | Envia `{ palavraPasseAtual, novaPalavraPasse }` |
| POST | `/perfil/foto` | `multipart/form-data`, campo `ficheiro`. Recebe `{ fotoUrl }` |
| GET | `/perfil/historico-lavandarias` | `[{ id, nome, logoUrl }]` |
| GET | `/informacoes` | `[{ id, titulo, descricao, perfisAbrangidos, ultimaAtualizacao, versao, texto?, perguntas? }]` |
| PUT | `/informacoes/{id}` | Central de ajuda: `{ perfisAbrangidos, perguntas: [{ pergunta, resposta }] }` · Outras: `{ perfisAbrangidos, versao, texto }` |

`id` das informações: `central-de-ajuda`, `termos-e-condicoes`, `politica-de-privacidade`, `sobre-a-sukula`.

---

## 3. Portal da Lavandaria

O utilizador com sessão iniciada **é** a lavandaria, por isso não há `{id}` da lavandaria nos endereços
(a API descobre-a pelo token).

### Conta
| Método | Endereço | Notas |
|---|---|---|
| GET | `/lavandaria/conta` | Ver campos abaixo. `pedidosNovos` e `pedidosEmProcessamento` aparecem nos círculos vermelhos do menu |
| PUT | `/lavandaria/conta` | Envia `{ nome, moradaCompleta, horario, servicosOferecidos, descricao }` |
| POST | `/lavandaria/conta/foto` | `multipart/form-data`, campo `ficheiro`. Recebe `{ fotoUrl }` |

Campos: `id, nome, localizacao, moradaCompleta, fotoUrl, capaUrl, verificada, parceiroDesde, horario,
servicosOferecidos, descricao, totalEstafetas, totalPedidos, avaliacao, telefoneApoio, pedidosNovos, pedidosEmProcessamento`.

### Controle
| Método | Endereço | Recebe |
|---|---|---|
| GET | `/lavandaria/dashboard?periodo=dia` | `periodo`: `dia`, `semana`, `mes`. `{ subtitulo, subtituloEstafetas, indicadores: [{ titulo, valor, variacao, icone }], grafico: { descricao, maximo, barras: [{ rotulo, valor, meta, destaque }] }, producaoTotal: { desde, pedidos, pecas, categorias: [{ nome, percentagem }] } }` |
| GET | `/lavandaria/estafetas?estado=&periodo=semana` | `[Estafeta]` |
| GET | `/lavandaria/estafetas/{id}` | `Estafeta` |
| GET | `/lavandaria/estafetas/{id}/producao?periodo=semana` | `{ periodo, indicadores, grafico: [{ rotulo, recolhas, entregas }], ultimosPedidos: [{ numero, cliente, tipo, dataHora, estado }], localizacaoAtual }` |

`icone` pode ser: `pacote`, `camisa`, `dinheiro`, `relogio`, `camiao`, `rota`, `pessoas`, `edificio`, `visto`, `estrela`, `maquina`.

Campos de `Estafeta`: `id, nome, telefone, fotoUrl, estado ("Em rota" | "Disponível" | "Ocupado" | "Offline"), zona,
recolhas, entregas, pedidos, avaliacao, producao (0-100), email, veiculo, zonaAtuacao, membroDesde, totalAvaliacoes,
distancia ("1,2 km"), tempo ("~6 min")`.

### Pedidos
| Método | Endereço | Notas |
|---|---|---|
| GET | `/lavandaria/pedidos/novos?pesquisa=` | `[{ id, numero, cliente, bairro, servico, pecas, recolhaAgendada, valor, estado }]` |
| GET | `/lavandaria/pedidos/em-processamento?pesquisa=` | `{ resumo: { emLavagem, emEngomagem, prontosParaEntrega, atrasados }, itens: [{ id, numero, cliente, bairro, servico, pecas, recebidoEm, etapa, progresso }] }` |
| GET | `/lavandaria/pedidos/historico?pesquisa=&resultado=&pagina=1&tamanhoPagina=8` | Paginado + `resumo: { todos, realizados, naoRealizados, periodo }`. `resultado`: vazio, `Realizados`, `Não realizados` |
| GET | `/lavandaria/pedidos/{id}` | Detalhes completos (ver abaixo) |
| POST | `/lavandaria/pedidos/{id}/encaminhar` | `{ estafetaId }` — encaminhar para recolha |
| POST | `/lavandaria/pedidos/{id}/recusar` | |
| POST | `/lavandaria/pedidos/{id}/confirmar-recolha` | `{ observacoes }` |
| POST | `/lavandaria/pedidos/{id}/fotos` | Fotos do pedido pronto (uma por pedido HTTP), campo `ficheiro` |
| POST | `/lavandaria/pedidos/{id}/confirmar-execucao` | |
| POST | `/lavandaria/pedidos/{id}/encaminhar-entrega` | `{ estafetaId }` |

**Estados do pedido** (use exatamente estes textos):
`Novo`, `Aguarda recolha`, `Recolhido`, `Em processamento`, `Pronto para entrega`, `Em entrega`, `Entregue`, `Não realizado`, `Cancelado`.
O site escolhe o que mostrar na coluna da direita a partir do `estado`.

Detalhes do pedido (`GET /lavandaria/pedidos/{id}`):
```json
{
  "id": 10491, "numero": "#SK-10491", "estado": "Novo",
  "criadoEm": "Criado hoje às 13:42", "resumoServico": "Lavagem e engomagem + Calçados · 7 peças",
  "cliente": { "nome": "Ana Paula Ferreira", "telefone": "+244 923 456 781", "clienteDesde": "Mar 2026" },
  "endereco": "Rua do Talatona, ...", "enderecoCurto": "Cond. Jardim de Rosas, Casa 14",
  "tipoResidencia": "Vivenda · Portão azul",
  "recolhaAgendada": "Hoje, 02 Nov · 15:00 – 16:00", "recolhaCurta": "Hoje, 15:00 – 16:00",
  "entregaPrevista": "Qua, 04 Nov · 10:00 – 12:00", "pagamento": "Multicaixa Express · Pago",
  "pecas": [{ "nome": "Camisa", "servico": "Lavagem e engomagem", "quantidade": 3, "valor": 4500, "icone": "camisa" }],
  "subtotal": 20000, "taxaRecolha": 1500, "desconto": 2000, "cupao": "SUKULA10", "total": 19500,
  "estafeta": { "nome": "Joana Sebastião", "veiculo": "Motorizada · LD-12-88-CA" },
  "responsavel": { "nome": "Teresa Manuel", "iniciais": "TM", "funcao": "Operadora · Turno da manhã" },
  "prazoConclusao": "Ter, 03 Nov · 18:00",
  "avaliacao": { "estrelas": 5, "nota": "5,0", "comentario": "...", "autor": "Ana Paula Ferreira · 04 Nov" },
  "tempoTotal": "44h 52min",
  "naoRealizado": null
}
```
Quando o pedido **não foi realizado**, `naoRealizado` = `{ motivo, reembolso, notaInterna }`.

### Perfil da lavandaria
| Método | Endereço | Notas |
|---|---|---|
| GET | `/lavandaria/historico` | `{ resumo: [{ titulo, valor, icone }], meses: [{ mes, pedidos, pecas, receita, avaliacao, variacao }], marcos: [{ data, titulo, icone }] }` |
| GET | `/lavandaria/descontos` | `{ resumo: { cupoesAtivos, utilizacoesMes, descontoConcedido }, itens: [Desconto] }` |
| POST | `/lavandaria/descontos` | `{ codigo, tipo, valor, limite, validoDe, validoAte, servicos: [...] }` |
| PUT | `/lavandaria/descontos/{id}/estado` | `{ ativo: true/false }` |

```csharp
public class Desconto
{
    public int Id { get; set; }
    public string Codigo { get; set; }        // "SUKULA10"
    public string Tipo { get; set; }          // "percentagem" ou "valor"
    public decimal Valor { get; set; }        // 10  (=10%)  ou 2000 (=2.000 Kz)
    public string Descricao { get; set; }
    public string Validade { get; set; }      // "Válido até 30 Nov 2026"
    public int Utilizacoes { get; set; }
    public int? Limite { get; set; }          // null = sem limite
    public bool Ativo { get; set; }
    public bool Expirado { get; set; }
}
```

---

## Exemplo de controlador C#

```csharp
[ApiController]
[Route("api/clientes")]
[Authorize(Roles = "Administrador")]
public class ClientesController : ControllerBase
{
    private readonly SukulaContext _bd;
    public ClientesController(SukulaContext bd) => _bd = bd;

    [HttpGet]
    public async Task<IActionResult> Listar(string pesquisa = "", string estado = "", int pagina = 1, int tamanhoPagina = 8)
    {
        var consulta = _bd.Clientes.AsQueryable();
        if (!string.IsNullOrEmpty(pesquisa)) consulta = consulta.Where(c => c.NomeCompleto.Contains(pesquisa));
        if (!string.IsNullOrEmpty(estado))   consulta = consulta.Where(c => c.Estado == estado);

        var total = await consulta.CountAsync();
        var itens = await consulta.OrderBy(c => c.NomeCompleto)
                                  .Skip((pagina - 1) * tamanhoPagina).Take(tamanhoPagina)
                                  .ToListAsync();
        return Ok(new { itens, total, pagina, tamanhoPagina });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remover(int id)
    {
        var cliente = await _bd.Clientes.FindAsync(id);
        if (cliente == null) return NotFound(new { mensagem = "Cliente não encontrado." });
        _bd.Clientes.Remove(cliente);
        await _bd.SaveChangesAsync();
        return NoContent();
    }
}
```
