Parametric Analysis Tool (PAT)
==============

The Parametric Analysis Tool (PAT) is part of the OpenStudio collection of software tools.  

For more information and documentation on OpenStudio, visit the [OpenStudio website](https://www.openstudio.net/) or the [OpenStudio GitHub](https://github.com/NREL/OpenStudio) repo.  User support is available via the community moderated question and answer resource [unmethours.com](https://unmethours.com/questions/).

If you find a bug, you can help us by [submitting an issue](https://github.com/NREL/OpenStudio-PAT/issues).  Guidelines for issue submission and prioritization can be found on the [OpenStudio wiki](https://github.com/NREL/OpenStudio/wiki/Issue-Prioritization). 

# Development

PAT is an electron app.

* Install the following and make sure they are in your path:
	* node v18
	* npm
	* bower
	* gulp


* Clone the PAT repo and install all dependencies:

	```
	git clone https://github.com/NREL/OpenStudio-PAT.git
	npm install
	bower install
	gulp installDeps
	```

* Download the latest OpenStudio iteration installer https://github.com/NREL/OpenStudio/releases and run the installer. In the graphical interface, choose <project-root>/depend/OpenStudio as the installation prefix. The minimum required components are the ruby bindings and the openstudio cli. App, PAT, Plugin, etc are not required.

* Build the PAT app:	

	```
	npm run build
	```

* Start the PAT application in develop mode:

	```
	npm run start
	```

