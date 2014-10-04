/*
<div class="placeholder">
	<div class="ifConnected waiting">
		<i class="fa fa-refresh fa-spin"></i>
	</div>
	<div class="ifConnected no-playlist">
		<h2>Whaaat O_o</h2>
		<span>This channel hasn't any public playlists to show us…</span>
	</div>
</div>
*/

ytplm.channel = function(channelName, jq_tab, jq_content) {
	this.jq_scope = jq_content;
	this.jq_tab = jq_tab;
	this.el_tabTitle = jq_tab.find('span')[0];
	if (channelName) {
		this.loadByName(channelName);
	} else {
		this.load();
		jq_tab.addClass('mine');
		jq_content.addClass('mine');
		this.setTitle('Mine');
		this.dragndropInit();
	}
	this.readOnly = !!channelName;
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
		this.el_tabTitle.textContent = name;
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
				if (data) {
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
				if (data) {
					self.jq_scope.addClass('waiting');
					ytplm.tabs.hideForm();
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
