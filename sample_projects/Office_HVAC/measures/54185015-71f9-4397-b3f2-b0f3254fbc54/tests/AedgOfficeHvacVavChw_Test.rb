require 'openstudio'

require 'openstudio/ruleset/ShowRunnerOutput'

require "#{File.dirname(__FILE__)}/../measure.rb"

require 'test/unit'

class AedgOfficeHvacVavChW_Test < Test::Unit::TestCase

  
  def test_AedgOfficeHvacVavChW
     
    # create an instance of the measure
    measure = AedgOfficeHvacVavChW.new
    
    # create an instance of a runner
    runner = OpenStudio::Ruleset::OSRunner.new

    # load the test model
    translator = OpenStudio::OSVersion::VersionTranslator.new
    path = OpenStudio::Path.new(File.dirname(__FILE__) + "/AEDG_HVAC_GenericTestModel_0225_a.osm")
    model = translator.loadModel(path)
    assert((not model.empty?))
    model = model.get
    
    # get arguments and test that they are what we are expecting
    arguments = measure.arguments(model)
    assert_equal(3, arguments.size)
    assert_equal("ceilingReturnPlenumSpaceType", arguments[0].name)
    assert_equal("costTotalHVACSystem", arguments[1].name)
    assert_equal("remake_schedules", arguments[2].name)
       
    # set argument values to good values and run the measure on model with spaces
    argument_map = OpenStudio::Ruleset::OSArgumentMap.new

    ceilingReturnPlenumSpaceType = arguments[0].clone
    assert(ceilingReturnPlenumSpaceType.setValue("Plenum"))
    argument_map["ceilingReturnPlenumSpaceType"] = ceilingReturnPlenumSpaceType

    costTotalHVACSystem = arguments[1].clone
    assert(costTotalHVACSystem.setValue(15000.0))
    argument_map["costTotalHVACSystem"] = costTotalHVACSystem

    remake_schedules = arguments[2].clone
    assert(remake_schedules.setValue(true))
    argument_map["remake_schedules"] = remake_schedules
    
    measure.run(model, runner, argument_map)
    result = runner.result
    show_output(result)
    assert(result.value.valueName == "Success")
    #assert(result.warnings.size == 1)
    #assert(result.info.size == 2)

    #save the model for testing purposes
    output_file_path = OpenStudio::Path.new(File.dirname(__FILE__) + "/test.osm")
    model.save(output_file_path,true)
    
  end  

end
