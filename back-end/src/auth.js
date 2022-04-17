require('dotenv').config()
const argon2 = require('argon2');
const {user} = require('./db.js');
const express = require("express");
const router = express.Router();
const JWT = require('jsonwebtoken');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./passport');

router.use(bodyParser.urlencoded({extended: false}));

router.post('/reg', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const repassword = req.body.repassword;
    try {
        const found = await user.findOne({username: username}).exec();
        if (found) {return res.status(403).json({"msg": "User exists."});}
        if (password !== repassword) {return res.status(403).json({"msg": "Two passwords don't match."})}
        const newUser = new user({username: username, password: await argon2.hash(password)});
        await newUser.save();
        res.status(200).send();
    } catch (error) {
        res.status(403).json({"msg": error.message});
    }
});

router.post('/log', passport.authenticate('local', {successRedirect:'/'}), async (req, res) => {
    const username = req.body.username;
    const aUser = user.findOne({username: username});
    const id = aUser.id;
    try {
        const token = await JWT.sign({
            id: id,
            username: username,
        }, process.env.secret);
        console.log(token);
    } catch (error) {
        res.status(403).json({"msg": error.message});
    }
});

module.exports = router;