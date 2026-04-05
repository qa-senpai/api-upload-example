'use strict';

require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET    /health');
  console.log('');
  console.log('  POST   /api/json               – store a JSON document');
  console.log('  GET    /api/json               – list all stored documents');
  console.log('  GET    /api/json/:id           – retrieve document by id');
  console.log('');
  console.log('  POST   /api/excel/upload       – upload .xlsx file');
  console.log('  GET    /api/excel/download/:f  – download Excel file');
  console.log('');
  console.log('  POST   /api/video/upload       – upload video (mp4/mov/avi)');
  console.log(
    '  GET    /api/video/stream/:f    – stream video (Range supported)',
  );
  console.log('');
  console.log('  POST   /api/archive/upload     – upload .zip archive');
  console.log('  GET    /api/archive/download/:f – download archive');
  console.log('');
  console.log('  POST   /api/image/upload       – upload JPEG image');
  console.log('  GET    /api/image/:f           – serve image inline');
});
