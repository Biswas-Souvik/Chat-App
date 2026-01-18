import { handler } from '../src/lambdas/default';
import { getConnectionInfo, postToConnection } from '../src/utils/websocket';
import { getResponse } from '../src/utils/lambda';

jest.mock('../src/utils/websocket', () => ({
  getConnectionInfo: jest.fn(),
  postToConnection: jest.fn(),
}));

jest.mock('../src/utils/lambda', () => ({
  getResponse: jest.fn(),
}));

describe('default-message handler', () => {
  const mockEvent = {
    requestContext: {
      domainName: 'abc123.execute-api.ap-south-1.amazonaws.com',
      stage: 'test',
      connectionId: 'conn-123',
    },
  };

  const endpoint = 'https://abc123.execute-api.ap-south-1.amazonaws.com/test';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch connection info, post it back, and return success', async () => {
    const mockInfo = { some: 'info' };

    (getConnectionInfo as jest.Mock).mockResolvedValue(mockInfo);
    (postToConnection as jest.Mock).mockResolvedValue(undefined);
    (getResponse as jest.Mock).mockReturnValue({ statusCode: 200 });

    const result = await handler(mockEvent);

    expect(getConnectionInfo).toHaveBeenCalledWith(endpoint, 'conn-123');

    expect(postToConnection).toHaveBeenCalledWith(
      endpoint,
      'conn-123',
      JSON.stringify(mockInfo),
    );

    expect(getResponse).toHaveBeenCalledWith();
    expect(result).toEqual({ statusCode: 200 });
  });

  it('should return 500 if any step fails', async () => {
    (getConnectionInfo as jest.Mock).mockRejectedValue(
      new Error('WebSocket error'),
    );
    (getResponse as jest.Mock).mockReturnValue({ statusCode: 500 });

    const result = await handler(mockEvent);

    expect(getResponse).toHaveBeenCalledWith(500);
    expect(result).toEqual({ statusCode: 500 });
  });
});
