const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

const allowedOrigins = [
    'https://legalresearch.vercel.app',
    'http://localhost:3001'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Workspace-API-Key'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

app.use(express.json());

// Middleware to log the headers for debugging
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  res.on('finish', () => {
    console.log('Response Headers:', res.getHeaders());
  });
  next();
});

const API_KEY = '11eee940-b39f-3bc0-b1e0-edab9493f797';
const BASE_URL = 'https://retune.so/api/chat';

app.get('/', (req, res) => {
  res.send('Welcome to the API Gateway!');
});

app.post('/api/new-thread', async (req, res) => {
  try {
    const response = await axios.post(`${BASE_URL}/11eee940-df2f-6cb0-bb38-d5792b1045ea/new-thread`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'X-Workspace-API-Key': API_KEY
      }
    });
    console.log('Response Headers (new-thread):', response.headers);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.post('/api/response', async (req, res) => {
  const { threadId, input } = req.body;
  try {
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}/11eee940-df2f-6cb0-bb38-d5792b1045ea/response`,
      data: { threadId, input },
      headers: {
        'Content-Type': 'application/json',
        'X-Workspace-API-Key': API_KEY
      },
      responseType: 'stream' // Enable streaming
    });

    response.data.on('data', (chunk) => {
      const json = JSON.parse(chunk.toString());
      const value = json.response.value;
      res.write(value);
    });

    response.data.on('end', () => {
      res.end();
    });

  } catch (error) {
    console.error('Error in /api/response:', error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Handle any errors and log them
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
