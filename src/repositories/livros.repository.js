const path = require('path');
const Livro = require("../models/livro.model");
const db = require("../database/sqlite");
const RepositoryBase = require('./repository.interface');

class LivrosRepository extends RepositoryBase {
    constructor() {
        super();
        this.caminhoArquivo = path.join(__dirname, "../data/livros.json");
    }

    async findAll() {
        const rows = await db.all(
            "SELECT id, titulo, autor, categoria, ano, editora, numeroPaginas FROM livros ORDER BY id ASC"
        );
        return rows.map(r => Livro.fromJSON(r));
    }

    async findById(id) {
        const row = await db.get(
            "SELECT id, titulo, autor, categoria, ano, editora, numeroPaginas FROM livros WHERE id = ?",
            [id]
        );
        return row ? Livro.fromJSON(row) : null;
    }

    async create(livroData) {
        const novo = new Livro({ id: null, ...livroData });
        const res = await db.run(
            "INSERT INTO livros (titulo, autor, categoria, ano, editora, numeroPaginas) VALUES (?, ?, ?, ?, ?, ?)",
            [novo.titulo, novo.autor, novo.categoria, novo.ano, novo.editora, novo.numeroPaginas]
        );
        return this.findById(res.lastID);
    }

    async update(id, dadosAtualizados) {
        const atual = new Livro({ id, ...dadosAtualizados });
        await db.run(
            "UPDATE livros SET titulo = ?, autor = ?, categoria = ?, ano = ?, editora = ?, numeroPaginas = ? WHERE id = ?",
            [atual.titulo, atual.autor, atual.categoria, atual.ano, atual.editora, atual.numeroPaginas, id]
        );
        return this.findById(id);
    }

    async delete(id) {
        const existente = await this.findById(id);
        if (!existente) {
            const e = new Error("Livro não encontrado");
            e.statusCode = 404;
            throw e;
        }
        await db.run("DELETE FROM livros WHERE id = ?", [id]);
        return existente;
    }
}

module.exports = LivrosRepository;
