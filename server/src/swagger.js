const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyContacts API',
      version: '1.0.0',
      description: 'API documentation for MyContacts (auth & contacts)'
    },
    servers: [
      { url: 'http://localhost:4000', description: 'Local dev' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    __dirname + '/routes/*.js'
  ]
};

const specs = swaggerJsdoc(options);
module.exports = specs;
