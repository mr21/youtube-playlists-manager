ytplm.extractData = function(ytFn, ytOpt, callback) {
	var arr = [];
	function query(page) {
		if (page)
			ytOpt.pageToken = page;
		ytFn(ytOpt).execute(function(data) {
			arr = arr.concat(data.items);
			if (data.pageInfo.nextPageToken)
				query(data.pageInfo.nextPageToken);
			else
				callback(arr);
		});
	}
	query();
}
