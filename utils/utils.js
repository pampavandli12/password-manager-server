const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');

/* =============== HASH PASSWORD ======================== */
const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};
/* ================ COMPARE PASSWORD =================== */
const comparePassword = (password, hashedpassword) => {
  return bcrypt.compare(password, hashedpassword);
};

var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});

const sendPasswordToEmail = (email, otp, cb) => {
  var mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: 'OTP for your password reset',
    html: `<p>Hi, <br />
     You requested to reset your password, 
     this is the OTP for password reset: <b>${otp}</b>.<br />
     Please verify otp to complete the process.<br />
     This OTP will be valid for 30 minutes.</p>
     <div>Regards</div>
     <div>ShopNow</div>`,
  };
  transporter.sendMail(mailOptions, cb);
};

module.exports = { hashPassword, comparePassword, sendPasswordToEmail };
