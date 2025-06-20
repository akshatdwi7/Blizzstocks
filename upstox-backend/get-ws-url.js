const axios = require('axios');

const accessToken =
  'eyJ0eXAiOiJKV1QiLCJrZXlfaWQiOiJza192MS4wIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiI1WUFKN0ciLCJqdGkiOiI2ODU1MDQzOGM5ZjI1ODM5NzVmYzU2NmIiLCJpc011bHRpQ2xpZW50IjpmYWxzZSwiaXNQbHVzUGxhbiI6dHJ1ZSwiaWF0IjoxNzUwNDAyMTA0LCJpc3MiOiJ1ZGFwaS1nYXRld2F5LXNlcnZpY2UiLCJleHAiOjE3NTA0NTY4MDB9.m7FlNONiX6eEQD4Cl9LoasWoRffGXN-KMcF618C1iWI';

async function getWsUrl() {
  try {
    const response = await axios.get(
      'https://api.upstox.com/v2/feed/portfolio-stream-feed/authorize',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );
    console.log('WebSocket URL:', response.data.data.authorized_redirect_uri);
  } catch (err) {
    console.error(
      'Error fetching WebSocket URL:',
      err.response ? err.response.data : err.message
    );
  }
}

getWsUrl();
