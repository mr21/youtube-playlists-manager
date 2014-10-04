ytplm.playlist = function(p, readOnly) {
	this.createDom(p, readOnly);
	this.loadVideos(p.id, p.contentDetails.itemCount);
	this.privacy(this.originalPrivacy);
};

ytplm.playlist.privacyValues = [
	'public',
	'private',
	'unlisted'
];

ytplm.playlist.prototype = {
	createDom: function(p, readOnly) {
		this.originalName = p.snippet.title;
		this.originalPrivacy = p.status.privacyStatus;
		this.jq_scope = $(
			'<div class="playlist">' +
				'<div class="table header">' +
					'<div class="privacy">' +
						'<i value="AB" title="Public"   class="fa fa-globe"></i>' +
						'<i value="AC" title="Private"  class="fa fa-lock"></i>' +
						'<i value="BC" title="Unlisted" class="fa fa-unlock-alt"></i>' +
					'</div>' +
					'<a target="_blank" class="fa fa-external-link" href="//youtube.com/playlist?list=' + p.id + '"></a>' +
					'<div class="name">' +
						'<input '+ (readOnly ? 'readonly ' : '') +'type="text" class="span" placeholder="New playlist" value="' + p.snippet.title + '"/>' +
					'</div>' +
					'<div class="count"></div>' +
				'</div>' +
				'<div class="body">' +
					'<div class="bg"></div>' +
					'<div class="jqdragndrop-drop"></div>' +
					'<i class="waiting fa fa-refresh fa-spin"></i>' +
				'</div>' +
			'</div>'
		);
		var self = this;
		this.jq_bg = this.jq_scope.find('.bg');
		this.jq_drop = this.jq_scope.find('.jqdragndrop-drop');
		this.nl_drags = this.jq_drop[0].getElementsByTagName('b');
		this.jq_drop[0]._playlist = this;
		this.el_count = this.jq_scope.find('.count')[0];
		this.jq_privacy = this.jq_scope.find('.privacy');
		if (!readOnly)
			this.jq_privacy.click(function() {
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
		this.findBackground();
		this.setNbVideos(this.nl_drags.length);
	},
	setNbVideos: function(nb) {
		this.el_count.textContent = nb;
	},
	loadVideos: function(id, nbVideos) {
		this.setNbVideos(nbVideos);
		if (nbVideos > 0) {
			var self = this;
			this.jq_scope.addClass('waiting');
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
					self.findBackground();
				}
			);
		}
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
