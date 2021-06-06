const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { celebrateSignup, celebrateSingin, celebrateAuth } = require('../utils/celebrateConfig');

router.post('/signup', celebrateSignup, createUser);
router.post('/signin', celebrateSingin, login);
router.use('/users', celebrateAuth, auth, require('./users'));
router.use('/movies', celebrateAuth, auth, require('./movies'));

module.exports = router;
