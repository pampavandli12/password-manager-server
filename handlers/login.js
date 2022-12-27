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
      const jwt = token.generateToken({ email, username: resp.username });
      res.cookie('token', jwt, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        expires: new Date(Date.now() + 14400000),
      });
      res.send('SUCESS');
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
  const username = req.body.username;
  const email = req.body.email;
  try {
    // First find if user is already exist
    await client.connect();
    const collection = client.db(DB_NAME).collection('users');
    const response = await collection.findOne({ email: email });
    // If user exist, then send user exist message
    if (response) {
      res.send('User already exist, please login');
    } else {
      // If user does not exist, then create new user data
      const hashedPassword = await passwordUtils.hashPassword(password);
      const userData = {
        username: username,
        email: email,
        password: hashedPassword,
        OTP: null,
      };
      res.status(200).send({
        message: 'User created succesfully',
        userData,
      });
    }
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Something wrong, please try again later');
  }
});

Router.post('/getotp', async (req, res) => {
  //Check if email exist
  const email = req.body.email;
  try {
    await client.connect();
    const collection = client.db(DB_NAME).collection('users');
    const response = await collection.findOne({ email: email });
    if (response) {
      let OTP = Math.floor(100000 + Math.random() * 900000);
      passwordUtils.sendPasswordToEmail(req.body.email, OTP, (err, info) => {
        if (err) {
          res.status(500).send('Email is not valid');
        } else {
          res
            .status(200)
            .send('OTP send successfully, OTP will be valid till 30 minutes');
          setTimeout(async () => {
            await collection.updateOne(
              { email: email },
              { $set: { OTP: null } }
            );
          }, 3000000);
        }
      });
      await collection.updateOne({ email: email }, { $set: { OTP: OTP } });
    } else {
      res.send('This email does not exist, please try signup');
    }
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Something wrong, please try again');
  }
});

Router.post('/resetpassword', async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const password = req.body.password;
  try {
    await client.connect();
    const collection = client.db(DB_NAME).collection('users');
    const response = await collection.findOne({
      email: email,
      OTP: Number(otp),
    });
    if (response) {
      const hashedPassword = await passwordUtils.hashPassword(password);
      await collection.updateOne(
        { email: email },
        {
          $set: {
            password: hashedPassword,
            OTP: null,
          },
        }
      );
      res.send('Password has successfully changed, please try login');
    } else {
      res.send('Invalid OTP, please enter again');
    }
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).send('Something wrong, please try again');
  }
});
Router.get('/whoami', async (req, res) => {
  const { cookies } = req;
  if (Object.keys(cookies).length === 0) {
    return res.status(403).send('Forbidden');
  }
  const reqJwt = cookies.token;
  try {
    const details = await token.verifyToken(reqJwt);
    if (details) {
      res.status(200).send(details);
    } else {
      res.status(403).send('FORBIDDEN');
    }
  } catch (error) {
    res.status(403).send('FORBIDDEN');
  }
});
module.exports = Router;
