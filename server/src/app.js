const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

module.exports = app;

