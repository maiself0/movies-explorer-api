const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const ConflictingRequestError = require('../errors/conflicting-request');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name });

    res.send({ _id: user._id, email: user.email, name: user.name });
  } catch (err) {
    if (err.name === 'MongoError') {
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
    const token = jwt.sign({ _id: user._id },
      NODE_ENV !== 'production' ? 'secret' : JWT_SECRET,
      { expiresIn: '7d' });

    res.send(token);
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id })
      .orFail(new NotFoundError('Пользователь по указанному _id не найден.'));

    res.send({ email: user.email, name: user.name });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные _id пользователя.'));
    } else {
      next(err);
    }
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { email, name } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id,
      { email, name }, {
        new: true,
        runValidators: true,
      })
      .orFail(new NotFoundError('Пользователь по указанному _id не найден.'));

    res.send({ email: user.email, name: user.name });
  } catch (err) {
    if (err.name === 'MongoError') {
      next(new ConflictingRequestError('Данный email уже есть в базе.'));
    } else if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
    } else if (err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные _id профиля.'));
    } else {
      next(err);
    }
  }
};
