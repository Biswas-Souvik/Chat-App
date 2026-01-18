import { handler } from '../src/lambdas/disconnect';
import { deleteConnection } from '../src/utils/dynamodb';
import { getResponse } from '../src/utils/lambda';

jest.mock('../src/utils/dynamodb', () => ({
  deleteConnection: jest.fn(),
}));

jest.mock('../src/utils/lambda', () => ({
  getResponse: jest.fn(),
}));

describe('disconnect handler', () => {
  const mockEvent = {
    requestContext: {
      connectionId: 'conn-123',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete connection and return success response', async () => {
    (deleteConnection as jest.Mock).mockResolvedValue(undefined);
    (getResponse as jest.Mock).mockReturnValue({ statusCode: 200 });

    const result = await handler(mockEvent);

    expect(deleteConnection).toHaveBeenCalledWith('conn-123');
    expect(getResponse).toHaveBeenCalledWith();
    expect(result).toEqual({ statusCode: 200 });
  });

  it('should return 500 response if deleteConnection fails', async () => {
    (deleteConnection as jest.Mock).mockRejectedValue(
      new Error('DynamoDB error'),
    );
    (getResponse as jest.Mock).mockReturnValue({ statusCode: 500 });

    const result = await handler(mockEvent);

    expect(deleteConnection).toHaveBeenCalledWith('conn-123');
    expect(getResponse).toHaveBeenCalledWith(500);
    expect(result).toEqual({ statusCode: 500 });
  });
});
