ytplm.tabs = {
	init: function() {
		var
			self = this,
			jq_scope = $('.jqtabs'),
			plugin_tabs = $.plugin_tabs(jq_scope, {
				applyThis: this,
				onNewTab: this.onNewTab,
				onAfterRemoveTab: function() {
					if (1 === self.tabsContainer.getTabs().length)
						self.tabsContainer.newTabAppend();
				}
			});
		this.tabsContainer = plugin_tabs.container[0];
		this.channels = [];
		this.tabsContainer.newTabAppend();
	},
	onNewTab: function(jq_tab, jq_content) {
		var self = this;
		jq_tab
			.html(
				'<div>'+
					'<span></span>'+
					'<a title="Close tab" class="jqtabs-btnCloseTab header-link fa fa-times-circle"></a>'+
				'</div>'
			);
		jq_content
			.addClass('channel')
			.html(
				'<div class="playlists">'+
					'<form class="newTab">'+
						'Enter a YouTube channel below to easely browse through its videos&nbsp;:<br/>'+
						'<b>youtube.com/</b><input type="text" placeholder="ex: vsauce"/>'+
						'<input type="submit" value="Load"/><br/>'+
						'<span class="error"></span>'+
						'<br/>'+
						'Or log yourself to manage your personal playlists directly here by clicking this&nbsp;:<br/>'+
						'<button class="login"><i class="fa fa-sign-in"></i> Login with Google</button>'+
					'</form>'+
				'</div>'
			)
			.find('form')
				.submit(function() {
					self.loadTab(this[0].value);
					return false;
				})
				.find('.login')
					.click(function() {
						self.loadTab();
						return false;
					});
		this.jq_error = jq_content.find('.error');
	},
	writeError: function(err) {
		this.jq_error.text(err).show().delay(2000).fadeOut(3000);
	},
	loadTab: function(name) {
		var	self = this,
			jq_tab = this.tabsContainer.getActiveTab(),
			jq_content = this.tabsContainer.getActiveContent();
		function cb() {
			self.channels.push(new ytplm.channel(name, jq_tab, jq_content));
		}
		if (name)
			cb();
		else
			ytplm.connection.login(cb);
	}
};
