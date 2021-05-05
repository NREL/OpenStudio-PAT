#see the URL below for information on how to write OpenStudio measures
# http://openstudio.nrel.gov/openstudio-measure-writing-guide

#see the URL below for information on using life cycle cost objects in OpenStudio
# http://openstudio.nrel.gov/openstudio-life-cycle-examples

#see the URL below for access to C++ documentation on model objects (click on "model" in the main window to view model objects)
# http://openstudio.nrel.gov/sites/openstudio.nrel.gov/files/nv_data/cpp_documentation_it/model/html/namespaces.html

require 'json'
require 'time'

#start the measure
class AddMonthlyJSONUtilityData < OpenStudio::Ruleset::ModelUserScript
  
  #define the name that a user will see, this method may be deprecated as
  #the display name in PAT comes from the name field in measure.xml
  def name
    return "AddMonthlyJSONUtilityData"
  end
  
  def year_month_day(str)
    result = nil
    if match_data = /(\d+)(\D)(\d+)(\D)(\d+)/.match(str)
      if match_data[1].size == 4 #yyyy-mm-dd
        year = match_data[1].to_i
        month = match_data[3].to_i
        day = match_data[5].to_i
        result = [year, month, day]
      elsif match_data[5].size == 4 #mm-dd-yyyy
        year = match_data[5].to_i
        month = match_data[1].to_i
        day = match_data[3].to_i
        result = [year, month, day]     
      end
    else
      puts "no match for '#{str}'"
    end
    return result
  end
  
  #define the arguments that the user will input
  def arguments(model)
    args = OpenStudio::Ruleset::OSArgumentVector.new
    
    #set path to json
    json = OpenStudio::Ruleset::OSArgument::makeStringArgument("json",true)
    json.setDisplayName("Path to JSON")
    args << json
    
    #set variable name
    variable_name = OpenStudio::Ruleset::OSArgument::makeStringArgument("variable_name",true)
    variable_name.setDisplayName("Variable name")
    variable_name.setDefaultValue("Electric Bill")
    args << variable_name
    
    #set fuel type  
    fuel_type = OpenStudio::Ruleset::OSArgument::makeStringArgument("fuel_type", true)
    fuel_type.setDisplayName("Fuel Type")
    fuel_type.setDefaultValue("Electricity")
    args << fuel_type
    
    #set ConsumptionUnit
    consumption_unit = OpenStudio::Ruleset::OSArgument::makeStringArgument("consumption_unit", true)
    consumption_unit.setDisplayName("Consumption Unit")
    consumption_unit.setDefaultValue("kWh")
    args << consumption_unit
    
    #set data key name in json
    data_key_name = OpenStudio::Ruleset::OSArgument::makeStringArgument("data_key_name",true)
    data_key_name.setDisplayName("data key name")
    data_key_name.setDefaultValue("tot_kwh")
    args << data_key_name
    
    #make a start date argument
    start_date = OpenStudio::Ruleset::OSArgument::makeStringArgument("start_date",true)
    start_date.setDisplayName("Start date")
    args << start_date
    
    #make an end date argument
    end_date = OpenStudio::Ruleset::OSArgument::makeStringArgument("end_date",true)
    end_date.setDisplayName("End date")
    args << end_date
    
    #make an end date argument
    remove_utility_bill_data = OpenStudio::Ruleset::OSArgument::makeBoolArgument("remove_existing_data",true)
    remove_utility_bill_data.setDisplayName("remove existing Utility Bill data")
    remove_utility_bill_data.setDefaultValue(false)
    args << remove_utility_bill_data
    
    #make an end date argument
    set_runperiod = OpenStudio::Ruleset::OSArgument::makeBoolArgument("set_runperiod",true)
    set_runperiod.setDisplayName("Set RunPeriod in model")
    set_runperiod.setDefaultValue(false)
    args << set_runperiod
    
    return args
  end #end the arguments method

  #define what happens when the measure is run
  def run(model, runner, user_arguments)
    super(model, runner, user_arguments)
    
    #use the built-in error checking 
    if not runner.validateUserArguments(arguments(model), user_arguments)
      return false
    end

    #assign the user inputs to variables
    json = runner.getStringArgumentValue("json",user_arguments)
    variable_name = runner.getStringArgumentValue("variable_name",user_arguments)
    fuel_type = runner.getStringArgumentValue("fuel_type",user_arguments)
    consumption_unit = runner.getStringArgumentValue("consumption_unit",user_arguments)
    data_key_name = runner.getStringArgumentValue("data_key_name",user_arguments)
    start_date = runner.getStringArgumentValue("start_date",user_arguments)
    end_date = runner.getStringArgumentValue("end_date",user_arguments)
    remove_utility_bill_data = runner.getBoolArgumentValue("remove_existing_data",user_arguments)
    set_runperiod = runner.getBoolArgumentValue("set_runperiod",user_arguments)
    
    # set start date
    if date = year_month_day(start_date)

      start_date = OpenStudio::Date.new(OpenStudio::MonthOfYear.new(date[1]), date[2], date[0])
      
      # actual year of start date
      yearDescription = model.getYearDescription()
      yearDescription.setCalendarYear(date[0])
      if set_runperiod
        runPeriod = model.getRunPeriod()
        runPeriod.setBeginMonth(date[1])
        runPeriod.setBeginDayOfMonth(date[2])
        runner.registerInfo("RunPeriod start date set to #{start_date}")
      end
    else
      runner.registerError("Unknown start date '#{start_date}'")
      fail "Unknown start date '#{start_date}'"
      return false
    end
    
    # set end date
    if date = year_month_day(end_date)
      
      end_date = OpenStudio::Date.new(OpenStudio::MonthOfYear.new(date[1]), date[2], date[0])
      if set_runperiod
        runPeriod = model.getRunPeriod()
        runPeriod.setEndMonth(date[1])
        runPeriod.setEndDayOfMonth(date[2])
        runner.registerInfo("RunPeriod end date set to #{end_date}")
      end
    else
      runner.registerError("Unknown end date '#{end_date}'")
      fail "Unknown end date '#{end_date}'"
      return false
    end

    # remove all utility bills
    if remove_utility_bill_data
      model.getUtilityBills.each do |bill|
        bill.remove
      end
    end
    
    runner.registerInfo("json is #{json}")
    json_path = File.expand_path("#{json}", __FILE__)
    runner.registerInfo("json_path is #{json_path}")
    temp = File.read(json_path)
    json_data = JSON.parse(temp)  
    if not json_data.nil?
      runner.registerInfo("fuel_type is #{fuel_type}")
      utilityBill = OpenStudio::Model::UtilityBill.new("#{fuel_type}".to_FuelType, model)
      utilityBill.setName("#{variable_name}")
      utilityBill.setConsumptionUnit("#{consumption_unit}")

      json_data['data'].each do |period|
        begin
          from_date = period['from'] ? Time.iso8601(period['from']).strftime("%Y%m%dT%H%M%S") : nil
          to_date = period['to'] ? Time.iso8601(period['to']).strftime("%Y%m%dT%H%M%S") : nil
        rescue ArgumentError => e
          runner.registerError("Unknown date format in period '#{period}'")
        end
        if from_date.nil? or to_date.nil?
          runner.registerError("Unknown date format in period '#{period}'")
          fail "Unknown date format in period '#{period}'"
          return false
        end
        #runner.registerInfo("GC.start")
        #GC.start
        period_start_date = OpenStudio::DateTime.fromISO8601(from_date).get.date
        #period_start_date = OpenStudio::Date.new(OpenStudio::MonthOfYear.new(from_date[1]), from_date[2], from_date[0])
        #period_end_date = OpenStudio::DateTime.fromISO8601(to_date).get.date - OpenStudio::Time.new(1.0)
        period_end_date = OpenStudio::DateTime.fromISO8601(to_date).get.date
        #period_end_date = OpenStudio::Date.new(OpenStudio::MonthOfYear.new(to_date[1]), to_date[2], to_date[0])
        
        if (period_start_date < start_date) or (period_end_date > end_date)
          runner.registerInfo("skipping period #{period_start_date} to #{period_end_date}")
          next
        end
        
        if period["#{data_key_name}"].nil?
          runner.registerError("Billing period missing key:#{data_key_name} in: '#{period}'")
          return false
        end
        data_key_value = period["#{data_key_name}"].to_f
        
        # peak_kw = nil
        # if not period['peak_kw'].nil?
          # peak_kw = period['peak_kw'].to_f
        # end
        
        runner.registerInfo("period #{period}")
        runner.registerInfo("period_start_date: #{period_start_date}, period_end_date: #{period_end_date}, #{data_key_name}: #{data_key_value}")
        
        bp = utilityBill.addBillingPeriod()
        bp.setStartDate(period_start_date)
        bp.setEndDate(period_end_date)
        bp.setConsumption(data_key_value)
        # if peak_kw
          # bp.setPeakDemand(peak_kw)
        # end
      end
    end
    
    #reporting final condition of model
    runner.registerFinalCondition("Utility bill data has been added to the model.")
    
    return true
 
  end #end the run method

end #end the measure

#this allows the measure to be use by the application
AddMonthlyJSONUtilityData.new.registerWithApplication