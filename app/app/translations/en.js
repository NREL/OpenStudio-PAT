/***********************************************************************************************************************
 *  OpenStudio(R), Copyright (c) 2008-2018, Alliance for Sustainable Energy, LLC. All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
 *  following conditions are met:
 *
 *  (1) Redistributions of source code must retain the above copyright notice, this list of conditions and the following
 *  disclaimer.
 *
 *  (2) Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
 *  following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 *  (3) Neither the name of the copyright holder nor the names of any contributors may be used to endorse or promote
 *  products derived from this software without specific prior written permission from the respective party.
 *
 *  (4) Other than as required in clauses (1) and (2), distributions in any form of modifications or other derivative
 *  works may not use the "OpenStudio" trademark, "OS", "os", or any other confusingly similar designation without
 *  specific prior written permission from Alliance for Sustainable Energy, LLC.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 *  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER, THE UNITED STATES GOVERNMENT, OR ANY CONTRIBUTORS BE LIABLE FOR
 *  ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 *  PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 *  AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **********************************************************************************************************************/
export default {
  dependency: {
    title: 'PAT Dependency Download Status'
  },
  modified: {
    title: 'ParametricAnalysisTool',
    heading: 'Modified Files',
    blurb: 'You have unsaved changes. Click the save button to save your changes, or click the cancel button to quit without saving.'
  },
  nestedProjectWarning: {
    title: 'ParametricAnalysisTool',
    heading: 'Nested Project Warning',
    blurb: 'A pat.json file was found in your project path. You cannot nest a PAT project in another PAT project. Please choose another location for you current PAT project.'
  },
  saveAsInfo: {
    title: 'ParametricAnalysisTool',
    heading: 'SaveAs Information',
    blurb: 'A new server is now starting for your new project. Please be patient as this may take several minutes, depending on your computer. This dialog will close automatically once the server is fully started.'
  },
  whitespaceWarning: {
    title: 'ParametricAnalysisTool',
    heading: 'Whitespace Warning',
    blurb: 'You have whitespace in your project path, and this will likely cause problems. In the future, please remove all whitespace from your PAT project path.'
  },
  setProject: {
    title: 'Select a Project',
    blurb: 'Create a new or open an existing project',
    make: 'Make New Project',
    existing: 'Open Existing Project'
  },
  serverTools: {
    title: 'Server Troubleshooting Tools',
    start: 'Start Local Server',
    stop: 'Stop Local Server',
    ping: 'Ping Server and Set Status',
    viewServer: 'View Local Server',
    noProject: 'You must open a project first'
  },
  setMeasuresDir: {
    title: 'Set MyMeasures Directory',
    measuresDir: 'MyMeasures Directory'
  },
  projectName: {
    title: 'New Project',
    heading: 'New Project Name',
    blurb: 'This will be the name of the directory containing your project. In the next step, you will choose the location for your new project folder.'
  },
  toastr: {
    measureAdded: 'Measure added to project!',
    measureAddedError: 'Measure added to project, but unable to compute arguments',
    measureNameAlreadyAdded: 'Cannot add measure: measure names must be unique and there is already a measure with this name added to the project',
    measureDuplicated: 'Measure duplicated!',
    measureDuplicatedError: 'Error duplicating measure',
    downloadingMeasure: 'Downloading measure from the BCL...',
    measureDownloaded: 'Measure downloaded!',
    measureDownloadedError: 'Measure download error',
    openMeasure: 'Measure will open in a text editor for editing',
    updatedMeasureLocal: 'Measure successfully updated in your local BCL!',
    updatedMeasureProject: 'Measure successfully updated in your project!',
    updatingMeasureLocal: 'Updating measure in your local BCL!',
    updatingMeasureProject: 'Updating measure in your project!',
    designAltNameError: 'Cannot change design alternative name:  selected name is not unique',
    startLocalServer: 'Starting Local Server...this make take a while',
    localStartInProgressBeforeStop: 'Local Server start is in progress for this project, and must complete before it can be stopped...this may take a few minutes',
    connectedServer: 'Connected to server!',
    connectedServerError: 'Error: server did not start',
    stopLocalServer: 'Stopping Local Server...this make take a while',
    stoppedServer: 'Server stopped successfully!',
    stoppedServerError: 'Error: server could not be stopped',
    serverAlive: 'Server is Alive',
    serverOffline: 'Server is Offline',
    projectSaved: 'Project saved!',
    clusterSaved: 'Cluster details saved!',
    connectingCloud: 'Connecting to the cloud...this may take a few minutes',
    startingCloud: 'Starting cloud cluster...this may take up to 10 minutes',
    connectedCloud: 'Connected to AWS!',
    startedCloud: 'AWS server started!',
    connectedRemote: 'Connected to remote server!',
    connectedRemoteError: 'Error connecting to existing remote server',
    terminatingCluster: 'Terminating cloud clusters',
    terminatedCluster: 'Successfully terminated AWS cluster!  You should double check that the servers were terminated in the AWS Console',
    disconnectedRemote: 'Disconnected from remote server',
    disconnectedRemoteError: 'Could not disconnect from remote server',
    terminatedClusterError: 'Could not terminate AWS cluster...check the AWS console',
    downloadedResults: 'Results downloaded!',
    downloadedResultsError: 'Error downloading Results file',
    downloadedAllResults: 'All Results downloaded!',
    downloadedAllResultsError: 'Error downloading Results zip files',
    downloadedOsm: 'OSM downloaded!',
    downloadedOsmError: 'Error downloading OSM',
    downloadedAllOsm: 'All OSMs downloaded!',
    downloadedAllOsmError: 'Error downloading OSMs',
    downloadingResultsWarning: 'Downloading Results for all datapoints...this may take several minutes',
    downloadingOSMsWarning: 'Downloading OSMs for all datapoints...this may take several minutes',
    connectCredentialsError: 'Error connecting to AWS - No AWS Credentials Selected',
    startCredentialsError: 'Error starting AWS server - No AWS Credentials Selected',
    connectedCloudError: 'Error connecting to AWS',
    startedCloudError: 'Error starting AWS server',
    prepareExit: 'Preparing to exit...',
    amisError: 'Cannot retrieve OpenStudio Server Versions',
    noYaml: 'No AWS credentials selected. Cannot start/connect to AWS',
    noCluster: 'No cluster selected. Cannot start/connect to AWS',
    objFunctionGroupError: 'This algorithm needs at least 2 objective function groups defined on the outputs tab to run successfully',
    numberVariablesError: 'This algorithm needs at least 2 variables defined on the analysis tab to run successfully',
    projectNameError: 'Project cannot be named PAT',
    saveAsServerStartInProgress: 'Unable to "Save As" while server is starting. Please try again, once the server has fully started.',
    newServerStarted: 'New server started.'
  },
  analysis: {
    title: 'Analysis',
    projectName: 'Project Name',
    addMeasure: 'Add Measure',
    addMeasureOption: 'Add Measure Option',
    checkAll: 'Check to make all arguments variable',
    checkForUpdates: 'Check for Updates',
    cliDebug: 'CLI --debug',
    cliVerbose: 'CLI --verbose',
    timeoutWorkflow: 'Workflow Timeout',
    timeoutInitWorker: 'Initialize Worker Timeout',
    timeoutUploadResults: 'Upload Results Timeout',
    viewAlgorithmReference: 'View Algorithm Documentation',
    columns: {
      argumentName: 'Argument Name',
      shortName: 'Short Name',
      variable: 'Variable',
      variableSettings: 'Variable Settings'
    },
    defaultSeedModel: 'Default Seed Model',
    defaultWeatherFile: 'Default Weather File',
    deleteLastOption: 'Delete Last Option',
    duplicateMeasure: 'Duplicate Measure',
    duplicateMeasureAndOption: 'Duplicate Measure & Option',
    duplicateOption: 'Duplicate Option',
    energyplusMeasures: 'EnergyPlus Measures',
    modelToBaseInputsOn: 'Model To Base Inputs On',
    openstudioMeasures: 'OpenStudio Measures',
    reportingMeasures: 'Reporting Measures',
    algorithmicMethod: 'Algorithmic Method',
    helpAlgorithmicMethod: 'Specify the type of algorithm to be used to execute the analysis.',
    helpAnalysis: 'In Manual mode, users create Measure Options and set up different Design Alternatives by hand.  In Algorithmic mode, users specify ranges for each Measure Argument.  The Sampling Method that is selected will automatically create a series of Design Alternatives for the user.  Manual mode is most useful for  targeted analysis.  Algorithmic mode is most useful when the user wants to explore a large number of designs or wants to optimize for a certain outcome.',
    helpProjectyMeasuresAndOptions: 'A Measure is a script that is used to modify an energy model or create a report about the model.  Measures can be downloaded from the Building Component Library (BCL) or written by the user.',
    helpOpenStudioMeasures: 'An OpenStudio Measure is a script that modifies the OpenStudio model (.osm file).',
    helpEnergyPlusMeasures: 'An EnergyPlus Measure is a script that modifies the EnergyPlus model (.idf file).  This happens after the OpenStudio model (.osm) is translated to EnergyPlus format (.idf).  EnergyPlus Measures are typically used to add objects that are not yet supported by OpenStudio to the input file.',
    helpReportingMeasures: 'A Reporting Measure is a script that creates a report describing some aspect of the or the simulation results.  These Measures have access to the OpenStudio model, the EnergyPlus IDF, and the simulation results.',
    modalDeleteMeasure: {
      title: 'Delete Measure',
      message: 'Are you sure you want to delete this measure? Deleting this measure will result in the automatic saving of this project.'
    },
    type: {
      diagonal: 'Diagonal',
      nsga2: 'Nondominated Sorting Genetic Algorithm 2 (NSGA2)',
      spea2: 'Strength Pareto Evolutionary Algorithm 2 (SPEA2)',
      pso: 'Particle Swarm (PSO)',
      rgenoud: 'R-GENetic Optimization Using Derivatives (RGENOUD)',
      optim: 'Optim',
      lhs: 'Latin Hypercube Sampling (LHS)',
      morris: 'Morris Method',
      doe: 'Design Of Experiments (DOE)',
      preFlight: 'Pre Flight',
      singleRun: 'Single Run',
      sobol: 'Sobol',
      repeatRun: 'Repeat Run',
      baselinePerturbation: 'Baseline Perturbation',
      ga: 'Genetic Algorithm (GA)',
      gaisl: 'Island Parallel Genetic Algorithm (GAISL)',
      fast99: 'Fast99'
    },
    algorithmic: {
      helpAlgorithmSettings: 'These settings control the manner in which the given algorithm is executed. Please see each attribute for further details.',
      helpAdditionalAnalysisFiles: '',
      helpCLIDebug: 'This toggles the --debug option for the OpenStudio Command Line Interface (CLI), which is used to execute the simulation. If set to TRUE, this can create large simulate data point files and does degrade runtime performance.',
      helpCLIVerbose: 'This toggles the --verbose option for the OpenStudio Command Line Interface (CLI), which is used to execute the simulation. If set to TRUE, this flag can be used to print additional information for debugging.',
      helpTimeoutWorkflow: 'helpTimeoutWorkflow',
      helpTimeoutUploadResults: 'helpTimeoutUploadResults',
      helpTimeoutInitWorker: 'helpTimeoutInitWorker',
      helpServerScripts: 'For advanced use only; not required for general use of the application. If your analysis requires server and worker initialization or finalization scripts, add them here. Note that these scripts will not run on a local server; they can only be run on a cloud server.',
      helpServerInitialization: 'A shell script that runs before the analysis is begun. Your script will be renamed \'initialize.sh\'. If this script fails the analysis will be automatically set to a completed failed state.',
      helpServerFinalization: 'A shell script that runs after the analysis has finished, but before the analysis flag is set to completed.  Your script will be renamed \'finalize.sh\'. This script is run even if the analysis has failed.',
      helpWorkerInitialization: 'A shell script that runs on a worker container before each datapoint is executed.  Your script will be renamed \'initialize.sh\'.',
      helpWorkerFinalization: 'A shell script that runs on a worker container after a datapoint has been executed, even in the datapoint failed. Your script will be renamed \'finalize.sh\'.',
      helpScriptArguments: 'An array of arguments to pass to the script. Currently these arguments are dynamically parsed, meaning that expressions will be evaluated prior to being passed to the shell script.',
      algorithmSetting: 'Algorithm Settings',
      skipThisMeasure: 'Skip this measure',
      filesToIncludeMessage: 'If your analysis requires additional files to be uploaded to the server, list each directory to include along with the name of the folder to extract to on the server, below.',
      filesToInclude: 'Additional Analysis Files',
      dirToInclude: 'Directory to Include',
      selectDir: 'Select Directory',
      addDir: 'Add Directory',
      dirToUnpackTo: 'Directory Name to Unpack to on Server',
      server_initialization: 'Server Initialization Script',
      server_finalization: 'Server Finalization Script',
      worker_initialization: 'Worker Initialization Script',
      worker_finalization: 'Worker Finalization Script',
      selectScript: 'Select Script File',
      args: 'Script Arguments',
      addArg: 'Add Argument',
      serverScripts: 'Server Scripts',
      serverScriptsMessage: 'If your analysis requires server and worker initialization or finalization scripts, add them here.  Note that these scripts will not run on a local server; they can only be run on a cloud server.',
      modelDependentCustom: 'Or custom value (takes precedence)',
      warning: 'The selected variable setting is invalid for this algorithm.  The variable will be treated as a static argument when running the simulation.',
      grid: {
        max: 'Max',
        min: 'Min',
        maximum: 'maximum',
        measureInputs: 'Measure Inputs',
        minimum: 'minimum',
        mean: 'mean',
        name: 'Name',
        shortName: ' Short Name',
        stdDev: 'stdDev',
        deltaX: 'Delta X',
        distribution: 'distribution',
        relationToEUI: 'Relation to EUI',
        staticDefault: 'Static/Default',
        value: 'Value',
        variableSettings: 'Variable Settings',
        weight: 'Weight'
      }
    },
    manual: {
      projectMeasuresAndOptions: 'Project Measures and Options',
      modalSelectOptions: {
        title: 'Select Options',
        message: 'Select which options you would like to duplicate in this measure.',
        selectAll: 'Select All',
        deselectAll: 'Deselect All'
      },
      modalEditOptionDescription: 'Edit Option Description',
      modalEditModelDependentChoiceArg: 'Edit Model-Dependent Choice Argument',
      modalEditChoiceEnum: 'Select from Choices List',
      modalEditChoiceText: 'Enter Custom Choice',
      modalEditChoiceValue: 'Argument Value'
    }
  },
  bcl: {
    title: 'Measure Library',
    wait: 'Please wait',
    aside: {
      attributes: 'Attributes',
      description: 'Description',
      files: 'Files',
      maxCompatibleVersion: 'Max Compatible Version',
      minCompatibleVersion: 'Min Compatible Version',
      modelerDescription: 'Modeler Description',
      error: 'Error',
      group: 'Group',
      tags: 'Tags'
    },
    category: {
      title: 'Category',
      'Cases and Walkins': 'Cases and Walkins',
      Characteristics: 'Characteristics',
      Compressors: 'Compressors',
      Condensers: 'Condensers',
      'Construction Sets': 'Construction Sets',
      Cooling: 'Cooling',
      Daylighting: 'Daylighting',
      Distribution: 'Distribution',
      Economics: 'Economics',
      'Electric Equipment': 'Electric Equipment',
      'Electric Lighting': 'Electric Lighting',
      'Electric Lighting Controls': 'Electric Lighting Controls',
      'Energy Recovery': 'Energy Recovery',
      Envelope: 'Envelope',
      Equipment: 'Equipment',
      'Equipment Controls': 'Equipment Controls',
      Fenestration: 'Fenestration',
      Form: 'Form',
      'Gas Equipment': 'Gas Equipment',
      'Heat Reclaim': 'Heat Reclaim',
      'Heat Rejection': 'Heat Rejection',
      Heating: 'Heating',
      HVAC: 'HVAC',
      'HVAC Controls': 'HVAC Controls',
      Infiltration: 'Infiltration',
      'Life Cycle Cost Analysis': 'Life Cycle Cost Analysis',
      'Lighting Equipment': 'Lighting Equipment',
      'Onsite Power Generation': 'Onsite Power Generation',
      Opaque: 'Opaque',
      People: 'People',
      'People Schedules': 'People Schedules',
      Photovoltaic: 'Photovoltaic',
      QAQC: 'QAQC',
      Refrigeration: 'Refrigeration',
      'Refrigeration Controls': 'Refrigeration Controls',
      Reporting: 'Reporting',
      'Service Water Heating': 'Service Water Heating',
      'Space Types': 'Space Types',
      Troubleshooting: 'Troubleshooting',
      Ventilation: 'Ventilation',
      'Water Heating': 'Water Heating',
      'Water Use': 'Water Use',
      'Whole Building': 'Whole Building',
      'Whole Building Schedules': 'Whole Building Schedules',
      'Whole System': 'Whole System'
    },
    columns: {
      add: 'Add',
      date: 'Date',
      name: 'Name',
      edit: 'Edit/Copy',
      status: 'Update',
      type: 'Type'
    },
    edit: 'Edit',
    editAndCopy: 'Edit and Copy',
    filters: {
      title: 'Filters',
      bclOnline: 'BCL (Online)',
      local: 'Local',
      measureDirectory: 'Measure Directory',
      myProject: 'My Project'
    },
    search: 'Search',
    type: {
      title: 'Type',
      energyplus: 'EnergyPlus',
      openstudio: 'OpenStudio',
      reporting: 'Reporting'
    },
    createNewMeasure: {
      title: 'Create New Measure',
      name: 'Name',
      className: 'Class Name',
      description: 'Description',
      modelerDescription: 'Modeler Description',
      measureType: 'Measure Type',
      taxonomy: 'Taxonomy',
      createNewMeasure: 'Create New Measure',
      createMeasure: 'Create Measure and Open for Editing'
    },
    duplicateMeasure: {
      title: 'Duplicate Measure',
      name: 'Name',
      displayName: 'Display Name',
      description: 'Description',
      modelerDescription: 'Modeler Description'
    },
    updateMeasure: {
      title: 'Update Measure',
      name: 'Name',
      displayName: 'Display Name',
      updateProjectMeasure: 'A local update is available for this measure.  Apply update to your Project?',
      updateLocalFromBCL: 'An update for this local measure is available from the BCL. Update Local BCL measure?',
      updateLocalAndProject: 'An update for this local measure is available from the BCL.  Update Local BCL and Apply to your Project?',
      updateProjectButton: 'Update Project',
      updateLocalLibButton: 'Update Local Library',
      updateLocalLibOnlyButton: 'Update Local Library Only',
      updateBothButton: 'Update Local Library and Project'
    },
    displayErrors: {
      title: 'Measure Manager Warnings and Errors',
      viewErrors: 'View Measure Manager Errors'
    }
  },
  designAlts: {
    title: 'Design Alternatives',
    addAlternative: 'Add Alternative',
    columns: {
      description: 'Description',
      locationOrWeatherFile: 'Location or Weather File',
      name: 'Name',
      seedModel: 'Seed Model'
    },
    modalClearDatapoint: {
      title: 'Clear Datapoint Results',
      message: 'Deleting this alternative will delete its associated datapoint and results.  Proceed with the deletion?'
    },
    createOneDesignAlternative: 'Create One Design Alternative with Each Measure Option',
    duplicateAlternative: 'Duplicate Alternative',
    noAlternativesInAlgorithmic: 'For an Algorithmic Analysis, Design Alternatives are created automatically.',
    helpDesignAlternatives: 'A Design Alternative is a single simulation run.  Each Design Altenative can have one or more Measure Options applied to it.  In Manual mode, Design Alternatives are created by the user.   In Algorithmic mode, the Sampling Method creates the Design Alternatives automatically.'
  },
  outputs: {
    title: 'Outputs',
    noOutputsInManual: 'There are no outputs to set in Manual mode.',
    addAnotherMeasure: 'Add Measure',
    modalSelectOutputs: {
      title: 'Select Outputs',
      message: 'Select which outputs you would like to add to your analysis.',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      addOutput: 'Add Output',
      newOutputs: 'If the output you want is not listed above, you can enter additional outputs below.  Enter the \'display name\' of the output.  The unique name will be created automatically from the measure name and the output display name.',
      helpOutputs: 'Outputs are pieces of information that are created for every Design Alternative.  In Manual mode, outputs are not set.  In Algorithmic mode, some Sampling Methods (such as optimization) require an objective function (for example, minimize annual energy consumption).  In this case, the outputs are used to describe the objective function.'
    },
    selectOutputs: 'Select Outputs',
    addMeasure: 'Select measure to add more outputs',
    columns: {
      displayName: 'Display Name',
      shortName: 'Short Name',
      variableType: 'Variable Type',
      visualize: 'Visualize',
      objectiveFunction: 'Objective Function',
      targetValue: 'Target Value',
      units: 'Units',
      weightingFactor: 'Weighting Factor',
      objectiveFunctionGroup: 'Objective Function Group'
    }
  },
  reports: {
    title: 'Reports',
    type: {
      calibrationReport: 'Calibration Report',
      parallelCoordinates: 'Parallel Coordinates',
      radarChart: 'Radar Chart',
      radianceReport: 'Radiance Report',
      edaptExport: 'EDAPT Export'
    },
    helpReports: 'Reports present information from the Design Alternatives.  Some reports make more sense in Manual mode, while others make more sense in Algorithmic model.  Some reports require the user to include specific Reporting Measures (on the Project Measures and Options tab) to function correctly.'
  },
  run: {
    title: 'Run',
    cancelRun: 'Cancel Run',
    stopServer: 'Stop Server',
    exportToOSA: 'Export to OSA',
    runEntireWorkflow: 'Run Entire Workflow',
    runSelected: 'Run Selected',
    pleaseWait: 'Please wait...',
    selectAll: 'Select All',
    analysisName: 'Analysis Name',
    clearSelections: 'Clear Selections',
    algorithmicOnCloud: 'Algorithmic analyses cannot be run locally.  Select \'Run on Cloud\' from the dropdown above to run this analysis remotely.',
    viewServer: 'View Server',
    viewAlgorithmResults: 'View Results',
    downloadAlgorithmResults: 'Download Algorithm Results',
    modifiedDP: 'The design alternative data associated with this datapoint has changed since it was last run',
    deletedDA: 'The design alternative associated with this datapoint has been deleted from the project',
    truncated: '...[truncated]',
    queued: 'Queued',
    totalDatapoints: 'Total Datapoints',
    completed: 'Completed',
    started: 'Started',
    modalAnalysisRunning: {
      title: 'Analysis is Running',
      message: 'The analysis is currently running.  Wait for the analysis to complete or cancel the run before leaving this tab.'
    },
    modalClearResults: {
      title: 'Delete Local Results?',
      rerunAnalysisMessage: 'Running a new analysis will delete your local results. Are you sure you want to continue?',
      setRunTypeMessage: 'Selecting a new run type will delete your local results.  Are you sure you want to continue?',
      rerunSelectedMessage: 'Running a new analysis will delete your local results for the selected datapoints.  Are you sure you want to continue?'
    },
    modalAwsWarning: {
      title: 'PAT Cloud Support with Amazon EC2',
      message: 'The user assumes all responsibility for orphaned EC2 processes.  It is strongly recommended that you monitor EC2 cloud usage in the Amazon AWS Console to avoid any unwanted charges.',
      agree: 'I agree'
    },
    modalLargeDownload: {
      title: 'Large Number of Datapoints to Download',
      message: 'You are attempting to download a large number of files from the server.  This may freeze the PAT application and some files may not download.  Save your project and proceed at your own risk.'
    },
    modalOsaErrors: {
      title: 'OSA Errors',
      message: 'The following errors were encountered while generating the OSA and must be fixed before the project can be run successfully.'
    },
    modalCloudRunning: {
      title: 'Cloud Cluster is Running',
      message: 'You are still connected to AWS. Terminate the cluster?',
      terminate: 'Terminate',
      keep: 'Keep Cluster Running'
    },
    viewReport: 'View Report',
    'for': 'for',
    remote: {
      osServerVersion: 'AMI Name',
      AMINotes: 'AMI Notes',
      osVersion: 'OpenStudio Version',
      standardsRef: 'Standards Ref',
      connect: 'Connect',
      terminate: 'Terminate',
      disconnect: 'Disconnect',
      start: 'Start',
      serverURL: 'Existing Server URL',
      serverType: 'Remote Server Type',
      serverSettings: 'Remote Server Settings',
      serverInstanceNote: 'Note: The server requires 4 nodes for non-worker processes',
      serverInstanceType: 'Server Instance Type',
      workerInstanceType: 'Worker Instance Type',
      awsCredentials: 'AWS Credentials',
      selectAws: 'Select AWS credentials to use',
      newAwsCredentials: 'New',
      awsAccessKey: 'Access Key',
      awsRegion: 'Region',
      cpus: 'CPUs',
      cost: 'Cost',
      memory: 'Memory',
      storage: 'Storage',
      numberOfWorkers: 'Number of Workers',
      clusterText: 'Select a cluster or make a new one',
      selectCluster: 'Clusters',
      runningClusters: 'Running clusters',
      or: 'or',
      newCluster: 'New Cluster',
      newClusterName: 'New Cluster Name',
      awsUserID: 'AWS UserID',
      saveCluster: 'Save Cluster Settings',
      status: 'Cluster Status',
      viewAws: 'View AWS Console',
      awsServerDetails: 'AWS Server Details',
      serverPrivateKey: 'Server Private Key File',
      workerPrivateKey: 'Workers Private Key File',
      serverDNS: 'Server DNS',
      workerDNS: 'Workers DNS'
    },
    modalNewCluster: {
      title: 'New Cluster',
      name: 'Cluster Name'
    },
    modalNewAwsCredentials: {
      title: 'New AWS Credentials',
      name: 'Name',
      accessKey: 'Access Key',
      secretKey: 'Secret Key'
    }
  },
  statusBar: {
    Downloading: 'Downloading',
    Extracting: 'Extracting'
  },
  dependencyManager: {
    Downloading: 'Downloading',
    Extracting: 'Extracting'
  },
  Algorithmic: 'Algorithmic',
  Cancel: 'Cancel',
  Continue: 'Continue',
  Manual: 'Manual',
  OK: 'OK',
  Save: 'Save'
};
