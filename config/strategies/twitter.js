var passport = require('passport'),
	url = require('url'),
	TwitterStrategy = require('passport-twitter').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function () {
	passport.use(new TwitterStrategy ({
		clientID: config.twitter.clientID,
		clientSecret: config.twitter.clientSecret,
		callbackURL: config.twitter.callbackURL,
		passReqToCallback: true
	},
  function (req, accessToken, refreshToken, profile, done) {
		var providerData = profile._json;
		providerData.accessToken = accessToken;
		providerData.refreshToken = refreshToken;
		
		var providerUserProfile = {
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			fullName: profile.displayName,
			//email: profile.emails.value,
			username: profile.username,
			provider: 'twitter',
			providerId: profile.id,
			providerData: providerData
		};
		
		users.saveOAuthUserProfile(req, providerUserProfile, done);
	}));
};