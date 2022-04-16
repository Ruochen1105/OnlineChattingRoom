require('./db.js');
require('dotenv').config()
const express = require("express");
const cors = require('cors')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const crypto = require('crypto');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'front-end', 'build')));

const log = mongoose.model('log', new mongoose.Schema({
    content: String,
    poster: String,
    time: String
}));

app.post('/api/msg', (req, res) => {
    const date = new Date();
    const time = (date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + date.getMilliseconds()); // reference: https://usefulangle.com/post/187/nodejs-get-date-time
    log.create({content: req.body.message, poster: crypto.randomUUID(), time: time});
    res.json([{}]);
})

app.get('/api/msg', (req, res) => {
    log.find({}, (err, varToStoreResult, count) => {
        res.json(varToStoreResult);
    })
})

app.get('/api/search', async (req, res) => {
    const query = req.query;
    const history = await log.find(query);
    res.json(history);
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'front-end', 'build', 'index.html'))
})

app.listen(process.env.PORT || 5000);