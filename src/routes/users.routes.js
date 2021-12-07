const express = require('express');
const router = express.Router();

const  get_user_info, 
    user_info_by_role, 
    create_user, 
    user_delete, 
    user_role_set,
    upDate_user
 = require('../controllers/usersController');


router.get('/', get_user_info);
router.get('/', user_info_by_role);
router.post('/', create_user);
router.delete('/:id', user_delete);
router.put('/:id', user_role_set);
router.put('/:id', upDate_user);


module.exports = router;