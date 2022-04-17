require('dotenv').config()
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    content: String,
    poster: String,
    time: String
});

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, minlength: 3},
  password: {type: String, required: true},
})

const log = mongoose.model('log', logSchema);
const user = mongoose.model('user', userSchema);

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

module.exports = {
  log: log,
  user: user,
}