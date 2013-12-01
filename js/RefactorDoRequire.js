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

			for (var i = 0; i < project.scanResults.classes.length; i++) {
				var ci = project.scanResults.classes[i];

				requireOutputFile += prefix + "\"" + ci.js.packageName + project.settings.packageDelimiter + ci.js.className + "\": \"" + project.settings.requireMainJSPathPrefix + ci.js.className + "\",\n";
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