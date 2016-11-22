export default {
  dependency: {
    title: 'PAT Dependency Download Status'
  },
  modified: {
    title: 'ParametricAnalysisTool',
    heading: 'Modified Files',
    blurb: 'You have unsaved changes. Click the save button to save your changes, or click the cancel button to quit without saving.'
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
  projectName: {
    title: 'ParametricAnalysisTool',
    heading: 'Enter New Project Name',
    blurb: 'Enter the name for your new project, this will be the name of the directory containing your project. In the next step you will choose the location for your new project folder.'
  },
  analysis: {
    title: 'Analysis',
    projectName: 'Project Name',
    addMeasure: 'Add Measure',
    addMeasureOption: 'Add Measure Option',
    checkAll: 'Check All',
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
    type: {
      batchRun: 'BatchRun',
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
      algorithmSetting: 'Algorithm Setting'
    },
    manual: {
      projectMeasuresAndOptions: 'Project Measures and Options'
    }
  },
  bcl: {
    title: 'Building Component Library',
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
      edit: 'Edit',
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
    noAlternativesInAlgorithmic: 'There are no design alternatives to set for an Algorithmic Analysis.'
  },
  outputs: {
    title: 'Outputs',
    noOutputsInManual: 'There are no outputs to set in Manual mode.'
  },
  reports: {
    title: 'Reports',
    type: {
      calibrationReport: 'Calibration Report',
      parallelCoordinates: 'Parallel Coordinates',
      radarChart: 'Radar Chart',
      radianceReport: 'Radiance Report',
      edaptExport: 'EDAPT Export'
    }
  },
  run: {
    title: 'Run',
    cancelRun: 'Cancel Run',
    stopServer: 'Stop Server',
    exportToOSA: 'Export to OSA',
    runEntireWorkflow: 'Run Entire Workflow',
    modalAnalysisRunning: {
      title: 'Analysis is Running',
      message: 'The analysis is currently running.  Wait for the analysis to complete or cancel the run before leaving this tab.'
    },
    viewReport: 'View Report',
    'for': 'for'

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
