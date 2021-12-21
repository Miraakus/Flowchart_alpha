const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const { register, login, logout, contact } = require("../app/Controllers/UserController");
const router = require('express').Router();

// Login router
router.get('/login', (request, response) => response.render('login'))

// Login handle
router.post('/login', urlencodedParser, login)

// Register router
router.get('/register', (request, response) => response.render('register'))

// Register handle
router.post('/register', urlencodedParser, register)

// Logout handle
router.get('/logout', logout)

module.exports = router