import { scanConnections } from '../utils/dynamodb';
import { getResponse } from '../utils/lambda';
import { postToConnection } from '../utils/websocket';

export const handler = async (event: any) => {
  try {
    console.log(JSON.stringify(event, null, 2));
    const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
    const message = JSON.parse(event.body).message;

    const connections = await scanConnections();

    await Promise.all(
      connections.map(({ connectionId }: any) =>
        connectionId === event.requestContext.connectionId
          ? Promise.resolve()
          : postToConnection(endpoint, connectionId, message),
      ),
    );

    return getResponse();
  } catch (err) {
    console.error(err);
    return getResponse(500);
  }
};
