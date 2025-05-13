module OsLib_Schedules

  # create a ruleset schedule with a basic profile
  def OsLib_Schedules.createSimpleSchedule(model, options = {})

    defaults = {
        "name" => nil,
        "winterTimeValuePairs" => {24.0 => 0.0},
        "summerTimeValuePairs" => {24.0 => 1.0},
        "defaultTimeValuePairs" => {24.0 => 1.0},
    }


    # merge user inputs with defaults
    options = defaults.merge(options)

    #ScheduleRuleset
    sch_ruleset = OpenStudio::Model::ScheduleRuleset.new(model)
    if name
      sch_ruleset.setName(options["name"])
    end

    #Winter Design Day
    winter_dsn_day = OpenStudio::Model::ScheduleDay.new(model)
    sch_ruleset.setWinterDesignDaySchedule(winter_dsn_day)
    winter_dsn_day = sch_ruleset.winterDesignDaySchedule
    winter_dsn_day.setName("#{sch_ruleset.name} Winter Design Day")
    options["winterTimeValuePairs"].each do |k,v|
      hour = k.truncate
      min = ((k - hour)*60).to_i
      winter_dsn_day.addValue(OpenStudio::Time.new(0, hour, min, 0),v)
    end

    #Summer Design Day
    summer_dsn_day = OpenStudio::Model::ScheduleDay.new(model)
    sch_ruleset.setSummerDesignDaySchedule(summer_dsn_day)
    summer_dsn_day = sch_ruleset.summerDesignDaySchedule
    summer_dsn_day.setName("#{sch_ruleset.name} Summer Design Day")
    options["summerTimeValuePairs"].each do |k,v|
      hour = k.truncate
      min = ((k - hour)*60).to_i
      summer_dsn_day.addValue(OpenStudio::Time.new(0, hour, min, 0),v)
    end

    #All Days
    week_day = sch_ruleset.defaultDaySchedule
    week_day.setName("#{sch_ruleset.name} Schedule Week Day")
    options["defaultTimeValuePairs"].each do |k,v|
      hour = k.truncate
      min = ((k - hour)*60).to_i
      week_day.addValue(OpenStudio::Time.new(0, hour, min, 0),v)
    end

    result = sch_ruleset
    return result

  end #end of OsLib_Schedules.createSimpleSchedule
  
  # create a complex ruleset schedule
  def OsLib_Schedules.createComplexSchedule(model, options = {})

    defaults = {
        "name" => nil,
        "default_day" => ["always_on",[24.0,1.0]]
    }

    # merge user inputs with defaults
    options = defaults.merge(options)

    #ScheduleRuleset
    sch_ruleset = OpenStudio::Model::ScheduleRuleset.new(model)
    if name
      sch_ruleset.setName(options["name"])
    end

    #Winter Design Day
    unless options["winter_design_day"].nil?
      winter_dsn_day = OpenStudio::Model::ScheduleDay.new(model)
      sch_ruleset.setWinterDesignDaySchedule(winter_dsn_day)
      winter_dsn_day = sch_ruleset.winterDesignDaySchedule
      winter_dsn_day.setName("#{sch_ruleset.name} Winter Design Day")
      options["winter_design_day"].each do |data_pair|
        hour = data_pair[0].truncate
        min = ((data_pair[0] - hour)*60).to_i
        winter_dsn_day.addValue(OpenStudio::Time.new(0, hour, min, 0),data_pair[1])
      end
    end  

    #Summer Design Day
    unless options["summer_design_day"].nil?
      summer_dsn_day = OpenStudio::Model::ScheduleDay.new(model)
      sch_ruleset.setSummerDesignDaySchedule(summer_dsn_day)
      summer_dsn_day = sch_ruleset.summerDesignDaySchedule
      summer_dsn_day.setName("#{sch_ruleset.name} Summer Design Day")
      options["summer_design_day"].each do |data_pair|
        hour = data_pair[0].truncate
        min = ((data_pair[0] - hour)*60).to_i
        summer_dsn_day.addValue(OpenStudio::Time.new(0, hour, min, 0),data_pair[1])
      end
    end      
    
    #Default Day
    default_day = sch_ruleset.defaultDaySchedule
    default_day.setName("#{sch_ruleset.name} #{options["default_day"][0]}")
    default_data_array = options["default_day"]
    default_data_array.delete_at(0)
    default_data_array.each do |data_pair|
      hour = data_pair[0].truncate
      min = ((data_pair[0] - hour)*60).to_i
      default_day.addValue(OpenStudio::Time.new(0, hour, min, 0),data_pair[1])
    end
    
    #Rules
    unless options["rules"].nil?
      options["rules"].each do |data_array|
        rule = OpenStudio::Model::ScheduleRule.new(sch_ruleset)      
        rule.setName("#{sch_ruleset.name} #{data_array[0]} Rule")
        date_range = data_array[1].split("-")
        start_date = date_range[0].split("/")
        end_date = date_range[1].split("/")
        rule.setStartDate(model.getYearDescription.makeDate(start_date[0].to_i,start_date[1].to_i))
        rule.setEndDate(model.getYearDescription.makeDate(end_date[0].to_i,end_date[1].to_i))
        days = data_array[2].split("/")
        rule.setApplySunday(true) if days.include? "Sun"
        rule.setApplyMonday(true) if days.include? "Mon"
        rule.setApplyTuesday(true) if days.include? "Tue"
        rule.setApplyWednesday(true) if days.include? "Wed"
        rule.setApplyThursday(true) if days.include? "Thu"
        rule.setApplyFriday(true) if days.include? "Fri"
        rule.setApplySaturday(true) if days.include? "Sat"
        day_schedule = rule.daySchedule
        day_schedule.setName("#{sch_ruleset.name} #{data_array[0]}")        
        data_array.delete_at(0)
        data_array.delete_at(0)
        data_array.delete_at(0)
        data_array.each do |data_pair|
          hour = data_pair[0].truncate
          min = ((data_pair[0] - hour)*60).to_i
          day_schedule.addValue(OpenStudio::Time.new(0, hour, min, 0),data_pair[1])
        end
      end  
    end          

    result = sch_ruleset
    return result

  end #end of OsLib_Schedules.createComplexSchedule

end
