import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  GetConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';

const getClient = (endpoint: string) =>
  new ApiGatewayManagementApiClient({ endpoint });

export const postToConnection = (
  endpoint: string,
  connectionId: string,
  data: string
) =>
  getClient(endpoint).send(
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: data,
    })
  );

export const getConnectionInfo = (endpoint: string, connectionId: string) =>
  getClient(endpoint).send(
    new GetConnectionCommand({ ConnectionId: connectionId })
  );
