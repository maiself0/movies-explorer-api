const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/users.js');

router.get('/me/', getUser);
router.patch('/me/', updateUser);

module.exports = router;
