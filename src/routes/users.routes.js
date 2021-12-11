const express = require('express');
const router = express.Router();

const user = require('../controllers/users.controllers');
const { verifyToken } = require('../middlewares/auth');

router.use(verifyToken)

// User
router.get('/', user.getUsers)
router.post('/', user.createUser);
router.get('/:id', user.getUserById);
router.put('/:id', user.updateUser);
router.delete('/:id', user.deleteUser);

// User Role
router.get('/role', user.getUsersByRole );
router.put('/role/:id', user.setUserRole);

module.exports = router;
