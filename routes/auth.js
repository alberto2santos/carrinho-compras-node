const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Carrinho = require('../models/Carrinho');

// Login
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    
    // Busca usuário (simplificado, sem bcrypt por enquanto)
    const usuario = await Usuario.findOne({ email, senha });
    
    if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
    }
    
    req.session.userId = usuario._id;
    
    // RECUPERA carrinho do banco
    const carrinhoSalvo = await Carrinho.findOne({ 
        usuarioId: usuario._id 
    });
    
    if (carrinhoSalvo) {
        req.session.carrinho = carrinhoSalvo.itens;
    }
    
    res.json({ 
        mensagem: 'Login realizado!',
        usuario: { id: usuario._id, nome: usuario.nome }
    });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao fazer logout' });
        }
        res.json({ mensagem: 'Logout realizado!' });
    });
});

module.exports = router;