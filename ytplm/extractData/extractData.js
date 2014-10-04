ytplm.extractData = function(ytFn, ytOpt, callback, singlePage) {
	var arr;
	function query(page) {
		if (page)
			ytOpt.pageToken = page;
		ytFn(ytOpt).execute(function(data) {
			lg(data);
			if (data.items)
				arr = !arr
					? data.items
					: arr.concat(data.items);
			if (data.nextPageToken && !singlePage)
				query(data.nextPageToken);
			else
				callback(arr);
		});
	}
	query();
}
