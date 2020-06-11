/***********************************************************************************************************************
 *  OpenStudio(R), Copyright (c) 2008-2020, Alliance for Sustainable Energy, LLC. All rights reserved.
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
    title: 'État du téléchargement des dépendances PAT'
  },
  modified: {
    title: 'Outil d\'analyse paramétrique',
    heading: 'Fichiers modifiés',
    blurb: 'Vous avez des modifications non enregistrées. Cliquez sur le bouton Enregistrer pour enregistrer vos modifications ou cliquez sur le bouton Annuler pour quitter sans enregistrer.'
  },
  nestedProjectWarning: {
    title: 'Outil d\'analyse paramétrique',
    heading: 'Avertissement de projet imbriqué',
    blurb: 'Un fichier pat.json a été trouvé dans votre chemin de projet. Vous ne pouvez pas imbriquer un projet PAT dans un autre projet PAT. Veuillez choisir un autre emplacement pour votre projet PAT actuel.'
  },
  saveAsInfo: {
    title: 'ParametricAnalysisTool',
    heading: 'SaveAs Information',
    blurb: 'A new server is now starting for your new project. Please be patient as this may take several minutes, depending on your computer. This dialog will close automatically once the server is fully started.'
  },
  whitespaceWarning: {
    title: 'Outil d\'analyse paramétrique',
    heading: 'Avertissement d\'espace blanc',
    blurb: 'Vous avez des espaces blancs dans votre chemin de projet, ce qui causera probablement des problèmes. À l\'avenir, supprimez tous les espaces blancs de votre chemin de projet PAT.'
  },
  setProject: {
    title: 'Sélectionnez un projet',
    blurb: 'Créer un nouveau projet ou ouvrir un projet existant',
    make: 'Faire un nouveau projet',
    existing: 'Ouvrir un projet existant'
  },
  serverTools: {
    title: 'Outils de dépannage du serveur',
    start: 'Démarrer le serveur local',
    stop: 'Arrêter le serveur local',
    ping: 'Requête Ping au Serveur et définir l\'état',
    viewServer: 'View Local Server',
    noProject: 'Vous devez d\'abord ouvrir un projet'
  },
  setMeasuresDir: {
    title: 'Répertoire de MesMesures',
    measuresDir: 'Répertoire MesMesures'
  },
  projectName: {
    title: 'Nouveau projet',
    heading: 'Nom du nouveau projet',
    blurb: 'Ce sera le nom du répertoire contenant votre projet. À l\'étape suivante, vous choisirez l\'emplacement de votre nouveau dossier de projet.'
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
    exportedOSA: 'OSA et zip exportés au répertoire qui contient le projet',
    prepareExit: 'Preparing to exit...',
    amisError: 'Cannot retrieve OpenStudio Server Versions',
    noYaml: 'No AWS credentials selected. Cannot start/connect to AWS',
    noCluster: 'No cluster selected. Cannot start/connect to AWS',
    objFunctionGroupError: 'This algorithm needs at least 2 objective function groups defined on the outputs tab to run successfully',
    numberVariablesError: 'This algorithm needs at least 2 variables defined on the analysis tab to run successfully',
    projectNameError: 'Project cannot be named PAT',
    saveAsServerStartInProgress: 'Unable to "Save As" while server is starting. Please try again, once the server has fully started.',
    newServerStarted: 'New server started.',
    deprecationWarning: 'Avertissement de dépréciation: la version 3.1 de PAT n\'inclura pas l\'option Amazon Cloud Remote Server. Veuillez consulter les notes de mise à jour du OpenStudio Server 3.0.0 pour des détails additionels sur le déploiement en nuage.',
    noMoreLocalServerDefaultStart: 'Local Server ne démarre plus automatiquement.  Si vous désirez utiliser Local Server, il peut être démarrer manuellement dans le menu Server Tools.'
  },
  analysis: {
    title: 'Analyse',
    projectName: 'Nom du projet',
    addMeasure: 'Ajouter une mesure',
    addMeasureOption: 'Ajouter une option de mesure',
    checkAll: 'Cocher pour rendre tous les arguments variables',
    checkForUpdates: 'Rechercher des mises à jour',
    advancedArguments: 'Arguments avancés de délai pour CLI et OS-Server',
    helpAdvancedArguments: 'Cette section contient les arguments avancés pour le CLI et OS-Server',
    cliDebug: 'CLI --débogueur',
    cliVerbose: 'CLI --mode-verbeuse',
    timeoutWorkflow: 'Run Workflow Timeout (seconds)',
    timeoutInitWorker: 'Initialize Worker Timeout (seconds)',
    timeoutUploadResults: 'Upload Results Timeout (seconds)',
    viewAlgorithmReference: 'View Algorithm Documentation',
    columns: {
      argumentName: 'Nom de l\'argument',
      shortName: 'Nom court',
      variable: 'Variable',
      variableSettings: 'Paramètres des variables'
    },
    defaultSeedModel: 'Modèle initial par défaut',
    defaultWeatherFile: 'Fichier météorologique par défaut',
    deleteLastOption: 'Supprimer la dernière option',
    duplicateMeasure: 'Dupliquer mesure',
    duplicateMeasureAndOption: 'Dupliquer mesure et option',
    duplicateOption: 'Dupliquer option',
    energyplusMeasures: 'Mesures EnergyPlus',
    modelToBaseInputsOn: 'Modèle pour les entrées de base activées',
    openstudioMeasures: 'Mesures OpenStudio',
    reportingMeasures: 'Mesures de déclaration',
    algorithmicMethod: 'Algorithmic Method', // TODO
    helpAlgorithmicMethod: 'Specify the type of algorithm to be used to execute the analysis.', // TODO
    helpAnalysis: 'En mode manuel, les utilisateurs créent des options de mesure et paramètrent à la main différentes alternatives de conception. En mode Algorithmique, les utilisateurs spécifient des plages pour chaque Argument de Mesure. La méthode d\'échantillonnage sélectionnée créera automatiquement une série d\'alternatives de conception pour l\'utilisateur. Le mode manuel est plus utile pour l\'analyse ciblée. Mode algorithmique est plus utile lorsque l\'utilisateur veut explorer un grand nombre de concepts ou veut optimiser pour un certain résultat.',
    helpProjectyMeasuresAndOptions: 'Une mesure est un script qui est utilisé pour modifier un modèle d\'énergie ou créer un rapport sur le modèle. Les mesures peuvent être téléchargées à partir de la bibliothèque de composants de bâtiment (BCL) ou écrites par l\'utilisateur.',
    helpOpenStudioMeasures: 'Une mesure OpenStudio est un script qui modifie le modèle OpenStudio (fichier .osm).',
    helpEnergyPlusMeasures: 'Une mesure EnergyPlus est un script qui modifie le modèle EnergyPlus (fichier .idf). Cela se produit après que le modèle OpenStudio (.osm) est traduit au format EnergyPlus (.idf). Les mesures EnergyPlus sont généralement utilisées pour ajouter des objets qui ne sont pas encore pris en charge par OpenStudio dans le fichier d\'entrée.',
    helpReportingMeasures: 'Une mesure de rapport est un script qui crée un rapport décrivant un aspect des résultats de la simulation ou de la simulation. Ces mesures ont accès au modèle OpenStudio, à la IDF EnergyPlus et aux résultats de la simulation.',
    modalDeleteMeasure: {
      title: 'Delete Measure',
      message: 'Are you sure you want to delete this measure? Deleting this measure will result in the automatic saving of this project.'
    },
    type: {
      diagonal: 'Diagonale',
      nsga2: 'Nondominated Sorting Genetic Algorithm 2',
      spea2: 'Strength Pareto Evolutionary Algorithm 2',
      pso: 'Essaim de particules',
      rgenoud: 'Optimisation R-GENetique à l\'aide de dérivés',
      optim: 'Optim',
      lhs: 'Échantillonnage Hypercube latin',
      morris: 'Méthode Morris',
      doe: 'conception d\'expériences',
      preFlight: 'PreFlight',
      singleRun: 'Passage Unique',
      sobol: 'Sobol',
      repeatRun: 'Passages Multiples',
      baselinePerturbation: 'Perturbation de la base de référence',
      ga: 'Genetic Algorithm (GA)',
      gaisl: 'Island Parallel Genetic Algorithm (GAISL)',
      fast99:'Fast99'
    },
    algorithmic: {
      helpAlgorithmSettings: 'These settings control the manner in which the given algorithm is executed. Please see each attribute for further details.', // TODO
      helpAdditionalAnalysisFiles: '', // TODO
      helpCLIDebug: 'Ce bouton est utilisé pour activer et désactiver le débogueur pour l\'interface de ligne de commande OpenStudio (CLI) qui est utilisée pour exécuter la simulation. Si le bouton est en mode \'TRUE\', cela peut créer de gros fichiers de points de données de simulation et dégrader les performances d\'exécution.',
      helpCLIVerbose: 'Ce bouton est utilisé pour activer et désactiver la sortie verbeuse de l\'interface de ligne de commande OpenStudio (CLI) qui est utilisée pour exécuter la simulation. Si le bouton est en mode \'TRUE\', cet indicateur peut être utilisé pour imprimer des informations supplémentaires pour le débogage.',
      helpTimeoutWorkflow: 'This argument sets when the submitted workflow will timeout.  This will halt the workflow and return an error if the runtime of the workflow exceeds this argument.',
      helpTimeoutUploadResults: 'This argument sets how long the Server should wait for results to be uploaded from the Workers to the Server node.  This will halt the workflow and return an error if the file transfer of the results exceeds this argument.',
      helpTimeoutInitWorker: 'This argument sets when the initialization of the Workers will timeout.  This will halt the workflow and return an error if transfering the analysis.zip file from the Server to the Worker exceeds this argument.',
      helpSeverScripts: 'For advanced use only; not required for general use of the application. If your analysis requires server and worker initialization or finalization scripts, add them here. Note that these scripts will not run on a local server; they can only be run on a cloud server.', // TODO
      helpServerInitialization: 'A shell script that runs before the analysis is begun. If this script fails the analysis will be automatically set to a completed failed state.', // TODO
      helpServerFinalization: 'A shell script that runs after the analysis has finished, but before the analysis flag is set to completed. This script is run even if the analysis has failed.', // TODO
      helpWorkerInitialization: 'A shell script that runs on a worker container before each datapoint is executed.', // TODO
      helpWorkerFinalization: 'A shell script that runs on a worker container after a datapoint has been executed, even in the datapoint failed.', // TODO
      helpScriptArguments: 'An array of arguments to pass to the script. Currently these arguments are dynamically parsed, meaning that expressions will be evaluated prior to being passed to the shell script.', // TODO
      algorithmSetting: 'Paramètres de l\'algorithme',
      skipThisMeasure: 'Ignorer cette mesure',
      filesToIncludeMessage: 'Si votre analyse nécessite l\'importation de fichiers supplémentaires sur le serveur, indiquez chaque répertoire à inclure ainsi que le nom du dossier à extraire sur le serveur, ci-dessous.',
      filesToInclude: 'Fichiers d\'analyse supplémentaires',
      dirToInclude: 'Répertoire à inclure',
      selectDir: 'Sélectionner un répertoire',
      addDir: 'Ajouter un répertoire',
      dirToUnpackTo: 'Nom du répertoire à décompresser sur le serveur',
      server_initialization: 'Script d\'initialisation de l\'analyse',
      server_finalization: 'Script de finalisation de l\'analyse',
      worker_initialization: 'Script d\'initialisation des points de données',
      worker_finalization: 'Script de finalisation des points de données',
      selectScript: 'Sélectionner un fichier de script',
      args: 'Arguments de script',
      addArg: 'Ajouter Argument',
      serverScripts: 'Scripts de serveur',
      serverScriptsMessage: 'Si votre analyse nécessite des scripts d\'initialisation ou de finalisation de serveur et de travailleur, ajoutez-les ici. Notez que ces scripts ne s\'exécutent pas sur un serveur local; Ils ne peuvent être exécutés que sur un serveur cloud.',
      warning: 'Le paramètre de variable sélectionné n\'est pas valide pour cet algorithme. La variable sera traitée comme un argument statique lors de l\'exécution de la simulation.',
      modelDependentCustom: 'Ou valeur personalisée (a préseance)',
      grid: {
        max: 'Max',
        min: 'Min',
        maximum: 'maximum',
        measureInputs: 'Entrées des Mesures ',
        minimum: 'minimum',
        mean: 'moyenne',
        name: 'Nom',
        shortName: ' Nom court',
        stdDev: 'stdDev',
        deltaX: 'Delta X',
        distribution: 'distribution',
        relationToEUI: 'Relation avec EUI',
        staticDefault: 'Statique/Défaut',
        value: 'Valeur',
        variableSettings: 'Paramètres des variables',
        weight: 'Poids'
      }
    },
    manual: {
      projectMeasuresAndOptions: 'Mesures et options du projet',
      modalSelectOptions: {
        title: 'Sélectionnez les options',
        message: 'Sélectionnez les options que vous souhaitez copier dans cette mesure.',
        selectAll: 'Tout sélectionner',
        deselectAll: 'Tout déselectionner'
      },
      modalEditOptionDescription: 'Modifier la description de l\'option',
      modalEditModelDependentChoiceArg: 'Modifier l\'argument dépendant du modèle',
      modalEditChoiceEnum: 'liste d\'options',
      modalEditChoiceText: 'option personalisée',
      modalEditChoiceValue: 'Valeur de l\'argument'
    }
  },
  bcl: {
    title: 'Bibliothèque de mesures',
    wait: 'S\'il vous plaît, attendez',
    aside: {
      attributes: 'Attributs',
      description: 'Description',
      files: 'Dossiers',
      maxCompatibleVersion: 'Version maximale compatible',
      minCompatibleVersion: 'Version minimale compatible',
      modelerDescription: 'Description du modélisateur',
      error: 'Erreur',
      group: 'Groupe',
      tags: 'Mots clés'
    },
    category: {
      title: 'Catégorie',
      'Cases and Walkins': 'réfrigérateur/congélateur',
      Characteristics: 'Caractéristiques',
      Compressors: 'Compresseurs',
      Condensers: 'Condensateurs',
      'Construction Sets': 'Ensembles de construction',
      Cooling: 'Refroidissement',
      Daylighting: 'Lumière naturelle',
      Distribution: 'Distribution',
      Economics: 'Économie',
      'Electric Equipment': 'Équipement électrique',
      'Electric Lighting': 'Éclairage Électrique',
      'Electric Lighting Controls': 'Commandes d\'éclairage électrique',
      'Energy Recovery': 'Récupération d\'énergie',
      Envelope: 'Enveloppe',
      Equipment: 'Équipement',
      'Equipment Controls': 'Commandes d\'équipement',
      Fenestration: 'Fenestration',
      Form: 'Forme',
      'Gas Equipment': 'Équipement de gaz',
      'Heat Reclaim': 'Récupération de la chaleur',
      'Heat Rejection': 'Rejet de chaleur',
      Heating: 'Chauffage',
      HVAC: 'HVAC',
      'HVAC Controls': 'Commandes HVAC',
      Infiltration: 'Infiltration',
      'Life Cycle Cost Analysis': 'Analyse du coût du cycle de vie',
      'Lighting Equipment': 'Équipement d\'éclairage',
      'Onsite Power Generation': 'Génération d\'énergie sur site',
      Opaque: 'Opaque',
      People: 'Personnes',
      'People Schedules': 'Horaires des personnes',
      Photovoltaic: 'Photovoltaïque',
      QAQC: 'QAQC',
      Refrigeration: 'Réfrigération',
      'Refrigeration Controls': 'Commandes de réfrigération',
      Reporting: 'Rapports',
      'Service Water Heating': 'Chauffage de l\'eau de service',
      'Space Types': 'Types d\'espace',
      Troubleshooting: 'Dépannage',
      Ventilation: 'Ventilation',
      'Water Heating': 'Chauffage de l\'eau',
      'Water Use': 'Utilisation de l\'eau',
      'Whole Building': 'L\'ensemble du bâtiment',
      'Whole Building Schedules': 'Horaires complets du bâtiment',
      'Whole System': 'L\'ensemble du système'
    },
    columns: {
      add: 'Ajouter',
      date: 'Rendez-vous amoureux',
      name: 'Nom',
      edit: 'Modifier/Copier',
      status: 'Mettre à jour',
      type: 'Type'
    },
    edit: 'Modifier',
    editAndCopy: 'Modifier et copier',
    filters: {
      title: 'Filtres',
      bclOnline: 'BCL (En ligne)',
      local: 'Local',
      measureDirectory: 'Répertoire des mesures',
      myProject: 'Mon projet'
    },
    search: 'Chercher',
    type: {
      title: 'Type',
      energyplus: 'EnergyPlus',
      openstudio: 'OpenStudio',
      reporting: 'Rapports'
    },
    createNewMeasure: {
      title: 'Créer une nouvelle Mesure',
      name: 'Nom',
      className: 'Nom de classe',
      description: 'Description',
      modelerDescription: 'Description du modelisateur',
      measureType: 'Type de mesure',
      taxonomy: 'Taxonomie',
      createNewMeasure: 'Créer une nouvelle mesure',
      createMeasure: 'Créer une mesure et ouvrir pour modification'
    },
    duplicateMeasure: {
      title: 'Dupliquer mesure',
      name: 'Nom',
      displayName: 'Afficher un nom',
      description: 'Description',
      modelerDescription: 'Description du modelisateur'
    },
    updateMeasure: {
      title: 'Mettre à jour la mesure',
      name: 'Nome',
      displayName: 'Afficher nom',
      updateProjectMeasure: 'Une mise à jour locale est disponible pour cette mesure. Appliquer la mise à jour de votre projet?',
      updateLocalFromBCL: 'Une mise à jour de cette mesure locale est disponible auprès de la BCL. Mettre à jour la mesure locale BCL?',
      updateLocalAndProject: 'Une mise à jour de cette mesure locale est disponible auprès de la BCL. Mettre à jour local BCL et appliquer à votre projet?',
      updateProjectButton: 'Mettre à jour le projet',
      updateLocalLibButton: 'Mettre à jour la bibliothèque locale',
      updateLocalLibOnlyButton: 'Mettre à jour uniquement la bibliothèque locale',
      updateBothButton: 'Mettre à jour la bibliothèque locale et le projet'
    },
    displayErrors: {
      title: 'Manager de Mesures - Avertissements et Erreurs',
      viewErrors: 'Afficher les Erreurs'
    }
  },
  designAlts: {
    title: 'Alternatives de conception',
    addAlternative: 'Ajouter une alternative',
    columns: {
      description: 'Description',
      locationOrWeatherFile: 'Emplacement ou fichier météorologique',
      name: 'Nom',
      seedModel: 'Modèle initial'
    },
    modalClearDatapoint: {
      title: 'Effacer les résultats des points de données',
      message: 'La suppression de cette option supprimera son point de données associé et ses résultats. Procéder à la suppression?'
    },
    createOneDesignAlternative: 'Créer une alternative de conception avec chaque option de mesure',
    duplicateAlternative: 'Dupliquer l\'alternative',
    noAlternativesInAlgorithmic: 'FPour une analyse algorithmique, les alternatives de conception sont créées automatiquement.',
    helpDesignAlternatives: 'Une variante de conception est une simulation unique. Chaque alternative de conception peut avoir une ou plusieurs options de mesure appliquées à elle. En mode manuel, les alternatives de conception est créé par l\'utilisateur. En mode Algorithmique, la méthode d\'échantillonnage crée automatiquement les alternatives de conception.'
  },
  outputs: {
    title: 'Résultats',
    noOutputsInManual: 'Il n\'y a pas de résultats à régler en mode manuel.',
    addAnotherMeasure: 'Ajouter une mesure',
    modalSelectOutputs: {
      title: 'Sélectionner les résultats',
      message: 'Sélectionnez les résultats que vous souhaitez ajouter à votre analyse.',
      selectAll: 'Tout sélectionner',
      deselectAll: 'Tout déselectionner',
      addOutput: 'Ajouter un résultat',
      newOutputs: 'I du résultat. Le nom unique sera créé automatiquement à partir du nom de la mesure et du nom d\'affichage du résultat.',
      helpOutputs: 'Les sorties sont des informations qui sont créées pour chaque Alternative de conception. En mode manuel, les sorties ne sont pas réglées. En Algorithmique, certaines méthodes d\'échantillonnage (telles que l\'optimisation) nécessitent une fonction objective (par exemple, minimiser la consommation d\'énergie annuelle). Dans ce cas, les sorties sont utilisées pour décrire la fonction objectif.'
    },
    selectOutputs: 'Sélectionner les résultats',
    addMeasure: 'Sélectionnez une mesure pour ajouter d\'autres résultats',
    columns: {
      displayName: 'Afficher nom',
      shortName: 'Nom court',
      variableType: 'Type de variable',
      visualize: 'Visualiser',
      objectiveFunction: 'Fonction Objectif',
      targetValue: 'Valeur cible',
      units: 'Unités',
      weightingFactor: 'Facteur de pondération',
      objectiveFunctionGroup: 'Groupe de fonctions objectif'
    }
  },
  reports: {
    title: 'Rapports',
    type: {
      calibrationReport: 'Rapport d\'étalonnage',
      parallelCoordinates: 'Coordonnées parallèles',
      radarChart: 'Graphique Radar',
      radianceReport: 'Rapport Radiance',
      edaptExport: 'Exportation EDAPT'
    },
    helpReports: 'Les rapports présentent des informations provenant des solutions de conception alternatives. Certains rapports ont plus de sens en mode manuel, tandis que d\'autres ont plus de sens dans le modèle algorithmique. Certains rapports exigent que l\'utilisateur inclue des mesures de rapport spécifiques (dans l\'onglet Mesures et options du projet) pour fonctionner correctement.'
  },
  run: {
    title: 'Exécuter',
    cancelRun: 'Annuler l\'exécution',
    stopServer: 'Arrêter le serveur',
    exportOSA: 'Exporter OSA',
    exportToOSA: 'Exporter à l\'OSA',
    runEntireWorkflow: 'Exécuter tout le workflow',
    runSelected: 'Exécuter sélectionné',
    pleaseWait: 'Please wait...',
    selectAll: 'Tout sélectionner',
    analysisName: 'Nom de l\'analyse',
    clearSelections: 'Effacer les sélections',
    algorithmicOnCloud: 'Algorithmic analyses cannot be run locally.  Select \'Run on Cloud\' from the dropdown above to run this analysis remotely.',
    viewServer: 'Afficher le serveur',
    viewAlgorithmResults: 'Voir les Résultats',
    downloadAlgorithmResults: 'Télécharger les résultats',
    modifiedDP: 'Les données associées à ce point de données ont changé depuis la dernière exécution',
    deletedDA: 'L\'alternative de conception associée à ce point de données a été supprimée du projet',
    truncatedDatapoints: '...[truncated]',
    queued: 'Queued',
    totalDatapoints: 'Total Datapoints',
    completed: 'Completed',
    started: 'Started',
    modalAnalysisRunning: {
      title: 'Analyse en cours',
      message: 'L\'analyse est actuellement en cours. Attendez que l\'analyse soit terminée ou annulez l\'exécution avant de quitter cet onglet.'
    },
    modalClearResults: {
      title: 'Supprimer les résultats locaux?',
      rerunAnalysisMessage: 'L\'exécution d\'une nouvelle analyse supprimera vos résultats locaux. êtes-vous sûr de vouloir continuer?',
      setRunTypeMessage: 'La sélection d\'un nouveau type d\'exécution supprimera vos résultats locaux. êtes-vous sûr de vouloir continuer?',
      rerunSelectedMessage: 'L\'exécution d\'une nouvelle analyse supprimera vos résultats locaux pour les points de données selectionés. Êtes-vous sûr de vouloir continuer?'
    },
    modalAwsWarning: {
      title: 'PAT Cloud Support with Amazon EC2',
      message: 'The user assumes all responsibility for orphaned EC2 processes.  It is strongly recommended that you monitor EC2 cloud usage in the Amazon AWS Console to avoid any unwanted charges.',
      agree: 'I agree'
    },
    modalLargeDownload: {
      title: 'Large Number of Files to Download',
      message: 'You are attempting to download a large number of files from the server.  This may freeze the PAT application and some files may not download.  Save your project and proceed at your own risk.'
    },
    modalOsaErrors: {
      title: 'OSA Errors',
      message: 'The following errors were encountered while generating the OSA and must be fixed before the project can be run successfully.'
    },
    modalCloudRunning: {
      title: 'Cloud cluster est en cours d\'exécution',
      message: 'Vous êtes toujours connecté à AWS. Terminer le cluster?',
      terminate: 'Mettre fin',
      keep: 'Gardez le cluster en cours d\'exécution'
    },
    viewReport: 'Voir le rapport',
    'for': 'pour',
    remote: {
      osServerVersion: 'Nom AMI',
      AMINotes: 'AMI Notes',
      osVersion: 'Version d\'OpenStudio',
      standardsRef: 'Normes Ref',
      connect: 'Relier',
      terminate: 'Mettre fin',
      disconnect: 'Déconnecter',
      start: 'Début',
      serverURL: 'URL du serveur existant',
      serverType: 'Type de serveur distant',
      serverSettings: 'Paramètres du serveur distant',
      serverInstanceNote: 'Remarque: Le serveur requiert 4 noeuds pour les processus non-travailleurs',
      serverInstanceType: 'Type d\'instance de serveur',
      workerInstanceType: 'Type d\'instance du travailleur',
      awsCredentials: 'Identifiants d\'AWS',
      selectAws: 'Sélectionnez les identifiants AWS à utiliser',
      newAwsCredentials: 'Nouveau',
      awsAccessKey: 'Clef d\'accès',
      awsRegion: 'Région',
      cpus: 'CPU',
      cost: 'Coût',
      memory: 'Mémoire',
      storage: 'Espace de rangement',
      numberOfWorkers: 'Nombre de travailleurs',
      clusterText: 'Sélectionner un cluster ou en créer un nouveau',
      selectCluster: 'Clusters',
      runningClusters: 'Clusters en cours d\'exécution',
      or: 'ou',
      newCluster: 'Nouveau cluster',
      newClusterName: 'Nouveau nom du cluster',
      awsUserID: 'ID utilisateur AWS',
      saveCluster: 'Enregistrer les paramètres du cluster',
      status: 'État du cluster',
      viewAws: 'Afficher la console AWS',
      awsServerDetails: 'AWS Server Détails',
      serverPrivateKey: 'Fichier de clé privée du serveur',
      workerPrivateKey: 'Fichier des clés privées des travailleurs',
      serverDNS: 'DNS du serveur',
      workerDNS: 'Travailleurs DNS'
    },
    modalNewCluster: {
      title: 'Nouveau cluster',
      name: 'Nom du cluster'
    },
    modalNewAwsCredentials: {
      title: 'Nouvelles identifiant AWS',
      name: 'Nom',
      accessKey: 'Clef d\'accès',
      secretKey: 'Clef secrète'
    }
  },
  statusBar: {
    Downloading: 'Téléchargement',
    Extracting: 'Extraction'
  },
  dependencyManager: {
    Downloading: 'Téléchargement',
    Extracting: 'Extraction'
  },
  Algorithmic: 'Algorithmique',
  Cancel: 'Annuler',
  Continue: 'Continuer',
  Manual: 'Manuel',
  OK: 'D\'accord',
  Save: 'sauvegarder'
};
