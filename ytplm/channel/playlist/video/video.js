ytplm.video = function(p) {
	var	self = this,
		snip = p.snippet,
		img = snip.thumbnails || {};
	this.imgDef = img.default && img.default.url;
	if (!this.imgDef) {
		this.img404 = true;
		this.imgDef = '//s.ytimg.com/yts/img/no_thumbnail-vfl4t3-4R.jpg';
	}
	this.imgMed = img.medium ? img.medium.url : this.imgDef;
	this.id = snip.resourceId.videoId;
	this.title = snip.title.replace(/"/g, '&quot;');
	this.jq_scope = $(
		'<b'+
			' class="jqselection-selectable"'+
			' style="background-image:url('+this.imgDef+')"'+
			' title="'+this.title+'"'+
		'></b>'
	).click(function(e) {
		if (e.button === 1)
			window.open('//youtube.com/watch?v='+self.id+'&list='+snip.playlistId);
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
