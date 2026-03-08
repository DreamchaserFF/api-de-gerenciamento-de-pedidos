const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================================
// POST /auth/register — Cria um novo usuário
// ============================================================
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    // Verifica se o email já está cadastrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    // bcrypt transforma a senha em um hash — nunca salvamos a senha pura
    // O número 10 é o "salt rounds" — quanto maior, mais seguro e mais lento
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: 'Usuário criado com sucesso.' });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ============================================================
// POST /auth/login — Autentica o usuário e retorna o token
// ============================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    // Busca o usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // bcrypt.compare compara a senha digitada com o hash salvo no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Gera o token JWT
    // Payload: { userId } — informação que ficará dentro do token
    // process.env.JWT_SECRET — a chave secreta do .env
    // expiresIn: '1d' — o token expira em 1 dia
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ token });

  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { register, login };