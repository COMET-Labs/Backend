import express from 'express';
import axios from 'axios';
import UserToken from '../models/userToken';
import * as middleware from '../middleware/auth';
import * as tokenUtils from '../utils/token';

const authRouter = express.Router();

authRouter.post('/signup', (req, res) => {
  res.status(200).json({
    result: 'Signup Will Appear Here Soon'
  });
});

authRouter.post('/login', async (req, res) => {
  let accessToken = await tokenUtils.signAccessToken(123456);
  let refreshToken = await tokenUtils.signRefreshToken(123456);
  UserToken.create({
    user: 123456,
    refreshToken: refreshToken
  });
  res.status(200).json({
    result: 'Login will appear here soon',
    accessToken: accessToken,
    refreshToken: refreshToken
  });
});

authRouter.post('/dashboard', middleware.verifyAccessToken, async (req, res) => {
  res.status(200).json({
    result: 'Logged In'
  });
});

authRouter.post('/googlelogin', (req, res) => {
  res.status(200).json({
    result: 'Login with google will appear here soon'
  });
});

authRouter.post('/linkedinlogin', async (req, res) => {
  const { access_token } = req.body;
  let auth = 'Bearer ' + access_token;
  try {
    let user = await axios.get('https://api.linkedin.com/v2/me', {
      method: 'GET',
      headers: { Connection: 'Keep-Alive', Authorization: auth }
    });
    let userEmail = await axios.get(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      {
        method: 'GET',
        headers: { Connection: 'Keep-Alive', Authorization: auth }
      }
    );
    console.log(user.data);
    console.log(userEmail.data.elements[0]);
    // User.findOne({})
    res.status(200).json({
      result: 'Success'
    });
  } catch (err) {
    res.status(401).json({
      result: err
    });
  }
});

module.exports = authRouter;
