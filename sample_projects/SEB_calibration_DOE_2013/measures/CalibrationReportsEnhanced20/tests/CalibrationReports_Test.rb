require 'openstudio'

require 'openstudio/ruleset/ShowRunnerOutput'

require "#{File.dirname(__FILE__)}/../measure.rb"

require 'fileutils'

require 'minitest/autorun'

class CalibrationReportsEnhanced_Test < MiniTest::Unit::TestCase

  def is_openstudio_2?
    begin
      workflow = OpenStudio::WorkflowJSON.new
    rescue
      return false
    end
    return true
  end

  def model_in_path_default
    return "#{File.dirname(__FILE__)}/ExampleModel.osm"
  end

  def epw_path_default
    # make sure we have a weather data location
    epw = nil
    epw = OpenStudio::Path.new("#{File.dirname(__FILE__)}/USA_CO_Golden-NREL.724666_TMY3.epw")
    assert(File.exist?(epw.to_s))
    return epw.to_s
  end

  def run_dir(test_name)
    # always generate test output in specially named 'output' directory so result files are not made part of the measure
    "#{File.dirname(__FILE__)}/output/#{test_name}"
  end

  def model_out_path(test_name)
    "#{run_dir(test_name)}/TestOutput.osm"
  end

  def workspace_path(test_name)
    if is_openstudio_2?
      return "#{run_dir(test_name)}/run/in.idf"
    else
      return "#{run_dir(test_name)}/ModelToIdf/in.idf"
    end
  end

  def sql_path(test_name)
    if is_openstudio_2?
      return "#{run_dir(test_name)}/run/eplusout.sql"
    else
      return "#{run_dir(test_name)}/ModelToIdf/EnergyPlusPreProcess-0/EnergyPlus-0/eplusout.sql"
    end
  end

  def report_path(test_name)
    "#{run_dir(test_name)}/report.html"
  end

  # method for running the test simulation using OpenStudio 1.x API
  def setup_test_1(test_name, epw_path)

    co = OpenStudio::Runmanager::ConfigOptions.new(true)
    co.findTools(false, true, false, true)

    if !File.exist?(sql_path(test_name))
      puts "Running EnergyPlus"

      wf = OpenStudio::Runmanager::Workflow.new("modeltoidf->energypluspreprocess->energyplus")
      wf.add(co.getTools())
      job = wf.create(OpenStudio::Path.new(run_dir(test_name)), OpenStudio::Path.new(model_out_path(test_name)), OpenStudio::Path.new(epw_path))

      rm = OpenStudio::Runmanager::RunManager.new
      rm.enqueue(job, true)
      rm.waitForFinished
    end
  end

  # method for running the test simulation using OpenStudio 2.x API
  def setup_test_2(test_name, epw_path)
    osw_path = File.join(run_dir(test_name), 'in.osw')
    osw_path = File.absolute_path(osw_path)

    workflow = OpenStudio::WorkflowJSON.new
    workflow.setSeedFile(File.absolute_path(model_out_path(test_name)))
    workflow.setWeatherFile(File.absolute_path(epw_path))
    workflow.saveAs(osw_path)

    cli_path = OpenStudio.getOpenStudioCLI
    cmd = "\"#{cli_path}\" run -w \"#{osw_path}\""
    puts cmd
    system(cmd)
  end

  # create test files if they do not exist when the test first runs
  def setup_test(test_name, idf_output_requests, model_in_path = model_in_path_default, epw_path = epw_path_default)

    if !File.exist?(run_dir(test_name))
      FileUtils.mkdir_p(run_dir(test_name))
    end
    assert(File.exist?(run_dir(test_name)))

    if File.exist?(report_path(test_name))
      FileUtils.rm(report_path(test_name))
    end

    assert(File.exist?(model_in_path))

    if File.exist?(model_out_path(test_name))
      FileUtils.rm(model_out_path(test_name))
    end

    # convert output requests to OSM for testing, OS App and PAT will add these to the E+ Idf
    workspace = OpenStudio::Workspace.new("Draft".to_StrictnessLevel, "EnergyPlus".to_IddFileType)
    workspace.addObjects(idf_output_requests)
    rt = OpenStudio::EnergyPlus::ReverseTranslator.new
    request_model = rt.translateWorkspace(workspace)

    translator = OpenStudio::OSVersion::VersionTranslator.new
    model = translator.loadModel(model_in_path)
    assert((not model.empty?))
    model = model.get
    model.addObjects(request_model.objects)
    model.save(model_out_path(test_name), true)

    if is_openstudio_2?
      setup_test_2(test_name, epw_path)
    else
      setup_test_1(test_name, epw_path)
    end
  end

  # calibration_reports
  def test_CalibrationReportsEnhanced

    test_name = 'calibration_reports'
    model_in_path = "#{File.dirname(__FILE__)}/ExampleModel.osm"

    # create an instance of the measure
    measure = CalibrationReportsEnhanced.new

    # create an instance of a runner
    runner = OpenStudio::Ruleset::OSRunner.new

    # get arguments
    arguments = measure.arguments
    argument_map = OpenStudio::Ruleset.convertOSArgumentVectorToMap(arguments)

    # create hash of argument values
    args_hash = {}

    # populate argument with specified hash value if specified
    arguments.each do |arg|
      temp_arg_var = arg.clone
      if args_hash[arg.name]
        assert(temp_arg_var.setValue(args_hash[arg.name]))
      end
      argument_map[arg.name] = temp_arg_var
    end

    # get the energyplus output requests, this will be done automatically by OS App and PAT
    idf_output_requests = measure.energyPlusOutputRequests(runner, argument_map)
    assert_equal(0, idf_output_requests.size)

    # mimic the process of running this measure in OS App or PAT. Optionally set custom model_in_path and custom epw_path.
    epw_path = epw_path_default
    setup_test(test_name, idf_output_requests)

    assert(File.exist?(model_out_path(test_name)))
    assert(File.exist?(sql_path(test_name)))
    assert(File.exist?(epw_path))

    # set up runner, this will happen automatically when measure is run in PAT or OpenStudio
    runner.setLastOpenStudioModelPath(OpenStudio::Path.new(model_out_path(test_name)))
    runner.setLastEnergyPlusWorkspacePath(OpenStudio::Path.new(workspace_path(test_name)))
    runner.setLastEpwFilePath(epw_path)
    runner.setLastEnergyPlusSqlFilePath(OpenStudio::Path.new(sql_path(test_name)))

    # delete the output if it exists
    if File.exist?(report_path(test_name))
      FileUtils.rm(report_path(test_name))
    end
    assert(!File.exist?(report_path(test_name)))

    # temporarily change directory to the run directory and run the measure
    start_dir = Dir.pwd
    begin
      Dir.chdir(run_dir(test_name))

      # run the measure
      measure.run(runner, argument_map)
      result = runner.result
      show_output(result)
      assert_equal('Success', result.value.valueName)
      assert(result.warnings.size == 0)
    ensure
      Dir.chdir(start_dir)
    end

    model = runner.lastOpenStudioModel
    assert((not model.empty?))
    model = model.get

    sqlFile = runner.lastEnergyPlusSqlFile
    assert((not sqlFile.empty?))
    sqlFile = sqlFile.get

    model.setSqlFile(sqlFile)

    # must have a runPeriod
    runPeriod = model.runPeriod
    assert((not runPeriod.empty?))

    # must have a calendarYear
    yearDescription = model.yearDescription
    assert((not yearDescription.empty?))
    calendarYear = yearDescription.get.calendarYear
    assert((not calendarYear.empty?))

    # check for varying demand
    model.getUtilityBills.each do |utilityBill|
      if not utilityBill.peakDemandUnitConversionFactor.empty?
        hasVaryingDemand = false
        modelPeakDemand = 0.0
        count = 0
        utilityBill.billingPeriods.each do |billingPeriod|
          peakDemand = billingPeriod.modelPeakDemand
          if not peakDemand.empty?
            temp = peakDemand.get
            if count == 0
              modelPeakDemand = temp
            else
              if modelPeakDemand != temp
                hasVaryingDemand = true
                break
              end
            end
            count = count + 1
          end
        end
        if count > 1
          assert(hasVaryingDemand)
        end
      end
    end

    # make sure the report file exists
    assert(File.exist?(report_path(test_name)))

  end

  # calibration_reports_no_gas
  def test_CalibrationReportsEnhanced_NoGas

    test_name = 'calibration_reports_no_gas'

    # load model, remove gas bills, save to new file
    raw_model_path = "#{File.dirname(__FILE__)}/ExampleModel.osm"
    vt = OpenStudio::OSVersion::VersionTranslator.new
    model = vt.loadModel(raw_model_path)
    assert((not model.empty?))
    model = model.get
    utilityBills = model.getUtilityBills
    assert_equal(2, utilityBills.size())
    utilityBills.each do |utilityBill|
      if utilityBill.fuelType == "Gas".to_FuelType
        utilityBill.remove
      end
    end
    utilityBills = model.getUtilityBills
    assert_equal(1, utilityBills.size())
    altered_model_path = OpenStudio::Path.new("#{run_dir(test_name)}/ExampleModelNoGasInput.osm")
    model.save(altered_model_path, true)

    # set model_in_path to new altered copy of model
    model_in_path = altered_model_path

    # create an instance of the measure
    measure = CalibrationReportsEnhanced.new

    # create an instance of a runner
    runner = OpenStudio::Ruleset::OSRunner.new

    # get arguments
    arguments = measure.arguments
    argument_map = OpenStudio::Ruleset.convertOSArgumentVectorToMap(arguments)

    # create hash of argument values
    args_hash = {}

    # populate argument with specified hash value if specified
    arguments.each do |arg|
      temp_arg_var = arg.clone
      if args_hash[arg.name]
        assert(temp_arg_var.setValue(args_hash[arg.name]))
      end
      argument_map[arg.name] = temp_arg_var
    end

    # get the energyplus output requests, this will be done automatically by OS App and PAT
    idf_output_requests = measure.energyPlusOutputRequests(runner, argument_map)
    assert_equal(0, idf_output_requests.size)

    # mimic the process of running this measure in OS App or PAT. Optionally set custom model_in_path and custom epw_path.
    epw_path = epw_path_default
    setup_test(test_name, idf_output_requests, model_in_path.to_s)

    assert(File.exist?(model_out_path(test_name)))
    assert(File.exist?(sql_path(test_name)))
    assert(File.exist?(epw_path))

    # set up runner, this will happen automatically when measure is run in PAT or OpenStudio
    runner.setLastOpenStudioModelPath(OpenStudio::Path.new(model_out_path(test_name)))
    runner.setLastEnergyPlusWorkspacePath(OpenStudio::Path.new(workspace_path(test_name)))
    runner.setLastEpwFilePath(epw_path)
    runner.setLastEnergyPlusSqlFilePath(OpenStudio::Path.new(sql_path(test_name)))

    # delete the output if it exists
    if File.exist?(report_path(test_name))
      FileUtils.rm(report_path(test_name))
    end
    assert(!File.exist?(report_path(test_name)))

    # temporarily change directory to the run directory and run the measure
    start_dir = Dir.pwd
    begin
      Dir.chdir(run_dir(test_name))

      # run the measure
      measure.run(runner, argument_map)
      result = runner.result
      show_output(result)
      assert_equal('Success', result.value.valueName)
      assert(result.warnings.size == 0)
    ensure
      Dir.chdir(start_dir)
    end

    model = runner.lastOpenStudioModel
    assert((not model.empty?))
    model = model.get

    sqlFile = runner.lastEnergyPlusSqlFile
    assert((not sqlFile.empty?))
    sqlFile = sqlFile.get

    model.setSqlFile(sqlFile)

    # must have a runPeriod
    runPeriod = model.runPeriod
    assert((not runPeriod.empty?))

    # must have a calendarYear
    yearDescription = model.yearDescription
    assert((not yearDescription.empty?))
    calendarYear = yearDescription.get.calendarYear
    assert((not calendarYear.empty?))

    # check for varying demand
    model.getUtilityBills.each do |utilityBill|
      if not utilityBill.peakDemandUnitConversionFactor.empty?
        hasVaryingDemand = false
        modelPeakDemand = 0.0
        count = 0
        utilityBill.billingPeriods.each do |billingPeriod|
          peakDemand = billingPeriod.modelPeakDemand
          if not peakDemand.empty?
            temp = peakDemand.get
            if count == 0
              modelPeakDemand = temp
            else
              if modelPeakDemand != temp
                hasVaryingDemand = true
                break
              end
            end
            count = count + 1
          end
        end
        if count > 1
          assert(hasVaryingDemand)
        end
      end
    end

    # make sure the report file exists
    assert(File.exist?(report_path(test_name)))

  end

  # calibration_reports_no_gas
  def test_CalibrationReportsEnhanced_NoDemand

    test_name = 'calibration_reports_no_demand'


    # load model, remove gas bills, save to new file
    raw_model_path = "#{File.dirname(__FILE__)}/ExampleModel.osm"
    vt = OpenStudio::OSVersion::VersionTranslator.new
    model = vt.loadModel(raw_model_path)
    assert((not model.empty?))
    model = model.get
    utilityBills = model.getUtilityBills
    assert_equal(2, utilityBills.size())
    utilityBills.each do |utilityBill|
      if utilityBill.fuelType == "Electricity".to_FuelType
        utilityBill.billingPeriods.each do |billingPeriod|
          billingPeriod.resetPeakDemand
        end
      end
    end
    utilityBills = model.getUtilityBills
    assert_equal(2, utilityBills.size())
    altered_model_path = OpenStudio::Path.new("#{run_dir(test_name)}/ExampleModelNoDemandInput.osm")
    model.save(altered_model_path, true)

    # set model_in_path to new altered copy of model
    model_in_path = altered_model_path

    # create an instance of the measure
    measure = CalibrationReportsEnhanced.new

    # create an instance of a runner
    runner = OpenStudio::Ruleset::OSRunner.new

    # get arguments
    arguments = measure.arguments
    argument_map = OpenStudio::Ruleset.convertOSArgumentVectorToMap(arguments)

    # create hash of argument values
    args_hash = {}

    # populate argument with specified hash value if specified
    arguments.each do |arg|
      temp_arg_var = arg.clone
      if args_hash[arg.name]
        assert(temp_arg_var.setValue(args_hash[arg.name]))
      end
      argument_map[arg.name] = temp_arg_var
    end

    # get the energyplus output requests, this will be done automatically by OS App and PAT
    idf_output_requests = measure.energyPlusOutputRequests(runner, argument_map)
    assert_equal(0, idf_output_requests.size)

    # mimic the process of running this measure in OS App or PAT. Optionally set custom model_in_path and custom epw_path.
    epw_path = epw_path_default
    setup_test(test_name, idf_output_requests, model_in_path.to_s)

    assert(File.exist?(model_out_path(test_name)))
    assert(File.exist?(sql_path(test_name)))
    assert(File.exist?(epw_path))

    # set up runner, this will happen automatically when measure is run in PAT or OpenStudio
    runner.setLastOpenStudioModelPath(OpenStudio::Path.new(model_out_path(test_name)))
    runner.setLastEnergyPlusWorkspacePath(OpenStudio::Path.new(workspace_path(test_name)))
    runner.setLastEpwFilePath(epw_path)
    runner.setLastEnergyPlusSqlFilePath(OpenStudio::Path.new(sql_path(test_name)))

    # delete the output if it exists
    if File.exist?(report_path(test_name))
      FileUtils.rm(report_path(test_name))
    end
    assert(!File.exist?(report_path(test_name)))

    # temporarily change directory to the run directory and run the measure
    start_dir = Dir.pwd
    begin
      Dir.chdir(run_dir(test_name))

      # run the measure
      measure.run(runner, argument_map)
      result = runner.result
      show_output(result)
      assert_equal('Success', result.value.valueName)
      assert(result.warnings.size == 0)
    ensure
      Dir.chdir(start_dir)
    end

    model = runner.lastOpenStudioModel
    assert((not model.empty?))
    model = model.get

    sqlFile = runner.lastEnergyPlusSqlFile
    assert((not sqlFile.empty?))
    sqlFile = sqlFile.get

    model.setSqlFile(sqlFile)

    # must have a runPeriod
    runPeriod = model.runPeriod
    assert((not runPeriod.empty?))

    # must have a calendarYear
    yearDescription = model.yearDescription
    assert((not yearDescription.empty?))
    calendarYear = yearDescription.get.calendarYear
    assert((not calendarYear.empty?))

    # check for no demand
    model.getUtilityBills.each do |utilityBill|
      utilityBill.billingPeriods.each do |billingPeriod|
        assert(billingPeriod.peakDemand.empty?)
      end
    end

    # make sure the report file exists
    assert(File.exist?(report_path(test_name)))

  end

  # calibration_reports_with_two_gas_bills
  def test_CalibrationReportsEnhanced_TwoGas

    test_name = 'calibration_reports_no_gas'

    # load model, remove gas bills, save to new file
    raw_model_path = "#{File.dirname(__FILE__)}/ExampleModel.osm"
    vt = OpenStudio::OSVersion::VersionTranslator.new
    model = vt.loadModel(raw_model_path)
    assert((not model.empty?))
    model = model.get
    utilityBills = model.getUtilityBills
    assert_equal(2, utilityBills.size())
    utilityBills.each do |utilityBill|
      if utilityBill.fuelType == "Gas".to_FuelType
        utilityBill.clone(model)
      end
    end
    utilityBills = model.getUtilityBills
    assert_equal(1, utilityBills.size())
    altered_model_path = OpenStudio::Path.new("#{run_dir(test_name)}/ExampleModelTwoGasInput.osm")
    model.save(altered_model_path, true)

    # set model_in_path to new altered copy of model
    model_in_path = altered_model_path

    # create an instance of the measure
    measure = CalibrationReportsEnhanced.new

    # create an instance of a runner
    runner = OpenStudio::Ruleset::OSRunner.new

    # get arguments
    arguments = measure.arguments
    argument_map = OpenStudio::Ruleset.convertOSArgumentVectorToMap(arguments)

    # create hash of argument values
    args_hash = {}

    # populate argument with specified hash value if specified
    arguments.each do |arg|
      temp_arg_var = arg.clone
      if args_hash[arg.name]
        assert(temp_arg_var.setValue(args_hash[arg.name]))
      end
      argument_map[arg.name] = temp_arg_var
    end

    # get the energyplus output requests, this will be done automatically by OS App and PAT
    idf_output_requests = measure.energyPlusOutputRequests(runner, argument_map)
    assert_equal(0, idf_output_requests.size)

    # mimic the process of running this measure in OS App or PAT. Optionally set custom model_in_path and custom epw_path.
    epw_path = epw_path_default
    setup_test(test_name, idf_output_requests, model_in_path.to_s)

    assert(File.exist?(model_out_path(test_name)))
    assert(File.exist?(sql_path(test_name)))
    assert(File.exist?(epw_path))

    # set up runner, this will happen automatically when measure is run in PAT or OpenStudio
    runner.setLastOpenStudioModelPath(OpenStudio::Path.new(model_out_path(test_name)))
    runner.setLastEnergyPlusWorkspacePath(OpenStudio::Path.new(workspace_path(test_name)))
    runner.setLastEpwFilePath(epw_path)
    runner.setLastEnergyPlusSqlFilePath(OpenStudio::Path.new(sql_path(test_name)))

    # delete the output if it exists
    if File.exist?(report_path(test_name))
      FileUtils.rm(report_path(test_name))
    end
    assert(!File.exist?(report_path(test_name)))

    # temporarily change directory to the run directory and run the measure
    start_dir = Dir.pwd
    begin
      Dir.chdir(run_dir(test_name))

      # run the measure
      measure.run(runner, argument_map)
      result = runner.result
      show_output(result)
      assert_equal('Success', result.value.valueName)
      assert(result.warnings.size == 1)
    ensure
      Dir.chdir(start_dir)
    end

    model = runner.lastOpenStudioModel
    assert((not model.empty?))
    model = model.get

    sqlFile = runner.lastEnergyPlusSqlFile
    assert((not sqlFile.empty?))
    sqlFile = sqlFile.get

    model.setSqlFile(sqlFile)

    # must have a runPeriod
    runPeriod = model.runPeriod
    assert((not runPeriod.empty?))

    # must have a calendarYear
    yearDescription = model.yearDescription
    assert((not yearDescription.empty?))
    calendarYear = yearDescription.get.calendarYear
    assert((not calendarYear.empty?))

    # make sure the report file exists
    assert(File.exist?(report_path(test_name)))

  end

end
