import { getConnectionInfo, postToConnection } from '../utils/websocket';
import { getResponse } from '../utils/lambda';

export const handler = async (event: any) => {
  try {
    console.log(JSON.stringify(event, null, 2));
    const endpoint = `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
    const connectionId = event.requestContext.connectionId;

    const info = await getConnectionInfo(endpoint, connectionId);

    await postToConnection(endpoint, connectionId, JSON.stringify(info));

    return getResponse();
  } catch (err) {
    console.error((err as Error).message);
    return getResponse(500);
  }
};
