function lg(s) { console.log(s); }

var ytplm = {};

window.gapi_onload = function() {
	ytplm.connection.gapiOnload();
};

$(function() {
	ytplm.header.init();
	ytplm.playlists.init();
});

