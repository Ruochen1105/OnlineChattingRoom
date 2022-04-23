const {log} = require('./db.js');
const express = require("express");
const router = express.Router();

router.post('/msg', (req, res) => {
    const date = new Date();
    const time = (date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()); // reference: https://usefulangle.com/post/187/nodejs-get-date-time
    log.create({content: req.body.message, poster: req.user.username, time: time});
    res.json([{}]);
})

router.get('/msg', (req, res) => {
    log.find({}, (err, varToStoreResult, count) => {
        res.json(varToStoreResult);
    })
})

router.get('/search', async (req, res) => {
    const query = req.query.search;
    const history = await log.find({"content": {"$regex": query, "$options": "i"}});
    res.json(history);
})

module.exports = router;