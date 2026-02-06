const express = require('express');
const router = express.Router();

// Adicionar produto (SESSÃO PURA, SEM BANCO)
router.post('/carrinho/adicionar', (req, res) => {
    const { produtoId, nome, preco, quantidade } = req.body;
    
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    }
    
    const produtoExistente = req.session.carrinho.find(
        item => item.produtoId === produtoId
    );
    
    if (produtoExistente) {
        produtoExistente.quantidade += parseInt(quantidade);
    } else {
        req.session.carrinho.push({
            produtoId,
            nome,
            preco: parseFloat(preco),
            quantidade: parseInt(quantidade),
            adicionadoEm: new Date()
        });
    }
    
    res.json({
        mensagem: 'Produto adicionado!',
        carrinho: req.session.carrinho,
        totalItens: req.session.carrinho.length
    });
});

// Visualizar carrinho
router.get('/carrinho', (req, res) => {
    const carrinho = req.session.carrinho || [];
    
    const total = carrinho.reduce((soma, item) => {
        return soma + (item.preco * item.quantidade);
    }, 0);
    
    res.json({
        carrinho: carrinho,
        totalItens: carrinho.length,
        valorTotal: total.toFixed(2)
    });
});

// Remover produto
router.delete('/carrinho/remover/:produtoId', (req, res) => {
    const { produtoId } = req.params;
    
    if (!req.session.carrinho) {
        return res.status(400).json({ erro: 'Carrinho vazio' });
    }
    
    req.session.carrinho = req.session.carrinho.filter(
        item => item.produtoId !== produtoId
    );
    
    res.json({
        mensagem: 'Produto removido!',
        carrinho: req.session.carrinho
    });
});

// Finalizar compra
router.post('/carrinho/finalizar', (req, res) => {
    const carrinho = req.session.carrinho || [];
    
    if (carrinho.length === 0) {
        return res.status(400).json({ erro: 'Carrinho vazio' });
    }
    
    const pedido = {
        pedidoId: Date.now(),
        itens: carrinho,
        dataPedido: new Date(),
        valorTotal: carrinho.reduce((soma, item) => 
            soma + (item.preco * item.quantidade), 0
        ).toFixed(2)
    };
    
    // Limpa carrinho
    req.session.carrinho = [];
    
    res.json({
        mensagem: 'Compra finalizada com sucesso!',
        pedido: pedido
    });
});

module.exports = router;