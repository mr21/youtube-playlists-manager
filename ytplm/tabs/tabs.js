ytplm.tabs = {
	init: function() {
		var
			self = this,
			jq_scope = $('.jqtabs'),
			jq_formNewTab = jq_scope.find('.jqtabs-contents .newTab'),
			plugin_tabs = $.plugin_tabs(jq_scope, {
				onChange: function(jq_tab, jq_content) {
					if (jq_content.is(':empty'))
						self.showForm();
					else
						self.hideForm();
				},
				onNewTab: function(jq_tab, jq_content) {
					jq_tab.html(
						'<div>'+
							'<span></span>'+
							'<a title="Close tab" class="jqtabs-btnCloseTab header-link fa fa-times-circle"></a>'+
						'</div>'
					);
					jq_content.addClass('channel');
				},
				onAfterRemoveTab: function() {
					if (1 === self.tabsContainer.getTabs().length)
						self.tabsContainer.newTabAppend();
				}
			});

		this.tabsContainer = plugin_tabs.container[0];
		this.jq_formNewTab = jq_formNewTab;
		this.channels = [];

		jq_formNewTab
			.submit(function() {
				self.loadTab(jq_formNewTab[0][0].value);
				return false;
			})
			.find('.login').click(function() {
				self.loadTab();
				return false;
			});
		this.tabsContainer.newTabAppend();
	},
	showForm: function() {
		this.jq_formNewTab.show();
	},
	hideForm: function() {
		this.jq_formNewTab.hide();
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
