const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const { hash } = require('bcrypt');


const UsersControllers = require('../controllers/users-controllers');


router.post('/sign_up', 
UsersControllers.sing_upUser);

router.post('/login', 
UsersControllers.loginUser);

module.exports = router;