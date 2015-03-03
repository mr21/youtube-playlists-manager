function lg(s) { console.log(s); }

var ytplm = {};

window.gapi_onload = function() {
	gapi.client.setApiKey(ytplm.connection.apiKey);
	gapi.client.load('youtube', 'v3').then(function() {
		ytplm.tabs.init();
	});
};
