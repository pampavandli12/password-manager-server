const bcrypt = require('bcrypt');

/* =============== HASH PASSWORD ======================== */
const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};
/* ================ COMPARE PASSWORD =================== */
const comparePassword = (password, hashedpassword) => {
  return bcrypt.compare(password, hashedpassword);
};

module.exports = { hashPassword, comparePassword };
