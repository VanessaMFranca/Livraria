function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ erro: 'Acesso não autorizado. Faça login.' });
    }
    next();
}
module.exports = { requireAuth };
