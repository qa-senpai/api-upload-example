import { expect, test } from '@playwright/test';

test('submits a URL-encoded form and returns a stored record', async ({
  request,
}) => {
  const response = await request.post('/api/form', {
    form: {
      name: 'Alice',
      age: '30',
      email: 'alice@example.com',
    },
  });

  expect(response.status()).toBe(201);

  const body = (await response.json()) as {
    id: string;
    data: Record<string, string>;
    createdAt: string;
  };

  expect(body.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  );
  expect(body.data.name).toBe('Alice');
  expect(body.data.age).toBe('30');
  expect(body.data.email).toBe('alice@example.com');
  expect(typeof body.createdAt).toBe('string');
});
