import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ReactGram Backend',
      version: '1.0.0',
      description: 'Documentação da API de backend do Reactgram.',
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Ambiente local',
      },
      {
        url: 'https://reactgram-backend.dev-joao.app.br',
        description: 'Ambiente produção',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'Rotas relacionadas a usuários',
      },
      {
        name: 'Photos',
        description: 'Rotas relacionadas a fotos',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Photo: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            image: { type: 'string' },
            title: { type: 'string' },
            likes: {
              type: 'array',
              items: { type: 'string' },
            },
            comments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  comment: { type: 'string' },
                  userName: { type: 'string' },
                  userImage: { type: 'string' },
                  userId: { type: 'string' },
                },
              },
            },
            user: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },

        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64f9c3e2a1b2c3d4e5f6a789',
            },
            firstName: {
              type: 'string',
              example: 'João',
            },
            lastName: {
              type: 'string',
              example: 'Paulo',
            },
            username: {
              type: 'string',
              example: 'joaopaulo',
            },
            email: {
              type: 'string',
              example: 'joaopaulo@gmail.com',
            },
            profileImage: {
              type: 'string',
              example: 'profile123.jpg',
              nullable: true,
            },
            bio: {
              type: 'string',
              example: 'Desenvolvedor fullstack',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        AuthResponseRegister: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64f9c3e2a1b2c3d4e5f6a789',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },

        AuthResponseLogin: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            profileImage: {
              type: 'string',
              nullable: true,
            },
            message: {
              type: 'string',
              example: 'Login realizado com sucesso.',
            },
          },
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Usuário não encontrado.'],
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/routes/*.ts'], // onde estão seus endpoints
};

export const swaggerSpec = swaggerJsdoc(options);
