'use strict';

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'All-Types API',
      version: '1.0.0',
      description:
        'REST API demonstrating endpoints for five different data types: ' +
        'JSON documents, Excel spreadsheets, video files, ZIP archives, and JPEG images.',
      contact: {
        name: 'API Course',
      },
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        description: 'Local development server',
        variables: {
          port: {
            default: '3000',
          },
        },
      },
    ],
    tags: [
      {
        name: 'JSON',
        description: 'Store and retrieve arbitrary JSON documents',
      },
      {
        name: 'Excel',
        description: 'Upload and download Excel spreadsheets (.xlsx)',
      },
      {
        name: 'Video',
        description: 'Upload and stream video files (mp4, mov, avi, mkv)',
      },
      { name: 'Archive', description: 'Upload and download ZIP archives' },
      { name: 'Image', description: 'Upload and serve JPEG images' },
      { name: 'System', description: 'Health and status endpoints' },
    ],
    components: {
      schemas: {
        // ── Shared error shape ──────────────────────────────────────────────
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'INVALID_FILE_TYPE' },
                message: {
                  type: 'string',
                  example: 'Invalid file type "text/plain".',
                },
              },
            },
          },
        },

        // ── JSON ────────────────────────────────────────────────────────────
        JsonRecord: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            data: {
              type: 'object',
              additionalProperties: true,
              example: { name: 'Alice', age: 30 },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-04-05T12:00:00.000Z',
            },
          },
        },

        // ── File upload response ────────────────────────────────────────────
        FileUploadResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'File uploaded successfully' },
            file: {
              type: 'object',
              properties: {
                filename: {
                  type: 'string',
                  example: '550e8400-e29b-41d4-a716-446655440000.xlsx',
                },
                originalName: { type: 'string', example: 'report.xlsx' },
                size: { type: 'integer', example: 204800 },
                mimetype: {
                  type: 'string',
                  example:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
                uploadedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2026-04-05T12:00:00.000Z',
                },
              },
            },
          },
        },
      },
    },
  },
  // Glob patterns pointing to files that contain @swagger JSDoc blocks
  apis: ['./src/routes/*.routes.js', './app.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
