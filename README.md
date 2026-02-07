# 🛒 Carrinho de Compras - API RESTful

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Express](https://img.shields.io/badge/Express-v4.18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Mongoose](https://img.shields.io/badge/Mongoose-v8.0-red)
![License](https://img.shields.io/badge/license-MIT-yellow)

API RESTful completa para gerenciamento de carrinho de compras de e-commerce, com **autenticação de usuários**, **persistência em MongoDB Atlas** e **sessões seguras**.

---

## 📑 Índice

- [Sobre](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias-utilizadas)
- [Instalação](#-instalação)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Endpoints da API](#-endpoints-da-api)
  - [Autenticação](#autenticação)
  - [Carrinho](#carrinho)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Testando a API](#-testando-a-api)
- [Segurança](#-segurança)
- [Autor](#-autor)

---

## 📋 Sobre o Projeto

Sistema completo de carrinho de compras que resolve os principais desafios de e-commerce:

### Problemas Resolvidos

✅ **HTTP Stateless**: Implementa sessões persistentes no MongoDB  
✅ **Autenticação Segura**: Sistema de registro e login com bcrypt  
✅ **Persistência de Dados**: Carrinho salvo no banco de dados (MongoDB Atlas)  
✅ **Sessões Seguras**: Cookies httpOnly e expiração automática  
✅ **Validações Completas**: Prevenção de emails duplicados, dados inválidos, etc.  

---

## ✨ Funcionalidades

### Autenticação de Usuários
- ✅ Registro de novos usuários
- ✅ Login com email e senha
- ✅ Logout seguro
- ✅ Criptografia de senhas (bcrypt)
- ✅ Validação de credenciais

### Carrinho de Compras
- ✅ Adicionar produtos ao carrinho
- ✅ Visualizar carrinho completo
- ✅ Atualizar quantidade automaticamente
- ✅ Remover produtos do carrinho
- ✅ Finalizar compra
- ✅ Limpar carrinho
- ✅ Persistência por 7 dias
- ✅ Cálculo automático de totais

---

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB Atlas** - Banco de dados na nuvem
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Criptografia de senhas
- **express-session** - Gerenciamento de sessões
- **connect-mongo** - Persistência de sessões no MongoDB
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 📦 Instalação

### Pré-requisitos

- Node.js 14+ instalado
- Conta no MongoDB Atlas (gratuito)
- npm ou yarn

### Passos

1. **Clone o repositório:**
```bash
git clone https://github.com/alberto2santos/carrinho-compras-node.git
cd carrinho-compras-node
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://seu-usuario:sua-senha@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Sessão
SESSION_SECRET=sua-chave-secreta-super-segura
SESSION_MAX_AGE=604800000

# Carrinho (7 dias em milissegundos)
CARRINHO_EXPIRATION=604800000
```

4. **Inicie o servidor:**
```bash
npm run dev
```

5. **Servidor rodando em:**
```
http://localhost:3000
```

---

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` ou `production` |
| `MONGODB_URI` | Connection string do MongoDB Atlas | `mongodb+srv://...` |
| `SESSION_SECRET` | Chave secreta para sessões | `chave-aleatoria-123` |
| `SESSION_MAX_AGE` | Tempo de expiração da sessão (ms) | `604800000` (7 dias) |
| `CARRINHO_EXPIRATION` | Tempo de expiração do carrinho (ms) | `604800000` (7 dias) |

---

## 🔌 Endpoints da API

### Autenticação

#### 1. Registrar Novo Usuário
```http
POST /api/auth/registro
Content-Type: application/json

{
  "nome": "Alberto Santos",
  "email": "alberto@teste.com",
  "senha": "123456"
}
```

**Resposta (201 Created):**
```json
{
  "mensagem": "Usuário criado com sucesso!",
  "usuario": {
    "id": "65c1234567890abcdef12345",
    "nome": "Alberto Santos",
    "email": "alberto@teste.com"
  }
}
```

---

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alberto@teste.com",
  "senha": "123456"
}
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Login realizado com sucesso!",
  "usuario": {
    "id": "65c1234567890abcdef12345",
    "nome": "Alberto Santos",
    "email": "alberto@teste.com"
  },
  "carrinho": []
}
```

---

#### 3. Logout
```http
POST /api/auth/logout
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Logout realizado com sucesso!"
}
```

---

#### 4. Dados do Usuário Logado
```http
GET /api/auth/me
```

**Resposta (200 OK):**
```json
{
  "usuario": {
    "id": "65c1234567890abcdef12345",
    "nome": "Alberto Santos",
    "email": "alberto@teste.com"
  }
}
```

---

### Carrinho

**⚠️ Todas as rotas do carrinho exigem autenticação (login).**

#### 1. Adicionar Produto ao Carrinho
```http
POST /api/carrinho/adicionar
Content-Type: application/json

{
  "produtoId": "001",
  "nome": "Notebook Dell",
  "preco": 3500.00,
  "quantidade": 1
}
```

**Resposta (201 Created):**
```json
{
  "mensagem": "Produto adicionado ao carrinho!",
  "carrinho": [...],
  "totalItens": 1,
  "valorTotal": 3500
}
```

---

#### 2. Visualizar Carrinho
```http
GET /api/carrinho
```

**Resposta (200 OK):**
```json
{
  "carrinho": [
    {
      "produtoId": "001",
      "nome": "Notebook Dell",
      "preco": 3500,
      "quantidade": 1,
      "adicionadoEm": "2026-02-07T02:30:00.000Z"
    }
  ],
  "totalItens": 1,
  "valorTotal": 3500,
  "atualizadoEm": "2026-02-07T02:30:00.000Z",
  "expiraEm": "2026-02-14T02:30:00.000Z"
}
```

---

#### 3. Remover Produto
```http
DELETE /api/carrinho/remover/:produtoId
```

**Exemplo:**
```http
DELETE /api/carrinho/remover/001
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Produto removido do carrinho!",
  "carrinho": [],
  "totalItens": 0,
  "valorTotal": 0
}
```

---

#### 4. Finalizar Compra
```http
POST /api/carrinho/finalizar
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Compra finalizada com sucesso!",
  "pedido": {
    "pedidoId": 1738883456789,
    "usuarioId": "65c1234...",
    "itens": [...],
    "valorTotal": 3500,
    "dataPedido": "2026-02-07T02:40:00.000Z",
    "status": "processando"
  }
}
```

---

#### 5. Limpar Carrinho
```http
DELETE /api/carrinho/limpar
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Carrinho limpo com sucesso!"
}
```

---

## 📁 Estrutura do Projeto

```
carrinho-compras-node/
│
├── config/
│   └── database.js          # Configuração e conexão com MongoDB Atlas
│
├── middleware/
│   └── auth.js              # Middleware de autenticação e autorização
│
├── models/
│   ├── Carrinho.js          # Schema Mongoose do Carrinho
│   └── Usuario.js           # Schema Mongoose do Usuário
│
├── routes/
│   ├── carrinho.js          # Rotas da API do carrinho
│   └── auth.js              # Rotas de autenticação
│
├── .env                     # Variáveis de ambiente (NÃO COMMITAR!)
├── .gitignore               # Arquivos ignorados pelo Git
├── LICENSE                  # Licença MIT
├── README.md                # Documentação do projeto
├── package.json             # Dependências e scripts
├── package-lock.json        # Lock das dependências
└── server.js                # Configuração e inicialização do servidor
```

### Descrição dos Diretórios

- **`config/`** - Configuração do MongoDB Atlas com DNS customizado
- **`middleware/`** - Middleware de autenticação (verificaLogin, carregaUsuario)
- **`models/`** - Schemas Mongoose (Usuario, Carrinho) com validações e métodos
- **`routes/`** - Rotas RESTful da API (autenticação e carrinho)
- **`server.js`** - Servidor Express com sessões persistentes

---

## 🧪 Testando a API

### Ferramentas Recomendadas

- **Thunder Client** - Extensão do VS Code (recomendado)
- **Postman** - Cliente HTTP completo
- **Insomnia** - Alternativa ao Postman
- **cURL** - Linha de comando

### Exemplo com Thunder Client (VS Code)

1. **Instala a extensão:** Thunder Client
2. **Cria nova requisição**
3. **Testa os endpoints** na ordem:
   - Registro → Login → Adicionar ao carrinho → Ver carrinho

### Exemplo com cURL

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/api/auth/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Alberto Santos",
    "email": "alberto@teste.com",
    "senha": "123456"
  }'

# 2. Login (salva o cookie)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "alberto@teste.com",
    "senha": "123456"
  }'

# 3. Adicionar ao carrinho (usa o cookie)
curl -X POST http://localhost:3000/api/carrinho/adicionar \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "produtoId": "001",
    "nome": "Notebook",
    "preco": 3500.00,
    "quantidade": 1
  }'

# 4. Ver carrinho
curl -X GET http://localhost:3000/api/carrinho \
  -b cookies.txt
```

---

## 🔐 Segurança

### Implementações de Segurança

- ✅ **Senhas Criptografadas**: bcrypt com salt de 10 rounds
- ✅ **httpOnly Cookies**: Proteção contra XSS
- ✅ **SameSite**: Proteção contra CSRF
- ✅ **Sessões Seguras**: Armazenadas no MongoDB com expiração
- ✅ **Validação de Dados**: Mongoose schemas com validações
- ✅ **Prevenção de Duplicatas**: Email único no banco
- ✅ **TTL Index**: Remoção automática de carrinhos expirados
- ✅ **Tratamento de Erros**: Respostas padronizadas

### Boas Práticas

- Variáveis sensíveis no `.env` (não commitadas)
- Autenticação obrigatória em rotas protegidas
- Validações server-side completas
- Logs de erros detalhados

---

## 🛠️ Roadmap de Melhorias

- [ ] Implementar JWT em vez de sessões
- [ ] Adicionar refresh tokens
- [ ] Sistema completo de produtos (CRUD)
- [ ] Sistema de pedidos persistente
- [ ] Integração com gateway de pagamento (Stripe/PagSeguro)
- [ ] Upload de imagens de produtos
- [ ] Sistema de avaliações e comentários
- [ ] Front-end React/Vue para consumir a API
- [ ] Testes automatizados (Jest/Supertest)
- [ ] CI/CD com GitHub Actions
- [ ] Deploy em produção (Railway/Render/Heroku)
- [ ] Documentação Swagger/OpenAPI
- [ ] Rate limiting e throttling
- [ ] Sistema de cupons de desconto

---

## 📝 Notas Técnicas

### Como Funciona a Persistência

```javascript
// 1. Usuário faz login
// → Sessão criada no MongoDB
// → Cookie enviado ao cliente

// 2. Cliente adiciona ao carrinho
// → Dados salvos no MongoDB (collection carrinhos)
// → Vinculados ao usuário logado

// 3. Cliente faz logout
// → Sessão destruída
// → Carrinho permanece no banco

// 4. Cliente faz login novamente
// → Sessão recriada
// → Carrinho recuperado do banco ✅
```

### Resolução de DNS Customizada

O projeto implementa resolução DNS customizada (Google DNS 8.8.8.8) para resolver problemas de conectividade com MongoDB Atlas em alguns provedores de internet.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Alberto Luiz dos Santos Peixoto**

- GitHub: [@alberto2santos](https://github.com/alberto2santos)
- LinkedIn: [Alberto Luiz](https://www.linkedin.com/in/alberto-luiz/)
- Email: alberto.dos.santos93@gmail.com

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrão de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Mudanças na documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração de código
- `test:` - Adição de testes
- `chore:` - Tarefas de manutenção

---

## 📞 Suporte

Se você tiver alguma dúvida ou sugestão:

- **Email**: alberto.dos.santos93@gmail.com
- **LinkedIn**: [Alberto Luiz](https://www.linkedin.com/in/alberto-luiz/)
- **Issues**: [GitHub Issues](https://github.com/alberto2santos/carrinho-compras-node/issues)

---

## ⭐ Agradecimentos

Se este projeto foi útil para você, considere:

- ⭐ Dar uma estrela no repositório
- 🐛 Reportar bugs ou sugerir melhorias
- 🤝 Contribuir com código
- 📢 Compartilhar com outros desenvolvedores

---

**Desenvolvido com 💙 por [Alberto Luiz](https://github.com/alberto2santos)**
