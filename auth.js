/**
 * Created by geo on 26/11/14.
 */
//testing passport to authenticate users
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy
    ,Worker= require('./app.js');


passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
            },
    function(email, password, done) {
        test.find({ email: email}, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));
passport.serializeUser(function(user, done){
        done(null, user.username);
    });
passport.deserializeUser(function(username, done){
    done(null, {username:username});
});
module.exports = passport;
