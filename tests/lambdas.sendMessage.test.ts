import { handler } from '../src/lambdas/sendMessage';
import { scanConnections } from '../src/utils/dynamodb';
import { postToConnection } from '../src/utils/websocket';
import { getResponse } from '../src/utils/lambda';

jest.mock('../src/utils/dynamodb', () => ({
  scanConnections: jest.fn(),
}));

jest.mock('../src/utils/websocket', () => ({
  postToConnection: jest.fn(),
}));

jest.mock('../src/utils/lambda', () => ({
  getResponse: jest.fn(),
}));

describe('broadcast-message handler', () => {
  const mockEvent = {
    requestContext: {
      domainName: 'abc123.execute-api.ap-south-1.amazonaws.com',
      stage: 'test',
      connectionId: 'conn-self',
    },
    body: JSON.stringify({ message: 'hello all' }),
  };

  const endpoint = 'https://abc123.execute-api.ap-south-1.amazonaws.com/test';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send message to all connections except the sender', async () => {
    (scanConnections as jest.Mock).mockResolvedValue([
      { connectionId: 'conn-self' },
      { connectionId: 'conn-1' },
      { connectionId: 'conn-2' },
    ]);

    (postToConnection as jest.Mock).mockResolvedValue(undefined);
    (getResponse as jest.Mock).mockReturnValue({ statusCode: 200 });

    const result = await handler(mockEvent);

    expect(scanConnections).toHaveBeenCalled();

    expect(postToConnection).toHaveBeenCalledTimes(2);
    expect(postToConnection).toHaveBeenCalledWith(
      endpoint,
      'conn-1',
      'hello all',
    );
    expect(postToConnection).toHaveBeenCalledWith(
      endpoint,
      'conn-2',
      'hello all',
    );

    expect(getResponse).toHaveBeenCalledWith();
    expect(result).toEqual({ statusCode: 200 });
  });

  it('should return 500 if scanning connections fails', async () => {
    (scanConnections as jest.Mock).mockRejectedValue(
      new Error('DynamoDB scan failed'),
    );
    (getResponse as jest.Mock).mockReturnValue({ statusCode: 500 });

    const result = await handler(mockEvent);

    expect(getResponse).toHaveBeenCalledWith(500);
    expect(result).toEqual({ statusCode: 500 });
  });

  it('should return 500 if posting to any connection fails', async () => {
    (scanConnections as jest.Mock).mockResolvedValue([
      { connectionId: 'conn-1' },
    ]);

    (postToConnection as jest.Mock).mockRejectedValue(
      new Error('WebSocket send failed'),
    );
    (getResponse as jest.Mock).mockReturnValue({ statusCode: 500 });

    const result = await handler(mockEvent);

    expect(postToConnection).toHaveBeenCalled();
    expect(getResponse).toHaveBeenCalledWith(500);
    expect(result).toEqual({ statusCode: 500 });
  });
});
