import { getConnectionInfo, postToConnection } from '../utils/websocket';

export const handler = async (event: any) => {
  try {
    console.log(JSON.stringify(event, null, 2));
    const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
    const connectionId = event.requestContext.connectionId;

    const info = await getConnectionInfo(endpoint, connectionId);

    await postToConnection(endpoint, connectionId, JSON.stringify(info));

    return { statusCode: 200 };
  } catch (err) {
    console.error((err as Error).message);
  }
};
