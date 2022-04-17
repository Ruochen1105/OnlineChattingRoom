const argon2 = require('argon2');
const {user} = require('./db.js');
const express = require("express");
const router = express.Router();
const JWT = require('jsonwebtoken');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));

router.post('/reg', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const repassword = req.body.repassword;
    console.log(username, password, repassword);
})

module.exports = router;