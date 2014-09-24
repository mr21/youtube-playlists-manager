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

ytplm.channel = function(jq_tab, jq_content, mine) {
	this.jq_scope = jq_content;
	this.jq_tab = jq_tab;
	this.load();
	if (mine) {
		this.dragndropInit();
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
	load: function() {
		var self = this;
		this.jq_scope.addClass('waiting');
		ytplm.tabs.hideForm();
		ytplm.extractData(
			gapi.client.youtube.playlists.list,
			{
				part: 'snippet,status,contentDetails',
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
