# 🛒 Carrinho de Compras - API RESTful

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Express](https://img.shields.io/badge/Express-v4.18-blue)
![License](https://img.shields.io/badge/license-MIT-yellow)


API desenvolvida em Node.js para gerenciamento de carrinho de compras de e-commerce, com sistema de sessões para persistência de dados entre requisições.

---

## 📑 Índice

- [Sobre](#sobre-o-projeto)
- [Tecnologias](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Endpoints](#endpoints-da-api)
- [Autor](#autor)

## 📋 Sobre o Projeto

Sistema de carrinho de compras que resolve o desafio de manter o estado dos itens selecionados pelo usuário ao longo de várias páginas, utilizando gerenciamento de sessões. A aplicação garante que os itens permaneçam no carrinho mesmo após o usuário navegar entre páginas ou retornar à aplicação posteriormente.

### Problema Resolvido

- **HTTP Stateless**: O protocolo HTTP não mantém estado entre requisições. Esta API resolve isso com sessões persistentes.
- **Persistência de Dados**: Itens do carrinho são mantidos por até 7 dias, permitindo que o usuário retorne e continue sua compra.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Express-Session** - Gerenciamento de sessões
- **JavaScript ES6+** - Sintaxe moderna

---

## ✨ Funcionalidades

- ✅ Adicionar produtos ao carrinho
- ✅ Visualizar carrinho completo com cálculo de total
- ✅ Atualizar quantidade de produtos existentes
- ✅ Remover produtos do carrinho
- ✅ Finalizar compra e limpar carrinho
- ✅ Persistência de sessão por 7 dias
- ✅ Validação de dados

---

## 📦 Instalação

### Pré-requisitos

- Node.js 14+ instalado
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

3. **Inicie o servidor:**
```bash
npm start
```

4. **Servidor rodando em:**
```
http://localhost:3000
```

---

## 🔌 Endpoints da API

### 1. Adicionar Produto ao Carrinho
```http
POST /api/carrinho/adicionar
Content-Type: application/json

{
  "produtoId": "001",
  "nome": "Notebook",
  "preco": 2500.00,
  "quantidade": 1
}
```

**Resposta:**
```json
{
  "mensagem": "Produto adicionado!",
  "carrinho": [...],
  "totalItens": 1
}
```

---

### 2. Visualizar Carrinho
```http
GET /api/carrinho
```

**Resposta:**
```json
{
  "carrinho": [...],
  "totalItens": 2,
  "valorTotal": "5300.00"
}
```

---

### 3. Remover Produto
```http
DELETE /api/carrinho/remover/:produtoId
```

**Exemplo:**
```http
DELETE /api/carrinho/remover/001
```

**Resposta:**
```json
{
  "mensagem": "Produto removido!",
  "carrinho": [...]
}
```

---

### 4. Finalizar Compra
```http
POST /api/carrinho/finalizar
```

**Resposta:**
```json
{
  "mensagem": "Compra finalizada com sucesso!",
  "pedido": {
    "pedidoId": 1738881048576,
    "itens": [...],
    "dataPedido": "2026-02-06T22:50:48.576Z",
    "valorTotal": "5000.00"
  }
}
```

---

## 📁 Estrutura do Projeto

```
carrinho-compras-node/
│
├── config/
│   └── database.js          # Configuração do MongoDB (futuro)
│
├── middleware/
│   └── auth.js              # Middleware de autenticação
│
├── models/
│   ├── Carrinho.js          # Schema do Carrinho
│   └── Usuario.js           # Schema do Usuário
│
├── routes/
│   ├── carrinho.js          # Rotas da API do carrinho
│   └── auth.js              # Rotas de autenticação (futuro)
│
├── .gitignore               # Arquivos ignorados pelo Git
├── LICENSE                  # Licença MIT
├── README.md                # Documentação do projeto
├── package.json             # Dependências e scripts
├── package-lock.json        # Lock das dependências
└── server.js                # Configuração e inicialização do servidor
```
### Descrição dos Diretórios

- **`config/`** - Arquivos de configuração (banco de dados, variáveis de ambiente)
- **`middleware/`** - Funções middleware (autenticação, validação, logs)
- **`models/`** - Schemas e modelos de dados (MongoDB/Mongoose)
- **`routes/`** - Definição das rotas da API (endpoints RESTful)
- **`server.js`** - Arquivo principal que inicia o servidor Express

---

## 🧪 Testando a API

Você pode testar os endpoints usando:

- **Postman**: Importe a collection com os endpoints acima
- **Thunder Client**: Extensão do VS Code
- **cURL**: Via terminal

### Exemplo com cURL:
```bash
curl -X POST http://localhost:3000/api/carrinho/adicionar \
  -H "Content-Type: application/json" \
  -d '{
    "produtoId": "001",
    "nome": "Notebook",
    "preco": 2500.00,
    "quantidade": 1
  }'
```

---

## 🔐 Segurança

- **httpOnly Cookies**: Proteção contra XSS
- **Sessões com TTL**: Expiração automática após 7 dias
- **Validação de Dados**: Todos os inputs são validados

---

## 🛠️ Melhorias Futuras

- [ ] Autenticação de usuários (JWT)
- [ ] Persistência em banco de dados (MongoDB)
- [ ] Sistema de produtos completo (CRUD)
- [ ] Integração com gateway de pagamento
- [ ] Front-end para consumir a API
- [ ] Testes automatizados (Jest)
- [ ] Deploy em produção (Heroku/Vercel)

---

## 📝 Notas Técnicas

### Como Funciona o Gerenciamento de Sessão

```javascript
// Sessão criada automaticamente para cada cliente
req.session.carrinho = [];

// Dados persistem entre requisições
// Cookie enviado automaticamente pelo navegador
```

### Limitações da Versão Atual

- **MemoryStore**: Dados são perdidos ao reiniciar o servidor
- **Sem autenticação**: Qualquer cliente pode acessar qualquer carrinho via cookie
- **Sem persistência**: Ideal para desenvolvimento, não para produção

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

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📞 Suporte

Se você tiver alguma dúvida ou sugestão, entre em contato:

- **Email**: alberto.dos.santos93@gmail.com
- **LinkedIn**: [Alberto Luiz](https://www.linkedin.com/in/alberto-luiz/)

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela no repositório!**

---

**Desenvolvido com 💙 por [Alberto Luiz](https://github.com/alberto2santos)**