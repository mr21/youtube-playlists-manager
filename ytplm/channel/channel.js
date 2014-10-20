ytplm.channel = function(channelName, jq_tab, jq_content) {
	var self = this;
	this.jq_scope = jq_content;
	this.jq_tab = jq_tab;
	this.jq_tabTitle = jq_tab.find('span');
	this.jq_playlists = jq_content.find('.playlists');
	this.readOnly = !!channelName;
	if (channelName) {
		this.loadByName(channelName);
	} else {
		this.load();
		jq_content.addClass('mine');
		jq_tab.addClass('mine');
		this.setTitle('Mine');
		this.dragndropInit();
		this.diffInit();
		$('<a class="edit header-link fa fa-reply" title="Cancel all the modifications"></a>')
		.appendTo(this.jq_tabTitle)
		.click(function() { self.diffCancel(); return false; });
		$('<a class="edit header-link fa fa-save" title="Save all the modifications"></a>')
		.appendTo(this.jq_tabTitle)
		.click(function() { self.diffSave(); return false; });
	}
};

ytplm.channel.prototype = {
	dragndropInit: function() {
		this.plugin_dragndrop =
		$.plugin_dragndrop(this.jq_scope)
			.duration(150)
			.onDrag(function(drops, drags) {
				$.each(drops, function() {
					this._playlist.refresh();
				});
			})
			.onDrop(function(drops, drags) {
				$.each(drops, function() {
					this._playlist.refresh();
				});
			})
			.onDropOver(function(jq_drop) {
				jq_drop.parent().parent().addClass('hover');
			})
			.onDropOut(function(jq_drop) {
				jq_drop.parent().parent().removeClass('hover');
			});
	},
	setTitle: function(name) {
		this.jq_tabTitle[0].textContent = name;
	},
	diffInit: function() {
		var self = this;
		this.jq_diff =
			$('<div class="diff"></div>')
				.appendTo(this.jq_scope);
		$('<a class="close fa fa-close header-link" title="Close this window or press Escape" href="#"></a>')
			.appendTo(this.jq_diff)
			.click(function() {
				self.diffHide();
				return false;
			});
		$(document)
			.keydown(function(e) {
				if (e.keyCode === 27) // escape
					self.diffHide();
			})
		this.jq_diffList =
			$('<div class="list">')
				.appendTo(this.jq_diff);
	},
	diffShow: function() {
		var df, diffs = [];
		for (var i = 0, pl; pl = this[i]; ++i)
			if (df = pl.domDiff())
				diffs.push(df);
		this.diffWrite(diffs);
		this.jq_scope.addClass('diff');
	},
	diffHide: function() {
		this.jq_scope.removeClass('diff');
	},
	diffCancel: function() {
		this.diffShow();
	},
	diffSave: function() {
		this.diffShow();
	},
	diffWrite: function(df) {
		lg(df)
		var html = '';
		$.each(df, function() {
			html +=
				'<div>'+
					'<div class="title">'+
						'<span>'+this.name+'</span>';
			if (this.newName)
				html += '<span class="new">'+this.newName+'</span>';
			html += '</div>';
			if (this.privacy) {
				var prv = ytplm.playlist.privacyClasses;
				html +=
					'<div class="privacy">'+
						'<span><i title="'+prv[this.privacy][0]+'" class="privacy '+prv[this.privacy][1]+'"></i></span>'+
						'<span class="new"><i title="'+prv[this.newPrivacy][0]+'" class="privacy '+prv[this.newPrivacy][1]+'"></i></span>'+
					'</div>';
			}
			if (this.videos) {
				html += '<div class="videos">';
				$.each(this.videos, function() {
					html +=
						'<div class="'+this.status+'">'+
							'<img src="'+this.img+'"/>'+
							'<span class="name">'+this.name+'</span>'+
						'</div>';
				});
				html += '</div>';
			}
			html += '</div>';
		});
		this.jq_diffList.html(html);
	},
	loadByName: function(name) {
		var self = this;
		ytplm.extractData(
			gapi.client.youtube.search.list,
			{
				type: 'channel',
				part: 'snippet',
				q: name
			},
			function(data) {
				if (!data) {
					ytplm.tabs.writeError('Channel not found...');
				} else {
					self.load(data[0].id.channelId);
					self.setTitle(data[0].snippet.channelTitle);
				}
			},
			"singlePage"
		);
	},
	load: function(channelId) {
		var	self = this,
			queryParams = {
				part: 'snippet,status,contentDetails',
				maxResults: 50
			};
		if (channelId)
			queryParams.channelId = channelId;
		else
			queryParams.mine = true;
		ytplm.extractData(
			gapi.client.youtube.playlists.list,
			queryParams,
			function(data) {
				if (!data) {
					ytplm.tabs.writeError('This channel has not yet public playlist :(');
				} else {
					self.jq_playlists
						.addClass('waiting')
						.empty();
					$.each(data, function(i) {
						self[i] = new ytplm.playlist(this, self.readOnly);
						self.jq_playlists.append(self[i].jq_scope);
					});
					self.jq_playlists.removeClass('waiting');
				}
			}
		);
	}
};
