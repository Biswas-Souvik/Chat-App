import { postToConnection, getConnectionInfo } from '../src/utils/websocket';

import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  GetConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import { mockClient } from 'aws-sdk-client-mock';

const apiGwMock = mockClient(ApiGatewayManagementApiClient);

beforeEach(() => {
  apiGwMock.reset();
});

describe('API Gateway WebSocket helpers', () => {
  const endpoint = 'https://abc123.execute-api.ap-south-1.amazonaws.com/prod';

  describe('postToConnection', () => {
    it('should post data to a websocket connection', async () => {
      apiGwMock.on(PostToConnectionCommand).resolves({});

      await postToConnection(endpoint, 'conn-123', 'hello');

      expect(apiGwMock).toHaveReceivedCommand(PostToConnectionCommand);
      expect(apiGwMock).toHaveReceivedCommandWith(PostToConnectionCommand, {
        ConnectionId: 'conn-123',
        Data: 'hello',
      });
    });
  });

  describe('getConnectionInfo', () => {
    it('should fetch connection info', async () => {
      apiGwMock.on(GetConnectionCommand).resolves({
        Identity: {
          SourceIp: '1.2.3.4',
        } as any,
      });

      const result = await getConnectionInfo(endpoint, 'conn-123');

      expect(result).toEqual(
        expect.objectContaining({
          Identity: {
            SourceIp: '1.2.3.4',
          },
        }),
      );

      expect(apiGwMock).toHaveReceivedCommand(GetConnectionCommand);
      expect(apiGwMock).toHaveReceivedCommandWith(GetConnectionCommand, {
        ConnectionId: 'conn-123',
      });
    });
  });
});
