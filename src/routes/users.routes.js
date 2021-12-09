const express = require('express');
const router = express.Router();

const { get_user_info,
  user_info_by_role,
  create_user,
  user_delete,
  user_role_set,
  upDate_user,
  get_roles,
  create_roles,
  upDate_roles
} = require('../controllers/users.controllers');
const { verifyToken } = require('../middlewares/auth');

router.use(verifyToken)

router.get('/', get_user_info);
router.get('/', user_info_by_role);
router.get('/roles', get_roles);
router.post('/', create_user);
router.post('/roles', create_roles);
router.delete('/:id', user_delete);
router.put('/', user_role_set);
router.put('/:id', upDate_user);
router.put('/roles/:id', upDate_roles);

module.exports = router;
