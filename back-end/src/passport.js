const passport = require('passport');
const LocalStrategy = require('passport-local');
const argon2 = require('argon2');
const {user} = require('./db.js');

passport.use(new LocalStrategy(async function verify(username, password, done) {
    try {
        const found =await user.findOne({username: username});
        if (found === null) {return done(null, false);}
        if (await argon2.verify(found.password, password)){
            return done(null, found);
        } else {
            return done(null, false);
        }
    } catch (error) {
        done(error, false)
    }
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});