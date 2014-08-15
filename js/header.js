ytplm.header = {
	init: function() {
		var jq_scope = $('#header');
		jq_scope.find('.login').click(function() {
			ytplm.connection.login();
			return false;
		});
		jq_scope.find('.logout').click(function() {
			ytplm.connection.logout();
			return false;
		});
	}
};
