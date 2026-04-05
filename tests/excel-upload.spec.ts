import { expect, test } from '@playwright/test';
import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';

const filePath = 'tests/fixtures/examples-excel.xlsx';

test('uploads an Excel file successfully', async ({ request }) => {
  const excelBuffer = await readFile(filePath);

  const response = await request.post('/api/excel/upload', {
    multipart: {
      file: {
        name: 'examples-excel.xlsx',
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: excelBuffer,
      },
    },
  });

  expect(response.status()).toBe(201);

  const body = (await response.json()) as {
    message: string;
    file: {
      filename: string;
      originalName: string;
      size: number;
      mimetype: string;
    };
  };

  expect(body.message).toContain('uploaded successfully');
  expect(body.file.originalName).toBe('examples-excel.xlsx');
  expect(body.file.mimetype).toBe(
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  expect(body.file.filename).toMatch(/\.xlsx$/);
  expect(typeof body.file.size).toBe('number');
  expect(body.file.size).toBeGreaterThan(0);
});

test('upload excel через ReadStream', async ({ request }) => {
  // Файл читається потоково, а не цілком у пам'ять
  const response = await request.post('/api/excel/upload', {
    multipart: {
      file: createReadStream(filePath),
    },
  });

  expect(response.status()).toBe(201);

  const body = (await response.json()) as {
    message: string;
    file: {
      filename: string;
      originalName: string;
      size: number;
      mimetype: string;
    };
  };

  expect(body.message).toContain('uploaded successfully');
  expect(body.file.originalName).toBe('examples-excel.xlsx');
  expect(body.file.filename).toMatch(/\.xlsx$/);
  expect(body.file.size).toBeGreaterThan(0);
});
