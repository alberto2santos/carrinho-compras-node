const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
        minlength: [3, 'Nome deve ter no mínimo 3 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
        select: false // Não retorna senha por padrão
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// MIDDLEWARE: Criptografa senha antes de salvar
UsuarioSchema.pre('save', async function(next) {
    // Só criptografa se senha foi modificada
    if (!this.isModified('senha')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// MÉTODO: Compara senha
UsuarioSchema.methods.compararSenha = async function(senhaDigitada) {
    return await bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);