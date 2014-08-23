ytplm.playlist = function(p) {
	this.name =
	this.originalName = p.snippet.title;
	this.createDom(p);
	this.attachEvents();
	this.loadVideos(p.id);
	this.setBackground(p.snippet.thumbnails.medium.url);
};

ytplm.playlist.prototype = {
	createDom: function(p) {
		this.jq_scope = $(
			'<div class="playlist waiting">' +
				'<div class="table header">' +
					'<a target="_blank" class="fa fa-external-link" href="//youtube.com/playlist?list=' + p.id + '"></a>' +
					'<div class="name">' +
						'<input type="text" class="span" placeholder="New playlist" value="' + p.snippet.title + '"/>' +
					'</div>' +
					'<em class="nbVideos"></em>' +
				'</div>' +
				'<div class="body">' +
					'<div class="bg"></div>' +
					'<div class="jqdnd-drop"></div>' +
					'<i class="waiting fa fa-refresh fa-spin"></i>' +
				'</div>' +
			'</div>'
		);
	},
	attachEvents: function() {
		this.jq_bg = this.jq_scope.find('.bg');
		this.jq_drop = this.jq_scope.find('.jqdnd-drop');
	},
	loadVideos: function(id) {
		var self = this;
		ytplm.extractData(
			gapi.client.youtube.playlistItems.list,
			{
				playlistId: id,
				part: 'snippet',
				maxResults: 50
			},
			function(data) {
				$.each(data, function(i) {
					self[i] = new ytplm.video(this);
					self.jq_drop.append(self[i].jq_scope);
				});
				self.jq_scope.removeClass('waiting');
			}
		);
	},
	setBackground: function(url) {
		this.jq_bg.css('background-image', 'url("' + url + '")');
	}
};
