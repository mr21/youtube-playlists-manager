ytplm.playlist = function(p) {
	this.createDom(p);
	this.attachEvents();
	this.loadVideos(p.id);
	this.setBackground(p.snippet.thumbnails.medium.url);
};

ytplm.playlist.prototype = {
	createDom: function(p) {
		this.jq_scope = $(
			'<div class="playlist waiting">' +
				'<div class="header">' +
					'<div class="name">' +
						'<div class="relative">' +
							'<div class="absolute">' +
								'<a href="//youtube.com/playlist?list=' + p.id + '" target="_blank">' + p.snippet.title + '</a>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="edit">' +
						'<a href="#" class="fa fa-gear" title="Settings"></a>' +
					'</div>' +
					'<em class="nbVideos"></em>' +
				'</div>' +
				'<div class="body">' +
					'<div class="bg"></div>' +
					'<div class="jqdnd-drop"></div>' +
					'<i class="waiting fa fa-refresh fa-spin"></i>' +
					'<form>' +
						'<input type="text" value="" placeholder="Playlist\'s name"/><br/>' +
						'<input type="button" value="Cancel" class="cancel"/>' +
						'<input type="submit" value="Save"/><br/>' +
						'<input type="button" value="Delete" class="delete"/>' +
					'</form>' +
				'</div>' +
			'</div>'
		);
	},
	attachEvents: function() {
		var
			jq_scope = this.jq_scope,
			jq_aName = jq_scope.find('.name a'),
			jq_aEdit = jq_scope.find('.edit a'),
			jq_form = jq_scope.find('form'),
			jq_btnCancel = jq_form.find('.cancel'),
			jq_btnDelete = jq_form.find('.delete');

		this.jq_bg = jq_scope.find('.bg');
		this.jq_drop = jq_scope.find('.jqdnd-drop');

		jq_aEdit.click(function() {
			if (jq_scope.hasClass('edit')) {
				jq_scope.removeClass('edit');
			} else {
				jq_form[0][0].value = jq_aName[0].textContent;
				jq_scope.addClass('edit');
			}
			return false;
		});

		jq_btnCancel.click(function() {
			jq_scope.removeClass('edit');
		});

		jq_btnDelete.click(function() {
			;
		});

		jq_form.submit(function() {
			return false;
		});
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
				$.each(data, function() {
					self.jq_drop.append((new ytplm.video(this)).jq_scope);
				});
				self.jq_scope.removeClass('waiting');
			}
		);
	},
	setBackground: function(imgUrl) {
		this.jq_bg.css('background-image', 'url(' + imgUrl + ')');
	}
};
