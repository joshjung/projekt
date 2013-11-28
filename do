#!/usr/local/bin/node

project = require("./jsProject/jsProject");

var instructions = {
	scan: {
		desc: "Dumps a JSON of all the project scanned info to the standard out.",
		run: function() {
			project.scan(function(results) {
				console.log(results);
			});
		}
	},
	imports: {
		desc: "Runs through all the javascript class files and cleans up the imports.",
		run: function() {
			project.imports(function() {
				console.log("Refactoring of imports in all javascript classes has completed successfully.");
			});
		}
	},
	require: {
		desc: "Rebuilds your project.json:requireMain.js file to match all the JS classes in your project.",
		run: function() {
			project.require(function() {
				console.log("Refactoring of " + project.settings.requireMain + " has completed successfully.");
			});
		}
	}
};

if (process.argv.length == 2) {
	var thr = "ERROR: Must provide at least one instruction: node proj/do.js <instruction>\n\n";

	for (var instruction in instructions) {
		thr += " * " + instruction + ": " + instructions[instruction].desc + "\n";
	}

	console.log(thr);

	return;
}

instructions[process.argv[2]].run();
