const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: ['https://trade-ideas-beryl.vercel.app', 'http://localhost:3000'], // Add any other allowed origins here
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

const API_KEY = '11eee940-b39f-3bc0-b1e0-edab9493f797';
const BASE_URL = 'https://retune.so/api/chat';

// Welcome route to test the backend URL
app.get('/', (req, res) => {
  res.send('Welcome to the API Gateway!');
});

// Endpoint to create a new thread
app.post('/api/new-thread', async (req, res) => {
  try {
    const response = await axios.post(`${BASE_URL}/11eee940-df2f-6cb0-bb38-d5792b1045ea/new-thread`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'X-Workspace-API-Key': API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Endpoint to continue a conversation in a thread
app.post('/api/response', async (req, res) => {
  const { threadId, input } = req.body;
  try {
    const response = await axios.post(`${BASE_URL}/11eee940-df2f-6cb0-bb38-d5792b1045ea/response`, { threadId, input }, {
      headers: {
        'Content-Type': 'application/json',
        'X-Workspace-API-Key': API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

module.exports = app;
