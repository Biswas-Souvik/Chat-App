import { putConnection } from '../utils/dynamodb';

export const handler = async (event: any) => {
  try {
    console.log(JSON.stringify(event, null, 2));
    await putConnection(event.requestContext.connectionId);
    return { statusCode: 200 };
  } catch (err) {
    console.error(err);
    return { statusCode: 500 };
  }
};
