class RepositoryBase {
    constructor() {
        if (this.constructor === RepositoryBase) {
            throw new Error("Não é possível instanciar uma classe abstrata");
        }
        this.caminhoArquivo = null;
    }
    async findAll() { throw new Error("Método deve ser implementado"); }
    async findById(id) { throw new Error("Método deve ser implementado"); }
    async create(data) { throw new Error("Método deve ser implementado"); }
    async update(id, data) { throw new Error("Método deve ser implementado"); }
    async delete(id) { throw new Error("Método deve ser implementado"); }

    async getNextId() {
        const items = await this.findAll();
        if (items.length === 0) return 1;
        return Math.max(...items.map(item => item.id)) + 1;
    }
}

module.exports = RepositoryBase;
