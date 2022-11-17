export default {
  swagger: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'PMS Application API',
        version: '1.0.0',
        description: 'Jiffix Auto Care Project Management System Application Resource Endpoint API',
      },
      host: 'localhost:5400',
      components: {
        securitySchemes: {
          jwt: {
            type: 'http',
            scheme: 'bearer',
            in: 'header',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/routes/*.ts', './src/resources/swagger/authentication.yml'],
  },
};
