'use strict';

const router = require('express').Router();
const { uploadExcel } = require('../middleware/upload');
const { upload, download } = require('../controllers/excel.controller');

/**
 * @swagger
 * /api/excel/upload:
 *   post:
 *     summary: Upload an Excel spreadsheet
 *     description: |
 *       Accepts `.xlsx` or `.xls` files (multipart/form-data, field name **file**).
 *       Max size: **20 MB**. Returns the server-assigned filename needed for download.
 *     tags: [Excel]
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
 *                 description: Excel file (.xlsx or .xls)
 *     responses:
 *       201:
 *         description: File uploaded successfully
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
 * /api/excel/download/{filename}:
 *   get:
 *     summary: Download an Excel file
 *     description: Streams the file as an attachment using the server-assigned filename.
 *     tags: [Excel]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000.xlsx
 *         description: Server-assigned filename returned by the upload endpoint
 *     responses:
 *       200:
 *         description: Excel file download
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
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
router.post('/upload', uploadExcel.single('file'), upload);
router.get('/download/:filename', download);

module.exports = router;
