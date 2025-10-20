//erc/routes/index.js
const express = require("express");
const router = express.Router();

// Rotas de livros
const livrosRoutes = require("./livros.routes");

// Rota inicial (explicação do sistema)
router.get("/", (req, res) =>{
    res.status(200).json({
        mensagem: "Bem-vindo à API da livraria! Use /livros para gerenciar os livros.",
    });
});

// Usa as rotas de livros
router.use("/livros", livrosRoutes);

module.exports = router;