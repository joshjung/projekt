fs = require("fs");
project = require("./Projekt");
FileUtil = require("./util/FileUtil");
StringUtil = require("./util/StringUtil");

var classNameDuplicateCheck = {};
var errors = [];

var getJSCodeInformation = function(path) {
	if (path.charAt(0) == "/") {
		path = path.substr(1);
	}

	if (StringUtil.endsWith(path, ".js")) {
		path = path.substr(0, path.length - 3);
	}

	var split = path.split("/");

	var className = split[split.length - 1];

	var packageName = "";

	for (var i = 0; i < split.length - 1; i++) {
		packageName += (packageName.length ? project.settings.packageDelimiter : "") + split[i];
	}

	if (classNameDuplicateCheck[className] != null) {
		errors.push({
			message: "Duplicate class found: '" + className + "'.\n    at '" + packageName + "'\n    at '" + classNameDuplicateCheck[className] + "'\nClass names must be unique."
		});
	}

	classNameDuplicateCheck[className] = packageName;
	return {
		packageName: packageName,
		className: className,
		publicPath: project.settings.jsOutputPrefix + "/" + path
	};
};

var isClassFileFilter = {
	filter: function(name, fullPath, stat) {
		if (name.charAt(0) == name.charAt(0).toUpperCase() && StringUtil.endsWith(name, ".js")) {
			return {
				name: name,
				fullPath: fullPath,
				size: stat.size,
				js: getJSCodeInformation(fullPath.substr(project.settings.javascriptRootDirFull.length))
			};
		}

		return null;
	}
}

module.exports = {
	scan: function(callback) {
		project.readSettings(function(projectSettings) {
			FileUtil.find(project.settings.javascriptRootDirFull, function(found) {
				found.sort(function(a, b) {
					if (a.fullPath > b.fullPath)
						return 1;
					if (a.FullPath < b.fullPath)
						return -1;

					return 0;
				});

				callback({
					classes: found,
					errors: errors
				});

			}, isClassFileFilter);
		});
	}
};