const express = require('express');
const authRouter = express.Router();

authRouter.post('/signup', (req, res) => {
  res.status(200).json({
    result: 'Signup Will Appear Here Soon'
  });
});

authRouter.post('/login', (req, res) => {
  res.status(200).json({
    result: 'Login will appear here soon'
  });
});

authRouter.post('/googlelogin', (req, res) => {
  res.status(200).json({
    result: 'Login with google will appear here soon'
  });
});

authRouter.post('/linkedinlogin', (req, res) => {
  res.status(200).json({
    result: 'Login with linkedIN will appear here soon'
  });
});

module.exports = authRouter;
