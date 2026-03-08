// Carrega as variáveis do .env para o process.env
require('dotenv').config();

const app = require('./src/app');
const connectDatabase = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Conecta ao banco de dados e só depois liga o servidor
const startServer = async() => {
    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
};

startServer();