// src/lib/openapi.ts
export const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'User Management System API',
      version: '1.0.0',
      description: 'API documentation for the User Management System',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-production-url.com' 
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Admin', description: 'Administrative endpoints' },
      { name: 'Profile', description: 'User profile endpoints' },
    ],
    paths: {
      '/api/auth/register': {
        post: {
          summary: 'Register a new user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'user@example.com',
                    },
                    password: {
                      type: 'string',
                      format: 'password',
                      minLength: 8,
                      example: 'securePassword123',
                    },
                    name: {
                      type: 'string',
                      example: 'John Doe',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'User registered successfully',
                      },
                      user: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                          },
                          email: {
                            type: 'string',
                            example: 'user@example.com',
                          },
                          name: {
                            type: 'string',
                            example: 'John Doe',
                          },
                          role: {
                            type: 'string',
                            example: 'user',
                          },
                          createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00.000Z',
                          },
                          updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00.000Z',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Invalid input or user already exists',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'User with this email already exists',
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/auth/login': {
        post: {
          summary: 'Login a user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'user@example.com',
                    },
                    password: {
                      type: 'string',
                      format: 'password',
                      example: 'securePassword123',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                      },
                      user: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                          },
                          email: {
                            type: 'string',
                            example: 'user@example.com',
                          },
                          name: {
                            type: 'string',
                            example: 'John Doe',
                          },
                          role: {
                            type: 'string',
                            example: 'user',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Invalid email or password',
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          summary: 'Logout a user',
          tags: ['Auth'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Logout successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Logged out successfully',
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Unauthorized',
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/users/me': {
        get: {
          summary: 'Get current user profile',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User profile retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: '123e4567-e89b-12d3-a456-426614174000',
                      },
                      email: {
                        type: 'string',
                        example: 'user@example.com',
                      },
                      name: {
                        type: 'string',
                        example: 'John Doe',
                      },
                      role: {
                        type: 'string',
                        example: 'user',
                      },
                      createdAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2023-01-01T00:00:00.000Z',
                      },
                      updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2023-01-01T00:00:00.000Z',
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Unauthorized',
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/profile': {
        get: {
          summary: 'Get user profile',
          tags: ['Profile'],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Profile retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: '123e4567-e89b-12d3-a456-426614174000',
                      },
                      email: {
                        type: 'string',
                        example: 'user@example.com',
                      },
                      name: {
                        type: 'string',
                        example: 'John Doe',
                      },
                      bio: {
                        type: 'string',
                        example: 'Software developer with 5 years of experience',
                      },
                      avatar: {
                        type: 'string',
                        example: 'https://example.com/avatars/user.jpg',
                      },
                      createdAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2023-01-01T00:00:00.000Z',
                      },
                      updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        example: '2023-01-01T00:00:00.000Z',
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Unauthorized',
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        put: {
          summary: 'Update user profile',
          tags: ['Profile'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'John Doe',
                    },
                    bio: {
                      type: 'string',
                      example: 'Software developer with 5 years of experience',
                    },
                    avatar: {
                      type: 'string',
                      example: 'https://example.com/avatars/user.jpg',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Profile updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Profile updated successfully',
                      },
                      profile: {
                        type: 'object',
                        properties: {
                          id: {
                            type: 'string',
                            example: '123e4567-e89b-12d3-a456-426614174000',
                          },
                          email: {
                            type: 'string',
                            example: 'user@example.com',
                          },
                          name: {
                            type: 'string',
                            example: 'John Doe',
                          },
                          bio: {
                            type: 'string',
                            example: 'Software developer with 5 years of experience',
                          },
                          avatar: {
                            type: 'string',
                            example: 'https://example.com/avatars/user.jpg',
                          },
                          createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00.000Z',
                          },
                          updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-01-01T00:00:00.000Z',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Unauthorized',
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/admin/users': {
        get: {
          summary: 'Get all users (admin only)',
          tags: ['Admin'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: 'Page number',
              required: false,
              schema: {
                type: 'integer',
                default: 1,
              },
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Number of items per page',
              required: false,
              schema: {
                type: 'integer',
                default: 10,
              },
            },
          ],
          responses: {
            200: {
              description: 'Users retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      users: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                              example: '123e4567-e89b-12d3-a456-426614174000',
                            },
                            email: {
                              type: 'string',
                              example: 'user@example.com',
                            },
                            name: {
                              type: 'string',
                              example: 'John Doe',
                            },
                            role: {
                              type: 'string',
                              example: 'user',
                            },
                            createdAt: {
                              type: 'string',
                              format: 'date-time',
                              example: '2023-01-01T00:00:00.000Z',
                            },
                            updatedAt: {
                              type: 'string',
                              format: 'date-time',
                              example: '2023-01-01T00:00:00.000Z',
                            },
                          },
                        },
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          total: {
                            type: 'integer',
                            example: 100,
                          },
                          page: {
                            type: 'integer',
                            example: 1,
                          },
                          limit: {
                            type: 'integer',
                            example: 10,
                          },
                          pages: {
                            type: 'integer',
                            example: 10,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Unauthorized',
                      },
                    },
                  },
                },
              },
            },
            403: {
              description: 'Forbidden',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Forbidden: Admin access required',
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      error: {
                        type: 'string',
                        example: 'Internal server error',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };