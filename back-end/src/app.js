const express = require("express");
const app = express();
const path = require('path');

const databaseURI = process.env.MONGODB_URI;

app.get('/', (req, res) => {
    
})

app.listen(process.env.PORT || 3000);