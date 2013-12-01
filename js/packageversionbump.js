fs = require("fs");
StringUtil = require("./util/StringUtil");

var parseVersions = function(data) {
	data = data.replace("\"", "");

	versions = [];

	while (versions.length != 3) {
		data = data.substr(1, data.length);
		var version = parseInt(data);

		if (!isNaN(version)) {
			versions.push(version);
			data = data.substr(data.search("."), 20);
		}
	}

	data = data.substr(data.search("\""), data.length);

	versions.str = data;

	return versions;
};

fs.readFile("./package.json", function(err, data) {
	if (err) throw err;

	var originalData = data = "" + data;
	
	var regex = new RegExp("version\":");
	var match = regex.exec(data);

	if (match == null) {
		throw "Could not find version location in file.";
	}

	data = data.substr(match.index, data.length);
	versions = parseVersions(data);
	data = versions.str;

	oldVersion = versions[0] + "." + versions[1] + "." + versions[2];

	versions[2]++;

	newVersion = versions[0] + "." + versions[1] + "." + versions[2];

	originalData = StringUtil.replaceMidWith(originalData, match.index, originalData.search(data), "version\": \"" + newVersion);

	console.log("package.json: " + oldVersion + " -> " + newVersion);

	fs.writeFile("./package.json", originalData, function(err2) {
		if (err2) throw err2;
	});
});