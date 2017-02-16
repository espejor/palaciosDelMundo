module.exports = {
	db : 'mongodb://espejor:pepe05@ds139939.mlab.com:39939/palacesoftheworld',
	sessionSecret: 'developmentSessionSecret',
	google: {
		clientID: '1017339095363-mj7lectrn5bqhodvo5dtfk5eb4jfhjhh.apps.googleusercontent.com',
		clientSecret: 'XOqZCbZUsrnvdUuAuntJBKkB',
		callbackURL: 'http://localhost:3000/oauth/google/callback'
	},
	facebook: {
		clientID: '1859732197618336',
		clientSecret: '52bfa7ff41353a9158e85cc190ea28d9',
		callbackURL: 'http://localhost:3000/oauth/facebook/callback'
	}
};
