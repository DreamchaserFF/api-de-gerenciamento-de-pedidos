const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const app = express();

app.use(express.json());

const orderRoutes = require('./routes/order.routes');
const authRoutes = require('./routes/auth.routes');
const authMiddleware = require('./middlewares/auth.middleware');

// Rota da documentação — acessível em /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas abertas
app.use('/auth', authRoutes);

// Rotas protegidas
app.use('/order', authMiddleware, orderRoutes);

module.exports = app;