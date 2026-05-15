import handler from '@/src/pages/api/hello';

function createMockRes() {
  let statusCode = 200;
  let jsonData: unknown;

  return {
    status: vi.fn((code: number) => {
      statusCode = code;
      return {
        json: vi.fn((data: unknown) => { jsonData = data; }),
      };
    }),
    getStatusCode: () => statusCode,
    getJsonData: () => jsonData,
  };
}

describe('hello API handler', () => {
  it('returns 200 with name John Doe', async () => {
    const req = {} as any;
    const res = createMockRes() as any;

    await handler(req, res);

    expect(res.getStatusCode()).toBe(200);
    expect(res.getJsonData()).toEqual({ name: 'John Doe' });
  });
});
