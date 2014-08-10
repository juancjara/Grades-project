var config = require('./config.js'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  User = require('./models/user.js');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new FacebookStrategy({
      clientID: config.facebook.id,
      clientSecret: config.facebook.secret,
      callbackURL: '/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      var user = {
        provider_id : profile.id,
        provider: profile.provider,
        name: profile.displayName
      };
      User.findOrCreate(user, function(err, model) {
        done(err, model);
      });
    }
  ));

  passport.use(new GoogleStrategy({
      clientID: config.google.id,
      clientSecret: config.google.secret,
      callbackURL: '/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      var user = {
        provider_id: profile.id,
        provider: 'google plus',
        name: profile.displayName
      }
      User.findOrCreate(user, function(err, model) {
        done(err, model);
      });
    }
  ));

  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.id,
      consumerSecret: config.twitter.secret,
      callbackURL: '/auth/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
      var user = {
        provider_id: profile.id,
        provider: profile.provider,
        name: profile.displayName
      };
      User.findOrCreate(user, function(err, model) {
        done(err, model);
      });
    }
  ));
}