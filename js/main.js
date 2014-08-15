function lg(s) { console.log(s); }

var ytplm = {};

$(function() {
	ytplm.playlists.init();
});

GoogleAPI(
	$('#header .login')[0],
	function() {
		lg('success');
		ytplm.playlists.load();
	},
	function() {
		lg('fail');
	}
);
