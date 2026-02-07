const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Carrinho = require('../models/Carrinho');

/**
 * POST /api/auth/registro
 * Registra novo usuário
 */
router.post('/registro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Validações
        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: 'Campos obrigatórios faltando',
                campos: { nome: 'string', email: 'string', senha: 'string' }
            });
        }
        
        // Verifica se email já existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(409).json({
                erro: 'Email já cadastrado'
            });
        }
        
        // Cria usuário
        const usuario = await Usuario.create({ nome, email, senha });
        
        // Salva ID na sessão
        req.session.usuarioId = usuario._id;
        
        res.status(201).json({
            mensagem: 'Usuário criado com sucesso!',
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
        
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({
            erro: 'Erro ao criar usuário',
            mensagem: error.message
        });
    }
});

/**
 * POST /api/auth/login
 * Faz login do usuário
 */
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Validações
        if (!email || !senha) {
            return res.status(400).json({
                erro: 'Email e senha são obrigatórios'
            });
        }
        
        // Busca usuário (inclui senha para comparação)
        const usuario = await Usuario.findOne({ email }).select('+senha');
        
        if (!usuario) {
            return res.status(401).json({
                erro: 'Credenciais inválidas'
            });
        }
        
        // Compara senha
        const senhaCorreta = await usuario.compararSenha(senha);
        
        if (!senhaCorreta) {
            return res.status(401).json({
                erro: 'Credenciais inválidas'
            });
        }
        
        // Salva ID na sessão
        req.session.usuarioId = usuario._id;
        
        // Recupera carrinho do banco (se existir)
        const carrinho = await Carrinho.findOne({ usuarioId: usuario._id });
        
        if (carrinho) {
            req.session.carrinho = carrinho.itens;
        }
        
        res.json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            },
            carrinho: carrinho ? carrinho.itens : []
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            erro: 'Erro ao fazer login',
            mensagem: error.message
        });
    }
});

/**
 * POST /api/auth/logout
 * Faz logout do usuário
 */
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                erro: 'Erro ao fazer logout'
            });
        }
        
        res.json({
            mensagem: 'Logout realizado com sucesso!'
        });
    });
});

/**
 * GET /api/auth/me
 * Retorna dados do usuário logado
 */
router.get('/me', async (req, res) => {
    try {
        if (!req.session.usuarioId) {
            return res.status(401).json({
                erro: 'Não autenticado'
            });
        }
        
        const usuario = await Usuario.findById(req.session.usuarioId);
        
        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }
        
        res.json({
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
        
    } catch (error) {
        res.status(500).json({
            erro: 'Erro ao buscar usuário',
            mensagem: error.message
        });
    }
});

module.exports = router;