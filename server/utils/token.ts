import jwt from 'jsonwebtoken';
import UserToken from '../models/userToken';

export async function signToken(userId, secretKey, expiresIn) {
  const options = {
    expiresIn: expiresIn
  };
  try {
    let token = await jwt.sign({ userId: userId }, secretKey, options);
    return token;
  } catch (err) {
    return err;
  }
}

export async function signAccessToken(userId) {
  try {
    let res = await signToken(userId, process.env.ACCESS_TOKEN_SECRET, '1h');
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function signRefreshToken(userId) {
  try {
    let res = await signToken(userId, process.env.REFRESH_TOKEN_SECRET, '60d');
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function verifyRefreshToken(refreshToken) {
  try {
    let user = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    return user;
  } catch (err) {
    return err;
  }
}

export async function reIssueTokens(refreshToken) {
  const payload = await verifyRefreshToken(refreshToken);
  const userId = payload.aud;

  let x = await UserToken.find({ user: userId }).sort({ createdAt: -1 }).limit(1);

  let userToken: any = x[0];

  if (!userToken) throw { isError: true, message: 'User token does not exist' };
  if (userToken.refreshToken !== refreshToken)
    throw { isError: true, message: 'Old token. Not valid anymore.' };

  const [accessToken, refToken] = await Promise.all([
    signAccessToken(userId),
    signRefreshToken(userId)
  ]);

  await UserToken.findOneAndUpdate({ _id: userToken._id }, { $set: { refreshToken: refToken } });

  return { accessToken: accessToken, refreshToken: refToken };
}
