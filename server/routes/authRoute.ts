import express from 'express';
import axios from 'axios';
import UserToken from '../models/userToken';
import User from '../models/users';
import * as middleware from '../middleware/auth';
import * as tokenUtils from '../utils/token';
import handleError from '../middleware/errorHandler';

const authRouter = express.Router();

authRouter.post(
  '/signup',
  (req, res, next) => {
    User.findOne({ email: { personal: req.body.email } }).exec(async (err, user) => {
      if (err) {
        next({ status: 401 });
      }
      if (user !== null) {
        next({ status: 401, message: 'You already have an account. Kindly Login' });
      } else {
        console.log(req.body);
        User.create({
          fullName: `${req.body.firstName} ${req.body.lastName}`,
          password: req.body.password,
          email: { personal: req.body.email }
        })
          .then((user) => {
            res.status(200).json({
              user: user
            });
          })
          .catch((err) => {
            next({ status: 401, message: 'You already have an account. Kindly Login' });
          });
      }
    });
  },
  handleError
);

// authRouter.post('/login', async (req, res) => {
//   let accessToken = await tokenUtils.signAccessToken(123456);
//   let refreshToken = await tokenUtils.signRefreshToken(123456);
//   UserToken.create({
//     user: 123456,
//     refreshToken: refreshToken
//   });
//   res.status(200).json({
//     result: 'Login will appear here soon',
//     accessToken: accessToken,
//     refreshToken: refreshToken
//   });
// },handleError);

authRouter.post(
  '/dashboard',
  middleware.verifyAccessToken,
  async (req, res) => {
    res.status(200).json({
      result: 'Logged In'
    });
  },
  handleError
);

authRouter.post(
  '/googlelogin',
  (req, res) => {
    res.status(200).json({
      result: 'Login with google will appear here soon'
    });
  },
  handleError
);

authRouter.post(
  '/linkedinlogin',
  async (req, res, next) => {
    const { access_token } = req.body;
    console.log(access_token);
    let auth = 'Bearer ' + access_token;
    try {
      let userData = await axios.get('https://api.linkedin.com/v2/me', {
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
      // let ex = await axios.get(
      //   'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))',
      //   {
      //     method: 'GET',
      //     headers: { Connection: 'Keep-Alive', Authorization: auth }
      //   }
      // );
      // console.log(ex.data);
      console.log(userData.data);
      let email = userEmail.data.elements[0]['handle~'].emailAddress;
      User.findOne({ email: { personal: email } }).exec(async (err, user) => {
        if (err) {
          next({ status: 401 });
        }
        if (user !== null) {
          let accessToken = await tokenUtils.signAccessToken(user._id);
          let refreshToken = await tokenUtils.signRefreshToken(user._id);
          UserToken.create({
            user: user._id,
            refreshToken: refreshToken
          });
          res.status(200).json({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
          });
        } else {
          User.create({
            fullName: `${userData.data.localizedFirstName} ${userData.data.localizedLastName}`,
            email: { personal: email },
            isVerified: true
          })
            .then(async (user) => {
              let accessToken = await tokenUtils.signAccessToken(user._id);
              let refreshToken = await tokenUtils.signRefreshToken(user._id);
              UserToken.create({
                user: user._id,
                refreshToken: refreshToken
              })
                .then((token) => {
                  res.status(200).json({
                    user: user,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                  });
                })
                .catch((err) => {
                  next({ status: 401 });
                });
            })
            .catch((err) => {
              next({ status: 401 });
            });
        }
      });
    } catch (err) {
      next({ status: 401 });
    }
  },
  handleError
);

module.exports = authRouter;
