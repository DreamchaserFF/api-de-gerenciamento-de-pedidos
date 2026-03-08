const mongoose = require('mongoose');

// Função que conecta ao banco de dados
const connectDatabase = async() => {
    try {
        // Usa a variavel MONGODB_URI do arquivo .env
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado com sucesso.');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1); // Encerra o programa se não conseguir conectar.
    }
};

module.exports = connectDatabase;