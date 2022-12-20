const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'husdhfbwhivbiwvbsd';

const generateToken = (payload) => {
  return jwt.sign(payload, PRIVATE_KEY, { expiresIn: '1h' });
};
const verifyToken = (token) => {
  return jwt.verify(token, PRIVATE_KEY);
};
module.exports = { generateToken, verifyToken };
