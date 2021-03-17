import UserToken from '../models/userToken';
import jwt from 'jsonwebtoken';
export async function verifyAccessToken(req, res, next) {
  try {
    const authToken = req.headers.authorization; // authToken like 'Bearer <JWT-access-token>'
    if (!authToken) throw { isError: true, message: 'No auth token provided!' };

    const accessToken = authToken.split(' ')[1];
    if (!accessToken) throw { isError: true, message: 'No auth token provided!' };

    const payload = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    await checkIfAllowed(payload.userId);
    req.payload = payload;
    next(); // calling the next middleware in chain
  } catch (err) {
    // next(err); //calling the error middleware in express
  }
}

async function checkIfAllowed(userId) {
  const userToken = await UserToken.find({ user: userId }).sort({ createdAt: -1 }).limit(1);
  if (!userToken[0]) throw { isError: true, message: 'User token does not exist' };

  // you can also implement other checks like:
  // 1. If the last sent refresh token to user is in logged out state in database.
  // 2. If the last sent refresh token to user is in blocked state in database.
}
