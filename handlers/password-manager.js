const express = require('express');
const Router = express.Router();
const token = require('../utils/token');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODBDEV_URL;
const passwordUtils = require('../utils/utils');
const DB_NAME = 'password-shell';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const Authenticate = async (req, res, next) => {
  const { cookies } = req;
  if (Object.keys(cookies).length === 0) {
    return res.status(403).send('Forbidden');
  }
  const reqJwt = cookies.token;
  try {
    const details = await token.verifyToken(reqJwt);
    if (details) {
      req.body.email = details.email;
      next();
    } else {
      res.status(403).send('FORBIDDEN');
    }
  } catch (error) {
    res.status(403).send('FORBIDDEN');
  }
};

Router.get('/', Authenticate, async (req, res) => {
  const email = req.body.email;
  try {
    await client.connect();
    const collection = client.db(DB_NAME).collection('vault');
    console.log(email);
    const passwordCollections = await collection.find({ indexField: email });
    console.log(passwordCollections);
    res.send(passwordCollections);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something wrong, please try again');
  }
});

Router.post('/', async (req, res) => {
  const indexField = req.body.useremail;
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;
  const notes = req.body.notes;
  try {
    await client.connect();
    const collection = client.db(DB_NAME).collection('vault');
    const hashedPassword = await passwordUtils.hashPassword(password);
    const newDocument = {
      indexField: indexField,
      username: username,
      email: email,
      password: hashedPassword,
      notes: notes,
    };
    await collection.insertOne(newDocument);
    res.send('Password saved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something wrong, please try again');
  }
});
Router.put('/', async (req, res) => {
  res.send('This endpoint is to update password');
});
Router.delete('/', async (req, res) => {
  res.send('This endpoint is to delete password');
});
module.exports = Router;
