const express = require('express');
const Router = express.Router();
const token = require('../utils/token');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URL;
const passwordUtils = require('../utils/utils');
const DB_NAME = 'password-shell';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

Router.post('/', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    await client.connect();
    const collection = client.db(DB_NAME).collection('users');
    const resp = await collection.findOne({ email: email });
    if (
      resp &&
      (await passwordUtils.comparePassword(password, resp.password))
    ) {
      // Generate jwt token
      const jwt = token.generateToken({ name: 'Pampapathi', age: 29 });
      res.send({ jwt });
    } else {
      res.status(401).send('Invalid credentials');
    }
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('SERVER ERROR');
  }
});

Router.post('/signup', async (req, res) => {
  const password = req.body.password;
  try {
    const hashedPassword = await passwordUtils.hashPassword(password);
    const userData = {
      email: req.body.email,
      password: hashedPassword,
      OTP: null,
    };

    await client.connect();
    const collection = client.db(DB_NAME).collection('users');
    await collection.insertOne(userData);
    res.status(200).send({
      message: 'User created succesfully',
      userData,
    });

    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

Router.get('/auth', (req, res) => {
  const jwt = token.generateToken({ name: 'Pampapathi', age: 29 });
  res.send({ jwt });
});
module.exports = Router;
