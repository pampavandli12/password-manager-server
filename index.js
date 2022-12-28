const express = require('express');
const encryption = require('./utils/crypto');
const cookieParser = require('cookie-parser');
const login = require('./handlers/login');
const vault = require('./handlers/password-manager');

// Load .env variables
require('dotenv').config();
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public')); // Serves resources from public folder
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  })
);
const port = process.env.PORT || 3000;

app.use('/login', login);
app.use('/vault', vault);
app.listen(port, () => console.log(`This app is running at ${port}`));
