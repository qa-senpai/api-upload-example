import test, { expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('download excel, should be 200', async ({ request }) => {
  const fileId = '8a914436-99de-402b-8123-52746af4a1df.xlsx';
  const response = await request.get(`/api/excel/download/${fileId}`, {
    failOnStatusCode: true,
  });

  const headers = response.headers();

  expect(headers['content-type']).toBe(
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );

  expect(headers['content-disposition']).toContain(
    `attachment; filename="8a914436-99de-402b-8123-52746af4a1df.xlsx"`,
  );

  const body = await response.body();

  const buffer = Buffer.from(body);
  expect(buffer.byteLength).toBe(5347);
});
