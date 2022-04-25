const {log} = require('./db.js');
const express = require("express");
const router = express.Router();
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

router.post('/msg', (req, res) => {
    const date = new Date();
    const time = (date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()); // reference: https://usefulangle.com/post/187/nodejs-get-date-time
    log.create({content: req.body.message, poster: req.user.username, time: time, image: req.body.image});
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

router.post('/upload', async (req, res) => {
    const upload = multer({storage: storage}).single('file');
    upload(req, res, err => {
        if (err) {
            res.sendStatus(500);
        }
        res.json({name:req.file.filename});
    })
})

module.exports = router;