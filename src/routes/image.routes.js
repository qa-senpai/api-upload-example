'use strict';

const router = require('express').Router();
const { uploadImage } = require('../middleware/upload');
const { upload, serve } = require('../controllers/image.controller');

/**
 * @swagger
 * /api/image/upload:
 *   post:
 *     summary: Upload a JPEG image
 *     description: |
 *       Accepts `.jpg` / `.jpeg` files (multipart/form-data, field name **file**).
 *       Max size: **10 MB**. Returns the server-assigned filename needed to serve the image.
 *     tags: [Image]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: JPEG image (.jpg / .jpeg)
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       400:
 *         description: Invalid file type or no file provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/image/{filename}:
 *   get:
 *     summary: Serve a JPEG image inline
 *     description: |
 *       Returns the image with `Content-Disposition: inline` so it displays directly
 *       in browser and Postman preview panes.
 *     tags: [Image]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000.jpg
 *         description: Server-assigned filename returned by the upload endpoint
 *     responses:
 *       200:
 *         description: JPEG image
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/upload', uploadImage.single('file'), upload);
router.get('/:filename', serve);

module.exports = router;
