const Movie = require('../models/movie');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden');

module.exports.createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });

    res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при создании карточки.'));
    } else {
      next(err);
    }
  }
};

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id })
      .orFail(new NotFoundError('Карточки не найдены.'));
    res.send(Object.values(movies));
  } catch (err) {
    next(err);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
      .orFail(new NotFoundError('Карточка с указанным _id не найдена.'));

    if (req.user._id !== movie.owner.toString()) {
      next(new ForbiddenError('Недостаточно прав для удаления карточки.'));
    } else {
      movie.remove();
      res.send({ message: 'Карточка успешно удалена' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные _id.'));
    } else {
      next(err);
    }
  }
};
