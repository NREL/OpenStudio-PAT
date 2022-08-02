Parametric Analysis Tool (PAT)
==============

The Parametric Analysis Tool (PAT) is part of the OpenStudio collection of software tools.

For more information and documentation on OpenStudio, visit the [OpenStudio website](https://www.openstudio.net/) or the [OpenStudio GitHub](https://github.com/NREL/OpenStudio) repo.  User support is available via the community moderated question and answer resource [unmethours.com](https://unmethours.com/questions/).

If you find a bug, you can help us by [submitting an issue](https://github.com/NREL/OpenStudio-PAT/issues).  Guidelines for issue submission and prioritization can be found on the [OpenStudio wiki](https://github.com/NREL/OpenStudio/wiki/Issue-Prioritization). 

# Development

PAT is an electron app. 

## Getting started

* Install node v18.7.0 and npm v8 if you don't have them already. You can [use these commands](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#checking-your-version-of-npm-and-nodejs) to check if they are installed. If you don't have them, you can download them with a [Node version manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#checking-your-version-of-npm-and-nodejs) (recommended), an OS-compatible [package manager](https://nodejs.org/en/download/package-manager/), or a [pre-built installer](https://nodejs.org/en/download/current/).

* Use the following commands to clone the PAT repo and install all dependencies:

	```
	git clone https://github.com/NREL/OpenStudio-PAT.git
	npm install
	npx bower install
	npx gulp installDeps
	```

* Start the PAT application in develop mode:

	```
	npm run start
	```

