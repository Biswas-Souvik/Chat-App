process.env.TABLE_NAME = 'ConnectionsTable';

import {
  putConnection,
  deleteConnection,
  scanConnections,
} from '../src/utils/dynamodb';

import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

describe('DynamoDB connection repository', () => {
  describe('putConnection', () => {
    it('should put a connection into DynamoDB', async () => {
      ddbMock.on(PutCommand).resolves({});

      await putConnection('conn-123');

      expect(ddbMock).toHaveReceivedCommand(PutCommand);
      expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
        TableName: 'ConnectionsTable',
        Item: { connectionId: 'conn-123' },
      });
    });
  });

  describe('deleteConnection', () => {
    it('should delete a connection from DynamoDB', async () => {
      ddbMock.on(DeleteCommand).resolves({});

      await deleteConnection('conn-123');

      expect(ddbMock).toHaveReceivedCommand(DeleteCommand);
      expect(ddbMock).toHaveReceivedCommandWith(DeleteCommand, {
        TableName: 'ConnectionsTable',
        Key: { connectionId: 'conn-123' },
      });
    });
  });

  describe('scanConnections', () => {
    it('should return items when scan has results', async () => {
      ddbMock.on(ScanCommand).resolves({
        Items: [{ connectionId: 'conn-1' }, { connectionId: 'conn-2' }],
      });

      const result = await scanConnections();

      expect(result).toEqual([
        { connectionId: 'conn-1' },
        { connectionId: 'conn-2' },
      ]);

      expect(ddbMock).toHaveReceivedCommand(ScanCommand);
      expect(ddbMock).toHaveReceivedCommandWith(ScanCommand, {
        TableName: 'ConnectionsTable',
      });
    });

    it('should return empty array when scan returns no items', async () => {
      ddbMock.on(ScanCommand).resolves({});

      const result = await scanConnections();

      expect(result).toEqual([]);
    });
  });
});
