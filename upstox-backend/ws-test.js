const WebSocket = require('ws');

const accessToken =
  'eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI1WUFKN0ciLCJqdGkiOiI2ODU1MDQzOGM5ZjI1ODM5NzVmYzU2NmIiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6dHJ1ZSwiaWF0IjoxNzUwNDAyMTA0LCJpc3MiOiJ1ZGFwaS1nYXRld2F5LXNlcnZpY2UiLCJleHAiOjE3NTA0NTY4MDB9.m7FlNONiX6eEQD4Cl9LoasWoRffGXN-KMcF618C1iWI';

const ws = new WebSocket('wss://api.upstox.com/v2/feed/market-data', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

ws.on('open', () => {
  // Subscribe to a symbol (e.g., Reliance)
  ws.send(
    JSON.stringify({
      guid: 'some-unique-guid',
      method: 'sub',
      data: {
        mode: 'full',
        instrumentKeys: ['NSE_EQ|INE002A01018'], // Reliance
      },
    })
  );
});

ws.on('message', (data) => {
  console.log('Received:', data.toString());
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});

ws.on('close', () => {
  console.log('WebSocket closed');
});
