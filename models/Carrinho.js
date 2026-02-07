const mongoose = require('mongoose');

const CarrinhoSchema = new mongoose.Schema({
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        index: true
    },
    itens: [{
        produtoId: {
            type: String,
            required: true
        },
        nome: {
            type: String,
            required: true
        },
        preco: {
            type: Number,
            required: true,
            min: 0
        },
        quantidade: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        adicionadoEm: {
            type: Date,
            default: Date.now
        }
    }],
    valorTotal: {
        type: Number,
        default: 0
    },
    atualizadoEm: {
        type: Date,
        default: Date.now
    },
    expiraEm: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        index: { expires: 0 } // TTL index: remove automaticamente após expirar
    }
}, {
    timestamps: true
});

// MIDDLEWARE: Calcula total antes de salvar
CarrinhoSchema.pre('save', function(next) {
    this.valorTotal = this.itens.reduce((total, item) => {
        return total + (item.preco * item.quantidade);
    }, 0);
    
    this.atualizadoEm = new Date();
    next();
});

// MÉTODO: Adiciona item ao carrinho
CarrinhoSchema.methods.adicionarItem = function(produto) {
    const itemExistente = this.itens.find(
        item => item.produtoId === produto.produtoId
    );
    
    if (itemExistente) {
        itemExistente.quantidade += produto.quantidade;
    } else {
        this.itens.push({
            produtoId: produto.produtoId,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: produto.quantidade
        });
    }
    
    return this;
};

// MÉTODO: Remove item do carrinho
CarrinhoSchema.methods.removerItem = function(produtoId) {
    this.itens = this.itens.filter(item => item.produtoId !== produtoId);
    return this;
};

// MÉTODO: Limpa carrinho
CarrinhoSchema.methods.limpar = function() {
    this.itens = [];
    this.valorTotal = 0;
    return this;
};

module.exports = mongoose.model('Carrinho', CarrinhoSchema);