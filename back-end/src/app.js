require('dotenv').config()
const express = require("express");
const cors = require('cors')
const path = require('path');
const session = require('express-session');
const api = require('./api')
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'front-end', 'build')));

app.use('/api', api);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'front-end', 'build', 'index.html'))
})

app.listen(process.env.PORT || 3000);