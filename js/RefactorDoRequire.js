fs = require("fs");
StringUtil = require("./util/StringUtil");

module.exports = {
	run: function(project, callback) {
		fs.readFile("." + project.settings.requireMain, function(err, data) {
			if (err) throw err;

			var requireOutputFilePrev = "" + data;

			var requireOutputFile = null;
			var replaceIndexStart = requireOutputFilePrev.indexOf(project.settings.outputStartToken) + project.settings.outputStartToken.length;
			var replaceIndexEnd = requireOutputFilePrev.indexOf(project.settings.outputEndToken);

			if (replaceIndexStart == -1 || replaceIndexEnd == -1) {
				throw "Could not find the start or end token in the file: '" + project.settings.outputStartToken + "' or '" + project.settings.outputEndToken + "'";
			}

			var prefix = StringUtil.getFormatPrefixAtPoint(requireOutputFilePrev, requireOutputFilePrev.indexOf(project.settings.outputStartToken));

			requireOutputFile = requireOutputFilePrev.substr(0, replaceIndexStart) + "\n";

			var classes = project.scanResults.classes.concat();

			classes.sort(function(a, b) {
				return (a.js.packageName + project.settings.packageDelimiter + a.js.className) < (b.js.packageName + project.settings.packageDelimiter + b.js.className);
			});

			var lastPackageName = "";
			for (var i = 0; i < classes.length; i++) {
				var ci = classes[i];

				if (lastPackageName != ci.js.packageName) {
					requireOutputFile += prefix + "//---------------------------------\n";
					requireOutputFile += prefix + "// " + ci.js.packageName.toUpperCase() + "\n";
					requireOutputFile += prefix + "//---------------------------------\n";
				}

				requireOutputFile += prefix + "\"" + ci.js.packageName + project.settings.packageDelimiter + ci.js.className + "\": \"" + ci.js.packagePath + "\",\n";

				lastPackageName = ci.js.packageName;
			}

			requireOutputFile = requireOutputFile.substr(0, requireOutputFile.length - 2) + "\n";

			requireOutputFile += prefix + requireOutputFilePrev.substr(replaceIndexEnd, requireOutputFilePrev.length);

			fs.writeFile("." + project.settings.requireMain, requireOutputFile, function(err) {
				if (err) throw err;
				callback();
			});
		});
	}
};