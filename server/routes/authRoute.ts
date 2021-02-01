const express = require('express');
const authRouter = express.Router();
const axios = require('axios');

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
  const { access_token } = req.body;
  let auth = 'Bearer ' + access_token;
  axios
    .get('https://api.linkedin.com/v2/me', {
      method: 'GET',
      headers: { Connection: 'Keep-Alive', Authorization: auth }
    })
    .then(async (usr) => {
      console.log(usr);
      res.status(200).json({
        result: 'Success'
      });
    });
});

module.exports = authRouter;
