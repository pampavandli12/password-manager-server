const crypto = require('crypto-js');
require('dotenv').config();

// Encrypte the data
const encriptPassword = (password) => {
  return crypto.AES.encrypt(password, process.env.CRYPTO_SECRET_KEY).toString();
};

// Decrypting the data
const decryptPassword = (encrypted) => {
  return crypto.AES.decrypt(encrypted, process.env.CRYPTO_SECRET_KEY).toString(
    crypto.enc.Utf8
  );
};

exports.decryptPassword = decryptPassword;

exports.encriptPassword = encriptPassword;
