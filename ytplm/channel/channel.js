ytplm.channel = function(channelName, jq_tab, jq_content) {
	var self = this;
	this.jq_scope = jq_content;
	this.jq_tab = jq_tab;
	this.jq_tabTitle = jq_tab.find('span');
	this.jq_playlists = jq_content.find('.playlists');
	this.jq_form = jq_content.find('form');
	this.diffData = [];
	this.readOnly = !!channelName;
	if (channelName)
		this.loadByName(channelName);
	else
		this.load();
};

ytplm.channel.prototype = {
	readWrite: function() {
		var self = this;
		this.jq_scope.addClass('mine');
		this.jq_tab.addClass('mine');
		this.setTitle('Mine');
		this.dragndropInit();
		this.diffInit();
		$('<a class="edit header-link fa fa-save" title="Save all the modifications"></a>')
			.appendTo(this.jq_tabTitle)
			.click(function() { self.diffShow(); return false; });
	},
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
	saveChanges: function() {
		var	self = this,
			nbCalls = 0,
			plToRewrite = [],
			queries = [],
			delQueries = [];
		this.jq_diff.addClass('saving');
		$.each(this.diffData, function() {
			if (this.newName || this.newPrivacy || this.videos) {
				var	pl = this.self,
					body = {
						part: 'snippet',
						resource: {
							id: pl.id,
							snippet: {
								title: this.newName ? this.newName : this.name
							}
						}
					};
				plToRewrite.push(pl);
				if (this.newPrivacy) {
					body.part += ',status';
					body.resource.status = {
						privacyStatus: this.newPrivacy
					};
				}
				if (this.newName || this.newPrivacy)
					queries.push([
						gapi.client.youtube.playlists.update,
						body,
						pl
					]);
				if (this.videos) {
					$.each(this.videos, function() {
						var	body = {},
							type = this.status === 'del'
								? 'delete'
								: this.status === 'add'
									? 'insert'
									: 'update';
						if (type !== 'delete') {
							body.part = 'snippet';
							body.snippet = {
								playlistId: pl.id,
								position: this.posB - 1,
								resourceId: {
									kind: this.video.kind,
									videoId: this.video.videoId
								},
							};
						}
						if (type !== 'insert')
							body.id = this.video.id;
						body = [
							gapi.client.youtube.playlistItems[type],
							body,
							this.video
						];
						if (type === 'delete')
							delQueries.push(body);
						else
							queries.push(body);
					});
				}
			}
		});
		queries = queries.concat(delQueries);
		nbCalls = queries.length;
		function launchQ(i) {
			if (i < nbCalls) {
				ytplm.setData(
					queries[i][0],
					queries[i][1],
					function(data) {
						if (data.id)
							queries[i][2].id = data.id;
						launchQ(++i);
					}
				);
			} else {
				$.each(plToRewrite, function() {
					this.rewriteData();
				})
				self.diffShow();
				self.jq_diff.removeClass('saving');
			}
		}
		launchQ(0);
	},
	cancelChanges: function() {
		$.each(this.diffData, function() {
			this.self.resetData();
		});
		this.jq_diffList.empty();
	},
	diffInit: function() {
		var self = this;
		this.jq_diff =
			$('<div class="diff"></div>')
				.appendTo(this.jq_scope);
		var jq_menu =
			$('<div class="menu"></div>')
				.appendTo(this.jq_diff);
		$('<a class="fa fa-close header-link" title="Close this window or press Escape" href="#"></a>')
			.appendTo(jq_menu)
			.click(function() {
				self.diffHide();
				return false;
			});
		$('<i class="fa fa-refresh fa-spin saving" title="Please wait, it\'s sending few queries."></i>')
			.appendTo(jq_menu);
		$('<a class="fa fa-save header-link savelink" title="Apply all these changes on your YouTube account" href="#"></a>')
			.appendTo(jq_menu)
			.click(function() {
				self.saveChanges();
				return false;
			});
		$('<a class="fa fa-trash-o header-link" title="Cancel all these changes" href="#"></a>')
			.appendTo(jq_menu)
			.click(function() {
				self.cancelChanges();
				return false;
			});
		$(document)
			.keydown(function(e) {
				if (e.keyCode === 27) // escape
					self.diffHide();
			});
		this.jq_diffList =
			$('<div class="list">')
				.appendTo(this.jq_diff);
	},
	diffShow: function() {
		var df;
		this.diffData.length = 0;
		for (var i = 0, pl; pl = this[i]; ++i)
			if (df = pl.domDiff())
				this.diffData.push(df);
		this.diffWrite();
		this.jq_scope.addClass('diff');
	},
	diffHide: function() {
		this.jq_scope.removeClass('diff');
	},
	diffWrite: function() {
		var html = '';
		$.each(this.diffData, function() {
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
					var pos;
					switch (this.status) {
						case 'add' : pos = this.posB; break;
						case 'del' : pos = this.posA; break;
						case 'up'  :
						case 'down': pos = this.posA + '<i class="new"></i>' + this.posB; break;
					}
					html +=
						'<div class="'+this.status+'">'+
							'<img src="'+this.video.imgDef+'"/>'+
							'<span class="pos">'+pos+'</span>'+
							'<span class="name">'+this.video.title+'</span>'+
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
		ytplm.getData(
			gapi.client.youtube.search.list,
			{
				type: 'channel',
				part: 'snippet',
				q: name
			},
			function(data) {
				if (!data[0]) {
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
		this.jq_playlists.addClass('waiting');
		ytplm.getData(
			gapi.client.youtube.playlists.list,
			queryParams,
			function(data) {
				if (!data[0]) {
					ytplm.tabs.writeError('This channel has not yet public playlist :(');
				} else {
					if (!channelId)
						self.readWrite();
					self.jq_form.remove();
					$.each(data, function(i) {
						self[i] = new ytplm.playlist(this, self.readOnly);
						self.jq_playlists.append(self[i].jq_scope);
					});
				}
				self.jq_playlists.removeClass('waiting');
			}
		);
	}
};
