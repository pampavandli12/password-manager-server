const express = require('express');
const Router = express.Router();

Router.post('/', async (req, res) => {
  res.send('This endpoint is to create new password');
});
Router.put('/', async (req, res) => {
  res.send('This endpoint is to update password');
});
Router.delete('/', async (req, res) => {
  res.send('This endpoint is to delete password');
});
module.exports = Router;
