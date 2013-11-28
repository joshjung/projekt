var find = function(dir, callback, filter, recurse, found, waiter) {
	waiter = waiter ? waiter : {
		waitCount: 0
	};

	found = found ? found : [];
	recurse = recurse == null ? true : recurse;

	waiter.waitCount++;

	fs.readdir(dir, function(err, files) {
		if (err) {
			console.log(err);
			return;
		}

		var filteredFiles = [];

		for (var i = 0; i < files.length; i++) {
			var filename = dir + "/" + files[i];
			var stat = fs.statSync(filename);

			var findToken = null;

			if (stat.isDirectory()) {
				find(filename, callback, filter, recurse, found, waiter);
			} else if (!filter || (findToken = filter.filter(files[i], filename, stat)) != null) {
				found.push(findToken);
			}
		}

		waiter.waitCount--;

		if (waiter.waitCount == 0) {
			callback(found);
		}
	});
};

module.exports = {
	find: find
};