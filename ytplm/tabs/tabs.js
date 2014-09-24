ytplm.tabs = {
	init: function() {
		var
			self = this,
			jq_scope = $('.jqtabs'),
			jq_divNewTab = jq_scope.find('.jqtabs-contents .newTab'),
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
							'<a title="Close tab" class="jqtabs-btnCloseTab fa fa-times-circle"></a>'+
						'</div>'
					);
					jq_content.addClass('channel');
				}
			});

		this.tabsContainer = plugin_tabs.container[0];
		this.jq_divNewTab = jq_divNewTab;
		this.channels = [];

		jq_divNewTab.find('.login').click(function() {
			ytplm.connection.login(function() {
				self.loadTab(true);
			});
			return false;
		});
		this.tabsContainer.newTabAppend();
	},
	showForm: function() {
		this.jq_divNewTab.show();
	},
	hideForm: function() {
		this.jq_divNewTab.hide();
	},
	loadTab: function(mine) {
		this.channels.push(new ytplm.channel(
			this.tabsContainer.getActiveTab(),
			this.tabsContainer.getActiveContent(),
			mine
		));
	}
};
