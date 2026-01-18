process.env.SOME_SECRET = 'some-secret';

import { getResponse, getEnv } from '../src/utils/lambda';

describe('getResponse', () => {
  it('returns response with default statusCode 200', () => {
    const result = getResponse();
    expect(result).toEqual({ statusCode: 200 });
  });

  it('returns response with provided statusCode', () => {
    const result = getResponse(404);
    expect(result).toEqual({ statusCode: 404 });
  });
});

describe('getEnv', () => {
  it('gives env if exists', () => {
    const SOME_SECRET = getEnv('SOME_SECRET');

    expect(SOME_SECRET).toEqual('some-secret');
  });

  it('throws error for undefined keys', () => {
    expect(() => getEnv('UNDEFINED_KEY')).toThrow(`UNDEFINED_KEY is required`);
  });
});
