ytplm.channel = function(channelName, jq_tab, jq_content) {
	var self = this;
	this.jq_scope = jq_content;
	this.jq_tab = jq_tab;
	this.jq_tabTitle = jq_tab.find('span');
	this.readOnly = !!channelName;
	if (channelName) {
		this.loadByName(channelName);
	} else {
		this.load();
		jq_content.addClass('mine');
		jq_tab.addClass('mine');
		this.setTitle('Mine');
		this.dragndropInit();
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
		$('<a class="close fa fa-close header-link" title="Close this window" href="#"></a>')
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
			$('<ul></ul>')
				.appendTo(this.jq_diff);
	},
	diffShow: function() { this.jq_diff.addClass('show'); },
	diffHide: function() { this.jq_diff.removeClass('show'); },
	diffCancel: function() {
		lg('channel::diffCancel()')
		this.diffShow();
	},
	diffSave: function() {
		lg('channel::diffSave()')
		this.diffShow();
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
					self.jq_scope
						.addClass('waiting')
						.empty();
					self.diffInit();
					$.each(data, function(i) {
						self[i] = new ytplm.playlist(this, self.readOnly);
						self.jq_scope.append(self[i].jq_scope);
					});
					self.jq_scope.removeClass('waiting');
				}
			}
		);
	}
};
