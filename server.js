require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/database');
const { carregaUsuario } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// CONECTA AO MONGODB
connectDB();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONFIGURAÇÃO DE SESSÃO
app.use(session({
    secret: process.env.SESSION_SECRET || 'sua-chave-secreta-aqui',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false
    }
}));

app.use(carregaUsuario);

// ROTAS
const rotasAuth = require('./routes/auth');
const rotasCarrinho = require('./routes/carrinho');

app.use('/api/auth', rotasAuth);
app.use('/api/carrinho', rotasCarrinho);

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API de Carrinho de Compras',
        versao: '2.0.0',
        endpoints: {
            'POST /api/auth/registro': 'Registrar',
            'POST /api/auth/login': 'Login',
            'POST /api/carrinho/adicionar': 'Adicionar ao carrinho',
            'GET /api/carrinho': 'Ver carrinho'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno' });
});

app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Servidor rodando!');
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});