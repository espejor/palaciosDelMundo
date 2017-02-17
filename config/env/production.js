module.exports = {
	db : 'mongodb://espejor:pepe05@ds139939.mlab.com:39939/palacesoftheworld',
	sessionSecret: 'developmentSessionSecret',
	google: {
		clientID: '1017339095363-mj7lectrn5bqhodvo5dtfk5eb4jfhjhh.apps.googleusercontent.com',
		clientSecret: 'XOqZCbZUsrnvdUuAuntJBKkB',
		callbackURL: 'https://palacesoftheworld.herokuapp.com/oauth/google/callback'
	},	
	googlemaps: {
		API_KEY: 'AIzaSyC8wzZzLM9fgggkBLsGUSwIFVJgM2YORtg'
	},
	twitter: {
		clientID: 'B3aOXMDx9AxZgwuZFIGH57bEc',
		clientSecret: 'mqnXHghGOaVyFZVlAJTOKG7rYHkjKrRm4bfvMbzKlsaM3mCRff',
		callbackURL: 'https://palacesoftheworld.herokuapp.com/oauth/twitter/callback'
	},
	facebook: {
		clientID: '154326215077046',
		clientSecret: 'c20a600e373b6d39e18d75da33065cf1',
		callbackURL: 'https://palacesoftheworld.herokuapp.com/oauth2/facebook/callback'
	}
};
