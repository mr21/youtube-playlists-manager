/*
	jQuery - tabs - 1.3
	https://github.com/Mr21/jquery-tabs
*/

$.plugin_tabs = function(parent, options) {
	return new $.plugin_tabs.obj(
		parent.jquery
			? parent.eq(0)
			: $(parent),
		options || {}
	);
};

$.plugin_tabs.obj = function(jq_parent, options) {
	this.class_container      = options.class_container      || 'jqtabs';
	this.class_tabs           = options.class_tabs           || 'jqtabs-tabs';
	this.class_tab            = options.class_tab            || 'jqtabs-tab';
	this.class_tabActive      = options.class_tabActive      || 'jqtabs-tabActive';
	this.class_tabHole        = options.class_tabHole        || 'jqtabs-tabHole';
	this.class_contents       = options.class_contents       || 'jqtabs-contents';
	this.class_content        = options.class_content        || 'jqtabs-content';
	this.class_contentActive  = options.class_contentActive  || 'jqtabs-contentActive';
	this.class_btnNewTab      = options.class_btnNewTab      || 'jqtabs-btnNewTab';
	this.class_btnCloseTab    = options.class_btnCloseTab    || 'jqtabs-btnCloseTab';
	this.class_tabClosing     = options.class_tabClosing     || 'jqtabs-tabClosing';
	this.class_contentClosing = options.class_contentClosing || 'jqtabs-contentClosing';
	this.jq_parent = jq_parent;
	this.container = [];
	if (!options.noDragndrop && $.plugin_dragndrop)
		this._dragndropInit();
	this.applyThis(options.applyThis);
	this.duration(options.duration === undefined ? 200 : options.duration);
	this.onChange(options.onChange);
	this.onNewTab(options.onNewTab);
	this._watchDom();
	this._initContainer(jq_parent);
};

$.plugin_tabs.obj.prototype = {
	// public:
	applyThis: function(app) {
		if (app !== undefined)
			return this.app = app, this;
		return this.app;
	},
	duration: function(ms) {
		if (arguments.length === 0)
			return this.ms;
		this.ms = ms;
		if (this.plugin_dragndrop)
			this.plugin_dragndrop.duration(ms);
		return this;
	},
	onChange: function(f) { this.cbChange = f; return this; },
	onNewTab: function(f) { this.cbNewTab = f; return this; },
	// private:
	_initContainer: function(jq_elem) {
		var self = this;
		if (!jq_elem.hasClass(this.class_container))
			jq_elem = jq_elem.find('.' + this.class_container);
		jq_elem.each(function() {
			if (!this._jqtabs_ready) {
				var	jq_this = $(this),
					obj = new $.plugin_tabs.container(jq_this, self);
				this._jqtabs_ready = true;
				if (this.id)
					self.container[this.id] = obj;
				else
					self.container.push(obj);
			}
		});
	},
	_watchDom: function() {
		var self = this;
		this.jq_parent.on('DOMNodeInserted', function(e) {
			self._initContainer($(e.target));
		});
	},
	_dragndropInit: function() {
		this.plugin_dragndrop =
			$.plugin_dragndrop(this.jq_parent, {
				dropClass     : this.class_tabs,
				dragClass     : this.class_tab,
				dragHoleClass : this.class_tabHole,
				noSelection   : true
			})
			.onDrag(function(jq_drops, jq_tabs) {
				jq_drops[0]._jqtabs_container._onDrag(jq_tabs);
			})
			.onDrop(function(jq_drops, jq_tabs) {
				var container = jq_drops[0]._jqtabs_container;
				jq_tabs[0]._jqtabs_container = container;
				container._onDrop(jq_tabs);
			});
	}
};

$.plugin_tabs.container = function(jq_parent, plugin_jqtabs) {
	this.plugin_jqtabs = plugin_jqtabs;
	this.jq_activeTab = null;
	this.jq_parent = jq_parent;
	this.jq_tabs = this.jq_parent.find('.' + plugin_jqtabs.class_tabs);
	this.jq_contents = this.jq_parent.find('.' + plugin_jqtabs.class_contents);
	this.jq_btnNewTabs = this.jq_tabs.find('.' + plugin_jqtabs.class_btnNewTab);
	this.jq_tabs[0]._jqtabs_container = this;
	this._findTabs();
	this._init();
};

