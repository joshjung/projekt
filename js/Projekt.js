scanner = require("./ProjektScanner");
refactorDoRequire = require("./RefactorDoRequire");
refactorDoImports = require("./RefactorDoImports");

// This will allow us to write our output to a pipe and not die until the other end process all of our output.
process.on("SIGPIPE", process.exit);

var ProjectLibrary = function() {
	this.settings = null;
	this.scanResults = null;
};

ProjectLibrary.prototype = {
	setupSettingDefaults: function() {
		this.settings = this.settings ? this.settings : {};
		this.settings.packageDelimiter = this.settings.packageDelimiter ? this.settings.packageDelimiter : ".";
		this.settings.javascriptRootDirFull = fs.realpathSync(".") + this.settings.javascriptRootDir;

		console.log(this.settings);
	},
	readSettings: function(callback) {
		if (this.settings) {
			callback(this.settings);
		}

		var self = this;

		fs.readFile('./project-settings.json', function(err, data) {
			if (err) throw err;

			self.settings = JSON.parse(data);

			self.setupPackageDefaults();

			callback(self.settings);
		});
	},
	readStdIn: function(callback) {
		this.stdin = process.openStdin();
		this.stdinData = "";

		stdin.on('data', function(chunk) {
			this.stdinData += chunk;
		});

		stdin.on('end', function() {
			callback(this.stdinData);
		});
	},
	scan: function(callback) {
		if (this.scanResults) {
			callback(this.scanResults);
		}

		var self = this;

		scanner.scan(function(results) {
			self.scanResults = results;
			callback(results);
		});
	},
	require: function(callback) {
		var self = this;
		this.readSettingsAndScan(function() {
			refactorDoRequire.run(self, function() {
				callback();
			});
		});
	},
	imports: function(callback) {
		var self = this;
		this.readSettingsAndScan(function() {
			refactorDoImports.run(self, function() {
				callback();
			});
		});
	},
	readSettingsAndScan: function(callback) {
		var self = this;
		this.readSettings(function(project) {
			self.scan(function(results) {
				callback();
			});
		});
	}

};

module.exports = new ProjectLibrary();