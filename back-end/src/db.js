require('dotenv').config()
const mongoose = require('mongoose');
/*
const log = new mongoose.Schema({
    content: String,
    poster: String,
    time: String
});

mongoose.model("log", log);
*/
// OPTIONAL: modify the connection code below if
// using mongodb authentication
const mongooseOpts = {
  useNewUrlParser: true,  
  useUnifiedTopology: true
};

mongoose.connect(process.env.MONGODB_URI, mongooseOpts, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connected to database'); 
  }
});