function lg(s) { console.log(s); }

if (top.location === self.location ||
	location.protocol === 'http:')
	location = 'http://mr21.fr/YouTube-playlists-manager';

var ytplm = {};

window.gapi_onload = function() {
	gapi.client.setApiKey(ytplm.connection.apiKey);
	gapi.client.load('youtube', 'v3').then(function() {
		ytplm.tabs.init();
	});
};
