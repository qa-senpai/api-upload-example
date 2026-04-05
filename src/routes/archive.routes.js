'use strict';

const router = require('express').Router();
const { uploadArchive } = require('../middleware/upload');
const { upload, download } = require('../controllers/archive.controller');

/**
 * @swagger
 * /api/archive/upload:
 *   post:
 *     summary: Upload a ZIP archive
 *     description: |
 *       Accepts `.zip` files (multipart/form-data, field name **file**).
 *       Max size: **100 MB**. Returns the server-assigned filename needed for download.
 *     tags: [Archive]
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
 *                 description: ZIP archive (.zip)
 *     responses:
 *       201:
 *         description: Archive uploaded successfully
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
 * /api/archive/download/{filename}:
 *   get:
 *     summary: Download a ZIP archive
 *     description: Streams the archive as an attachment using the server-assigned filename.
 *     tags: [Archive]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000.zip
 *         description: Server-assigned filename returned by the upload endpoint
 *     responses:
 *       200:
 *         description: ZIP archive download
 *         content:
 *           application/zip:
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
router.post('/upload', uploadArchive.single('file'), upload);
router.get('/download/:filename', download);

module.exports = router;
