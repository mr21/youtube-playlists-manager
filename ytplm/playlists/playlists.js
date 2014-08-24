ytplm.playlists = {
	init: function() {
		this.jq_scope = $('#playlists');
		this.jq_placeholder = this.jq_scope.find('.placeholder');
		this.nl_nbVideos = this.jq_scope[0].getElementsByTagName('em');

		var
			self = this,
			DURATION = 150,
			CSS_CLOSE = {backgroundPosition:'0px'};

		this.jq_scope
			.dragndrop({
				duration: DURATION,
				ondrag: function(drops, drags) {
					$.each(drops, function() {
						this._playlist.refresh();
					});
				},
				ondrop: function(drops, drags) {
					$.each(drops, function() {
						this._playlist.refresh();
					});
				},
				ondragover: function(l, r) {
					var $l = $(l),
						$r = $(r);
					$l.stop().animate({backgroundPosition: $l.width() * -0.1 + 'px'}, DURATION, 'swing');
					$r.stop().animate({backgroundPosition: $r.width() *  0.5 + 'px'}, DURATION, 'swing');
				},
				ondragout: function(l, r) {
					$(l).stop().animate(CSS_CLOSE, DURATION, 'swing');
					$(r).stop().animate(CSS_CLOSE, DURATION, 'swing');
				},
				ondropover: function(drop) {
					$(drop.parentNode.parentNode).addClass('hover');
				},
				ondropout: function(drop) {
					$(drop.parentNode.parentNode).removeClass('hover');
				}
			});
	},
	length: function() {
		return this.nl_nbVideos.length;
	},
	empty: function() {
		this.jq_placeholder.nextAll().remove();
	},
	load: function() {
		var self = this;
		this.jq_scope.addClass('waiting');
		ytplm.extractData(
			gapi.client.youtube.playlists.list,
			{
				part: 'snippet,status',
				maxResults: 50,
				mine: true
			},
			function(data) {
				$.each(data, function(i) {
					self[i] = new ytplm.playlist(this);
					self.jq_scope.append(self[i].jq_scope);
				});
				self.jq_scope.removeClass('waiting');
			}
		);
	}
};

/*
	// La methode .delete qui se trouvait dans le plugin au debut:
	// case 46: self.delete(); break;
	delete: function() {
		var self = this,
			$drags = $(this.elemsSelected),
			i = 0;
		$drags
			.css('backgroundPosition', 'right')
			.animate({width: '0px'}, this.duration, 'swing', function() {
				if (++i === self.elemsSelected.length) {
					$drags.remove();
					self.elemsSelected.length = 0;
				}
			});
	},
*/
