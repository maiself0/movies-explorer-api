const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { celebrateSignup, celebrateSingin } = require('../utils/celebrateConfig');

router.post('/signup', celebrateSignup, createUser);
router.post('/signin', celebrateSingin, login);
router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.get('/', auth);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
