import { getEnv } from '../utils/lambda';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

const TABLE_NAME = getEnv('TABLE_NAME');

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const putConnection = (connectionId: string) =>
  docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { connectionId },
    }),
  );

export const deleteConnection = (connectionId: string) =>
  docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { connectionId },
    }),
  );

export const scanConnections = async () => {
  const result = await docClient.send(
    new ScanCommand({ TableName: TABLE_NAME }),
  );
  return result.Items ?? [];
};
