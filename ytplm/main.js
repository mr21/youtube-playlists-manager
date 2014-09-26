function lg(s) { console.log(s); }

if (location.protocol === 'http:')
	location = 'https' + location.href.substr(4);

var ytplm = {};

window.gapi_onload = function() {
	// gapi.client.setApiKey('rtVInr4eHiZ1NPvnF08dmo5t');
	gapi.client.load('youtube', 'v3', function() {
		ytplm.tabs.init();
	});
};
