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
  analysis: {
    title: 'Analysis',
    projectName: 'Project Name',
    addMeasure: 'Add Measure',
    addMeasureOption: 'Add Measure Option',
    checkAll: 'Check to make all arguments variable',
    checkForUpdates: 'Check for Updates',
    columns: {
      argumentName: 'Argument Name',
      shortName: 'Short Name',
      variable: 'Variable',
      variableSettings: 'Variable Settings'
    },
    defaultSeedModel: 'Default Seed Model',
    defaultWeatherFile: 'Default Weather File',
    deleteLastOption: 'Delete Last Option',
    duplicateMeasureAndOption: 'Duplicate Measure & Option',
    duplicateOption: 'Duplicate Option',
    energyplusMeasures: 'EnergyPlus Measures',
    modelToBaseInputsOn: 'Model To Base Inputs On',
    openstudioMeasures: 'OpenStudio Measures',
    reportingMeasures: 'Reporting Measures',
    samplingMethod: 'Sampling Method',
    helpAnalysis: 'In Manual mode, users create Measure Options and set up different Design Alternatives by hand.  In Algorithmic mode, users specify ranges for each Measure Argument.  The Sampling Method that is selected will automatically create a series of Design Alternatives for the user.  Manual mode is most useful for  targeted analysis.  Algorithmic mode is most useful when the user wants to explore a large number of designs or wants to optimize for a certain outcome.',
    helpProjectyMeasuresAndOptions: 'A Measure is a script that is used to modify an energy model or create a report about the model.  Measures can be downloaded from the Building Component Library (BCL) or written by the user.',
    helpOpenStudioMeasures: 'An OpenStudio Measure is a script that modifies the OpenStudio model (.osm file).',
    helpEnergyPlusMeasures: 'An EnergyPlus Measure is a script that modifies the EnergyPlus model (.idf file).  This happens after the OpenStudio model (.osm) is translated to EnergyPlus format (.idf).  EnergyPlus Measures are typically used to add objects that are not yet supported by OpenStudio to the input file.',
    helpReportingMeasures: 'A Reporting Measure is a script that creates a report describing some aspect of the or the simulation results.  These Measures have access to the OpenStudio model, the EnergyPlus IDF, and the simulation results.',
    type: {
      diagonal: 'Diagonal',
      nsga2: 'Nondominated Sorting Genetic Algorithm 2',
      spea2: 'Strength Pareto Evolutionary Algorithm 2',
      pso: 'Particle Swarm',
      rgenoud: 'R-GENetic Optimization Using Derivatives',
      optim: 'Optim',
      lhs: 'Latin Hypercube Sampling',
      morris: 'Morris Method',
      doe: 'DesignOfExperiments',
      preFlight: 'PreFlight',
      singleRun: 'SingleRun',
      repeatRun: 'RepeatRun',
      baselinePerturbation: 'BaselinePerturbation'
    },
    algorithmic: {
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
      serverScriptsMessage: 'If your analysis requires server and worker initialization or finalization scripts, add them here.  Note that these scripts will not run on a local server; they can only be run on a cloud server.'
    },
    manual: {
      projectMeasuresAndOptions: 'Project Measures and Options'
    }
  },
  bcl: {
    title: 'Building Component Library',
    wait: 'Please wait',
    aside: {
      attributes: 'Attributes',
      description: 'Description',
      files: 'Files',
      maxCompatibleVersion: 'Max Compatible Version',
      minCompatibleVersion: 'Min Compatible Version',
      modelerDescription: 'Modeler Description',
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
    createOneDesignAlternative: 'Create One Design Alternative with Each Measure Option',
    duplicateAlternative: 'Duplicate Alternative',
    noAlternativesInAlgorithmic: 'For an Algorithmic Analysis, Design Alternatives are created automatically.',
    helpDesignAlternatives: 'A Design Alternative is a single simulation run.  Each Design Altenative can have one or more Measure Options applied to it.  In Manual mode, Design Alternatives are created by the user.   In Algorithmic mode, the Sampling Method creates the Design Alternatives automatically.'
  },
  outputs: {
    title: 'Outputs',
    noOutputsInManual: 'There are no outputs to set in Manual mode.',
    modalSelectOutputs: {
      title: 'Select Outputs',
      message: 'Select which outputs you would like to add to your analysis.',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      newOutputs: 'If the output you want is not listed above, you can enter additional outputs below.  Enter the \'unique name\' of the output.',
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
    viewServer: 'View Server',
    modalAnalysisRunning: {
      title: 'Analysis is Running',
      message: 'The analysis is currently running.  Wait for the analysis to complete or cancel the run before leaving this tab.'
    },
    modalClearResults: {
      title: 'Delete Local Results?',
      rerunAnalysisMessage: 'Running a new analysis will delete your local results. Are you sure you want to continue?',
      setRunTypeMessage: 'Selecting a new run type will delete your local results.  Are you sure you want to continue?'
    },
    modalCloudRunning: {
      title: 'Cloud Cluster is Running',
      message: 'You are still connected to AWS. Terminate the cluster?'
    },
    viewReport: 'View Report',
    'for': 'for',
    remote: {
      osServerVersion: 'OpenStudio Server Version',
      connect: 'Connect',
      terminate: 'Terminate',
      disconnect: 'Disconnect',
      start: 'Start',
      serverURL: 'Existing Server URL',
      serverType: 'Remote Server Type',
      serverSettings: 'Remote Server Settings',
      serverInstanceType: 'Server Instance Type',
      workerInstanceType: 'Worker Instance Type',
      awsCredentials: 'AWS Credentials',
      selectAws: 'Select AWS credentials to use',
      newAwsCredentials: 'New',
      awsAccessKey: 'Access Key',
      awsRegion: 'Region',
      cpus: 'CPUs',
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
