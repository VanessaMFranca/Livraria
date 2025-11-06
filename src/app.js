const app = require("./config/express");
const db = require("./database/sqlite");
db.init(); // garante que a tabela exista antes das rotas

//Todas as rotas da aplicação (centralizadas)
const routes = require("./routes");
    

//Configura o middleware de tratamento de erros
const errorHandler = require("./middleware/errorHandler");

//Configura as rotas com prefixo /api
app.use("/api", routes);

//Middleware de tratamento de erros
app.use(errorHandler);

//Handler para rotas não encontradas (404)
app.use((req, res) => {
    res.status(404).json({erro: "Endpoint não encontrado"});
});

module.exports = app;