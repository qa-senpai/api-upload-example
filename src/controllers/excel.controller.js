'use strict';

const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads', 'excel');

/**
 * POST /api/excel/upload
 * Multer has already saved the file to disk and attached metadata to req.file.
 */
function upload(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: {
          code: 'NO_FILE',
          message: 'No file was uploaded. Use field name "file".',
        },
      });
    }

    return res.status(201).json({
      message: 'Excel file uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/excel/download/:filename
 * Streams the requested file as a downloadable attachment.
 */
function download(req, res, next) {
  try {
    const { filename } = req.params;
    // Prevent path traversal: strip any directory components
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      const err = new Error(`File "${safeFilename}" not found`);
      err.status = 404;
      return next(err);
    }

    return res.download(filePath, safeFilename);
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, download };
