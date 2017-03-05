var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField:'username'
},
    function(username, password, done,req) {
    User.findOne({ email: username }, function(err, user) {
       // var query={"email":username};
        //var update={"lastlogin":user.logintime};
        if (err) {
            return done(err);
        }
        else if (!user) {
            return done(null, false, { message: '用户不存在' });
        }
        else if (!user.validPassword(password)) {
            return done(null, false, { message: '密码错误!' });
        }
        else{
                return done(null, user);
            }});
    }));