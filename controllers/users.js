require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
// const AuthorizationError = require('../errors/auth-err');
const ConflictingRequestError = require('../errors/conflicting-request');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });

    res.send({ _id: user._id, email: user.email, name: user.name });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      next(new ConflictingRequestError('Данный email уже есть в базе.'));
    }
    if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
    } else {
      next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV !== 'production' ? 'secret' : JWT_SECRET);
    res.send(token);
  } catch (err) {
    next(err);
  }
};
