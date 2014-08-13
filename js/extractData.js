ytplm.extractData = function(ytFn, ytOpt, callback) {
	var arr = [];
	function query(page) {
		if (page)
			ytOpt.pageToken = page;
		ytFn(ytOpt).execute(function(data) {
			arr = arr.concat(data.items);
			if (data.nextPageToken)
				query(data.nextPageToken);
			else
				callback(arr);
		});
	}
	query();
}
