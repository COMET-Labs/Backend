function signToken(userId, secretKey, expiresIn) {
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn: expiresIn,
      issuer: 'example.com',
      audience: userId
    };

    jwt.sign({}, secretKey, options, (err, token) => {
      if (err) {
        reject({ isError: true, message: 'Invalid operation!' });
      } else {
        resolve(token);
      }
    });
  });
}

function signAccessToken(userId) {
  return signToken(userId, 'accessTokenSecretKey', '1h');
}

function signRefreshToken(userId) {
  return signToken(userId, 'refreshTokenSecretKey', '60d');
}

async function reIssueTokens(refreshToken) {
  const payload = await verifyRefreshToken(refreshToken);
  const userId = payload.aud;

  let userToken = await UserToken.find({ user: userId }).sort({ createdAt: -1 }).limit(1);

  userToken = userToken[0];
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

async function verifyAccessToken(req, res, next) {
  try {
    const authToken = req.headers.authorization; // authToken like 'Bearer <JWT-access-token>'
    if (!authToken) throw { isError: true, message: 'No auth token provided!' };

    const accessToken = authToken.split(' ')[1];
    if (!accessToken) throw { isError: true, message: 'No auth token provided!' };

    const payload = await jwt.verifyAccessToken(accessToken);
    await checkIfAllowed(payload.aud);
    req.payload = payload;
    next(); // calling the next middleware in chain
  } catch (err) {
    next(err); //calling the error middleware in express
  }
}

async function checkIfAllowed(userId) {
  const userToken = await UserToken.find({ user: userId }).sort({ createdAt: -1 }).limit(1);
  if (!userToken[0]) throw { isError: true, message: 'User token does not exist' };

  // you can also implement other checks like:
  // 1. If the last sent refresh token to user is in logged out state in database.
  // 2. If the last sent refresh token to user is in blocked state in database.
}
