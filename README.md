Projekt
=========

A Javascript project manager, including project scanning, refactoring, and optimization tools.

Requirements
=========

Projekt assumes your application is using require.js.

Installation
=========

Projekt is installed via node package manager and is designed to be installed globally:

`npm install projekt -g`

You may need sudo permissions in order for npm to install the command-line script.

project-settings.json
=========

Each project is required to have its own `project-settings.json` in the root directory. Here is an example:

	{
		// The root directory publicly visible on your site (e.g. "/public")
		"publicDir": "",						
		// The root directory inside publicDir where your javascript files are to be scanned.
		"javascriptRootDir": "/demo",			
		"requireMainJSPathPrefix": "",					
		// The location of the root data-main require.js file
		"requireMain": "/demo/main.js",			
		// The token inside of your requireMain that is the prefix for injecting generated require.js mappings
		"outputStartToken": "/** GENERATED REQUIRE START **/",
		// The token inside of your requireMain that is the postfix for injecting generated require.js mappings
		"outputEndToken": "/** GENERATED REQUIRE END **/",
		// The delimiter for package names. By default this is period.
		"packageDelimiter": "."					
	}

Introduction
==========

Once installed, navigate to the directory of a Projekt project and simply type:

	projekt

To see the options to run.