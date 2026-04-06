import test, { expect } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';

test('upload excel, should be 200', async ({ request }) => {
  const uploadBuffer = await readFile('tests/fixtures/examples-excel.xlsx');

  const response = await request.post('/api/excel/upload', {
    multipart: {
      file: {
        name: 'example-excel.xlsx',
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: uploadBuffer,
      },
    },
  });

  expect(response.status()).toBe(201);
  expect(response).toBeOK();

  const json = await response.json();

  expect(json.message).toContain('uploaded successfully');
  expect(json).toHaveProperty('file.originalName', 'example-excel.xlsx');
  expect(json).toHaveProperty('file.size', 5347);
  expect(json).toHaveProperty(
    'file.mimetype',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
});

test('upload excel via stream, should be 200', async ({ request }) => {
  const response = await request.post('/api/excel/upload', {
    multipart: {
      file: createReadStream('tests/fixtures/examples-excel.xlsx'),
    },
  });

  expect(response.status()).toBe(201);
  expect(response).toBeOK();

  const json = await response.json();

  expect(json.message).toContain('uploaded successfully');
  expect(json).toHaveProperty('file.originalName', 'examples-excel.xlsx');
  expect(json).toHaveProperty('file.size', 5347);
  expect(json).toHaveProperty(
    'file.mimetype',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
});

/*
{
  "message": "File uploaded successfully",
  "file": {
    "filename": "550e8400-e29b-41d4-a716-446655440000.xlsx",
    "originalName": "report.xlsx",
    "size": 204800,
    "mimetype": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "uploadedAt": "2026-04-05T12:00:00.000Z"
  }
}
*/
