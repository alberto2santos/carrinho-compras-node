const mongoose = require('mongoose');

const CarrinhoSchema = new mongoose.Schema({
    usuarioId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: true 
    },
    itens: [{
        produtoId: String,
        nome: String,
        preco: Number,
        quantidade: Number,
        adicionadoEm: { type: Date, default: Date.now }
    }],
    atualizadoEm: { type: Date, default: Date.now },
    expiraEm: { 
        type: Date, 
        default: () => Date.now() + 7*24*60*60*1000 
    }
});

module.exports = mongoose.model('Carrinho', CarrinhoSchema);