const express = require('express');
const router = express.Router();
const Carrinho = require('../models/Carrinho');
const { verificaLogin } = require('../middleware/auth');

/**
 * POST /api/carrinho/adicionar
 * Adiciona produto ao carrinho
 */
router.post('/adicionar', verificaLogin, async (req, res) => {
    try {
        const { produtoId, nome, preco, quantidade } = req.body;
        
        // Validações
        if (!produtoId || !nome || !preco || !quantidade) {
            return res.status(400).json({
                erro: 'Campos obrigatórios faltando',
                campos: { produtoId: 'string', nome: 'string', preco: 'number', quantidade: 'number' }
            });
        }
        
        if (preco <= 0 || quantidade <= 0) {
            return res.status(400).json({
                erro: 'Preço e quantidade devem ser maiores que zero'
            });
        }
        
        // Busca ou cria carrinho
        let carrinho = await Carrinho.findOne({ usuarioId: req.session.usuarioId });
        
        if (!carrinho) {
            carrinho = new Carrinho({
                usuarioId: req.session.usuarioId,
                itens: []
            });
        }
        
        // Adiciona item (método do model)
        carrinho.adicionarItem({ produtoId, nome, preco, quantidade });
        
        // Salva no banco
        await carrinho.save();
        
        // Atualiza sessão
        req.session.carrinho = carrinho.itens;
        
        res.status(201).json({
            mensagem: 'Produto adicionado ao carrinho!',
            carrinho: carrinho.itens,
            totalItens: carrinho.itens.length,
            valorTotal: carrinho.valorTotal
        });
        
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        res.status(500).json({
            erro: 'Erro ao adicionar produto',
            mensagem: error.message
        });
    }
});

/**
 * GET /api/carrinho
 * Visualiza carrinho
 */
router.get('/', verificaLogin, async (req, res) => {
    try {
        const carrinho = await Carrinho.findOne({ usuarioId: req.session.usuarioId });
        
        if (!carrinho || carrinho.itens.length === 0) {
            return res.json({
                carrinho: [],
                totalItens: 0,
                valorTotal: 0,
                mensagem: 'Carrinho vazio'
            });
        }
        
        res.json({
            carrinho: carrinho.itens,
            totalItens: carrinho.itens.length,
            valorTotal: carrinho.valorTotal,
            atualizadoEm: carrinho.atualizadoEm,
            expiraEm: carrinho.expiraEm
        });
        
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        res.status(500).json({
            erro: 'Erro ao buscar carrinho',
            mensagem: error.message
        });
    }
});

/**
 * DELETE /api/carrinho/remover/:produtoId
 * Remove produto do carrinho
 */
router.delete('/remover/:produtoId', verificaLogin, async (req, res) => {
    try {
        const { produtoId } = req.params;
        
        const carrinho = await Carrinho.findOne({ usuarioId: req.session.usuarioId });
        
        if (!carrinho) {
            return res.status(404).json({
                erro: 'Carrinho não encontrado'
            });
        }
        
        // Remove item (método do model)
        carrinho.removerItem(produtoId);
        
        // Salva no banco
        await carrinho.save();
        
        // Atualiza sessão
        req.session.carrinho = carrinho.itens;
        
        res.json({
            mensagem: 'Produto removido do carrinho!',
            carrinho: carrinho.itens,
            totalItens: carrinho.itens.length,
            valorTotal: carrinho.valorTotal
        });
        
    } catch (error) {
        console.error('Erro ao remover do carrinho:', error);
        res.status(500).json({
            erro: 'Erro ao remover produto',
            mensagem: error.message
        });
    }
});

/**
 * POST /api/carrinho/finalizar
 * Finaliza compra
 */
router.post('/finalizar', verificaLogin, async (req, res) => {
    try {
        const carrinho = await Carrinho.findOne({ usuarioId: req.session.usuarioId });
        
        if (!carrinho || carrinho.itens.length === 0) {
            return res.status(400).json({
                erro: 'Carrinho vazio'
            });
        }
        
        // Cria pedido (simulado)
        const pedido = {
            pedidoId: Date.now(),
            usuarioId: req.session.usuarioId,
            itens: carrinho.itens,
            valorTotal: carrinho.valorTotal,
            dataPedido: new Date(),
            status: 'processando'
        };
        
        // Aqui você salvaria o pedido em uma collection "Pedidos"
        // const novoPedido = await Pedido.create(pedido);
        
        // Limpa carrinho (método do model)
        carrinho.limpar();
        await carrinho.save();
        
        // Limpa sessão
        req.session.carrinho = [];
        
        res.json({
            mensagem: 'Compra finalizada com sucesso!',
            pedido: pedido
        });
        
    } catch (error) {
        console.error('Erro ao finalizar compra:', error);
        res.status(500).json({
            erro: 'Erro ao finalizar compra',
            mensagem: error.message
        });
    }
});

/**
 * DELETE /api/carrinho/limpar
 * Limpa todo o carrinho
 */
router.delete('/limpar', verificaLogin, async (req, res) => {
    try {
        const carrinho = await Carrinho.findOne({ usuarioId: req.session.usuarioId });
        
        if (!carrinho) {
            return res.json({
                mensagem: 'Carrinho já está vazio'
            });
        }
        
        // Limpa carrinho
        carrinho.limpar();
        await carrinho.save();
        
        // Limpa sessão
        req.session.carrinho = [];
        
        res.json({
            mensagem: 'Carrinho limpo com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
        res.status(500).json({
            erro: 'Erro ao limpar carrinho',
            mensagem: error.message
        });
    }
});

module.exports = router;