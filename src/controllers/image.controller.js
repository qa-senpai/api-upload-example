'use strict';

const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads', 'images');

/**
 * POST /api/image/upload
 * Multer has already saved the JPEG to disk.
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
      message: 'Image uploaded successfully',
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
 * GET /api/image/:filename
 * Serves the image inline (displayed in browser / Postman preview).
 */
function serve(req, res, next) {
  try {
    const { filename } = req.params;
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      const err = new Error(`Image "${safeFilename}" not found`);
      err.status = 404;
      return next(err);
    }

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `inline; filename="${safeFilename}"`,
    });

    return res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, serve };
