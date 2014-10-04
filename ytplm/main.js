function lg(s) { console.log(s); }

if (location.protocol === 'http:')
	location = 'https' + location.href.substr(4);

var ytplm = {};

window.gapi_onload = function() {
	gapi.client.setApiKey(ytplm.connection.apiKey);
	gapi.client.load('youtube', 'v3', function() {
		ytplm.tabs.init();
	});
};
