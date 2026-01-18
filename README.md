# WebSocket API – Usage Guide

This project exposes an **API Gateway WebSocket API** backed by AWS Lambda and DynamoDB.
You can test it locally using **wscat**.

---

## Prerequisites

- Node.js installed
- `wscat` installed globally

```bash
npm install -g wscat
```

---

## 1. Get the WebSocket URL

After deploying the SAM stack, note the output:
Example:

```text
wss://abcd1234.execute-api.ap-south-1.amazonaws.com/test
```

---

## 2. Connect to the WebSocket

Use `wscat` to open a connection:

```bash
wscat -c wss://<api-id>.execute-api.<region>.amazonaws.com/test
```

On success, you should see:

```text
connected (press CTRL+C to quit)
```

This triggers the **`$connect`** route
The connection ID is stored in DynamoDB

---

## 3. Send a Message

This WebSocket API uses the following route selection expression:

```yaml
RouteSelectionExpression: $request.body.action
```

So every message **must include an `action` field**.

### Example: Send a broadcast message

Paste this JSON into the `wscat` prompt:

```json
{ "action": "sendMessage", "message": "Hello, World! I am Souvik" }
```

Triggers the **`sendMessage`** route
Message is broadcast to all connected clients except the sender

---

## 4. Test With Multiple Clients

Open another terminal and connect again:

```bash
wscat -c wss://<api-id>.execute-api.<region>.amazonaws.com/test
```

Send a message from one terminal — it should appear in the other.

---

## 5. Default Route

If you send a message **without** a valid `action`:

```json
{
  "foo": "bar"
}
```

The **`$default`** route is invoked
The default Lambda responds with connection info

---

## 6. Disconnect

To disconnect, simply close the client:

```text
CTRL + C
```

Triggers the **`$disconnect`** route
The connection is removed from DynamoDB

---

## Notes

- All WebSocket messages must be valid JSON
- `action` must match `sendMessage` exactly

---
