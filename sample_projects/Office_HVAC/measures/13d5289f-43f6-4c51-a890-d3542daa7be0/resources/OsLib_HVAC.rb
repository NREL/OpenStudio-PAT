module OsLib_HVAC

  # do something
  def OsLib_HVAC.doSomething(input)

    # do something
    output = input

    result = output
    return result

  end # end of def


  # validate and make plenum zones
  def OsLib_HVAC.validateAndAddPlenumZonesToSystem(model, runner, options = {})

    # set defaults to use if user inputs not passed in
    defaults = {
        "zonesPlenum" => nil,
        "zonesPrimary" => nil,
        "type" => "ceilingReturn",
    }

    # merge user inputs with defaults
    options = defaults.merge(options)

    # array of valid ceiling plenums
    zoneSurfaceHash = {}
    zonePlenumHash = {}
    
    if options["zonesPlenum"] == nil
      runner.registerWarning("No plenum zones were passed in, validateAndAddPlenumZonesToSystem will not alter the model.")
    else
      options["zonesPlenum"].each do |zone|
        # get spaces in zone
        spaces = zone.spaces
        # get adjacent spaces
        spaces.each do |space|
          # get surfaces
          surfaces = space.surfaces
          # loop through surfaces looking for floors with surface boundary condition, grab zone that surface's parent space is in.
          surfaces.each do |surface|
            if surface.outsideBoundaryCondition == "Surface" and surface.surfaceType == "Floor"
              next unless surface.adjacentSurface.is_initialized
              adjacentSurface = surface.adjacentSurface.get
              next unless adjacentSurface.space.is_initialized
              adjacentSurfaceSpace =  adjacentSurface.space.get
              next unless adjacentSurfaceSpace.thermalZone.is_initialized
              adjacentSurfaceSpaceZone = adjacentSurfaceSpace.thermalZone.get
              if options["zonesPrimary"].include? adjacentSurfaceSpaceZone
                if zoneSurfaceHash[adjacentSurfaceSpaceZone].nil? or surface.grossArea > zoneSurfaceHash[adjacentSurfaceSpaceZone]
                  adjacentSurfaceSpaceZone.setReturnPlenum(zone)
                  zoneSurfaceHash[adjacentSurfaceSpaceZone] = surface.grossArea
                  zonePlenumHash[adjacentSurfaceSpaceZone] = zone
                end  
              end
            end
          end # end of surfaces.each do
        end # end of spaces.each do
      end # end of zonesPlenum.each do
    end # end of zonesPlenum == nil

    # report out results of zone-plenum hash
    zonePlenumHash.each do |zone,plenum|
      runner.registerInfo("#{plenum.name} has been set as a return air plenum for #{zone.name}.")
    end
    
    # pass back zone-plenum hash
    result = zonePlenumHash
    return result

  end # end of def
    
  def OsLib_HVAC.sortZones(model, runner, options = {})

    # set defaults to use if user inputs not passed in
    defaults = {"standardBuildingTypeTest" => nil, # not used for now
                "secondarySpaceTypeTest" => nil,
                "ceilingReturnPlenumSpaceType" => nil              
    }

    # merge user inputs with defaults
    options = defaults.merge(options)

    # set up zone type arrays
    zonesPrimary = []
    zonesSecondary = []
    zonesPlenum = []
    zonesUnconditioned = []
    
    # get thermal zones
    zones = model.getThermalZones
    zones.each do |zone|
      # assign appropriate zones to zonesPlenum or zonesUnconditioned (those that don't have thermostats or zone HVAC equipment)
      # if not conditioned then add to zonesPlenum or zonesUnconditioned
      unless zone.thermostatSetpointDualSetpoint.is_initialized or zone.equipment.size > 0
        # determine if zone is a plenum zone or general unconditioned zone
        # assume it is a plenum if it has at least one planum space
        zone.spaces.each do |space|
          # if a zone has already been assigned as a plenum, skip
          next if zonesPlenum.include? zone
          # if zone not assigned as a plenum, get space type if it exists
          # compare to plenum space type if it has been assigned
          if space.spaceType.is_initialized and options["ceilingReturnPlenumSpaceType"].nil? == false
            spaceType = space.spaceType.get
            if spaceType == options["ceilingReturnPlenumSpaceType"]
              zonesPlenum << zone # zone has a plenum space; assign it as a plenum
            end
          end
        end
        # if zone not assigned as a plenum, assign it as unconditioned
        unless zonesPlenum.include? zone  
          zonesUnconditioned << zone
        end  
      else
        # zone is conditioned.  check if its space type is secondary or primary
        spaces = zone.spaces
        spaces.each do |space|
          # if a zone has already been assigned as secondary, skip
          next if zonesSecondary.include? zone
          # get space type if it exists
          next unless space.spaceType.is_initialized
          spaceType = space.spaceType.get
          # get standards information
          # for now skip standardsBuildingType and just rely on the standardsSpaceType. Seems like enough.
          next unless spaceType.standardsSpaceType.is_initialized
          standardSpaceType = spaceType.standardsSpaceType.get
          # test space type against secondary space type array
          # if any space type in zone is secondary, assign zone as secondary
          if options["secondarySpaceTypeTest"].include? standardSpaceType
            zonesSecondary << zone
          end
        end # end of spaces each do
        # if zone not assigned as secondary, assign as primary
        unless zonesSecondary.include? zone
          zonesPrimary << zone
        end
      end
    end  
    
    zonesSorted = {"zonesPrimary" => zonesPrimary,
                 "zonesSecondary" => zonesSecondary,
                 "zonesPlenum" => zonesPlenum,
                 "zonesUnconditioned" => zonesUnconditioned}
    # pass back zonesSorted hash
    result = zonesSorted
    return result

  end # end of def

  def OsLib_HVAC.reportConditions(model, runner, condition)

    airloops = model.getAirLoopHVACs
    plantLoops = model.getPlantLoops
    zones = model.getThermalZones

    # count up zone equipment (not counting zone exhaust fans)
    zoneHasEquip = false
    zonesWithEquipCounter = 0
    
    zones.each do |zone|
      if zone.equipment.size > 0
        zone.equipment.each do |equip|
          unless equip.to_FanZoneExhaust.is_initialized
            zonesWithEquipCounter += 1
            break
          end
        end        
      end
    end  
    
    if condition == "initial"
      runner.registerInitialCondition("The building started with #{airloops.size} air loops and #{plantLoops.size} plant loops. #{zonesWithEquipCounter} zones were conditioned with zone equipment.")
    elsif condition == "final"
      runner.registerFinalCondition("The building finished with #{airloops.size} air loops and #{plantLoops.size} plant loops. #{zonesWithEquipCounter} zones are conditioned with zone equipment.")
    end
    
  end # end of def

  def OsLib_HVAC.removeEquipment(model, runner)

    airloops = model.getAirLoopHVACs
    plantLoops = model.getPlantLoops
    zones = model.getThermalZones
    
    # remove all airloops 
    airloops.each do |air_loop|
      air_loop.remove
    end

    # remove all zone equipment except zone exhaust fans
    zones.each do |zone|
      zone.equipment.each do |equip|
        if equip.to_FanZoneExhaust.is_initialized
        else  
          equip.remove
        end
      end
    end       

    # remove plant loops
    plantLoops.each do |plantLoop|
      # get the demand components and see if water use connection, then save it
      # notify user with info statement if supply side of plant loop had heat exchanger for refrigeration
      usedForSHWorRefrigeration = false
      plantLoop.demandComponents.each do |comp| #AP code to check your comments above
        if comp.to_WaterUseConnections.is_initialized or comp.to_CoilWaterHeatingDesuperheater.is_initialized
          usedForSHWorRefrigeration = true
        end
      end
      if usedForSHWorRefrigeration == false
        plantLoop.remove
      else
        runner.registerWarning("#{plantLoop.name} is used for SHW or refrigeration heat reclaim.  Loop will not be deleted")
      end
    end #next plantLoop
      
  end # end of def

  def OsLib_HVAC.assignHVACSchedules(model, runner, options = {})
   
    require "#{File.dirname(__FILE__)}/OsLib_Schedules"
   
    schedulesHVAC = {}
    airloops = model.getAirLoopHVACs
    
    # find airloop with most primary spaces
    max_primary_spaces = 0
    representative_airloop = false
    building_HVAC_schedule = false
    building_ventilation_schedule = false
    unless options["remake_schedules"]
      # if remake schedules not selected, get relevant schedules from model if they exist
      airloops.each do |air_loop|
        primary_spaces = 0
        air_loop.thermalZones.each do |thermal_zone|
          thermal_zone.spaces.each do |space|
            if space.spaceType.is_initialized
              if space.spaceType.get.name.is_initialized
                if space.spaceType.get.name.get.include? options["primarySpaceType"]
                  primary_spaces += 1
                end
              end  
            end  
          end
        end
        if primary_spaces > max_primary_spaces
          max_primary_spaces = primary_spaces
          representative_airloop = air_loop
        end      
      end
    end  
    if representative_airloop
      building_HVAC_schedule = representative_airloop.availabilitySchedule
      if representative_airloop.airLoopHVACOutdoorAirSystem.is_initialized
        building_ventilation_schedule_optional = representative_airloop.airLoopHVACOutdoorAirSystem.get.getControllerOutdoorAir.maximumFractionofOutdoorAirSchedule
        if building_ventilation_schedule_optional.is_initialized
          building_ventilation_schedule = building_ventilation_schedule.get
        end
      end  
    end
    # build new airloop schedules if existing model doesn't have them
    if options["primarySpaceType"] == "Classroom"
      # ventilation schedule
      unless building_ventilation_schedule
        ruleset_name = "AEDG K-12 Ventilation Schedule"
        winter_design_day = [[24,1]]
        summer_design_day = [[24,1]]
        default_day = ["Weekday",[6,0],[18,1],[24,0]]
        rules = []
        rules << ["Weekend","1/1-12/31","Sat/Sun",[24,0]]
        rules << ["Summer Weekday","7/1-8/31","Mon/Tue/Wed/Thu/Fri",[8,0],[13,1],[24,0]]
        options_ventilation = {"name" => ruleset_name,
                               "winter_design_day" => winter_design_day,
                               "summer_design_day" => summer_design_day,
                               "default_day" => default_day,
                               "rules" => rules}
        building_ventilation_schedule = OsLib_Schedules.createComplexSchedule(model, options_ventilation)
      end
      # HVAC availability schedule
      unless building_HVAC_schedule
        ruleset_name = "AEDG K-12 HVAC Availability Schedule"
        winter_design_day = [[24,1]]
        summer_design_day = [[24,1]]
        default_day = ["Weekday",[6,0],[18,1],[24,0]]
        rules = []
        rules << ["Weekend","1/1-12/31","Sat/Sun",[24,0]]
        rules << ["Summer Weekday","7/1-8/31","Mon/Tue/Wed/Thu/Fri",[8,0],[13,1],[24,0]]
        options_hvac = {"name" => ruleset_name,
                        "winter_design_day" => winter_design_day,
                        "summer_design_day" => summer_design_day,
                        "default_day" => default_day,
                        "rules" => rules}
        building_HVAC_schedule = OsLib_Schedules.createComplexSchedule(model, options_hvac)
      end
    elsif options["primarySpaceType"] == "Office"
      # ventilation schedule
      unless building_ventilation_schedule
        ruleset_name = "AEDG Office Ventilation Schedule"
        winter_design_day = [[24,1]] #ML These are not always on in PNNL model
        summer_design_day = [[24,1]] #ML These are not always on in PNNL model
        default_day = ["Weekday",[7,0],[22,1],[24,0]] #ML PNNL has a one hour ventilation offset
        rules = []
        rules << ["Saturday","1/1-12/31","Sat",[7,0],[18,1],[24,0]] #ML PNNL has a one hour ventilation offset
        rules << ["Sunday","1/1-12/31","Sun",[24,0]]
        options_ventilation = {"name" => ruleset_name,
                               "winter_design_day" => winter_design_day,
                               "summer_design_day" => summer_design_day,
                               "default_day" => default_day,
                               "rules" => rules}
        building_ventilation_schedule = OsLib_Schedules.createComplexSchedule(model, options_ventilation)
      end
      # HVAC availability schedule
      unless building_HVAC_schedule
        ruleset_name = "AEDG Office HVAC Availability Schedule"
        winter_design_day = [[24,1]] #ML These are not always on in PNNL model
        summer_design_day = [[24,1]] #ML These are not always on in PNNL model
        default_day = ["Weekday",[6,0],[22,1],[24,0]] #ML PNNL has a one hour ventilation offset
        rules = []
        rules << ["Saturday","1/1-12/31","Sat",[6,0],[18,1],[24,0]] #ML PNNL has a one hour ventilation offset
        rules << ["Sunday","1/1-12/31","Sun",[24,0]]
        options_hvac = {"name" => ruleset_name,
                        "winter_design_day" => winter_design_day,
                        "summer_design_day" => summer_design_day,
                        "default_day" => default_day,
                        "rules" => rules}
        building_HVAC_schedule = OsLib_Schedules.createComplexSchedule(model, options_hvac)
      end
      # special loops for radiant system (different temperature setpoints)
      if options["allHVAC"]["zone"] == "Radiant"
        # create hot water schedule for radiant heating loop
        schedulesHVAC["radiant_hot_water"] = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG HW-Radiant-Loop-Temp-Schedule",
                                                                                   "default_day" => ["All Days",[24,45.0]]})
        # create hot water schedule for radiant cooling loop
        schedulesHVAC["radiant_chilled_water"] = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG CW-Radiant-Loop-Temp-Schedule",
                                                                                   "default_day" => ["All Days",[24,15.0]]})
        # create mean radiant heating and cooling setpoint schedules
        # ML ideally, should grab schedules tied to zone thermostat and make modified versions that follow the setback pattern
        # for now, create new ones that match the recommended HVAC schedule
        # mean radiant heating setpoint schedule (PNNL values)
        ruleset_name = "AEDG Office Mean Radiant Heating Setpoint Schedule"
        winter_design_day = [[24,18.8]]
        summer_design_day = [[6,18.3],[22,18.8],[24,18.3]]
        default_day = ["Weekday",[6,18.3],[22,18.8],[24,18.3]]
        rules = []
        rules << ["Saturday","1/1-12/31","Sat",[6,18.3],[18,18.8],[24,18.3]]
        rules << ["Sunday","1/1-12/31","Sun",[24,18.3]]
        options_radiant_heating = {"name" => ruleset_name,
                        "winter_design_day" => winter_design_day,
                        "summer_design_day" => summer_design_day,
                        "default_day" => default_day,
                        "rules" => rules}
        mean_radiant_heating_schedule = OsLib_Schedules.createComplexSchedule(model, options_radiant_heating)
        schedulesHVAC["mean_radiant_heating"] = mean_radiant_heating_schedule
        # mean radiant cooling setpoint schedule (PNNL values)
        ruleset_name = "AEDG Office Mean Radiant Cooling Setpoint Schedule"
        winter_design_day = [[6,26.7],[22,24.0],[24,26.7]]
        summer_design_day = [[24,24.0]]
        default_day = ["Weekday",[6,26.7],[22,24.0],[24,26.7]]
        rules = []
        rules << ["Saturday","1/1-12/31","Sat",[6,26.7],[18,24.0],[24,26.7]]
        rules << ["Sunday","1/1-12/31","Sun",[24,26.7]]
        options_radiant_cooling = {"name" => ruleset_name,
                        "winter_design_day" => winter_design_day,
                        "summer_design_day" => summer_design_day,
                        "default_day" => default_day,
                        "rules" => rules}
        mean_radiant_cooling_schedule = OsLib_Schedules.createComplexSchedule(model, options_radiant_cooling)
        schedulesHVAC["mean_radiant_cooling"] = mean_radiant_cooling_schedule
      end
    end
    # SAT schedule
    if options["allHVAC"]["primary"]["doas"]
      # primary airloop is DOAS
      schedulesHVAC["primary_sat"] = sch_ruleset_DOAS_setpoint = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG DOAS Temperature Setpoint Schedule",
                                                                                "default_day" => ["All Days",[24,20.0]]})
    else 
      # primary airloop is multizone VAV that cools
      schedulesHVAC["primary_sat"] = sch_ruleset_DOAS_setpoint = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG Cold Deck Temperature Setpoint Schedule",
                                                                                "default_day" => ["All Days",[24,12.8]]})
    end
    schedulesHVAC["ventilation"] = building_ventilation_schedule
    schedulesHVAC["hvac"] = building_HVAC_schedule
    # build new plant schedules as needed
    zoneHVACHotWaterPlant = ["FanCoil","DualDuct","Baseboard"] # dual duct has fan coil and baseboard
    zoneHVACChilledWaterPlant = ["FanCoil","DualDuct"] # dual duct has fan coil
    # hot water
    if options["allHVAC"]["primary"]["heat"] == "Water" or options["allHVAC"]["secondary"]["heat"] == "Water" or zoneHVACHotWaterPlant.include? options["allHVAC"]["zone"]
      schedulesHVAC["hot_water"] = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG HW-Loop-Temp-Schedule",
                                                                                 "default_day" => ["All Days",[24,67.0]]})
    end
    # chilled water
    if options["allHVAC"]["primary"]["cool"] == "Water" or options["allHVAC"]["secondary"]["cool"] == "Water" or zoneHVACChilledWaterPlant.include? options["allHVAC"]["zone"]
      schedulesHVAC["chilled_water"] = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG CW-Loop-Temp-Schedule",
                                                                                     "default_day" => ["All Days",[24,6.7]]})
    end
    # heat pump condenser loop schedules
    if options["allHVAC"]["zone"] == "GSHP"
      # there will be a heat pump condenser loop
      # loop setpoint schedule
      schedulesHVAC["hp_loop"] = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG HP-Loop-Temp-Schedule",
                                                                               "default_day" => ["All Days",[24,21]]})
      # cooling component schedule (#ML won't need this if a ground loop is actually modeled)
      schedulesHVAC["hp_loop_cooling"] = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG HP-Loop-Clg-Temp-Schedule",
                                                                                       "default_day" => ["All Days",[24,21]]})
      # heating component schedule
      schedulesHVAC["hp_loop_heating"] = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG HP-Loop-Htg-Temp-Schedule",
                                                                                       "default_day" => ["All Days",[24,5]]})
    end
    if options["allHVAC"]["zone"] == "WSHP"
      # there will be a heat pump condenser loop
      # loop setpoint schedule
      schedulesHVAC["hp_loop"] = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG HP-Loop-Temp-Schedule",
                                                                               "default_day" => ["All Days",[24,30]]}) #PNNL
      # cooling component schedule (#ML won't need this if a ground loop is actually modeled)
      schedulesHVAC["hp_loop_cooling"] = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG HP-Loop-Clg-Temp-Schedule",
                                                                                       "default_day" => ["All Days",[24,30]]}) #PNNL
      # heating component schedule
      schedulesHVAC["hp_loop_heating"] = OsLib_Schedules.createComplexSchedule(model, {"name" => "AEDG HP-Loop-Htg-Temp-Schedule",
                                                                                       "default_day" => ["All Days",[24,20]]}) #PNNL
    end
    
    # pass back schedulesHVAC hash
    result = schedulesHVAC
    return result

  end # end of def

  def OsLib_HVAC.createHotWaterPlant(model, runner, hot_water_setpoint_schedule, loop_type)
    
    hot_water_plant = OpenStudio::Model::PlantLoop.new(model)
    hot_water_plant.setName("AEDG #{loop_type} Loop")
    hot_water_plant.setMaximumLoopTemperature(100)
    hot_water_plant.setMinimumLoopTemperature(10)
    loop_sizing = hot_water_plant.sizingPlant
    loop_sizing.setLoopType("Heating")
    if loop_type == "Hot Water"
      loop_sizing.setDesignLoopExitTemperature(82)
    elsif loop_type == "Radiant Hot Water"
      loop_sizing.setDesignLoopExitTemperature(60) #ML follows convention of sizing temp being larger than supplu temp
    end    
    loop_sizing.setLoopDesignTemperatureDifference(11)
    # create a pump
    pump = OpenStudio::Model::PumpVariableSpeed.new(model)
    pump.setRatedPumpHead(119563) #Pa
    pump.setMotorEfficiency(0.9)
    pump.setCoefficient1ofthePartLoadPerformanceCurve(0)
    pump.setCoefficient2ofthePartLoadPerformanceCurve(0.0216)
    pump.setCoefficient3ofthePartLoadPerformanceCurve(-0.0325)
    pump.setCoefficient4ofthePartLoadPerformanceCurve(1.0095)
    # create a boiler
    boiler = OpenStudio::Model::BoilerHotWater.new(model)
    boiler.setNominalThermalEfficiency(0.9)
    # create a scheduled setpoint manager
    setpoint_manager_scheduled = OpenStudio::Model::SetpointManagerScheduled.new(model,hot_water_setpoint_schedule)
    # create a supply bypass pipe
    pipe_supply_bypass = OpenStudio::Model::PipeAdiabatic.new(model)
    # create a supply outlet pipe
    pipe_supply_outlet = OpenStudio::Model::PipeAdiabatic.new(model)
    # create a demand bypass pipe
    pipe_demand_bypass = OpenStudio::Model::PipeAdiabatic.new(model)
    # create a demand inlet pipe
    pipe_demand_inlet = OpenStudio::Model::PipeAdiabatic.new(model)
    # create a demand outlet pipe
    pipe_demand_outlet = OpenStudio::Model::PipeAdiabatic.new(model)
    # connect components to plant loop
    # supply side components
    hot_water_plant.addSupplyBranchForComponent(boiler)
    hot_water_plant.addSupplyBranchForComponent(pipe_supply_bypass)
    pump.addToNode(hot_water_plant.supplyInletNode)
    pipe_supply_outlet.addToNode(hot_water_plant.supplyOutletNode)
    setpoint_manager_scheduled.addToNode(hot_water_plant.supplyOutletNode)
    # demand side components (water coils are added as they are added to airloops and zoneHVAC)
    hot_water_plant.addDemandBranchForComponent(pipe_demand_bypass)
    pipe_demand_inlet.addToNode(hot_water_plant.demandInletNode)
    pipe_demand_outlet.addToNode(hot_water_plant.demandOutletNode)

    # pass back hot water plant
    result = hot_water_plant
    return result

  end # end of def

  def OsLib_HVAC.createChilledWaterPlant(model, runner, chilled_water_setpoint_schedule, loop_type, chillerType)
    
    # chilled water plant
    chilled_water_plant = OpenStudio::Model::PlantLoop.new(model)
    chilled_water_plant.setName("AEDG #{loop_type} Loop")
    chilled_water_plant.setMaximumLoopTemperature(98)
    chilled_water_plant.setMinimumLoopTemperature(1)
    loop_sizing = chilled_water_plant.sizingPlant
    loop_sizing.setLoopType("Cooling")
    if loop_type == "Chilled Water"
      loop_sizing.setDesignLoopExitTemperature(6.7)
    elsif loop_type == "Radiant Chilled Water"
      loop_sizing.setDesignLoopExitTemperature(15)
    end    
    loop_sizing.setLoopDesignTemperatureDifference(6.7)
    # create a pump
    pump = OpenStudio::Model::PumpVariableSpeed.new(model)
    pump.setRatedPumpHead(149453) #Pa
    pump.setMotorEfficiency(0.9)
    pump.setCoefficient1ofthePartLoadPerformanceCurve(0)
    pump.setCoefficient2ofthePartLoadPerformanceCurve(0.0216)
    pump.setCoefficient3ofthePartLoadPerformanceCurve(-0.0325)
    pump.setCoefficient4ofthePartLoadPerformanceCurve(1.0095)
    # create a chiller
    if chillerType == "WaterCooled"
      # create clgCapFuncTempCurve
      clgCapFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
      clgCapFuncTempCurve.setCoefficient1Constant(1.07E+00)
      clgCapFuncTempCurve.setCoefficient2x(4.29E-02)
      clgCapFuncTempCurve.setCoefficient3xPOW2(4.17E-04)
      clgCapFuncTempCurve.setCoefficient4y(-8.10E-03)
      clgCapFuncTempCurve.setCoefficient5yPOW2(-4.02E-05)
      clgCapFuncTempCurve.setCoefficient6xTIMESY(-3.86E-04)
      clgCapFuncTempCurve.setMinimumValueofx(0)
      clgCapFuncTempCurve.setMaximumValueofx(20)
      clgCapFuncTempCurve.setMinimumValueofy(0)
      clgCapFuncTempCurve.setMaximumValueofy(50)
      # create eirFuncTempCurve
      eirFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
      eirFuncTempCurve.setCoefficient1Constant(4.68E-01)
      eirFuncTempCurve.setCoefficient2x(-1.38E-02)
      eirFuncTempCurve.setCoefficient3xPOW2(6.98E-04)
      eirFuncTempCurve.setCoefficient4y(1.09E-02)
      eirFuncTempCurve.setCoefficient5yPOW2(4.62E-04)
      eirFuncTempCurve.setCoefficient6xTIMESY(-6.82E-04)
      eirFuncTempCurve.setMinimumValueofx(0)
      eirFuncTempCurve.setMaximumValueofx(20)
      eirFuncTempCurve.setMinimumValueofy(0)
      eirFuncTempCurve.setMaximumValueofy(50)
      # create eirFuncPlrCurve
      eirFuncPlrCurve = OpenStudio::Model::CurveQuadratic.new(model)
      eirFuncPlrCurve.setCoefficient1Constant(1.41E-01)
      eirFuncPlrCurve.setCoefficient2x(6.55E-01)
      eirFuncPlrCurve.setCoefficient3xPOW2(2.03E-01)
      eirFuncPlrCurve.setMinimumValueofx(0)
      eirFuncPlrCurve.setMaximumValueofx(1.2)
      # construct chiller
      chiller = OpenStudio::Model::ChillerElectricEIR.new(model,clgCapFuncTempCurve,eirFuncTempCurve,eirFuncPlrCurve)
      chiller.setReferenceCOP(6.1)
      chiller.setCondenserType("WaterCooled")
      chiller.setChillerFlowMode("ConstantFlow")
    elsif chillerType == "AirCooled"
      # create clgCapFuncTempCurve
      clgCapFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
      clgCapFuncTempCurve.setCoefficient1Constant(1.05E+00)
      clgCapFuncTempCurve.setCoefficient2x(3.36E-02)
      clgCapFuncTempCurve.setCoefficient3xPOW2(2.15E-04)
      clgCapFuncTempCurve.setCoefficient4y(-5.18E-03)
      clgCapFuncTempCurve.setCoefficient5yPOW2(-4.42E-05)
      clgCapFuncTempCurve.setCoefficient6xTIMESY(-2.15E-04)
      clgCapFuncTempCurve.setMinimumValueofx(0)
      clgCapFuncTempCurve.setMaximumValueofx(20)
      clgCapFuncTempCurve.setMinimumValueofy(0)
      clgCapFuncTempCurve.setMaximumValueofy(50)
      # create eirFuncTempCurve
      eirFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
      eirFuncTempCurve.setCoefficient1Constant(5.83E-01)
      eirFuncTempCurve.setCoefficient2x(-4.04E-03)
      eirFuncTempCurve.setCoefficient3xPOW2(4.68E-04)
      eirFuncTempCurve.setCoefficient4y(-2.24E-04)
      eirFuncTempCurve.setCoefficient5yPOW2(4.81E-04)
      eirFuncTempCurve.setCoefficient6xTIMESY(-6.82E-04)
      eirFuncTempCurve.setMinimumValueofx(0)
      eirFuncTempCurve.setMaximumValueofx(20)
      eirFuncTempCurve.setMinimumValueofy(0)
      eirFuncTempCurve.setMaximumValueofy(50)
      # create eirFuncPlrCurve
      eirFuncPlrCurve = OpenStudio::Model::CurveQuadratic.new(model)
      eirFuncPlrCurve.setCoefficient1Constant(4.19E-02)
      eirFuncPlrCurve.setCoefficient2x(6.25E-01)
      eirFuncPlrCurve.setCoefficient3xPOW2(3.23E-01)
      eirFuncPlrCurve.setMinimumValueofx(0)
      eirFuncPlrCurve.setMaximumValueofx(1.2)
      # construct chiller
      chiller = OpenStudio::Model::ChillerElectricEIR.new(model,clgCapFuncTempCurve,eirFuncTempCurve,eirFuncPlrCurve)
      chiller.setReferenceCOP(2.93)
      chiller.setCondenserType("AirCooled")
      chiller.setChillerFlowMode("ConstantFlow")
    end
    # create a scheduled setpoint manager
    setpoint_manager_scheduled = OpenStudio::Model::SetpointManagerScheduled.new(model,chilled_water_setpoint_schedule)
    # create a supply bypass pipe
    pipe_supply_bypass = OpenStudio::Model::PipeAdiabatic.new(model)
    # create a supply outlet pipe
    pipe_supply_outlet = OpenStudio::Model::PipeAdiabatic.new(model)
    # create a demand bypass pipe
    pipe_demand_bypass = OpenStudio::Model::PipeAdiabatic.new(model)
    # create a demand inlet pipe
    pipe_demand_inlet = OpenStudio::Model::PipeAdiabatic.new(model)
    # create a demand outlet pipe
    pipe_demand_outlet = OpenStudio::Model::PipeAdiabatic.new(model)
    # connect components to plant loop
    # supply side components
    chilled_water_plant.addSupplyBranchForComponent(chiller)
    chilled_water_plant.addSupplyBranchForComponent(pipe_supply_bypass)
    pump.addToNode(chilled_water_plant.supplyInletNode)
    pipe_supply_outlet.addToNode(chilled_water_plant.supplyOutletNode)
    setpoint_manager_scheduled.addToNode(chilled_water_plant.supplyOutletNode)
    # demand side components (water coils are added as they are added to airloops and ZoneHVAC)
    chilled_water_plant.addDemandBranchForComponent(pipe_demand_bypass)
    pipe_demand_inlet.addToNode(chilled_water_plant.demandInletNode)
    pipe_demand_outlet.addToNode(chilled_water_plant.demandOutletNode)

    # pass back chilled water plant
    result = chilled_water_plant
    return result

  end # end of def

  def OsLib_HVAC.createCondenserLoop(model, runner, options)

    condenserLoops = {}

    # check for water-cooled chillers
    waterCooledChiller = false
    model.getChillerElectricEIRs.each do |chiller|
      next if waterCooledChiller == true
      if chiller.condenserType == "WaterCooled"
        waterCooledChiller = true
      end   
    end
    # create condenser loop for water-cooled chillers
    if waterCooledChiller
      # create condenser loop for water-cooled chiller(s)
      condenser_loop = OpenStudio::Model::PlantLoop.new(model)
      condenser_loop.setName("AEDG Condenser Loop")
      condenser_loop.setMaximumLoopTemperature(80)
      condenser_loop.setMinimumLoopTemperature(5)
      loop_sizing = condenser_loop.sizingPlant
      loop_sizing.setLoopType("Condenser")
      loop_sizing.setDesignLoopExitTemperature(29.4)
      loop_sizing.setLoopDesignTemperatureDifference(5.6)
      # create a pump
      pump = OpenStudio::Model::PumpVariableSpeed.new(model)
      pump.setRatedPumpHead(134508) #Pa
      pump.setMotorEfficiency(0.9)
      pump.setCoefficient1ofthePartLoadPerformanceCurve(0)
      pump.setCoefficient2ofthePartLoadPerformanceCurve(0.0216)
      pump.setCoefficient3ofthePartLoadPerformanceCurve(-0.0325)
      pump.setCoefficient4ofthePartLoadPerformanceCurve(1.0095)
      # create a cooling tower
      tower = OpenStudio::Model::CoolingTowerVariableSpeed.new(model)
      # create a supply bypass pipe
      pipe_supply_bypass = OpenStudio::Model::PipeAdiabatic.new(model)
      # create a supply outlet pipe
      pipe_supply_outlet = OpenStudio::Model::PipeAdiabatic.new(model)
      # create a demand bypass pipe
      pipe_demand_bypass = OpenStudio::Model::PipeAdiabatic.new(model)
      # create a demand inlet pipe
      pipe_demand_inlet = OpenStudio::Model::PipeAdiabatic.new(model)
      # create a demand outlet pipe
      pipe_demand_outlet = OpenStudio::Model::PipeAdiabatic.new(model)
      # create a setpoint manager
      setpoint_manager_follow_oa = OpenStudio::Model::SetpointManagerFollowOutdoorAirTemperature.new(model)
      setpoint_manager_follow_oa.setOffsetTemperatureDifference(0)
      setpoint_manager_follow_oa.setMaximumSetpointTemperature(80)
      setpoint_manager_follow_oa.setMinimumSetpointTemperature(5)
      # connect components to plant loop
      # supply side components
      condenser_loop.addSupplyBranchForComponent(tower)
      condenser_loop.addSupplyBranchForComponent(pipe_supply_bypass)
      pump.addToNode(condenser_loop.supplyInletNode)
      pipe_supply_outlet.addToNode(condenser_loop.supplyOutletNode)
      setpoint_manager_follow_oa.addToNode(condenser_loop.supplyOutletNode)
      # demand side components
      model.getChillerElectricEIRs.each do |chiller|
        if chiller.condenserType == "WaterCooled" # works only if chillers not already connected to condenser loop(s)
          condenser_loop.addDemandBranchForComponent(chiller)
        end   
      end
      condenser_loop.addDemandBranchForComponent(pipe_demand_bypass)
      pipe_demand_inlet.addToNode(condenser_loop.demandInletNode)
      pipe_demand_outlet.addToNode(condenser_loop.demandOutletNode)
      condenserLoops["condenser_loop"] = condenser_loop    
    end
    if options["zoneHVAC"] == "WSHP" or options["zoneHVAC"] == "GSHP"
      # create condenser loop for heat pumps
      condenser_loop = OpenStudio::Model::PlantLoop.new(model)
      condenser_loop.setName("AEDG Heat Pump Loop")
      condenser_loop.setMaximumLoopTemperature(80)
      condenser_loop.setMinimumLoopTemperature(1)
      loop_sizing = condenser_loop.sizingPlant
      loop_sizing.setLoopType("Condenser")
      if options["zoneHVAC"] == "GSHP"
        loop_sizing.setDesignLoopExitTemperature(21)
        loop_sizing.setLoopDesignTemperatureDifference(5)
      elsif options["zoneHVAC"] == "WSHP" 
        loop_sizing.setDesignLoopExitTemperature(30) #PNNL
        loop_sizing.setLoopDesignTemperatureDifference(20) #PNNL
      end  
      # create a pump
      pump = OpenStudio::Model::PumpVariableSpeed.new(model)
      pump.setRatedPumpHead(134508) #Pa
      pump.setMotorEfficiency(0.9)
      pump.setCoefficient1ofthePartLoadPerformanceCurve(0)
      pump.setCoefficient2ofthePartLoadPerformanceCurve(0.0216)
      pump.setCoefficient3ofthePartLoadPerformanceCurve(-0.0325)
      pump.setCoefficient4ofthePartLoadPerformanceCurve(1.0095)
      # create a supply bypass pipe
      pipe_supply_bypass = OpenStudio::Model::PipeAdiabatic.new(model)
      # create a supply outlet pipe
      pipe_supply_outlet = OpenStudio::Model::PipeAdiabatic.new(model)
      # create a demand bypass pipe
      pipe_demand_bypass = OpenStudio::Model::PipeAdiabatic.new(model)
      # create a demand inlet pipe
      pipe_demand_inlet = OpenStudio::Model::PipeAdiabatic.new(model)
      # create a demand outlet pipe
      pipe_demand_outlet = OpenStudio::Model::PipeAdiabatic.new(model)
      # create setpoint managers
      setpoint_manager_scheduled_loop = OpenStudio::Model::SetpointManagerScheduled.new(model,options["loop_setpoint_schedule"])
      setpoint_manager_scheduled_cooling = OpenStudio::Model::SetpointManagerScheduled.new(model,options["cooling_setpoint_schedule"])
      setpoint_manager_scheduled_heating = OpenStudio::Model::SetpointManagerScheduled.new(model,options["heating_setpoint_schedule"])
      # connect components to plant loop
      # supply side components
      condenser_loop.addSupplyBranchForComponent(pipe_supply_bypass)
      pump.addToNode(condenser_loop.supplyInletNode)
      pipe_supply_outlet.addToNode(condenser_loop.supplyOutletNode)
      setpoint_manager_scheduled_loop.addToNode(condenser_loop.supplyOutletNode)
      # demand side components
      condenser_loop.addDemandBranchForComponent(pipe_demand_bypass)
      pipe_demand_inlet.addToNode(condenser_loop.demandInletNode)
      pipe_demand_outlet.addToNode(condenser_loop.demandOutletNode)
      # add additional components according to specific system type
      if options["zoneHVAC"] == "GSHP"
        # add district cooling and heating to supply side
        district_cooling = OpenStudio::Model::DistrictCooling.new(model)
        district_cooling.setNominalCapacity(1000000000000) # large number; no autosizing
        condenser_loop.addSupplyBranchForComponent(district_cooling)
        setpoint_manager_scheduled_cooling.addToNode(district_cooling.outletModelObject.get.to_Node.get)
        district_heating = OpenStudio::Model::DistrictHeating.new(model)
        district_heating.setNominalCapacity(1000000000000) # large number; no autosizing
        district_heating.addToNode(district_cooling.outletModelObject.get.to_Node.get)
        setpoint_manager_scheduled_heating.addToNode(district_heating.outletModelObject.get.to_Node.get)
        # add heat pumps to demand side after they get created
      elsif options["zoneHVAC"] == "WSHP"
        # add a boiler and cooling tower to supply side
        # create a boiler
        boiler = OpenStudio::Model::BoilerHotWater.new(model)
        boiler.setNominalThermalEfficiency(0.9)
        condenser_loop.addSupplyBranchForComponent(boiler)
        setpoint_manager_scheduled_heating.addToNode(boiler.outletModelObject.get.to_Node.get)
        # create a cooling tower
        tower = OpenStudio::Model::CoolingTowerSingleSpeed.new(model)
        tower.addToNode(boiler.outletModelObject.get.to_Node.get)
        setpoint_manager_scheduled_cooling.addToNode(tower.outletModelObject.get.to_Node.get)
      end
      condenserLoops["heat_pump_loop"] = condenser_loop    
    end
      
    # pass back condenser loop(s)
    result = condenserLoops
    return result

  end # end of def

  def OsLib_HVAC.createPrimaryAirLoops(model, runner, options)
    primary_airloops = []
    # create primary airloop for each story
    assignedThermalZones = []
    model.getBuildingStorys.sort.each do |building_story|
      #ML stories need to be reordered from the ground up
      thermalZonesToAdd = []
      building_story.spaces.each do |space|
        # make sure spaces are assigned to thermal zones
        # otherwise might want to send a warning
        if space.thermalZone.is_initialized
          thermal_zone = space.thermalZone.get
          # grab primary zones
          if options["zonesPrimary"].include? thermal_zone
            # make sure zone was not already assigned to another air loop
            unless assignedThermalZones.include? thermal_zone
              # make sure thermal zones are not duplicated (spaces can share thermal zones)
              unless thermalZonesToAdd.include? thermal_zone
                thermalZonesToAdd << thermal_zone
              end
            end
          end  
        end      
      end
      # make sure thermal zones don't get added to more than one air loop
      assignedThermalZones << thermalZonesToAdd
            
      # create new air loop if story contains primary zones
      unless thermalZonesToAdd.empty?
        airloop_primary = OpenStudio::Model::AirLoopHVAC.new(model)
        airloop_primary.setName("AEDG Air Loop HVAC #{building_story.name}")
        # modify system sizing properties
        sizing_system = airloop_primary.sizingSystem
        # set central heating and cooling temperatures for sizing
        sizing_system.setCentralCoolingDesignSupplyAirTemperature(12.8)
        sizing_system.setCentralHeatingDesignSupplyAirTemperature(40) #ML OS default is 16.7
        # load specification
        sizing_system.setSystemOutdoorAirMethod("VentilationRateProcedure") #ML OS default is ZoneSum
        if options["primaryHVAC"]["doas"]
          sizing_system.setTypeofLoadtoSizeOn("VentilationRequirement") #DOAS
          sizing_system.setAllOutdoorAirinCooling(true) #DOAS
          sizing_system.setAllOutdoorAirinHeating(true) #DOAS
        else  
          sizing_system.setTypeofLoadtoSizeOn("Sensible") #VAV
          sizing_system.setAllOutdoorAirinCooling(false) #VAV
          sizing_system.setAllOutdoorAirinHeating(false) #VAV
        end    

        air_loop_comps = []
        # set availability schedule
        airloop_primary.setAvailabilitySchedule(options["hvac_schedule"])
        # create air loop fan
        if options["primaryHVAC"]["fan"] == "Variable"
          # create variable speed fan and set system sizing accordingly
          sizing_system.setCentralHeatingMaximumSystemAirFlowRatio(0.3) #DCV
          # variable speed fan
          fan = OpenStudio::Model::FanVariableVolume.new(model, model.alwaysOnDiscreteSchedule())
          fan.setFanEfficiency(0.69)
          fan.setPressureRise(1125) #Pa
          fan.autosizeMaximumFlowRate()
          fan.setFanPowerMinimumFlowFraction(0.6)
          fan.setMotorEfficiency(0.9)
          fan.setMotorInAirstreamFraction(1.0)
          air_loop_comps << fan
        else
          sizing_system.setCentralHeatingMaximumSystemAirFlowRatio(1.0) # No DCV
          # constant speed fan
          fan = OpenStudio::Model::FanConstantVolume.new(model, model.alwaysOnDiscreteSchedule())
          fan.setFanEfficiency(0.6)
          fan.setPressureRise(500) #Pa
          fan.autosizeMaximumFlowRate()
          fan.setMotorEfficiency(0.9)
          fan.setMotorInAirstreamFraction(1.0)
          air_loop_comps << fan
        end  
        # create heating coil
        if options["primaryHVAC"]["heat"] == "Water"
          # water coil
          heating_coil = OpenStudio::Model::CoilHeatingWater.new(model, model.alwaysOnDiscreteSchedule())
          air_loop_comps << heating_coil
        else  
          # gas coil
          heating_coil = OpenStudio::Model::CoilHeatingGas.new(model, model.alwaysOnDiscreteSchedule())
          air_loop_comps << heating_coil
        end  
        # create cooling coil
        if options["primaryHVAC"]["cool"] == "Water"
          # water coil
          cooling_coil = OpenStudio::Model::CoilCoolingWater.new(model, model.alwaysOnDiscreteSchedule())
          air_loop_comps << cooling_coil
        elsif options["primaryHVAC"]["cool"] == "SingleDX"
          # single speed DX coil
          # create cooling coil
          # create clgCapFuncTempCurve
          clgCapFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
          clgCapFuncTempCurve.setCoefficient1Constant(0.42415)
          clgCapFuncTempCurve.setCoefficient2x(0.04426)
          clgCapFuncTempCurve.setCoefficient3xPOW2(-0.00042)
          clgCapFuncTempCurve.setCoefficient4y(0.00333)
          clgCapFuncTempCurve.setCoefficient5yPOW2(-0.00008)
          clgCapFuncTempCurve.setCoefficient6xTIMESY(-0.00021)
          clgCapFuncTempCurve.setMinimumValueofx(17)
          clgCapFuncTempCurve.setMaximumValueofx(22)
          clgCapFuncTempCurve.setMinimumValueofy(13)
          clgCapFuncTempCurve.setMaximumValueofy(46)
          # create clgCapFuncFlowFracCurve
          clgCapFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgCapFuncFlowFracCurve.setCoefficient1Constant(0.77136)
          clgCapFuncFlowFracCurve.setCoefficient2x(0.34053)
          clgCapFuncFlowFracCurve.setCoefficient3xPOW2(-0.11088)
          clgCapFuncFlowFracCurve.setMinimumValueofx(0.75918)
          clgCapFuncFlowFracCurve.setMaximumValueofx(1.13877)
          # create clgEirFuncTempCurve
          clgEirFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
          clgEirFuncTempCurve.setCoefficient1Constant(1.23649)
          clgEirFuncTempCurve.setCoefficient2x(-0.02431)
          clgEirFuncTempCurve.setCoefficient3xPOW2(0.00057)
          clgEirFuncTempCurve.setCoefficient4y(-0.01434)
          clgEirFuncTempCurve.setCoefficient5yPOW2(0.00063)
          clgEirFuncTempCurve.setCoefficient6xTIMESY(-0.00038)
          clgEirFuncTempCurve.setMinimumValueofx(17)
          clgEirFuncTempCurve.setMaximumValueofx(22)
          clgEirFuncTempCurve.setMinimumValueofy(13)
          clgEirFuncTempCurve.setMaximumValueofy(46)
          # create clgEirFuncFlowFracCurve
          clgEirFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgEirFuncFlowFracCurve.setCoefficient1Constant(1.20550)
          clgEirFuncFlowFracCurve.setCoefficient2x(-0.32953)
          clgEirFuncFlowFracCurve.setCoefficient3xPOW2(0.12308)
          clgEirFuncFlowFracCurve.setMinimumValueofx(0.75918)
          clgEirFuncFlowFracCurve.setMaximumValueofx(1.13877)
          # create clgPlrCurve
          clgPlrCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgPlrCurve.setCoefficient1Constant(0.77100)
          clgPlrCurve.setCoefficient2x(0.22900)
          clgPlrCurve.setCoefficient3xPOW2(0.0)
          clgPlrCurve.setMinimumValueofx(0.0)
          clgPlrCurve.setMaximumValueofx(1.0)
          # cooling coil
          cooling_coil = OpenStudio::Model::CoilCoolingDXSingleSpeed.new(model,
                                                                           model.alwaysOnDiscreteSchedule(),
                                                                           clgCapFuncTempCurve,
                                                                           clgCapFuncFlowFracCurve,
                                                                           clgEirFuncTempCurve,
                                                                           clgEirFuncFlowFracCurve,
                                                                           clgPlrCurve)
          cooling_coil.setRatedCOP(OpenStudio::OptionalDouble.new(4))
          air_loop_comps << cooling_coil
        else
          # two speed DX coil (PNNL curves)
          # create cooling coil
          # create clgCapFuncTempCurve
          clgCapFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
          clgCapFuncTempCurve.setCoefficient1Constant(1.39072)
          clgCapFuncTempCurve.setCoefficient2x(-0.0529058)
          clgCapFuncTempCurve.setCoefficient3xPOW2(0.0018423)
          clgCapFuncTempCurve.setCoefficient4y(0.00058267)
          clgCapFuncTempCurve.setCoefficient5yPOW2(-0.000186814)
          clgCapFuncTempCurve.setCoefficient6xTIMESY(0.000265159)
          clgCapFuncTempCurve.setMinimumValueofx(16.5556)
          clgCapFuncTempCurve.setMaximumValueofx(22.1111)
          clgCapFuncTempCurve.setMinimumValueofy(23.7778)
          clgCapFuncTempCurve.setMaximumValueofy(47.66)
          # create clgCapFuncFlowFracCurve
          clgCapFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgCapFuncFlowFracCurve.setCoefficient1Constant(0.718954)
          clgCapFuncFlowFracCurve.setCoefficient2x(0.435436)
          clgCapFuncFlowFracCurve.setCoefficient3xPOW2(-0.154193)
          clgCapFuncFlowFracCurve.setMinimumValueofx(0.75)
          clgCapFuncFlowFracCurve.setMaximumValueofx(1.25)
          # create clgEirFuncTempCurve
          clgEirFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
          clgEirFuncTempCurve.setCoefficient1Constant(-0.536161)
          clgEirFuncTempCurve.setCoefficient2x(0.105138)
          clgEirFuncTempCurve.setCoefficient3xPOW2(-0.00172659)
          clgEirFuncTempCurve.setCoefficient4y(0.0149848)
          clgEirFuncTempCurve.setCoefficient5yPOW2(0.000659948)
          clgEirFuncTempCurve.setCoefficient6xTIMESY(-0.0017385)
          clgEirFuncTempCurve.setMinimumValueofx(16.5556)
          clgEirFuncTempCurve.setMaximumValueofx(22.1111)
          clgEirFuncTempCurve.setMinimumValueofy(23.7778)
          clgEirFuncTempCurve.setMaximumValueofy(47.66)
          # create clgEirFuncFlowFracCurve
          clgEirFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgEirFuncFlowFracCurve.setCoefficient1Constant(1.19525)
          clgEirFuncFlowFracCurve.setCoefficient2x(-0.306138)
          clgEirFuncFlowFracCurve.setCoefficient3xPOW2(0.110973)
          clgEirFuncFlowFracCurve.setMinimumValueofx(0.75)
          clgEirFuncFlowFracCurve.setMaximumValueofx(1.25)
          # create clgPlrCurve
          clgPlrCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgPlrCurve.setCoefficient1Constant(0.77100)
          clgPlrCurve.setCoefficient2x(0.22900)
          clgPlrCurve.setCoefficient3xPOW2(0.0)
          clgPlrCurve.setMinimumValueofx(0.0)
          clgPlrCurve.setMaximumValueofx(1.0)
          # cooling coil
          cooling_coil = OpenStudio::Model::CoilCoolingDXTwoSpeed.new(model,
                                                                      model.alwaysOnDiscreteSchedule(),
                                                                      clgCapFuncTempCurve,
                                                                      clgCapFuncFlowFracCurve,
                                                                      clgEirFuncTempCurve,
                                                                      clgEirFuncFlowFracCurve,
                                                                      clgPlrCurve,
                                                                      clgCapFuncTempCurve,
                                                                      clgEirFuncTempCurve)
          cooling_coil.setRatedHighSpeedCOP(4)
          cooling_coil.setRatedLowSpeedCOP(4)
          air_loop_comps << cooling_coil
        end
        unless options["zoneHVAC"] == "DualDuct"
          # create controller outdoor air
          controller_OA = OpenStudio::Model::ControllerOutdoorAir.new(model)
          controller_OA.autosizeMinimumOutdoorAirFlowRate()
          controller_OA.autosizeMaximumOutdoorAirFlowRate()
          # create ventilation schedules and assign to OA controller
          if options["primaryHVAC"]["doas"]
            controller_OA.setMinimumFractionofOutdoorAirSchedule(model.alwaysOnDiscreteSchedule())
            controller_OA.setMaximumFractionofOutdoorAirSchedule(model.alwaysOnDiscreteSchedule())
          else
            # multizone VAV that ventilates
            controller_OA.setMaximumFractionofOutdoorAirSchedule(options["ventilation_schedule"])
            controller_OA.setEconomizerControlType("DifferentialEnthalpy")
            # add night cycling (ML would people actually do this for a VAV system?))
            airloop_primary.setNightCycleControlType("CycleOnAny") #ML Does this work with variable speed fans?
          end  
          controller_OA.setHeatRecoveryBypassControlType("BypassWhenOAFlowGreaterThanMinimum")
          # create outdoor air system
          system_OA = OpenStudio::Model::AirLoopHVACOutdoorAirSystem.new(model, controller_OA)
          air_loop_comps << system_OA
          # create ERV
          heat_exchanger = OpenStudio::Model::HeatExchangerAirToAirSensibleAndLatent.new(model)
          heat_exchanger.setAvailabilitySchedule(model.alwaysOnDiscreteSchedule())
          sensible_eff = 0.75
          latent_eff = 0.69
          heat_exchanger.setSensibleEffectivenessat100CoolingAirFlow(sensible_eff)
          heat_exchanger.setSensibleEffectivenessat100HeatingAirFlow(sensible_eff)
          heat_exchanger.setSensibleEffectivenessat75CoolingAirFlow(sensible_eff)
          heat_exchanger.setSensibleEffectivenessat75HeatingAirFlow(sensible_eff)
          heat_exchanger.setLatentEffectivenessat100CoolingAirFlow(latent_eff)
          heat_exchanger.setLatentEffectivenessat100HeatingAirFlow(latent_eff)
          heat_exchanger.setLatentEffectivenessat75CoolingAirFlow(latent_eff)
          heat_exchanger.setLatentEffectivenessat75HeatingAirFlow(latent_eff)
          heat_exchanger.setFrostControlType("ExhaustOnly")
          heat_exchanger.setThresholdTemperature(-12.2)
          heat_exchanger.setInitialDefrostTimeFraction(0.1670)
          heat_exchanger.setRateofDefrostTimeFractionIncrease(0.0240)
          heat_exchanger.setEconomizerLockout(false)
        end  
        # create scheduled setpoint manager for airloop
        unless (options["primaryHVAC"]["doas"] or options["zoneHVAC"] == "DualDuct")
          # VAV for cooling and ventilation
          setpoint_manager = OpenStudio::Model::SetpointManagerOutdoorAirReset.new(model)
          setpoint_manager.setSetpointatOutdoorLowTemperature(15.6)
          setpoint_manager.setOutdoorLowTemperature(14.4)
          setpoint_manager.setSetpointatOutdoorHighTemperature(12.8)
          setpoint_manager.setOutdoorHighTemperature(21.1)
        else
          # DOAS or VAV for cooling and not ventilation
          setpoint_manager = OpenStudio::Model::SetpointManagerScheduled.new(model,options["primary_sat_schedule"])
        end
        # connect components to airloop
        # find the supply inlet node of the airloop
        airloop_supply_inlet = airloop_primary.supplyInletNode
        # add the components to the airloop
        air_loop_comps.each do |comp|
          comp.addToNode(airloop_supply_inlet)
          if comp.to_CoilHeatingWater.is_initialized
            options["hot_water_plant"].addDemandBranchForComponent(comp)
            comp.controllerWaterCoil.get.setMinimumActuatedFlow(0)
          elsif comp.to_CoilCoolingWater.is_initialized
            options["chilled_water_plant"].addDemandBranchForComponent(comp)
            comp.controllerWaterCoil.get.setMinimumActuatedFlow(0)
          end
        end
        # add erv to outdoor air system
        unless options["zoneHVAC"] == "DualDuct"
          heat_exchanger.addToNode(system_OA.outboardOANode.get)
        end  
        # add setpoint manager to supply equipment outlet node
        setpoint_manager.addToNode(airloop_primary.supplyOutletNode)
        # add thermal zones to airloop
        thermalZonesToAdd.each do |zone|
          # make an air terminal for the zone
          if options["primaryHVAC"]["fan"] == "Variable"
            air_terminal = OpenStudio::Model::AirTerminalSingleDuctVAVNoReheat.new(model, model.alwaysOnDiscreteSchedule())
          else
            air_terminal = OpenStudio::Model::AirTerminalSingleDuctUncontrolled.new(model, model.alwaysOnDiscreteSchedule())
          end
          # attach new terminal to the zone and to the airloop
          airloop_primary.addBranchForZone(zone, air_terminal.to_StraightComponent)
        end 
        primary_airloops << airloop_primary       
      end
    end

    # pass back primary airloops
    result = primary_airloops
    return result

  end # end of def

  def OsLib_HVAC.createSecondaryAirLoops(model, runner, options)

    secondary_airloops = []
    # create secondary airloop for each secondary zone
    model.getThermalZones.each do |zone|
      if options["zonesSecondary"].include? zone
        # create secondary airloop
        airloop_secondary = OpenStudio::Model::AirLoopHVAC.new(model)
        airloop_secondary.setName("AEDG Air Loop HVAC #{zone.name}")
        # modify system sizing properties
        sizing_system = airloop_secondary.sizingSystem
        # set central heating and cooling temperatures for sizing
        sizing_system.setCentralCoolingDesignSupplyAirTemperature(12.8)
        sizing_system.setCentralHeatingDesignSupplyAirTemperature(40) #ML OS default is 16.7
        # load specification
        sizing_system.setSystemOutdoorAirMethod("VentilationRateProcedure") #ML OS default is ZoneSum
        sizing_system.setTypeofLoadtoSizeOn("Sensible") #PSZ
        sizing_system.setAllOutdoorAirinCooling(false) #PSZ
        sizing_system.setAllOutdoorAirinHeating(false) #PSZ
        sizing_system.setCentralHeatingMaximumSystemAirFlowRatio(1.0) #Constant volume fan
        air_loop_comps = []
        # set availability schedule (HVAC operation schedule)
        airloop_secondary.setAvailabilitySchedule(options["hvac_schedule"])
        if options["secondaryHVAC"]["fan"] == "Variable"
          # create variable speed fan and set system sizing accordingly
          sizing_system.setCentralHeatingMaximumSystemAirFlowRatio(0.3) #DCV
          # variable speed fan
          fan = OpenStudio::Model::FanVariableVolume.new(model, model.alwaysOnDiscreteSchedule())
          fan.setFanEfficiency(0.69)
          fan.setPressureRise(1125) #Pa
          fan.autosizeMaximumFlowRate()
          fan.setFanPowerMinimumFlowFraction(0.6)
          fan.setMotorEfficiency(0.9)
          fan.setMotorInAirstreamFraction(1.0)
          air_loop_comps << fan
        else
          sizing_system.setCentralHeatingMaximumSystemAirFlowRatio(1.0) # No DCV
          # constant speed fan
          fan = OpenStudio::Model::FanConstantVolume.new(model, model.alwaysOnDiscreteSchedule())
          fan.setFanEfficiency(0.6)
          fan.setPressureRise(500) #Pa
          fan.autosizeMaximumFlowRate()
          fan.setMotorEfficiency(0.9)
          fan.setMotorInAirstreamFraction(1.0)
          air_loop_comps << fan
        end  
        # create cooling coil
        if options["secondaryHVAC"]["cool"] == "Water"
          # water coil
          cooling_coil = OpenStudio::Model::CoilCoolingWater.new(model, model.alwaysOnDiscreteSchedule())
          air_loop_comps << cooling_coil
        elsif options["secondaryHVAC"]["cool"] == "SingleDX"
          # single speed DX coil
          # create cooling coil
          # create clgCapFuncTempCurve
          clgCapFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
          clgCapFuncTempCurve.setCoefficient1Constant(0.42415)
          clgCapFuncTempCurve.setCoefficient2x(0.04426)
          clgCapFuncTempCurve.setCoefficient3xPOW2(-0.00042)
          clgCapFuncTempCurve.setCoefficient4y(0.00333)
          clgCapFuncTempCurve.setCoefficient5yPOW2(-0.00008)
          clgCapFuncTempCurve.setCoefficient6xTIMESY(-0.00021)
          clgCapFuncTempCurve.setMinimumValueofx(17)
          clgCapFuncTempCurve.setMaximumValueofx(22)
          clgCapFuncTempCurve.setMinimumValueofy(13)
          clgCapFuncTempCurve.setMaximumValueofy(46)
          # create clgCapFuncFlowFracCurve
          clgCapFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgCapFuncFlowFracCurve.setCoefficient1Constant(0.77136)
          clgCapFuncFlowFracCurve.setCoefficient2x(0.34053)
          clgCapFuncFlowFracCurve.setCoefficient3xPOW2(-0.11088)
          clgCapFuncFlowFracCurve.setMinimumValueofx(0.75918)
          clgCapFuncFlowFracCurve.setMaximumValueofx(1.13877)
          # create clgEirFuncTempCurve
          clgEirFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
          clgEirFuncTempCurve.setCoefficient1Constant(1.23649)
          clgEirFuncTempCurve.setCoefficient2x(-0.02431)
          clgEirFuncTempCurve.setCoefficient3xPOW2(0.00057)
          clgEirFuncTempCurve.setCoefficient4y(-0.01434)
          clgEirFuncTempCurve.setCoefficient5yPOW2(0.00063)
          clgEirFuncTempCurve.setCoefficient6xTIMESY(-0.00038)
          clgEirFuncTempCurve.setMinimumValueofx(17)
          clgEirFuncTempCurve.setMaximumValueofx(22)
          clgEirFuncTempCurve.setMinimumValueofy(13)
          clgEirFuncTempCurve.setMaximumValueofy(46)
          # create clgEirFuncFlowFracCurve
          clgEirFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgEirFuncFlowFracCurve.setCoefficient1Constant(1.20550)
          clgEirFuncFlowFracCurve.setCoefficient2x(-0.32953)
          clgEirFuncFlowFracCurve.setCoefficient3xPOW2(0.12308)
          clgEirFuncFlowFracCurve.setMinimumValueofx(0.75918)
          clgEirFuncFlowFracCurve.setMaximumValueofx(1.13877)
          # create clgPlrCurve
          clgPlrCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgPlrCurve.setCoefficient1Constant(0.77100)
          clgPlrCurve.setCoefficient2x(0.22900)
          clgPlrCurve.setCoefficient3xPOW2(0.0)
          clgPlrCurve.setMinimumValueofx(0.0)
          clgPlrCurve.setMaximumValueofx(1.0)
          # cooling coil
          cooling_coil = OpenStudio::Model::CoilCoolingDXSingleSpeed.new(model,
                                                                           model.alwaysOnDiscreteSchedule(),
                                                                           clgCapFuncTempCurve,
                                                                           clgCapFuncFlowFracCurve,
                                                                           clgEirFuncTempCurve,
                                                                           clgEirFuncFlowFracCurve,
                                                                           clgPlrCurve)
          cooling_coil.setRatedCOP(OpenStudio::OptionalDouble.new(4))
          air_loop_comps << cooling_coil
        else
          # two speed DX coil (PNNL curves)
          # create cooling coil
          # create clgCapFuncTempCurve
          clgCapFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
          clgCapFuncTempCurve.setCoefficient1Constant(1.39072)
          clgCapFuncTempCurve.setCoefficient2x(-0.0529058)
          clgCapFuncTempCurve.setCoefficient3xPOW2(0.0018423)
          clgCapFuncTempCurve.setCoefficient4y(0.00058267)
          clgCapFuncTempCurve.setCoefficient5yPOW2(-0.000186814)
          clgCapFuncTempCurve.setCoefficient6xTIMESY(0.000265159)
          clgCapFuncTempCurve.setMinimumValueofx(16.5556)
          clgCapFuncTempCurve.setMaximumValueofx(22.1111)
          clgCapFuncTempCurve.setMinimumValueofy(23.7778)
          clgCapFuncTempCurve.setMaximumValueofy(47.66)
          # create clgCapFuncFlowFracCurve
          clgCapFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgCapFuncFlowFracCurve.setCoefficient1Constant(0.718954)
          clgCapFuncFlowFracCurve.setCoefficient2x(0.435436)
          clgCapFuncFlowFracCurve.setCoefficient3xPOW2(-0.154193)
          clgCapFuncFlowFracCurve.setMinimumValueofx(0.75)
          clgCapFuncFlowFracCurve.setMaximumValueofx(1.25)
          # create clgEirFuncTempCurve
          clgEirFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
          clgEirFuncTempCurve.setCoefficient1Constant(-0.536161)
          clgEirFuncTempCurve.setCoefficient2x(0.105138)
          clgEirFuncTempCurve.setCoefficient3xPOW2(-0.00172659)
          clgEirFuncTempCurve.setCoefficient4y(0.0149848)
          clgEirFuncTempCurve.setCoefficient5yPOW2(0.000659948)
          clgEirFuncTempCurve.setCoefficient6xTIMESY(-0.0017385)
          clgEirFuncTempCurve.setMinimumValueofx(16.5556)
          clgEirFuncTempCurve.setMaximumValueofx(22.1111)
          clgEirFuncTempCurve.setMinimumValueofy(23.7778)
          clgEirFuncTempCurve.setMaximumValueofy(47.66)
          # create clgEirFuncFlowFracCurve
          clgEirFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgEirFuncFlowFracCurve.setCoefficient1Constant(1.19525)
          clgEirFuncFlowFracCurve.setCoefficient2x(-0.306138)
          clgEirFuncFlowFracCurve.setCoefficient3xPOW2(0.110973)
          clgEirFuncFlowFracCurve.setMinimumValueofx(0.75)
          clgEirFuncFlowFracCurve.setMaximumValueofx(1.25)
          # create clgPlrCurve
          clgPlrCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgPlrCurve.setCoefficient1Constant(0.77100)
          clgPlrCurve.setCoefficient2x(0.22900)
          clgPlrCurve.setCoefficient3xPOW2(0.0)
          clgPlrCurve.setMinimumValueofx(0.0)
          clgPlrCurve.setMaximumValueofx(1.0)
          # cooling coil
          cooling_coil = OpenStudio::Model::CoilCoolingDXTwoSpeed.new(model,
                                                                      model.alwaysOnDiscreteSchedule(),
                                                                      clgCapFuncTempCurve,
                                                                      clgCapFuncFlowFracCurve,
                                                                      clgEirFuncTempCurve,
                                                                      clgEirFuncFlowFracCurve,
                                                                      clgPlrCurve,
                                                                      clgCapFuncTempCurve,
                                                                      clgEirFuncTempCurve)
          cooling_coil.setRatedHighSpeedCOP(4)
          cooling_coil.setRatedLowSpeedCOP(4)
          air_loop_comps << cooling_coil
        end  
        if options["secondaryHVAC"]["heat"] == "Water"
          # water coil
          heating_coil = OpenStudio::Model::CoilHeatingWater.new(model, model.alwaysOnDiscreteSchedule())
          air_loop_comps << heating_coil
        else  
          # gas coil
          heating_coil = OpenStudio::Model::CoilHeatingGas.new(model, model.alwaysOnDiscreteSchedule())
          air_loop_comps << heating_coil
        end  
        # create controller outdoor air
        controller_OA = OpenStudio::Model::ControllerOutdoorAir.new(model)
        controller_OA.autosizeMinimumOutdoorAirFlowRate()
        controller_OA.autosizeMaximumOutdoorAirFlowRate()
        controller_OA.setEconomizerControlType("DifferentialEnthalpy")
        controller_OA.setMaximumFractionofOutdoorAirSchedule(options["ventilation_schedule"])
        controller_OA.setHeatRecoveryBypassControlType("BypassWhenOAFlowGreaterThanMinimum")
        # create outdoor air system
        system_OA = OpenStudio::Model::AirLoopHVACOutdoorAirSystem.new(model, controller_OA)
        air_loop_comps << system_OA
        # create ERV
        heat_exchanger = OpenStudio::Model::HeatExchangerAirToAirSensibleAndLatent.new(model)
        heat_exchanger.setAvailabilitySchedule(model.alwaysOnDiscreteSchedule())
        sensible_eff = 0.75
        latent_eff = 0.69
        heat_exchanger.setSensibleEffectivenessat100CoolingAirFlow(sensible_eff)
        heat_exchanger.setSensibleEffectivenessat100HeatingAirFlow(sensible_eff)
        heat_exchanger.setSensibleEffectivenessat75CoolingAirFlow(sensible_eff)
        heat_exchanger.setSensibleEffectivenessat75HeatingAirFlow(sensible_eff)
        heat_exchanger.setLatentEffectivenessat100CoolingAirFlow(latent_eff)
        heat_exchanger.setLatentEffectivenessat100HeatingAirFlow(latent_eff)
        heat_exchanger.setLatentEffectivenessat75CoolingAirFlow(latent_eff)
        heat_exchanger.setLatentEffectivenessat75HeatingAirFlow(latent_eff)
        heat_exchanger.setFrostControlType("ExhaustOnly")
        heat_exchanger.setThresholdTemperature(-12.2)
        heat_exchanger.setInitialDefrostTimeFraction(0.1670)
        heat_exchanger.setRateofDefrostTimeFractionIncrease(0.0240)
        heat_exchanger.setEconomizerLockout(false)
        # create setpoint manager for airloop
        setpoint_manager = OpenStudio::Model::SetpointManagerSingleZoneReheat.new(model)
        setpoint_manager.setMinimumSupplyAirTemperature(10)
        setpoint_manager.setMaximumSupplyAirTemperature(50)
        setpoint_manager.setControlZone(zone)
        # connect components to airloop
        # find the supply inlet node of the airloop
        airloop_supply_inlet = airloop_secondary.supplyInletNode
        # add the components to the airloop
        air_loop_comps.each do |comp|
          comp.addToNode(airloop_supply_inlet)
          if comp.to_CoilHeatingWater.is_initialized
            options["hot_water_plant"].addDemandBranchForComponent(comp)
            comp.controllerWaterCoil.get.setMinimumActuatedFlow(0)
          elsif comp.to_CoilCoolingWater.is_initialized
            options["chilled_water_plant"].addDemandBranchForComponent(comp)
            comp.controllerWaterCoil.get.setMinimumActuatedFlow(0)
          end
        end
        # add erv to outdoor air system
        heat_exchanger.addToNode(system_OA.outboardOANode.get)
        # add setpoint manager to supply equipment outlet node
        setpoint_manager.addToNode(airloop_secondary.supplyOutletNode)
        # add thermal zone to airloop
        if options["secondaryHVAC"]["fan"] == "Variable"
          air_terminal = OpenStudio::Model::AirTerminalSingleDuctVAVNoReheat.new(model, model.alwaysOnDiscreteSchedule())
        else
          air_terminal = OpenStudio::Model::AirTerminalSingleDuctUncontrolled.new(model, model.alwaysOnDiscreteSchedule())
        end
        # attach new terminal to the zone and to the airloop
        airloop_secondary.addBranchForZone(zone, air_terminal.to_StraightComponent)
        # add night cycling
        airloop_secondary.setNightCycleControlType("CycleOnAny") #ML Does this work with variable speed fans?
        secondary_airloops << airloop_secondary
      end
    end

    # pass back secondary airloops
    result = secondary_airloops
    return result
    
  end # end of def

  def OsLib_HVAC.createPrimaryZoneEquipment(model, runner, options)

    model.getThermalZones.each do |zone|
      if options["zonesPrimary"].include? zone
        if options["zoneHVAC"] == "FanCoil"
          # create fan coil
          # create fan
          fan = OpenStudio::Model::FanOnOff.new(model, model.alwaysOnDiscreteSchedule())
          fan.setFanEfficiency(0.5)
          fan.setPressureRise(75) #Pa
          fan.autosizeMaximumFlowRate()
          fan.setMotorEfficiency(0.9)
          fan.setMotorInAirstreamFraction(1.0)
          # create cooling coil and connect to chilled water plant
          cooling_coil = OpenStudio::Model::CoilCoolingWater.new(model, model.alwaysOnDiscreteSchedule())
          options["chilled_water_plant"].addDemandBranchForComponent(cooling_coil)
          cooling_coil.controllerWaterCoil.get.setMinimumActuatedFlow(0)
          # create heating coil and connect to hot water plant
          heating_coil = OpenStudio::Model::CoilHeatingWater.new(model, model.alwaysOnDiscreteSchedule())
          options["hot_water_plant"].addDemandBranchForComponent(heating_coil)
          heating_coil.controllerWaterCoil.get.setMinimumActuatedFlow(0)
          # construct fan coil
          fan_coil = OpenStudio::Model::ZoneHVACFourPipeFanCoil.new(model,
                                                                    model.alwaysOnDiscreteSchedule(),
                                                                    fan,
                                                                    cooling_coil,
                                                                    heating_coil)
          fan_coil.setMaximumOutdoorAirFlowRate(0)                                                          
          # add fan coil to thermal zone
          fan_coil.addToThermalZone(zone)
        elsif options["zoneHVAC"] == "WSHP" or options["zoneHVAC"] == "GSHP"
          # create water source heat pump and attach to heat pump loop
          # create fan
          fan = OpenStudio::Model::FanOnOff.new(model, model.alwaysOnDiscreteSchedule())
          fan.setFanEfficiency(0.5)
          fan.setPressureRise(75) #Pa
          fan.autosizeMaximumFlowRate()
          fan.setMotorEfficiency(0.9)
          fan.setMotorInAirstreamFraction(1.0)
          # create cooling coil and connect to heat pump loop
          cooling_coil = OpenStudio::Model::CoilCoolingWaterToAirHeatPumpEquationFit.new(model)
          cooling_coil.setRatedCoolingCoefficientofPerformance(6.45)
          cooling_coil.setTotalCoolingCapacityCoefficient1(-9.149069561)
          cooling_coil.setTotalCoolingCapacityCoefficient2(10.87814026)
          cooling_coil.setTotalCoolingCapacityCoefficient3(-1.718780157)
          cooling_coil.setTotalCoolingCapacityCoefficient4(0.746414818)
          cooling_coil.setTotalCoolingCapacityCoefficient5(0.0)
          cooling_coil.setSensibleCoolingCapacityCoefficient1(-5.462690012)
          cooling_coil.setSensibleCoolingCapacityCoefficient2(17.95968138)
          cooling_coil.setSensibleCoolingCapacityCoefficient3(-11.87818402)
          cooling_coil.setSensibleCoolingCapacityCoefficient4(-0.980163419)
          cooling_coil.setSensibleCoolingCapacityCoefficient5(0.767285761)
          cooling_coil.setSensibleCoolingCapacityCoefficient6(0.0)
          cooling_coil.setCoolingPowerConsumptionCoefficient1(-3.205409884)
          cooling_coil.setCoolingPowerConsumptionCoefficient2(-0.976409399)
          cooling_coil.setCoolingPowerConsumptionCoefficient3(3.97892546)
          cooling_coil.setCoolingPowerConsumptionCoefficient4(0.938181818)
          cooling_coil.setCoolingPowerConsumptionCoefficient5(0.0)
          options["heat_pump_loop"].addDemandBranchForComponent(cooling_coil)
          # create heating coil and connect to heat pump loop
          heating_coil = OpenStudio::Model::CoilHeatingWaterToAirHeatPumpEquationFit.new(model)
          heating_coil.setRatedHeatingCoefficientofPerformance(4.0)
          heating_coil.setHeatingCapacityCoefficient1(-1.361311959)
          heating_coil.setHeatingCapacityCoefficient2(-2.471798046)
          heating_coil.setHeatingCapacityCoefficient3(4.173164514)
          heating_coil.setHeatingCapacityCoefficient4(0.640757401)
          heating_coil.setHeatingCapacityCoefficient5(0.0)
          heating_coil.setHeatingPowerConsumptionCoefficient1(-2.176941116)
          heating_coil.setHeatingPowerConsumptionCoefficient2(0.832114286)
          heating_coil.setHeatingPowerConsumptionCoefficient3(1.570743399)
          heating_coil.setHeatingPowerConsumptionCoefficient4(0.690793651)
          heating_coil.setHeatingPowerConsumptionCoefficient5(0.0)
          options["heat_pump_loop"].addDemandBranchForComponent(heating_coil)
          # create supplemental heating coil
          supplemental_heating_coil = OpenStudio::Model::CoilHeatingElectric.new(model, model.alwaysOnDiscreteSchedule())
          # construct heat pump
          heat_pump = OpenStudio::Model::ZoneHVACWaterToAirHeatPump.new(model,
                                                                        model.alwaysOnDiscreteSchedule(),
                                                                        fan,
                                                                        heating_coil,
                                                                        cooling_coil,
                                                                        supplemental_heating_coil)
          heat_pump.setSupplyAirFlowRateWhenNoCoolingorHeatingisNeeded(OpenStudio::OptionalDouble.new(0))
          heat_pump.setOutdoorAirFlowRateDuringCoolingOperation(OpenStudio::OptionalDouble.new(0))
          heat_pump.setOutdoorAirFlowRateDuringHeatingOperation(OpenStudio::OptionalDouble.new(0))
          heat_pump.setOutdoorAirFlowRateWhenNoCoolingorHeatingisNeeded(OpenStudio::OptionalDouble.new(0))
          # add heat pump to thermal zone
          heat_pump.addToThermalZone(zone)
        elsif options["zoneHVAC"] == "ASHP"
          # create air source heat pump
          # create fan
          fan = OpenStudio::Model::FanOnOff.new(model, model.alwaysOnDiscreteSchedule())
          fan.setFanEfficiency(0.5)
          fan.setPressureRise(75) #Pa
          fan.autosizeMaximumFlowRate()
          fan.setMotorEfficiency(0.9)
          fan.setMotorInAirstreamFraction(1.0)
          # create heating coil
          # create htgCapFuncTempCurve
          htgCapFuncTempCurve = OpenStudio::Model::CurveCubic.new(model)
          htgCapFuncTempCurve.setCoefficient1Constant(0.758746)
          htgCapFuncTempCurve.setCoefficient2x(0.027626)
          htgCapFuncTempCurve.setCoefficient3xPOW2(0.000148716)
          htgCapFuncTempCurve.setCoefficient4xPOW3(0.0000034992)
          htgCapFuncTempCurve.setMinimumValueofx(-20)
          htgCapFuncTempCurve.setMaximumValueofx(20)
          # create htgCapFuncFlowFracCurve
          htgCapFuncFlowFracCurve = OpenStudio::Model::CurveCubic.new(model)
          htgCapFuncFlowFracCurve.setCoefficient1Constant(0.84)
          htgCapFuncFlowFracCurve.setCoefficient2x(0.16)
          htgCapFuncFlowFracCurve.setCoefficient3xPOW2(0)
          htgCapFuncFlowFracCurve.setCoefficient4xPOW3(0)
          htgCapFuncFlowFracCurve.setMinimumValueofx(0.5)
          htgCapFuncFlowFracCurve.setMaximumValueofx(1.5)
          # create htgEirFuncTempCurve
          htgEirFuncTempCurve = OpenStudio::Model::CurveCubic.new(model)
          htgEirFuncTempCurve.setCoefficient1Constant(1.19248)
          htgEirFuncTempCurve.setCoefficient2x(-0.0300438)
          htgEirFuncTempCurve.setCoefficient3xPOW2(0.00103745)
          htgEirFuncTempCurve.setCoefficient4xPOW3(-0.000023328)
          htgEirFuncTempCurve.setMinimumValueofx(-20)
          htgEirFuncTempCurve.setMaximumValueofx(20)
          # create htgEirFuncFlowFracCurve
          htgEirFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          htgEirFuncFlowFracCurve.setCoefficient1Constant(1.3824)
          htgEirFuncFlowFracCurve.setCoefficient2x(-0.4336)
          htgEirFuncFlowFracCurve.setCoefficient3xPOW2(0.0512)
          htgEirFuncFlowFracCurve.setMinimumValueofx(0)
          htgEirFuncFlowFracCurve.setMaximumValueofx(1)
          # create htgPlrCurve
          htgPlrCurve = OpenStudio::Model::CurveQuadratic.new(model)
          htgPlrCurve.setCoefficient1Constant(0.75)
          htgPlrCurve.setCoefficient2x(0.25)
          htgPlrCurve.setCoefficient3xPOW2(0.0)
          htgPlrCurve.setMinimumValueofx(0.0)
          htgPlrCurve.setMaximumValueofx(1.0)
          # heating coil
          heating_coil = OpenStudio::Model::CoilHeatingDXSingleSpeed.new(model,
                                                                           model.alwaysOnDiscreteSchedule(),
                                                                           htgCapFuncTempCurve,
                                                                           htgCapFuncFlowFracCurve,
                                                                           htgEirFuncTempCurve,
                                                                           htgEirFuncFlowFracCurve,
                                                                           htgPlrCurve)
          heating_coil.setRatedCOP(3.4)
          heating_coil.setCrankcaseHeaterCapacity(200)
          heating_coil.setMaximumOutdoorDryBulbTemperatureforCrankcaseHeaterOperation(8)
          heating_coil.autosizeResistiveDefrostHeaterCapacity
          # create cooling coil
          # create clgCapFuncTempCurve
          clgCapFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
          clgCapFuncTempCurve.setCoefficient1Constant(0.942587793)
          clgCapFuncTempCurve.setCoefficient2x(0.009543347)
          clgCapFuncTempCurve.setCoefficient3xPOW2(0.0018423)
          clgCapFuncTempCurve.setCoefficient4y(-0.011042676)
          clgCapFuncTempCurve.setCoefficient5yPOW2(0.000005249)
          clgCapFuncTempCurve.setCoefficient6xTIMESY(-0.000009720)
          clgCapFuncTempCurve.setMinimumValueofx(17)
          clgCapFuncTempCurve.setMaximumValueofx(22)
          clgCapFuncTempCurve.setMinimumValueofy(13)
          clgCapFuncTempCurve.setMaximumValueofy(46)
          # create clgCapFuncFlowFracCurve
          clgCapFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgCapFuncFlowFracCurve.setCoefficient1Constant(0.718954)
          clgCapFuncFlowFracCurve.setCoefficient2x(0.435436)
          clgCapFuncFlowFracCurve.setCoefficient3xPOW2(-0.154193)
          clgCapFuncFlowFracCurve.setMinimumValueofx(0.75)
          clgCapFuncFlowFracCurve.setMaximumValueofx(1.25)
          # create clgEirFuncTempCurve
          clgEirFuncTempCurve = OpenStudio::Model::CurveBiquadratic.new(model)
          clgEirFuncTempCurve.setCoefficient1Constant(0.342414409)
          clgEirFuncTempCurve.setCoefficient2x(0.034885008)
          clgEirFuncTempCurve.setCoefficient3xPOW2(-0.000623700)
          clgEirFuncTempCurve.setCoefficient4y(0.004977216)
          clgEirFuncTempCurve.setCoefficient5yPOW2(0.000437951)
          clgEirFuncTempCurve.setCoefficient6xTIMESY(-0.000728028)
          clgEirFuncTempCurve.setMinimumValueofx(17)
          clgEirFuncTempCurve.setMaximumValueofx(22)
          clgEirFuncTempCurve.setMinimumValueofy(13)
          clgEirFuncTempCurve.setMaximumValueofy(46)
          # create clgEirFuncFlowFracCurve
          clgEirFuncFlowFracCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgEirFuncFlowFracCurve.setCoefficient1Constant(1.1552)
          clgEirFuncFlowFracCurve.setCoefficient2x(-0.1808)
          clgEirFuncFlowFracCurve.setCoefficient3xPOW2(0.0256)
          clgEirFuncFlowFracCurve.setMinimumValueofx(0.5)
          clgEirFuncFlowFracCurve.setMaximumValueofx(1.5)
          # create clgPlrCurve
          clgPlrCurve = OpenStudio::Model::CurveQuadratic.new(model)
          clgPlrCurve.setCoefficient1Constant(0.75)
          clgPlrCurve.setCoefficient2x(0.25)
          clgPlrCurve.setCoefficient3xPOW2(0.0)
          clgPlrCurve.setMinimumValueofx(0.0)
          clgPlrCurve.setMaximumValueofx(1.0)
          # cooling coil
          cooling_coil = OpenStudio::Model::CoilCoolingDXSingleSpeed.new(model,
                                                                           model.alwaysOnDiscreteSchedule(),
                                                                           clgCapFuncTempCurve,
                                                                           clgCapFuncFlowFracCurve,
                                                                           clgEirFuncTempCurve,
                                                                           clgEirFuncFlowFracCurve,
                                                                           clgPlrCurve)
          cooling_coil.setRatedCOP(OpenStudio::OptionalDouble.new(4))
          # create supplemental heating coil
          supplemental_heating_coil = OpenStudio::Model::CoilHeatingElectric.new(model, model.alwaysOnDiscreteSchedule())
          # construct heat pump
          heat_pump = OpenStudio::Model::ZoneHVACPackagedTerminalHeatPump.new(model,
                                                                              model.alwaysOnDiscreteSchedule(),
                                                                              fan,
                                                                              heating_coil,
                                                                              cooling_coil,
                                                                              supplemental_heating_coil)
          heat_pump.setSupplyAirFlowRateWhenNoCoolingorHeatingisNeeded(0)
          heat_pump.setOutdoorAirFlowRateDuringCoolingOperation(0)
          heat_pump.setOutdoorAirFlowRateDuringHeatingOperation(0)
          heat_pump.setOutdoorAirFlowRateWhenNoCoolingorHeatingisNeeded(0)
          # add heat pump to thermal zone
          heat_pump.addToThermalZone(zone)
        elsif options["zoneHVAC"] == "Baseboard"
          # create baseboard heater add add to thermal zone and hot water loop
          baseboard_coil = OpenStudio::Model::CoilHeatingWaterBaseboard.new(model)
          baseboard_heater = OpenStudio::Model::ZoneHVACBaseboardConvectiveWater.new(model, model.alwaysOnDiscreteSchedule(), baseboard_coil)
          baseboard_heater.addToThermalZone(zone)          
          options["hot_water_plant"].addDemandBranchForComponent(baseboard_coil)
        elsif options["zoneHVAC"] == "Radiant"
          # create low temperature radiant object and add to thermal zone and radiant plant loops
          # create hot water coil and attach to radiant hot water loop
          heating_coil = OpenStudio::Model::CoilHeatingLowTempRadiantVarFlow.new(model, options["mean_radiant_heating_setpoint_schedule"])
          options["radiant_hot_water_plant"].addDemandBranchForComponent(heating_coil)
          # create chilled water coil and attach to radiant chilled water loop
          cooling_coil = OpenStudio::Model::CoilCoolingLowTempRadiantVarFlow.new(model, options["mean_radiant_cooling_setpoint_schedule"])
          options["radiant_chilled_water_plant"].addDemandBranchForComponent(cooling_coil)
          low_temp_radiant = OpenStudio::Model::ZoneHVACLowTempRadiantVarFlow.new(model, 
                                                                                  model.alwaysOnDiscreteSchedule(),
                                                                                  heating_coil,
                                                                                  cooling_coil)
          low_temp_radiant.setRadiantSurfaceType("Floors")
          low_temp_radiant.setHydronicTubingInsideDiameter(0.012)
          low_temp_radiant.setTemperatureControlType("MeanRadiantTemperature")
          low_temp_radiant.addToThermalZone(zone)
          # create radiant floor construction and substitute for existing floor (interior or exterior) constructions
          # create materials for radiant floor construction
          layers = []
          # ignore layer below insulation, which will depend on boundary condition
          layers << rigid_insulation_1in = OpenStudio::Model::StandardOpaqueMaterial.new(model,"Rough",0.0254,0.02,56.06,1210)
          layers << concrete_2in = OpenStudio::Model::StandardOpaqueMaterial.new(model,"MediumRough",0.0508,2.31,2322,832)
          layers << concrete_2in
          # create radiant floor construction from materials
          radiant_floor = OpenStudio::Model::ConstructionWithInternalSource.new(layers)
          radiant_floor.setSourcePresentAfterLayerNumber(2)
          radiant_floor.setSourcePresentAfterLayerNumber(2)
          # assign radiant construction to zone floor
          zone.spaces.each do |space|
            space.surfaces.each do |surface|
              if surface.surfaceType == "Floor"
                surface.setConstruction(radiant_floor)
              end
            end
          end
        elsif options["zoneHVAC"] == "DualDuct"
          # create baseboard heater add add to thermal zone and hot water loop
          baseboard_coil = OpenStudio::Model::CoilHeatingWaterBaseboard.new(model)
          baseboard_heater = OpenStudio::Model::ZoneHVACBaseboardConvectiveWater.new(model, model.alwaysOnDiscreteSchedule(), baseboard_coil)
          baseboard_heater.addToThermalZone(zone)          
          options["hot_water_plant"].addDemandBranchForComponent(baseboard_coil)
          # create fan coil (to mimic functionality of DOAS)
          # variable speed fan
          fan = OpenStudio::Model::FanVariableVolume.new(model, model.alwaysOnDiscreteSchedule())
          fan.setFanEfficiency(0.69)
          fan.setPressureRise(75) #Pa #ML This number is a guess; zone equipment pretending to be a DOAS
          fan.autosizeMaximumFlowRate()
          fan.setFanPowerMinimumFlowFraction(0.6)
          fan.setMotorEfficiency(0.9)
          fan.setMotorInAirstreamFraction(1.0)
          # create chilled water coil and attach to chilled water loop
          cooling_coil = OpenStudio::Model::CoilCoolingWater.new(model, model.alwaysOnDiscreteSchedule())
          options["chilled_water_plant"].addDemandBranchForComponent(cooling_coil)
          cooling_coil.controllerWaterCoil.get.setMinimumActuatedFlow(0)
          # create hot water coil and attach to hot water loop
          heating_coil = OpenStudio::Model::CoilHeatingWater.new(model, model.alwaysOnDiscreteSchedule())
          options["hot_water_plant"].addDemandBranchForComponent(heating_coil)
          heating_coil.controllerWaterCoil.get.setMinimumActuatedFlow(0)
          # construct fan coil (DOAS) and attach to thermal zone
          fan_coil_doas = OpenStudio::Model::ZoneHVACFourPipeFanCoil.new(model,
                                                                         options["ventilation_schedule"],
                                                                         fan,
                                                                         cooling_coil,
                                                                         heating_coil)
          fan_coil_doas.setCapacityControlMethod("VariableFanVariableFlow")
          fan_coil_doas.addToThermalZone(zone)
        end
      end
    end

  end # end of def
  
  def OsLib_HVAC.addDCV(model, runner, options)

    unless options["primary_airloops"].nil?
      options["primary_airloops"].each do |airloop|
        if options["allHVAC"]["primary"]["fan"] == "Variable"
          if airloop.airLoopHVACOutdoorAirSystem.is_initialized
            controller_mv = airloop.airLoopHVACOutdoorAirSystem.get.getControllerOutdoorAir.controllerMechanicalVentilation
            controller_mv.setDemandControlledVentilation(true)
            runner.registerInfo("Enabling demand control ventilation for #{airloop.name}")
          end  
        end  
      end
    end
   
    unless options["secondary_airloops"].nil?
      options["secondary_airloops"].each do |airloop|
        if options["allHVAC"]["secondary"]["fan"] == "Variable"
          if airloop.airLoopHVACOutdoorAirSystem.is_initialized
            controller_mv = airloop.airLoopHVACOutdoorAirSystem.get.getControllerOutdoorAir.controllerMechanicalVentilation
            controller_mv.setDemandControlledVentilation(true)
            runner.registerInfo("Enabling demand control ventilation for #{airloop.name}")
          end  
        end  
      end
    end
  end # end of def

end
