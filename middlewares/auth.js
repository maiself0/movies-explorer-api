require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/auth-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV !== 'production' ? 'secret' : JWT_SECRET);
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};