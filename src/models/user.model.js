class User {
    constructor({ id = null, username, password, nome, email = undefined, created_at = undefined }) {
        this.id = id ?? null;
        this.email = String(email || '').trim();
        this.nome = String(nome || '').trim();
        this.username = String(username || '').trim();
        this.created_at = created_at;
        this.password = password; // opcional (registro/troca)
        this._validar();
 }
    _validar() {
        const erros = [];
        if (!this.username || this.username.length < 3) erros.push('username deve ter pelo menos 3 caracteres');
        if (this.password !== undefined) {
            const pwd = String(this.password);
            if (pwd.length < 6) erros.push('password deve ter pelo menos 6 caracteres');
        }
        
        // Validação do nome
        if (!this.nome || this.nome.length < 3) erros.push('nome deve ter pelo menos 3 caracteres');

        // Validação do email
        if (!this.email || !this.email.includes('@') || !this.email.includes('.')) {
            erros.push('email inválido');
        }  
        if (erros.length) { const e = new Error('Dados de usuário inválidos'); e.statusCode = 400; e.details = erros; throw e; } 
    }
    
    static fromDB(row) {
    return new User({
        id: row.id,
        username: row.username,
        nome: row.nome,
        email: row.email,
        created_at: row.created_at
    });
}
    toJSON() { return { id: this.id, username: this.username, nome: this.nome, email: this.email, created_at: this.created_at }; }
}
module.exports = User;