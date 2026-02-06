function verificaLogin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ 
            erro: 'Faça login primeiro',
            redirect: '/login'
        });
    }
    next();
}

module.exports = verificaLogin;