/**
 * Middleware: Verifica se usuário está autenticado
 */
function verificaLogin(req, res, next) {
    if (!req.session.usuarioId) {
        return res.status(401).json({
            erro: 'Autenticação necessária',
            mensagem: 'Faça login para acessar este recurso',
            redirect: '/api/auth/login'
        });
    }
    next();
}

/**
 * Middleware: Anexa dados do usuário na requisição
 */
async function carregaUsuario(req, res, next) {
    if (req.session.usuarioId) {
        try {
            const Usuario = require('../models/Usuario');
            const usuario = await Usuario.findById(req.session.usuarioId);
            
            if (usuario) {
                req.usuario = {
                    id: usuario._id,
                    nome: usuario.nome,
                    email: usuario.email
                };
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    }
    next();
}

module.exports = {
    verificaLogin,
    carregaUsuario
};