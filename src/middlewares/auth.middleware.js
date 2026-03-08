const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // O token vem no header "Authorization" no formato: "Bearer eyJhbGci..."
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // Separa "Bearer" do token em si
  const token = authHeader.split(' ')[1];

  try {
    // jwt.verify verifica se o token é válido e não expirou
    // Se for válido, retorna o payload — no nosso caso { userId }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona o userId na requisição para os controllers poderem usar
    req.userId = decoded.userId;

    // next() diz ao Express para continuar para o controller
    next();

  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;