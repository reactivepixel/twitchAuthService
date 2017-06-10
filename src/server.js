const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');
const cookie_session = require('cookie-session');
const passport = require('passport');
const twitchStrategy = require('passport-twitch').Strategy;

const User = require('./models/db').user;

const port = process.env.PORT | 3000;

var app = express();

app.set("views", "./src/views");
app.set("view engine", "ejs");

// Middleware
app.use(body_parser.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(cookie_session({secret:"dontchawanna"}));
app.use(passport.initialize());
app.use(express.static("./public"));


passport.use(new twitchStrategy({
    clientID: "4gzbq395n98t5s64sfwpmx9dxo2anm",
    clientSecret: "i4asxasyab1ml8zfl6m86g9994j8jq",
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

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/" }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
});

app.listen(port);

//twitchRedirect
