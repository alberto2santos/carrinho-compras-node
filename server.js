const express = require('express');
const session = require('express-session');
const app = express();

// MIDDLEWARE
app.use(express.json());

// SESSÃO SIMPLES (SEM MongoDB)
app.use(session({
    secret: 'sua-chave-secreta-aqui',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        httpOnly: true,
        secure: false
    }
}));

// IMPORTA ROTAS
const rotasCarrinho = require('./routes/carrinho');

// USA ROTAS
app.use('/api', rotasCarrinho);

// INICIA SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});