require 'openstudio'

require 'openstudio/ruleset/ShowRunnerOutput'

require "#{File.dirname(__FILE__)}/../measure.rb"

require 'test/unit'

class AddMonthlyJSONUtilityData_Test < Test::Unit::TestCase

  
  def test_AddMonthlyJSONUtilityData
     
    # create an instance of the measure
    measure = AddMonthlyJSONUtilityData.new
    
    # create an instance of a runner
    runner = OpenStudio::Ruleset::OSRunner.new
    
    # make an empty model
    model = OpenStudio::Model::Model.new
    
    # get arguments and test that they are what we are expecting
    arguments = measure.arguments(model)
    assert_equal(4, arguments.size)
    assert_equal("json", arguments[0].name)
    assert_equal("json", arguments[1].name)
    assert_equal("start_date", arguments[2].name)
    assert_equal("end_date", arguments[3].name)
    
    # set argument values to good values and run the measure on model with spaces
    argument_map = OpenStudio::Ruleset::OSArgumentMap.new
    
    electric_json = arguments[0].clone
    assert(electric_json.setValue(File.dirname(__FILE__) + "/electric.json"))
    argument_map["json"] = electric_json
    
    gas_json = arguments[1].clone
    assert(gas_json.setValue(File.dirname(__FILE__) + "/gas.json"))
    argument_map["json"] = gas_json
    
    start_date = arguments[2].clone
    assert(start_date.setValue("2012-06-19"))
    argument_map["start_date"] = start_date
    
    end_date = arguments[3].clone
    assert(end_date.setValue("2013-05-20"))
    argument_map["end_date"] = end_date
    
    measure.run(model, runner, argument_map)
    result = runner.result
    show_output(result)
    assert(result.value.valueName == "Success")
    
  end  

end
