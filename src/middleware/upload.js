'use strict';

const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { MIME_TYPES, SIZE_LIMITS } = require('../config/mimeTypes');

const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'uploads');

/**
 * Build a multer instance for a given category.
 * - Generates a uuid-prefixed filename to prevent path traversal.
 * - Validates MIME type against the allowed list for that category.
 * - Enforces a per-category file size limit.
 *
 * @param {string} category  - Subdirectory name (excel | video | archives | images)
 * @param {string[]} allowed - Array of permitted MIME type strings
 * @param {number} maxSize   - Maximum file size in bytes
 * @returns {multer.Multer}
 */
function buildUploader(category, allowed, maxSize) {
  const storage = multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, path.join(UPLOADS_ROOT, category));
    },
    filename(_req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });

  function fileFilter(_req, file, cb) {
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error(
        `Invalid file type "${file.mimetype}". Allowed: ${allowed.join(', ')}`,
      );
      err.code = 'INVALID_FILE_TYPE';
      err.status = 400;
      cb(err, false);
    }
  }

  return multer({ storage, fileFilter, limits: { fileSize: maxSize } });
}

const uploadExcel = buildUploader('excel', MIME_TYPES.excel, SIZE_LIMITS.excel);
const uploadVideo = buildUploader('video', MIME_TYPES.video, SIZE_LIMITS.video);
const uploadArchive = buildUploader(
  'archives',
  MIME_TYPES.archive,
  SIZE_LIMITS.archive,
);
const uploadImage = buildUploader(
  'images',
  MIME_TYPES.image,
  SIZE_LIMITS.image,
);

module.exports = { uploadExcel, uploadVideo, uploadArchive, uploadImage };
