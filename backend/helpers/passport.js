const passport = require('passport');
const GoogleSteatary = require('passport-google-oauth2').Strategy;
require('dotenv').config()


passport.serializeUser((user , done) => {
    done(null,user);
});

passport.deserializeUser(function(user,done){
    done(null,user);
});
passport.use(new GoogleSteatary({
    clientID:process.env.CLIENT_ID, //Client id Which is provided by Google
    clientSecret:process.env.CLIENT_SECRET,     //Client Secret Which is Also provided by Google
    callbackURL:"http://localhost:3000/auth/google/callback",    //CallBack URL for redirecting in oue home page
    passReqToCallback:true
},
function(request,accessToken,refreshToken,profile,done){
    return done(null,profile);   //return Google profile
}
));