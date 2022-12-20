const jwt = require('jsonwebtoken');
const PRIVATE_KEY = process.env.JWT_SECRETE_KEY;

const generateToken = (payload) => {
  return jwt.sign(payload, PRIVATE_KEY, { expiresIn: '1d' });
};
const verifyToken = (token) => {
  return jwt.verify(token, PRIVATE_KEY);
};
module.exports = { generateToken, verifyToken };
