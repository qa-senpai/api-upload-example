'use strict';

/**
 * Allowed MIME types per upload category.
 * Used by multer fileFilter to reject unsupported files at the boundary.
 */
const MIME_TYPES = {
  excel: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ],
  video: [
    'video/mp4',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/x-matroska', // .mkv
  ],
  archive: [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-zip',
  ],
  image: ['image/jpeg', 'image/jpg'],
};

/**
 * File size limits per category (in bytes).
 */
const SIZE_LIMITS = {
  excel: 20 * 1024 * 1024, // 20 MB
  video: 500 * 1024 * 1024, // 500 MB
  archive: 100 * 1024 * 1024, // 100 MB
  image: 10 * 1024 * 1024, // 10 MB
};

module.exports = { MIME_TYPES, SIZE_LIMITS };
