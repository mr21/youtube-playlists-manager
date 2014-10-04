ytplm.connection = {
	id: {
		client_id: '514381834459-gr3dgmesev8jflg5364piutqb6alb35b.apps.googleusercontent.com',
		scope: ['https://www.googleapis.com/auth/youtube']
	},
	apiKey: 'AIzaSyBreHdBg1r-CTMmCqNVTIgPB17mzc1AAk0',
	logout: function() {
		gapi.auth.signOut();
	},
	login: function(callback) {
		var self = this;
		gapi.auth.authorize(this.id, function(authResult) {
			if (authResult.status.signed_in) {
				callback();
			} else {
				console.log('Connection failed... :(');
			}
		});
	}
};
