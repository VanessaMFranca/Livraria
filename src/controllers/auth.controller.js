const bcrypt = require('bcrypt');
const UsersRepository = require('../repositories/users.repository');

class AuthController {
    constructor() {
        this.usersRepo = new UsersRepository();
    }

    async register(req, res, next) {
        try {
            const { username, nome, email, password } = req.body;
            
            // Verifica se os campos obrigatórios estão presentes
            if (!username || !nome || !email || !password) {
                return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
            }

            // Verifica se o nome de usuário já existe
            const existingUser = await this.usersRepo.findByUsername(username);
            if (existingUser) {
                return res.status(409).json({ erro: 'Usuário já existe.' });
            }

            // Verifica se o email já está cadastrado
            const existingEmail = await this.usersRepo.findByEmail(email);
            if (existingEmail) {
                return res.status(409).json({ erro: 'Email já cadastrado.' });
            }

            // Criptografa a senha
            const hash = await bcrypt.hash(password, 10);

            // Cria o novo usuário
            const user = await this.usersRepo.create({ username, nome, email, passwordHash: hash });

            // Armazena o ID do usuário na sessão
            req.session.userId = user.id;

            // Retorna a resposta de sucesso com o usuário
            res.status(201).json({ mensagem: 'Usuário registrado com sucesso!', user: user.toJSON() });
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            
            // Busca o usuário pelo nome de usuário
            const user = await this.usersRepo.findByUsername(username);
            if (!user) {
                return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
            }

            // Verifica a senha
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
            }

            // Armazena o ID do usuário na sessão
            req.session.userId = user.id;

            // Retorna a resposta de sucesso
            res.status(200).json({ mensagem: 'Login realizado com sucesso!', user: user.toJSON() });
        } catch (err) {
            next(err);
        }
    }

    async me(req, res, next) {
        try {
            // Verifica se o usuário está autenticado
            if (!req.session.userId) {
                return res.status(401).json({ erro: 'Não autenticado.' });
            }

            // Busca os dados do usuário logado
            const user = await this.usersRepo.findById(req.session.userId);
            if (!user) {
                return res.status(404).json({ erro: 'Usuário não encontrado.' });
            }

            // Retorna os dados do usuário
            res.status(200).json({ user: user.toJSON() });
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        // Destroi a sessão do usuário
        req.session.destroy(() => {
            res.status(200).json({ mensagem: 'Logout realizado com sucesso.' });
        });
    }
}

module.exports = AuthController;
