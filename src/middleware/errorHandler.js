//Este middleware capta e trata os erros da aplicação
const errorHandler = (err,req, res, next)=>{
    if(process.env.NODE_ENV === 'development'){
        res.status(500).json({
            erro: "Erro interno do salvador",
            mensagem: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString(),
            url: req.originalUrl,
            method: req.method
        });
    }else {
        res.status(500).json({
            erro: "Erro interno do servidor",
            timestamp: new Date().toISOString()
        });
    }
};

 module.exports = errorHandler;