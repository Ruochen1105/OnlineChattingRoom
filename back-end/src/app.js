require('dotenv').config()
const express = require("express");
const cors = require('cors')
const path = require('path');
const session = require('express-session');
const api = require('./api');
const auth = require('./auth');
const passport = require('passport');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'front-end', 'build')));

app.use('/api',passport.authenticate('jwt'), api);
app.use('/auth', auth);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'front-end', 'build', 'index.html'))
})

app.listen(process.env.PORT || 3000);