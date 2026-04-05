'use strict';

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const jsonRoutes = require('./src/routes/json.routes');
const excelRoutes = require('./src/routes/excel.routes');
const videoRoutes = require('./src/routes/video.routes');
const archiveRoutes = require('./src/routes/archive.routes');
const imageRoutes = require('./src/routes/image.routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
// Relax the default CSP so Swagger UI scripts and styles can execute.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
      },
    },
  }),
);

// ── Request logging ───────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Body parser for JSON endpoints ────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ── Rate limiter applied to all file-upload endpoints ─────────────────────────
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 15, // max 15 upload requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many upload requests. Please wait a minute and try again.',
    },
  },
});

app.use('/api/excel/upload', uploadLimiter);
app.use('/api/video/upload', uploadLimiter);
app.use('/api/archive/upload', uploadLimiter);
app.use('/api/image/upload', uploadLimiter);

// ── Swagger UI ────────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Expose the raw OpenAPI JSON spec for tooling (Postman import, etc.)
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/json', jsonRoutes);
app.use('/api/excel', excelRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/image', imageRoutes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns server status and current timestamp.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: '2026-04-05T12:00:00.000Z'
 */
// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler for unmatched routes ─────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

// ── Centralized error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

module.exports = app;
