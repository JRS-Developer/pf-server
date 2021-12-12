const express = require('express');
const router = express.Router();

const user = require('../controllers/users.controllers');
const { verifyToken, esSuperUser, esSuperUserOrAdmin } = require('../middlewares/auth');

router.use(verifyToken)

// User
router.get('/', esSuperUserOrAdmin, user.getUser);
router.post('/', esSuperUserOrAdmin, user.createUser);
router.put('/:id', esSuperUserOrAdmin, user.updateUser);
router.delete('/:id', esSuperUser, user.deleteUser);

// User Role
router.get('/role', esSuperUserOrAdmin, user.getUsersByRole );
router.put('/role/:id', esSuperUserOrAdmin, user.setUserRole);

module.exports = router;
