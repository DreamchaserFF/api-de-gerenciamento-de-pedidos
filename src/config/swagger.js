const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orders API',
      version: '1.0.0',
      description: 'API para gerenciamento de pedidos',
    },
    components: {
      securitySchemes: {
        // Define o esquema de autenticação JWT para o Swagger
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    // Aplica autenticação JWT em todos os endpoints por padrão
    security: [{ bearerAuth: [] }]
  },
  // Onde o Swagger vai procurar os comentários de documentação
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);