const db = require('../database/sqlite');
const User = require('../models/user.model');

class UsersRepository {
    async findById(id) {
        const row = await db.get('SELECT id, username, email, nome, created_at FROM users WHERE id = ?', [id]);
        return row ? User.fromDB(row) : null;
    }

    async findByUsername(username) {
        const row = await db.get(
            'SELECT id, username, email, nome, password_hash, created_at FROM users WHERE username = ?',
            [username]
        );
        return row
            ? new User({
                  id: row.id,
                  username: row.username,
                  email: row.email,
                  nome: row.nome,
                  password: row.password_hash, // necessário para bcrypt.compare
                  created_at: row.created_at,
              })
            : null;
    }

    async findByEmail(email) {
        const row = await db.get(
            'SELECT id, username, email, nome, password_hash, created_at FROM users WHERE email = ?',
            [email]
        );
        return row
            ? new User({
                  id: row.id,
                  username: row.username,
                  email: row.email,
                  nome: row.nome,
                  password: row.password_hash,
                  created_at: row.created_at,
              })
            : null;
    }

    async create({ username, passwordHash, email, nome }) {
        const result = await db.run(
            'INSERT INTO users (username, password_hash, email, nome) VALUES (?, ?, ?, ?)',
            [username, passwordHash, email, nome]
        );

        const row = await db.get(
            'SELECT id, username, email, nome, created_at FROM users WHERE id = ?',
            [result.lastInsertRowid]
        );
        return User.fromDB(row);
    }
}

module.exports = UsersRepository;
