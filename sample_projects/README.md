#PAT Example Projects

This directory contains a number of sample and test projects for PAT 2.x along with supporting files.

1. __calibration_data__ - Contains 2013 consumption data for NREL's Site Entrance Building (SEB) used in the SEB test projects.
2. __seeds__ - Contains the SEB seed model used in all the SEB test projects along with seeds that can be used in the Office_HVAC and Office_Study examples.
3. __weather__ - Contains 2013 AMY data used in the SEB test projects and a weather file used in the Office_HVAC and Office_Study examples.
4. __Office_HVAC__ - A simple manual-mode project that can be run locally or in the cloud.  It applies multiple "AEDG" HVAC measures to an office building.
5. __Office_Study__ - This project can be run in manual mode or as a DOE/LHS example in the cloud.  It starts with an empty seed model, applies the DOE prototype measure to create small, medium, and large offices, then applies WWR and LPD measures.  It is a good demonstration of using PAT to build potential studies, and is a useful test of the Standards Gem with OpenStudio server.
6. __original_SEB_spreadsheets__ - The original SEB spreadsheet input files from the [OpenStudio Analysis Spreadsheet repo.](https://github.com/NREL/OpenStudio-analysis-spreadsheet)
7. __SEB*__ - SEB project directories are PAT projects that correspond to the SEB spreadsheets, and are used to demonstrate and test OpenStudio Server's various algorithms for sampling and optimization.  Many of these projects are used to perform a model calibration of NREL's Site Entrance Building utilizing 2013 consumption and AMY data.
