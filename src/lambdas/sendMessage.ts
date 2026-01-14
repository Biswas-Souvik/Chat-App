import { scanConnections } from '../utils/dynamodb';
import { postToConnection } from '../utils/websocket';

export const handler = async (event: any) => {
  try {
    console.log(JSON.stringify(event, null, 2));
    const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
    const message = JSON.parse(event.body).message;

    const connections = await scanConnections();

    await Promise.all(
      connections.map(({ connectionId }: any) =>
        connectionId !== event.requestContext.connectionId
          ? postToConnection(endpoint, connectionId, message)
          : Promise.resolve()
      )
    );

    return { statusCode: 200 };
  } catch (err) {
    console.error(err);
    return { statusCode: 500 };
  }
};