$.plugin_tabs.container.prototype = {
	// public:
	getTabs: function() {
		return this.jq_arrayTabs;
	},
	getActiveTab: function() {
		return this.jq_activeTab;
	},
	getActiveContent: function() {
		return this.jq_activeTab
			? this.jq_activeTab[0]._jqtabs_jqContent
			: null;
	},
	prevTab: function() {
		this._clickTab(this.jq_activeTab.prevAll('.' + this.plugin_jqtabs.class_tab).eq(0));
		return this;
	},
	nextTab: function() {
		this._clickTab(this.jq_activeTab.nextAll('.' + this.plugin_jqtabs.class_tab).eq(0));
		return this;
	},
	newTabPrepend: function() {
		var jq_tabs = this.getTabs();
		this._newTab(
			jq_tabs[0]
				? 'insertBefore'
				: 'prependTo',
			jq_tabs[0]
				? jq_tabs.eq(0)
				: this.jq_tabs
		);
		return this;
	},
	newTabAppend:  function() {
		var jq_tabs = this.getTabs();
		this._newTab(
			jq_tabs[0]
				? 'insertAfter'
				: 'prependTo',
			jq_tabs[0]
				? jq_tabs.eq(-1)
				: this.jq_tabs
		);
		return this;
	},
	removeTab: function(jq_tab, delay) {
		var self = this,
			jq_content = jq_tab[0]._jqtabs_jqContent;
		function f() {
			if (jq_tab[0] === self.jq_activeTab[0]) {
				var jq_next = jq_tab.nextAll('.' + self.plugin_jqtabs.class_tab + ':first');
				if (!jq_next[0])
					jq_next = jq_tab.prevAll('.' + self.plugin_jqtabs.class_tab + ':first');
			}
			jq_tab.remove();
			jq_content.remove();
			self._findTabs();
			if (jq_next) {
				if (jq_next[0])
					self._clickTab(jq_next);
				else
					self.jq_activeTab = null;
			}
		}
		if (delay === undefined)
			delay = this.plugin_jqtabs.ms;
		if (!delay) {
			f();
		} else {
			jq_tab.addClass(this.plugin_jqtabs.class_tabClosing);
			jq_content.addClass(this.plugin_jqtabs.class_contentClosing);
			setTimeout(f, delay);
		}
		return this;
	},
	// private:
	_findTabs: function() {
		this.jq_arrayTabs = this.jq_tabs.children('.' + this.plugin_jqtabs.class_tab);
	},
	_newTab: function(attachFn, element) {
		var
			jq_tab = $('<div>')
				.addClass(this.plugin_jqtabs.class_tab)
				[attachFn](element),
			jq_content = $('<div>')
				.addClass(this.plugin_jqtabs.class_content)
				.appendTo(this.jq_contents);
		this._findTabs();
		if (this.plugin_jqtabs.cbNewTab)
			this.plugin_jqtabs.cbNewTab.call(this.plugin_jqtabs.app, jq_tab, jq_content);
		this._initTab(jq_tab, jq_content);
		this._clickTab(jq_tab);
	},
	_init: function() {
		var	self = this,
			jq_tabs = this.getTabs(),
			jq_contents = this.jq_contents.children('.' + this.plugin_jqtabs.class_content);
		jq_tabs.each(function(i) {
			var jq_tab = jq_tabs.eq(i);
			self._initTab(jq_tab, jq_contents.eq(i));
			if (jq_tab.hasClass(self.plugin_jqtabs.class_tabActive))
				self._activeTab(jq_tab);
		});
		this.jq_btnNewTabs.click(function() {
			self.newTabAppend();
			return false;
		});
		if (!this.jq_activeTab && jq_tabs[0])
			this._activeTab(jq_tabs.eq(0));
	},
	_initTab: function(jq_tab, jq_content) {
		jq_tab[0]._jqtabs_container = this;
		jq_tab[0]._jqtabs_jqContent = jq_content;
		jq_tab.find('.' + this.plugin_jqtabs.class_btnCloseTab)
			.mousedown(false)
			.click(function() {
				jq_tab[0]._jqtabs_container.removeTab(jq_tab);
				return false;
			});
		jq_tab.mousedown(function(e) {
			if (e.button === 0)
				this._jqtabs_container._clickTab(jq_tab);
		});
	},
	_activeTab: function(jq_tab) {
		this.jq_activeTab = jq_tab.addClass(this.plugin_jqtabs.class_tabActive);
		jq_tab[0]._jqtabs_jqContent.addClass(this.plugin_jqtabs.class_contentActive);
		if (this.plugin_jqtabs.cbChange)
			this.plugin_jqtabs.cbChange(jq_tab, jq_tab[0]._jqtabs_jqContent);
	},
	_desactiveTab: function() {
		if (this.jq_activeTab[0]) {
			this.jq_activeTab.removeClass(this.plugin_jqtabs.class_tabActive);
			this.jq_activeTab[0]._jqtabs_jqContent.removeClass(this.plugin_jqtabs.class_contentActive);
		}
	},
	_clickTab: function(jq_tab) {
		if (jq_tab[0] && (this.jq_activeTab === null || jq_tab[0] !== this.jq_activeTab[0])) {
			if (this.jq_activeTab)
				this._desactiveTab();
			this._activeTab(jq_tab);
		}
	},
	_onDrag: function(jq_tab) {
		jq_tab[0]._jqtabs_jqContent.detach();
		this._findTabs();
		var jq_newTabActive = this.getTabs().eq(0);
		if (jq_newTabActive[0])
			this._activeTab(jq_newTabActive);
		else
			this.jq_activeTab = null;
	},
	_onDrop: function(jq_tab) {
		this._findTabs();
		if (this.jq_activeTab)
			this._desactiveTab();
		this.jq_contents.append(jq_tab[0]._jqtabs_jqContent);
		this._activeTab(jq_tab);
	}
};
