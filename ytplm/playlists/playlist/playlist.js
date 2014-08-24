ytplm.playlist = function(p) {
	this.createDom(p);
	this.loadVideos(p.id);
	this.privacy(this.originalPrivacy);
};

ytplm.playlist.privacyValues = [
	'public',
	'private',
	'unlisted'
];

ytplm.playlist.prototype = {
	createDom: function(p) {
		this.originalName = p.snippet.title;
		this.originalPrivacy = p.status.privacyStatus;
		this.jq_scope = $(
			'<div class="playlist waiting">' +
				'<div class="table header">' +
					'<div class="privacy">' +
						'<i value="AB" title="Public"   class="fa fa-globe"></i>' +
						'<i value="AC" title="Private"  class="fa fa-lock"></i>' +
						'<i value="BC" title="Unlisted" class="fa fa-unlock-alt"></i>' +
					'</div>' +
					'<a target="_blank" class="fa fa-external-link" href="//youtube.com/playlist?list=' + p.id + '"></a>' +
					'<div class="name">' +
						'<input type="text" class="span" placeholder="New playlist" value="' + p.snippet.title + '"/>' +
					'</div>' +
					'<div class="count"></div>' +
				'</div>' +
				'<div class="body">' +
					'<div class="bg"></div>' +
					'<div class="jqdnd-drop"></div>' +
					'<i class="waiting fa fa-refresh fa-spin"></i>' +
				'</div>' +
			'</div>'
		);
		var self = this;
		this.jq_bg = this.jq_scope.find('.bg');
		this.jq_drop = this.jq_scope.find('.jqdnd-drop');
		this.nl_drags = this.jq_drop[0].getElementsByTagName('b');
		this.jq_drop[0]._playlist = this;
		this.el_count = this.jq_scope.find('.count')[0];
		this.jq_privacy =
			this.jq_scope.find('.privacy')
			.click(function() {
				self.privacy(
					ytplm.playlist.privacyValues[
						(1 + $.inArray(self.privacy(), ytplm.playlist.privacyValues))
						% ytplm.playlist.privacyValues.length
					]
				);
			});
	},
	privacy: function(status) {
		if (status)
			this.jq_privacy.attr('value', status);
		else
			return this.jq_privacy.attr('value');
	},
	refresh: function() {
		this.recount();
		this.findBackground();
	},
	recount: function() {
		this.el_count.textContent = this.nl_drags.length;
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
				self.refresh();
			}
		);
	},
	findBackground: function() {
		var	self = this,
			changed = false;
		function bg(url) {
			self.jq_bg.css('background-image', url ? 'url("' + url + '")' : 'none');
			return url;
		}
		$.each(this.nl_drags, function() {
			if (bg(this._video.imgMed)) {
				changed = true;
				return false;
			}
		});
		if (!changed)
			bg();
	}
};
