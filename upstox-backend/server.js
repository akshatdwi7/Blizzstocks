const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Welcome</h1><a href="/auth/upstox">Login with Upstox</a>');
});

const { UPSTOX_CLIENT_ID, UPSTOX_CLIENT_SECRET, REDIRECT_URI } = process.env;

// Step 1: Redirect user to Upstox login
app.get('/auth/upstox', (req, res) => {
  const url = `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${UPSTOX_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(url);
});

// Step 2: Handle callback and exchange code for access token
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = new URLSearchParams({
      code,
      client_id: UPSTOX_CLIENT_ID,
      client_secret: UPSTOX_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const response = await axios.post(
      'https://api.upstox.com/v2/login/authorization/token',
      data,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    );

    // Save access_token securely (for demo, just send it)
    res.json(response.data);
  } catch (err) {
    console.error(
      'Error getting access token:',
      err.response ? err.response.data : err.message
    );
    res
      .status(err.response ? err.response.status : 500)
      .json({ error: err.response ? err.response.data : err.message });
  }
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
