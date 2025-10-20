const fs = require ("fs");
const path = require ("path");
const RepositoryBase = require("./repository.interface");
const Livro = require("../models/livro.model");

class LivrosRepository extends RepositoryBase {
    constructor() {
        super();
        this.caminhoArquivo = path.join(__dirname, "../data/livros.json");
    }
    async findAll(){
        const dados = await this._lerArquivo();
        const lista = JSON.parse(dados);
        return lista.map(item => Livro.fromJSON(item));
    }
    async findById(id) {
        const livros = await this.findAll();
        return livros.find(l => l.id === id);
    }
    async create(livroData) {
        const livros = await this.findAll();
        const novoId = await this.getNextId();
        const novoLivro = new Livro({ id: novoId, ...livroData });
        livros.push(novoLivro);
        await this._saveToFile(livros.map(livro => livro.toJSON()));
        return novoLivro;
    }
    async update(id, dadosAtualizados) {
        const livros = await this.findAll();
        const indice = livros.findIndex(l => l.id === id);
        
        if (indice === -1) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }
        livros[indice] = new Livro({ ...livros[indice], ...dadosAtualizados });
        await this._saveToFile(livros.map(livros => livros.toJSON()));
        return livros[indice];
    }
    async delete(id) {
        const livros = await this.findAll();
        const indice = livros.findIndex(l => l.id === id);

        if (indice === -1) {
            const error = new Error("Livro não encontrado");
            error.statusCode = 404;
            throw error;
        }

        const [livroRemovido] = livros.splice(indice, 1);
        await this._saveToFile(livros.map(livros => livros.toJSON()));
        return livroRemovido;
    }
    async _saveToFile(data) {
        fs.writeFileSync(this.caminhoArquivo, JSON.stringify(data, null, 2), "utf8");
    }
    async _lerArquivo() {
        return await fs.promises.readFile(this.caminhoArquivo, "utf8");
    }
}
module.exports = LivrosRepository;
