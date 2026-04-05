'use strict';

const router = require('express').Router();
const { uploadVideo } = require('../middleware/upload');
const { upload, stream } = require('../controllers/video.controller');

/**
 * @swagger
 * /api/video/upload:
 *   post:
 *     summary: Upload a video file
 *     description: |
 *       Accepts `.mp4`, `.mov`, `.avi`, or `.mkv` files (multipart/form-data, field name **file**).
 *       Max size: **500 MB**. Returns the server-assigned filename needed for streaming.
 *     tags: [Video]
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
 *                 description: Video file (mp4 / mov / avi / mkv)
 *     responses:
 *       201:
 *         description: Video uploaded successfully
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
 * /api/video/stream/{filename}:
 *   get:
 *     summary: Stream a video file
 *     description: |
 *       Supports HTTP **Range** requests (`Range: bytes=0-`) for seekable playback.
 *       Returns `206 Partial Content` when a Range header is present, `200` otherwise.
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000.mp4
 *         description: Server-assigned filename returned by the upload endpoint
 *       - in: header
 *         name: Range
 *         required: false
 *         schema:
 *           type: string
 *         example: bytes=0-1048575
 *         description: Byte range for partial content requests
 *     responses:
 *       200:
 *         description: Full video stream
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *       206:
 *         description: Partial video content (Range request)
 *         headers:
 *           Content-Range:
 *             schema:
 *               type: string
 *             example: bytes 0-1048575/10485760
 *           Accept-Ranges:
 *             schema:
 *               type: string
 *             example: bytes
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       416:
 *         description: Range Not Satisfiable
 */
router.post('/upload', uploadVideo.single('file'), upload);
router.get('/stream/:filename', stream);

module.exports = router;
