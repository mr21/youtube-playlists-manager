function lg(s) { console.log(s); }

if (location.protocol === 'http:')
	location = 'https' + location.href.substr(4);

var ytplm = {};

window.gapi_onload = function() {
	ytplm.connection.gapiOnload();
};

$(function() {
	ytplm.header.init();
	ytplm.playlists.init();
});

