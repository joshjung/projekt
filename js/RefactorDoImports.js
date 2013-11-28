fs = require("fs");

module.exports = {
	run: function(project, callback) {
		fs.readFile("." + project.settings.requireMain, function(err, data) {
			if (err) throw err;

			requireOutputFilePrev = "" + data;

			var classInfos = project.scanResults.classes;

			// We loop through every file...
			for (var i = 0; i < classInfos.length; i++) {
				// We load the contents of the file...
				var contents = "" + fs.readFileSync(classInfos[i].fullPath);

				// We loop through every import and see if it exists in the file...
				for (var j = 0; j < classInfos.length; j++) {
					// We look for the text 'ClassName"' which indicates someone has typed
					// out the classname followed by a quotation mark. In that case we want
					// to inject the full path, making sure it is resolved properly.
					var quotes = ["\"", "'"];

					for (var q = 0; q < quotes.length; q++) {
						var ix = contents.toUpperCase().indexOf(classInfos[j].js.className.toUpperCase() + quotes[q]);

						if (ix != -1) {
							// Now we iterate backwards until we find the starting quotation mark.
							var startIX = findReverse(contents, ix, quotes[q]) + 1;
							var endIX = ix + classInfos[j].js.className.length;

							contents = replaceMidWith(contents, startIX, endIX, classInfos[j].js.packageName + "." + classInfos[j].js.className);

							fs.writeFileSync(classInfos[i].fullPath, contents);
						}
					}
				}
			}

			callback();
		});
	}
};