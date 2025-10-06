const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);
const contactsRoutes = require('./routes/contacts.routes');
app.use('/contacts', contactsRoutes);

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
// Expose raw OpenAPI JSON for Postman import
app.get('/docs.json', (req, res) => res.json(swaggerSpecs));

module.exports = app;

