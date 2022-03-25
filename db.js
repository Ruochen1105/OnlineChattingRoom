const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs'),
  passportLocalMongoose = require('passport-local-mongoose');


const User = new mongoose.Schema({
  // username, password
  servers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }]
});

const Log = new mongoose.Schema({
	poster: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	time: {type: String, required: true},
	content: {type: String, required: false}
});


const Server = new mongoose.Schema({
	users: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
	name: {type: String, required: true},
	logs: [Log]
});


User.plugin(passportLocalMongoose);
List.plugin(URLSlugs('name'));

mongoose.model('User', User);
mongoose.model('List', List);
mongoose.model('Item', Item);
mongoose.connect('mongodb://localhost/grocerydb');
