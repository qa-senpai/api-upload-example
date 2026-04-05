import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

// Minimal bytes are enough for this API because validation is MIME-based.
const plainTextBuffer = Buffer.from('not-an-excel-file');

test.describe('Excel upload API', () => {
  test('uploads an Excel file successfully', async ({ request }) => {
    const excelBuffer = await readFile('./fixtures/examples excel.xlsx');

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
    expect(body.file.originalName).toBe('report.xlsx');
    expect(body.file.mimetype).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    expect(body.file.filename).toMatch(/\.xlsx$/);
    expect(typeof body.file.size).toBe('number');
    expect(body.file.size).toBeGreaterThan(0);
  });

  test('rejects non-Excel MIME type', async ({ request }) => {
    const response = await request.post('/api/excel/upload', {
      multipart: {
        file: {
          name: 'notes.txt',
          mimeType: 'text/plain',
          buffer: plainTextBuffer,
        },
      },
    });

    expect(response.status()).toBe(400);

    const body = (await response.json()) as {
      error: { code: string; message: string };
    };

    expect(body.error.code).toBe('INVALID_FILE_TYPE');
  });

  test('downloads uploaded Excel file by filename', async ({ request }) => {
    const uploadResponse = await request.post('/api/excel/upload', {
      multipart: {
        file: {
          name: 'download-check.xlsx',
          mimeType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          buffer: fakeXlsxBuffer,
        },
      },
    });

    expect(uploadResponse.status()).toBe(201);

    const uploadBody = (await uploadResponse.json()) as {
      file: { filename: string };
    };

    const downloadResponse = await request.get(
      `/api/excel/download/${uploadBody.file.filename}`,
    );

    expect(downloadResponse.status()).toBe(200);
    const disposition = downloadResponse.headers()['content-disposition'] || '';
    expect(disposition).toContain('attachment');

    const downloaded = await downloadResponse.body();
    expect(downloaded.length).toBeGreaterThan(0);
  });
});
