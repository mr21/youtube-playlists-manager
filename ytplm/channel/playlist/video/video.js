ytplm.video = function(p) {
	p = p.snippet;
	var img = p.thumbnails || {};
	this.imgDef = img.default && img.default.url;
	this.imgMed = img.medium ? img.medium.url : this.imgDef;
	this.jq_scope = $(
		'<b' +
			' class="jqselection-selectable"' +
			' style="background-image:url(' + (this.imgDef || '//s.ytimg.com/yts/img/no_thumbnail-vfl4t3-4R.jpg') + ')"' +
			' title="' + p.title.replace(/"/g, '&quot;') + '"' +
		'></b>'
	).click(function(e) {
		if (e.button === 1)
			window.open('//youtube.com/watch?v=' + p.resourceId.videoId + '&list=' + p.playlistId);
	});
	this.jq_scope[0]._video = this;
};

/*
thumbnails resolutions:
	default  : 120 *  90
	medium   : 320 * 180
	high     : 480 * 360
	standard : 640 * 480
*/

/*
id: "PLeeapPi3g3XxjCErDLm011DyI4T16dP0c"
snippet: Object
	channelId: "UC84M_g2fMtiNiTV7Lq6hXag"
	channelTitle: "Mr21u"
	description: ""
	playlistId: "PL13C8BA3123C8B802"
	position: 0
	publishedAt: "2014-08-12T16:41:32.000Z"
	resourceId: Object
		videoId: "4wPQ2kMJ8mI"
*/
