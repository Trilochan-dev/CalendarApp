const express = require('express');
const router = express.Router();
const { login, register } = require('../controller/user')
// User registration
router.post('/register', register);

// User login
router.post('/login', login);

module.exports = router;