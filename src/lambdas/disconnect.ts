import { deleteConnection } from '../utils/dynamodb';
import { getResponse } from '../utils/lambda';

export const handler = async (event: any) => {
  try {
    console.log(JSON.stringify(event, null, 2));
    await deleteConnection(event.requestContext.connectionId);

    return getResponse();
  } catch (err) {
    console.error(err);
    return getResponse(500);
  }
};
