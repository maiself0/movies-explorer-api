const router = require('express').Router();
const { celebrateCreateMovie, celebrateDeleteMovies } = require('../utils/celebrateConfig');
const { createMovie, getMovies, deleteMovie } = require('../controllers/movies');

router.post('/', celebrateCreateMovie, createMovie);
router.get('/', getMovies);
router.delete('/:movieId', celebrateDeleteMovies, deleteMovie);

module.exports = router;
