const admin = require('firebase-admin');

const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).send('Acces refuzat. Lipseste token-ul.');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(403).send('Token invalid sau expirat.');
  }
};

module.exports = checkAuth;