import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/config';

// ─── Swagger / OpenAPI Configuration ─────────────────────────────────────────

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIH26031 – AI Onion Grading System API',
      version: '1.0.0',
      description:
        'Production-grade REST API for AI-powered onion quality assessment and grading. ' +
        'Built with Node.js, Express, TypeScript, PostgreSQL (Prisma), AWS S3, and Python FastAPI (YOLOv8).',
      contact: {
        name: 'SIH26031 Team',
        email: 'support@oniongrading.in',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`,
        description: 'Development Server',
      },
      {
        url: 'https://api.oniongrading.in/api',
        description: 'Production Server (AWS EC2)',
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
        RegisterRequest: {
          type: 'object',
          required: ['name', 'phone', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Rajan Kumar' },
            phone: { type: 'string', example: '9876543210' },
            email: { type: 'string', format: 'email', example: 'rajan@example.com' },
            password: { type: 'string', example: 'Password123' },
            role: { type: 'string', enum: ['FARMER', 'PROCUREMENT_OFFICER', 'ADMIN'], default: 'FARMER' },
            village: { type: 'string', example: 'Lasalgaon' },
            district: { type: 'string', example: 'Nashik' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        AnalysisResult: {
          type: 'object',
          properties: {
            grade: { type: 'string', enum: ['A', 'B', 'C', 'REJECTED'] },
            score: { type: 'number', example: 92 },
            size: { type: 'string', example: 'Large' },
            freshness: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
            damage: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
            recommendation: { type: 'string', enum: ['ACCEPT', 'CONDITIONAL_ACCEPT', 'REJECT'] },
            processedImage: { type: 'string', example: 'https://s3.ap-south-1.amazonaws.com/...' },
            certificateUrl: { type: 'string' },
            defects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', example: 'Rot' },
                  confidence: { type: 'number', example: 0.03 },
                },
              },
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            message: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
