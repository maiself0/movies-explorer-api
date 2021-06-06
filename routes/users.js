const router = require('express').Router();
const { celebrateUpdateUser } = require('../utils/celebrateConfig');
const { getUser, updateUser } = require('../controllers/users.js');

router.get('/me/', getUser);
router.patch('/me/', celebrateUpdateUser, updateUser);

module.exports = router;
