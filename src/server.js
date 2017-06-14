const express = require('express');
const body_parser = require('body-parser');
const exphbs  = require('express-handlebars');
const cookie_parser = require('cookie-parser');
const cookie_session = require('cookie-session');
const passport = require('passport');
const twitchStrategy = require('passport-twitch').Strategy;

const User = require('./models/db').user;

const port = process.env.PORT || 3000;

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Middleware
app.use(body_parser.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(cookie_session({secret:"dontchawanna"}));
app.use(passport.initialize());
app.use(express.static("./public"));


passport.use(new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: "https://twitch-auth-service-production.herokuapp.com/auth/twitch/callback",
    scope: "user_read"
  },
  (accessToken, refreshToken, profile) => {
    // Suppose we are using mongo..
    // User.findOrCreate({ twitchId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    console.log('Debug: accessToken', accessToken);
    console.log('Debug: refreshToken', refreshToken);
    console.log('Debug: Profile', profile);
  }
));
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get("/", (req, res) => {
    //res.render('home');
    res.render('home');
});

app.get("/auth/twitch", passport.authenticate("twitch", {forceVerify: true}));

app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.

    console.log('Successful Integration made');
    res.redirect("/");
});

app.listen(port, () => {
  console.log('Server up and running on port', port);
});

//twitchRedirect
