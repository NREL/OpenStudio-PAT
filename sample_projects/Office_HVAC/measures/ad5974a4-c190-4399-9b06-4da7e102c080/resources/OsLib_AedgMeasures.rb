module OsLib_AedgMeasures

  def OsLib_AedgMeasures.getClimateZoneNumber(model,runner)
    # get ashrae climate zone from model
    ashraeClimateZone = ""
    climateZones = model.getClimateZones
    climateZones.climateZones.each do |climateZone|
      if climateZone.institution == "ASHRAE"
        ashraeClimateZone = climateZone.value
        runner.registerInfo("Using ASHRAE Climate zone #{ashraeClimateZone} for AEDG recommendations.")
      end
    end

    if ashraeClimateZone == ""#should this be not applicable or error?
      runner.registerError("Please assign an ASHRAE Climate Zone to your model using the site tab in the OpenStudio application. The measure can't make AEDG recommendations without this information.")
      return false # note - for this to work need to check for false in measure.rb and add return false there as well.
    else
      climateZoneNumber = ashraeClimateZone.split(//).first
    end

    # expected climate zone number should be 1 through 8
    if not ["1","2","3","4","5","6","7","8"].include? climateZoneNumber
      runner.registerError("ASHRAE climate zone number is not within expected range of 1 to 8.")
      return false # note - for this to work need to check for false in measure.rb and add return false there as well.
    end

    result = climateZoneNumber
    # don't add return false here, need to catch errors above

  end  # end of def OsLib_AedgMeasures.getClimateZoneNumber(model,runner)


  def OsLib_AedgMeasures.getLongHowToTips(guide,aedgTips,runner)

    # get tips
    if guide == "K12"
      hash = OsLib_AedgMeasures.getK12Tips()
    elsif guide == "SmMdOff"
      hash = OsLib_AedgMeasures.getSmMdOffTips()
    else
      runner.registerError("#{guide} is an invalid value. Can't generate how to tip messages.")
      return false # note - for this to work need to check for false in measure.rb and add return false there as well.
      # this should only happen if measure writer passes bad values to getLongHowToTips
    end

    # array for info string
    string = []

    # create info messages
    aedgTips.each do |aedgtip|
      if not hash[aedgtip] == hash[0]
        string << hash[aedgtip]
      else
        runner.registerWarning("#{aedgtip} is an invalid key for tip hash. Can't generate tip.")
      end
    end

    # see if expected number of messages created
    if aedgTips.size != string.size
      runner.registerWarning("One more more messages were not created.")
    end

    result = "#{hash[0]}: #{string.join(", ")}." # hash[0] bad key will return default value
    # don't add return false here, need to catch errors above

  end  # end of def OsLib_AedgMeasures.getClimateZoneNumber(model,runner)


  #hash of how to tips for K-12 school AEDG
  def OsLib_AedgMeasures.getK12Tips

    # envelope tips
    @aedgK12HowToTipHash = Hash.new("K-12 Schools AEDG How to Implement Recommendations")
    @aedgK12HowToTipHash["EN01"] = "EN1 Cool Roofs"
    @aedgK12HowToTipHash["EN02"] = "EN2 Roofs-Insulation Entirely above Deck"
    @aedgK12HowToTipHash["EN03"] = "EN3 Roofs-Attics, and Other Roofs"
    @aedgK12HowToTipHash["EN04"] = "EN4 Roofs-Metal Buildings"
    @aedgK12HowToTipHash["EN05"] = "EN5 Walls-Mass"
    @aedgK12HowToTipHash["EN06"] = "EN6 Walls-Steel Framed"
    @aedgK12HowToTipHash["EN07"] = "EN7 Walls-Wood Frame and Other"
    @aedgK12HowToTipHash["EN08"] = "EN8 Walls-Metal Building"
    @aedgK12HowToTipHash["EN09"] = "EN9 Below-Grade Walls"
    @aedgK12HowToTipHash["EN10"] = "EN10 Floors-Mass"
    @aedgK12HowToTipHash["EN11"] = "EN11 Floors-Metal Joist or Wood Joist/Wood Frame"
    @aedgK12HowToTipHash["EN12"] = "EN12 Slab-on-Grade Floors-Unheated"
    @aedgK12HowToTipHash["EN13"] = "EN13 Slab-on-Grade Floors-Heated"
    @aedgK12HowToTipHash["EN14"] = "EN14 Slab Edge Insulation"
    @aedgK12HowToTipHash["EN15"] = "EN15 Doors-Opaque, Swinging"
    @aedgK12HowToTipHash["EN16"] = "EN16 Doors-Opaque, Roll-Up, or Sliding"
    @aedgK12HowToTipHash["EN17"] = "EN17 Air Infiltration Control"
    @aedgK12HowToTipHash["EN18"] = "EN18 Vestibules"
    @aedgK12HowToTipHash["EN19"] = "EN19 Alternative Constructions"
    @aedgK12HowToTipHash["EN20"] = "EN20 Truss Heel Heights"
    @aedgK12HowToTipHash["EN21"] = "EN21 Moisture Control"
    @aedgK12HowToTipHash["EN22"] = "EN22 Thermal Bridging-Opaque Components"
    @aedgK12HowToTipHash["EN23"] = "EN23 Thermal Bridging-Fenestration"
    @aedgK12HowToTipHash["EN24"] = "EN24 Fenestration Descriptions"
    @aedgK12HowToTipHash["EN25"] = "EN25 View Window-to Floor Area Ratio (VFR)"
    @aedgK12HowToTipHash["EN26"] = "EN26 Unwanted Solar Heat Gain Is Most Effectively Controlled on the Outside of the Building"
    @aedgK12HowToTipHash["EN27"] = "EN27 Operable versus Fixed Windows"
    @aedgK12HowToTipHash["EN28"] = "EN28 Building Form and Window Orientation"
    @aedgK12HowToTipHash["EN29"] = "EN29 Glazing"
    @aedgK12HowToTipHash["EN30"] = "EN30 Obstructions and Planting"
    @aedgK12HowToTipHash["EN31"] = "EN31 Window Orientation"
    @aedgK12HowToTipHash["EN32"] = "EN32 Passive Solar"
    @aedgK12HowToTipHash["EN33"] = "EN33 Glazing"

    # daylighting tips
    @aedgK12HowToTipHash["DL01"] = "DL1 General Principles"
    @aedgK12HowToTipHash["DL02"] = "DL2 Consider Daylighting Early in the Design Process"
    @aedgK12HowToTipHash["DL03"] = "DL3 Space Types"
    @aedgK12HowToTipHash["DL04"] = "DL4 How to Select Daylighting Strategies"
    @aedgK12HowToTipHash["DL05"] = "DL5 Recommended Daylighting Fenestration-to-Floor Area Ratios"
    @aedgK12HowToTipHash["DL06"] = "DL6 View Windows Separate from Daylighting Strategy"
    @aedgK12HowToTipHash["DL07"] = "DL7 Lighting Design Criteria"
    @aedgK12HowToTipHash["DL08"] = "DL8 Use Daylighting Analysis Tools to Optimize Design"
    @aedgK12HowToTipHash["DL09"] = "DL9 Building Orientation"
    @aedgK12HowToTipHash["DL10"] = "DL10 Ceiling Height"
    @aedgK12HowToTipHash["DL11"] = "DL11 Outdoor Surface Reflectance"
    @aedgK12HowToTipHash["DL12"] = "DL12 Eliminate Direct Beam Radiation"
    @aedgK12HowToTipHash["DL13"] = "DL13 Daylighting Control for Audio-Visual (AV) Projection Activities"
    @aedgK12HowToTipHash["DL14"] = "DL14 Interior Finishes for Daylighting"
    @aedgK12HowToTipHash["DL15"] = "DL15 Calibration and Commissioning"
    @aedgK12HowToTipHash["DL16"] = "DL16 Dimming Controls"
    @aedgK12HowToTipHash["DL17"] = "DL17 Photosensor Placement and Lighting Layout"
    @aedgK12HowToTipHash["DL18"] = "DL18 Photosensor Specifications"
    @aedgK12HowToTipHash["DL19"] = "DL19 Select Compatible Light Fixtures"
    @aedgK12HowToTipHash["DL20"] = "DL20 Sidelighting Patterns"
    @aedgK12HowToTipHash["DL21"] = "DL21 South-Facing Classrooms-Configuration of Apertures"
    @aedgK12HowToTipHash["DL22"] = "DL22 South-Facing Classrooms-Glazing Area and Fenestration Type"
    @aedgK12HowToTipHash["DL23"] = "DL23 View Glazing and VTs"
    @aedgK12HowToTipHash["DL24"] = "DL24 South-Facing Classrooms-Make Light Shelf Durable and Reflective"
    @aedgK12HowToTipHash["DL25"] = "DL25 North-Facing Classroom-Configuration of Apertures"
    @aedgK12HowToTipHash["DL26"] = "DL26 North-Facing Classroom-Glazing Area and Fenestration Type"
    @aedgK12HowToTipHash["DL27"] = "DL27 South-and North-Facing Classrooms-Sloped Ceilings"
    @aedgK12HowToTipHash["DL28"] = "DL28 South-and North-Facing Classrooms-Recognize the Limits of Side Daylighting"
    @aedgK12HowToTipHash["DL29"] = "DL29 Classroom Toplighting Pattern"
    @aedgK12HowToTipHash["DL30"] = "DL30 Sizing the Roof Monitors"
    @aedgK12HowToTipHash["DL31"] = "DL31 Overhang for Roof Monitor"
    @aedgK12HowToTipHash["DL32"] = "DL32 Use Light-Colored Roofing in Front of Monitors"
    @aedgK12HowToTipHash["DL33"] = "DL33 Use Baffles to Block Direct Beam Radiation and Diffuse Light"
    @aedgK12HowToTipHash["DL34"] = "DL34 Minimize Contrast at Well-Ceiling Intersection"
    @aedgK12HowToTipHash["DL35"] = "DL35 Address the Monitor Design"
    @aedgK12HowToTipHash["DL36"] = "DL36 Let the Heat Stratify"
    @aedgK12HowToTipHash["DL37"] = "DL37 Minimize the Depth of the Ceiling Cavity"
    @aedgK12HowToTipHash["DL38"] = "DL38 Classroom Sidelighting Plus Toplighting Pattern"
    @aedgK12HowToTipHash["DL39"] = "DL39 Gym Toplighting Overview"
    @aedgK12HowToTipHash["DL40"] = "DL40 Gym Toplighting Sizing"
    @aedgK12HowToTipHash["DL41"] = "DL41 Gym Toplighting Using South-Facing Roof Monitors"
    @aedgK12HowToTipHash["DL42"] = "DL42 Gym Toplighting in Combination with North-and South-Facing Sidelighting"

    # electric lighting tips
    @aedgK12HowToTipHash["EL01"] = "EL1 Light-Colored Interior Finishes"
    @aedgK12HowToTipHash["EL02"] = "EL2 Color Rendering Index"
    @aedgK12HowToTipHash["EL03"] = "EL3 Color Temperature"
    @aedgK12HowToTipHash["EL04"] = "EL4 Linear Fluorescent Lamps and Ballasts"
    @aedgK12HowToTipHash["EL05"] = "EL5 Compact Fluorescent"
    @aedgK12HowToTipHash["EL06"] = "EL6 Metal Halide"
    @aedgK12HowToTipHash["EL07"] = "EL7 Light-Emitting Diode (LED) Lighting"
    @aedgK12HowToTipHash["EL08"] = "EL8 Occupancy Sensors"
    @aedgK12HowToTipHash["EL09"] = "EL9 Multilevel Switching or Dimming"
    @aedgK12HowToTipHash["EL10"] = "EL10 Exit Signs"
    @aedgK12HowToTipHash["EL11"] = "EL11 Circuiting and Switching"
    @aedgK12HowToTipHash["EL12"] = "EL12 Electrical Lighting Design for Schools"
    @aedgK12HowToTipHash["EL13"] = "EL13 Classroom Lighting"
    @aedgK12HowToTipHash["EL14"] = "EL14 Gym Lighting"
    @aedgK12HowToTipHash["EL15"] = "EL15 Lighting for a Multipurpose Room"
    @aedgK12HowToTipHash["EL16"] = "EL16 Lighting for a Library or Media Center"
    @aedgK12HowToTipHash["EL17"] = "EL17 Corridor Lighting"
    @aedgK12HowToTipHash["EL18"] = "EL18 Lighting for Offices and Teacher Support Rooms"
    @aedgK12HowToTipHash["EL19"] = "EL19 Lighting for Locker Areas and Restrooms"
    @aedgK12HowToTipHash["EL20"] = "EL20 Twenty-Four Hour Lighting"
    @aedgK12HowToTipHash["EL21"] = "EL21 Exterior Lighting Power-Parking Lots and Drives"
    @aedgK12HowToTipHash["EL22"] = "EL22 Exterior Lighting Power-Walkways"
    @aedgK12HowToTipHash["EL23"] = "EL23 Decorative Façade Lighting"
    @aedgK12HowToTipHash["EL24"] = "EL24 Sources"
    @aedgK12HowToTipHash["EL25"] = "EL25 Controls"

    # plug load tips
    @aedgK12HowToTipHash["PL01"] = "PL1 General Guidance"
    @aedgK12HowToTipHash["PL02"] = "PL2 Computer (Information Technology) Equipment"
    @aedgK12HowToTipHash["PL03"] = "PL3 Staff and Occupant Equipment Control"
    @aedgK12HowToTipHash["PL04"] = "PL4 Phantom/Parasitic Loads"
    @aedgK12HowToTipHash["PL05"] = "PL5 ENERGY STAR Appliances/Equipment"
    @aedgK12HowToTipHash["PL06"] = "PL6 Electrical Distribution System"

    # kitchen tips
    @aedgK12HowToTipHash["KE01"] = "KE1 General Guidance"
    @aedgK12HowToTipHash["KE02"] = "KE2 Energy-Efficient Kitchen Equipment"
    @aedgK12HowToTipHash["KE03"] = "KE3 Exhaust and Ventilation Energy Use"
    @aedgK12HowToTipHash["KE04"] = "KE4 Minimize Hot-Water Use"
    @aedgK12HowToTipHash["KE05"] = "KE5 High-Efficiency Walk-in Refrigeration Systems"
    @aedgK12HowToTipHash["KE06"] = "KE6 Position Hooded Appliances to Achieve Lower Exhaust Rates"
    @aedgK12HowToTipHash["KE07"] = "KE7 Operating Considerations"

    # service water heating tips
    @aedgK12HowToTipHash["WH01"] = "WH1 Service Water -Heating Types"
    @aedgK12HowToTipHash["WH02"] = "WH2 System Descriptions"
    @aedgK12HowToTipHash["WH03"] = "WH3 Sizing"
    @aedgK12HowToTipHash["WH04"] = "WH4 Equipment Efficiency"
    @aedgK12HowToTipHash["WH05"] = "WH5 Location"
    @aedgK12HowToTipHash["WH06"] = "WH6 Pipe Insulation"
    @aedgK12HowToTipHash["WH07"] = "WH7 Solar Hot-Water Systems"

    # hvac tips
    @aedgK12HowToTipHash["HV01"] = "HV1 Ground-Source Heat Pump System"
    @aedgK12HowToTipHash["HV02"] = "HV2 Fan-Coil System"
    @aedgK12HowToTipHash["HV03"] = "HV3 Multiple-Zone, Variable-Air-Volume (VAV) Air Handlers"
    @aedgK12HowToTipHash["HV04"] = "HV4 Dedicated Outdoor Air System (DOAS)"
    @aedgK12HowToTipHash["HV05"] = "HV5 Exhaust Air Energy Recovery"
    @aedgK12HowToTipHash["HV06"] = "HV6 Chilled-Water System"
    @aedgK12HowToTipHash["HV07"] = "HV7 Water Heating System"
    @aedgK12HowToTipHash["HV08"] = "HV8 Condenser-Water System for GSHPs"
    @aedgK12HowToTipHash["HV09"] = "HV9 Cooling and Heating Load Calculations"
    @aedgK12HowToTipHash["HV10"] = "HV10 Ventilation Air"
    @aedgK12HowToTipHash["HV11"] = "HV11 Cooling and Heating Equipment Efficiencies"
    @aedgK12HowToTipHash["HV12"] = "HV12 Fan Power and Motor Efficiencies"
    @aedgK12HowToTipHash["HV13"] = "HV13 Part-Load Dehumidification"
    @aedgK12HowToTipHash["HV14"] = "HV14 Economizer"
    @aedgK12HowToTipHash["HV15"] = "HV15 Demand-Controlled Ventilation"
    @aedgK12HowToTipHash["HV16"] = "HV16 System-Level Control Strategies"
    @aedgK12HowToTipHash["HV17"] = "HV17 Thermal Zoning"
    @aedgK12HowToTipHash["HV18"] = "HV18 Ductwork Design and Construction"
    @aedgK12HowToTipHash["HV19"] = "HV19 Duct Insulation"
    @aedgK12HowToTipHash["HV20"] = "HV20 Duct Sealing and Leakage Testing"
    @aedgK12HowToTipHash["HV21"] = "HV21 Exhaust Air Systems"
    @aedgK12HowToTipHash["HV22"] = "HV22 Testing, Adjusting, and Balancing"
    @aedgK12HowToTipHash["HV23"] = "HV23 Air Cleaning"
    @aedgK12HowToTipHash["HV24"] = "HV24 Relief versus Return Fans"
    @aedgK12HowToTipHash["HV25"] = "HV25 Zone Temperature Control"
    @aedgK12HowToTipHash["HV26"] = "HV26 Heating Sources"
    @aedgK12HowToTipHash["HV27"] = "HV27 Noise Control"
    @aedgK12HowToTipHash["HV28"] = "HV28 Proper Maintenance"
    # bonus hvac tips
    @aedgK12HowToTipHash["HV29"] = "HV29 Natural Ventilation and Naturally Conditioned Spaces"
    @aedgK12HowToTipHash["HV30"] = "HV30 Thermal Storage"
    @aedgK12HowToTipHash["HV31"] = "HV31 Thermal Mass"
    @aedgK12HowToTipHash["HV32"] = "HV32 Thermal Displacement Ventilation"
    @aedgK12HowToTipHash["HV33"] = "HV33 ASHRAE Standard 62.1 IAQ Procedure"
    @aedgK12HowToTipHash["HV34"] = "HV34 Evaporative Cooling"

    # commissioning tips
    @aedgK12HowToTipHash["QA01"] = "QA1 Design and Construction Team"
    @aedgK12HowToTipHash["QA02"] = "QA2 Owner’s Project Requirements and Basis of Design"
    @aedgK12HowToTipHash["QA03"] = "QA3 Selection of Quality Assurance Provider"
    @aedgK12HowToTipHash["QA04"] = "QA4 Design and Construction Schedule"
    @aedgK12HowToTipHash["QA05"] = "QA5 Design Review"
    @aedgK12HowToTipHash["QA06"] = "QA6 Defining Quality Assurance at Pre-Bid"
    @aedgK12HowToTipHash["QA07"] = "QA7 Verifying Building Envelope Construction"
    @aedgK12HowToTipHash["QA08"] = "QA8 Verifying Lighting Construction"
    @aedgK12HowToTipHash["QA09"] = "QA9 Verifying Electrical and HVAC Systems Construction"
    @aedgK12HowToTipHash["QA10"] = "QA10 Functional Performance Testing"
    @aedgK12HowToTipHash["QA11"] = "QA11 Substantial Completion"
    @aedgK12HowToTipHash["QA12"] = "QA12 Final Acceptance"
    @aedgK12HowToTipHash["QA13"] = "QA13 Establish Building Operation and Maintenance Program"
    @aedgK12HowToTipHash["QA14"] = "QA14 Monitor Post-Occupancy Performance"
    @aedgK12HowToTipHash["QA15"] = "QA15 M&V Electrical Panel Guidance"
    @aedgK12HowToTipHash["QA16"] = "QA16 M&V Data Management and Access"
    @aedgK12HowToTipHash["QA17"] = "QA17 M&V Benchmarking"
    @aedgK12HowToTipHash["QA18"] = "QA18 The Building as a Teaching Tool"

    # renewable energy tips
    @aedgK12HowToTipHash["RE01"] = "RE1 Photovoltaic (PV) Systems"
    @aedgK12HowToTipHash["RE02"] = "RE2 Solar Hot Water Systems"
    @aedgK12HowToTipHash["RE03"] = "RE3 Wind Turbine Power"

    result = @aedgK12HowToTipHash
    return result

  end #end of OsLib_AedgMeasures.getK12Tips


  #hash of how to tips for small to medium office buildings AEDG
  def OsLib_AedgMeasures.getSmMdOffTips

    # envelope tips
    aedgSmMdOffHowToTipHash = Hash.new("Small and Medium Offices AEDG How to Implement Recommendations")
    aedgSmMdOffHowToTipHash["EN01"] = "EN1 Cool Roofs"
    aedgSmMdOffHowToTipHash["EN02"] = "EN2 Roofs-Insulation Entirely above Deck"
    aedgSmMdOffHowToTipHash["EN03"] = "EN3 Roofs-Attics, and Other Roofs"
    aedgSmMdOffHowToTipHash["EN04"] = "EN4 Roofs-Metal Buildings"
    aedgSmMdOffHowToTipHash["EN05"] = "EN5 Walls-Mass"
    aedgSmMdOffHowToTipHash["EN06"] = "EN6 Walls-Steel Framed"
    aedgSmMdOffHowToTipHash["EN07"] = "EN7 Walls-Wood Frame and Other"
    aedgSmMdOffHowToTipHash["EN08"] = "EN8 Walls-Metal Building"
    aedgSmMdOffHowToTipHash["EN09"] = "EN9 Walls-Below-Grade"
    aedgSmMdOffHowToTipHash["EN10"] = "EN10 Floors-Mass"
    aedgSmMdOffHowToTipHash["EN11"] = "EN11 Floors-Metal Joist or Wood Joist/Wood Frame"
    aedgSmMdOffHowToTipHash["EN12"] = "EN12 Slab-on-Grade Floors-Unheated"
    aedgSmMdOffHowToTipHash["EN13"] = "EN13 Slab-on-Grade Floors-Heated"
    aedgSmMdOffHowToTipHash["EN14"] = "EN14 Slab Edge Insulation"
    aedgSmMdOffHowToTipHash["EN15"] = "EN15 Doors-Opaque, Swinging"
    aedgSmMdOffHowToTipHash["EN16"] = "EN16 Doors-Opaque, Roll-Up, or Sliding"
    aedgSmMdOffHowToTipHash["EN17"] = "EN17 Air Infiltration Control"
    aedgSmMdOffHowToTipHash["EN18"] = "EN18 Vestibules"
    aedgSmMdOffHowToTipHash["EN19"] = "EN19 Alternative Constructions"
    aedgSmMdOffHowToTipHash["EN20"] = "EN20 Truss Heel Heights"
    aedgSmMdOffHowToTipHash["EN21"] = "EN21 Moisture Control"
    aedgSmMdOffHowToTipHash["EN22"] = "EN22 Thermal Bridging-Opaque Components"
    aedgSmMdOffHowToTipHash["EN23"] = "EN23 Thermal Bridging-Fenestration"
    aedgSmMdOffHowToTipHash["EN24"] = "EN24 Vertical Fenestration Descriptions"
    aedgSmMdOffHowToTipHash["EN25"] = "EN25 Window-to-Wall Ratio (WWR)"
    aedgSmMdOffHowToTipHash["EN26"] = "EN26 Unwanted Solar Heat Gain Is Most Effectively Controlled on the Outside of the Building"
    aedgSmMdOffHowToTipHash["EN27"] = "EN27 Operable versus Fixed Windows"
    aedgSmMdOffHowToTipHash["EN28"] = "EN28 Building Form and Window Orientation"
    aedgSmMdOffHowToTipHash["EN29"] = "EN29 Glazing"
    aedgSmMdOffHowToTipHash["EN30"] = "EN30 Obstructions and Planting"
    aedgSmMdOffHowToTipHash["EN31"] = "EN31 Window Orientation"
    aedgSmMdOffHowToTipHash["EN32"] = "EN32 Passive Solar"
    aedgSmMdOffHowToTipHash["EN33"] = "EN33 Glazing"
    aedgSmMdOffHowToTipHash["EN34"] = "EN34 Visible Transmittance (VT)"
    aedgSmMdOffHowToTipHash["EN35"] = "EN35 Separating Views and Daylight"
    aedgSmMdOffHowToTipHash["EN36"] = "EN36 Color-Neutral Glazing"
    aedgSmMdOffHowToTipHash["EN37"] = "EN37 Reflectivity of Glass"
    aedgSmMdOffHowToTipHash["EN38"] = "EN38 Light-to-Solar-Gain Ratio"
    aedgSmMdOffHowToTipHash["EN39"] = "EN39 High Ceilings"
    aedgSmMdOffHowToTipHash["EN40"] = "EN40 Light Shelves"

    # daylighting tips
    aedgSmMdOffHowToTipHash["DL01"] = "DL1 Daylighting Early in the Design Process"
    aedgSmMdOffHowToTipHash["DL02"] = "DL2 Daylighting Analysis Tools to Optimize Design"
    aedgSmMdOffHowToTipHash["DL03"] = "DL3 Space Types, Layout, and Daylight"
    aedgSmMdOffHowToTipHash["DL04"] = "DL4 Building Orientation and Daylight"
    aedgSmMdOffHowToTipHash["DL05"] = "DL5 Building Shape and Daylight"
    aedgSmMdOffHowToTipHash["DL06"] = "DL6 Window-to-Wall Ratio (WWR)"
    aedgSmMdOffHowToTipHash["DL07"] = "DL7 Sidelighting-Ceiling and Window Height"
    aedgSmMdOffHowToTipHash["DL08"] = "Sidelighting-Clerestory Windows"
    aedgSmMdOffHowToTipHash["DL09"] = "DL9 Sidelighting-Borrowed Light"
    aedgSmMdOffHowToTipHash["DL10"] = "DL10 Sidelighting-Wall-to-Wall Windows"
    aedgSmMdOffHowToTipHash["DL11"] = "DL11 Sidelighting-Punched Windows"
    aedgSmMdOffHowToTipHash["DL12"] = "DL12 Shading Systems to Eliminate Direct-Beam Radiation"
    aedgSmMdOffHowToTipHash["DL13"] = "DL13 Daylighting Control for Audiovisual Activities"
    aedgSmMdOffHowToTipHash["DL14"] = "DL14 Interior Finishes for Daylighting"
    aedgSmMdOffHowToTipHash["DL15"] = "DL15 Outdoor Surface Reflectance"
    aedgSmMdOffHowToTipHash["DL16"] = "DL16 Calibration and Commissioning"
    aedgSmMdOffHowToTipHash["DL17"] = "DL17 Dimming Controls"
    aedgSmMdOffHowToTipHash["DL18"] = "DL18 Photosensor Placement and Lighting Layout"
    aedgSmMdOffHowToTipHash["DL19"] = "DL19 Photosensor Specifications"
    aedgSmMdOffHowToTipHash["DL20"] = "DL20 Select Compatible Light Fixtures"
    # bonus daylighting tips
    aedgSmMdOffHowToTipHash["DL21"] = "DL21 Toplighting"
    aedgSmMdOffHowToTipHash["DL22"] = "DL22 Rooftop Monitors"
    aedgSmMdOffHowToTipHash["DL23"] = "DL23 Rooftop Monitor Design"
    aedgSmMdOffHowToTipHash["DL24"] = "DL24 Skylights"
    aedgSmMdOffHowToTipHash["DL25"] = "DL25 Toplighting-Thermal Transmittance (Climate Zones 1-3)"
    aedgSmMdOffHowToTipHash["DL26"] = "DL26 Toplighting-Thermal Transmittance (Climate Zones 4-8)"
    aedgSmMdOffHowToTipHash["DL27"] = "DL27 Toplighting-Ceiling Height Differentials"

    # electric lighting tips
    aedgSmMdOffHowToTipHash["EL01"] = "EL1 Savings and Occupant Acceptance"
    aedgSmMdOffHowToTipHash["EL02"] = "EL2 Space Planning-Open Offices"
    aedgSmMdOffHowToTipHash["EL03"] = "EL3 Space Planning-Private Offices, Conference Rooms, and Break Rooms"
    aedgSmMdOffHowToTipHash["EL04"] = "EL4 Light-Colored Interior Finishes"
    aedgSmMdOffHowToTipHash["EL05"] = "EL5 Task Lighting"
    aedgSmMdOffHowToTipHash["EL06"] = "EL6 Color Rendering Index (CRI)"
    aedgSmMdOffHowToTipHash["EL07"] = "EL7 Color Temperature"
    aedgSmMdOffHowToTipHash["EL08"] = "EL8 Linear Fluorescent Lamps and Ballasts"
    aedgSmMdOffHowToTipHash["EL09"] = "EL9 Occupancy Sensors"
    aedgSmMdOffHowToTipHash["EL10"] = "EL10 Multilevel Switching"
    aedgSmMdOffHowToTipHash["EL11"] = "EL11 Daylight-Responsive Controls"
    aedgSmMdOffHowToTipHash["EL12"] = "EL12 Exit Signs"
    aedgSmMdOffHowToTipHash["EL13"] = "EL13 Light Fixture Distribution"
    aedgSmMdOffHowToTipHash["EL14"] = "EL14 Open-Plan Offices"
    aedgSmMdOffHowToTipHash["EL15"] = "EL15 Private Offices"
    aedgSmMdOffHowToTipHash["EL16"] = "EL16 Conference Rooms/Meeting Rooms"
    aedgSmMdOffHowToTipHash["EL17"] = "EL17 Corridors"
    aedgSmMdOffHowToTipHash["EL18"] = "EL18 Storage Areas"
    aedgSmMdOffHowToTipHash["EL19"] = "EL19 Lobbies"
    aedgSmMdOffHowToTipHash["EL20"] = "EL20 Twenty-Four Hour Lighting"
    aedgSmMdOffHowToTipHash["EL21"] = "EL21 Exterior Lighting Power-Parking Lots and Drives"
    aedgSmMdOffHowToTipHash["EL22"] = "EL22 Exterior Lighting Power-Walkways"
    aedgSmMdOffHowToTipHash["EL23"] = "EL23 Decorative Façade Lighting"
    aedgSmMdOffHowToTipHash["EL24"] = "EL24 Sources"
    aedgSmMdOffHowToTipHash["EL25"] = "EL25 Controls"

    # plug load tips
    aedgSmMdOffHowToTipHash["PL01"] = "PL1 Connected Wattage"
    aedgSmMdOffHowToTipHash["PL02"] = "PL2 Laptop Computers"
    aedgSmMdOffHowToTipHash["PL03"] = "PL3 Occupancy Controls"
    aedgSmMdOffHowToTipHash["PL04"] = "PL4 Parasitic Loads"
    aedgSmMdOffHowToTipHash["PL05"] = "PL5 Printing Equipment"
    aedgSmMdOffHowToTipHash["PL06"] = "PL6 Unnecessary Equipment"

    # service water heating tips
    aedgSmMdOffHowToTipHash["WH01"] = "WH1 Service Water Heating Types"
    aedgSmMdOffHowToTipHash["WH02"] = "WH2 System Descriptions"
    aedgSmMdOffHowToTipHash["WH03"] = "WH3 Sizing"
    aedgSmMdOffHowToTipHash["WH04"] = "WH4 Equipment Efficiency"
    aedgSmMdOffHowToTipHash["WH05"] = "WH5 Location"
    aedgSmMdOffHowToTipHash["WH06"] = "WH6 Pipe Insulation"

    # hvac tips
    aedgSmMdOffHowToTipHash["HV01"] = "HV1 Cooling and Heating Loads"
    aedgSmMdOffHowToTipHash["HV02"] = "HV2 Certification of HVAC Equipment"
    aedgSmMdOffHowToTipHash["HV03"] = "HV3 Single-Zone, Packaged Air-Source Heat Pump Systems (or Split Heat Pump
Systems) with Electric Resistance Supplemental Heat and DOASs"
    aedgSmMdOffHowToTipHash["HV04"] = "HV4 Water-Source Heat Pumps (WSHPs)"
    aedgSmMdOffHowToTipHash["HV05"] = "HV5 Ground-Coupled Water-Source Heat Pump (WSHP) System"
    aedgSmMdOffHowToTipHash["HV06"] = "HV6 Multiple-Zone, VAV Packaged DX Rooftop Units with a Hot-Water Coil,
Indirect Gas Furnace, or Electric Resistance in the Rooftop Unit and
Convection Heat in the Spaces"
    aedgSmMdOffHowToTipHash["HV07"] = "HV7 Multiple-Zone, VAV Air-Handling Units with Packaged Air-Cooled Chiller and
Gas-Fired Boiler"
    aedgSmMdOffHowToTipHash["HV08"] = "Fan-Coils"
    aedgSmMdOffHowToTipHash["HV09"] = "HV9 Radiant Heating and Cooling and DOAS"
    aedgSmMdOffHowToTipHash["HV10"] = "HV10 Dedicated Outdoor Air Systems (100% Outdoor Air Systems)"
    aedgSmMdOffHowToTipHash["HV11"] = "HV11 Part-Load Dehumidification"
    aedgSmMdOffHowToTipHash["HV12"] = "HV12 Exhaust Air Energy Recovery"
    aedgSmMdOffHowToTipHash["HV13"] = "HV13 Indirect Evaporative Cooling"
    aedgSmMdOffHowToTipHash["HV14"] = "HV14 Cooling and Heating Equipment Efficiencies"
    aedgSmMdOffHowToTipHash["HV15"] = "HV15 Ventilation Air"
    aedgSmMdOffHowToTipHash["HV16"] = "HV16 Economizer"
    aedgSmMdOffHowToTipHash["HV17"] = "HV17 Demand-Controlled Ventilation (DCV)"
    aedgSmMdOffHowToTipHash["HV18"] = "HV18 Carbon Dioxide (CO2 ) Sensors"
    aedgSmMdOffHowToTipHash["HV19"] = "HV19 Exhaust Air Systems"
    aedgSmMdOffHowToTipHash["HV20"] = "HV20 Ductwork Design and Construction"
    aedgSmMdOffHowToTipHash["HV21"] = "HV21 Duct Insulation"
    aedgSmMdOffHowToTipHash["HV22"] = "HV22 Duct Sealing and Leakage Testing"
    aedgSmMdOffHowToTipHash["HV23"] = "HV23 Fan Motor Efficiencies"
    aedgSmMdOffHowToTipHash["HV24"] = "HV24 Thermal Zoning"
    aedgSmMdOffHowToTipHash["HV25"] = "HV25 System-Level Control Strategies"
    aedgSmMdOffHowToTipHash["HV26"] = "HV26 Testing, Adjusting, and Balancing"
    aedgSmMdOffHowToTipHash["HV27"] = "HV27 Commissioning (Cx)"
    aedgSmMdOffHowToTipHash["HV28"] = "HV28 Filters"
    aedgSmMdOffHowToTipHash["HV29"] = "HV29 Chilled-Water (CHW) System"
    aedgSmMdOffHowToTipHash["HV30"] = "HV30 Water Heating Systems"
    aedgSmMdOffHowToTipHash["HV31"] = "HV31 Relief versus Return Fans"
    aedgSmMdOffHowToTipHash["HV32"] = "HV32 Heating Sources"
    aedgSmMdOffHowToTipHash["HV33"] = "HV33 Noise Control"
    aedgSmMdOffHowToTipHash["HV34"] = "HV34 Proper Maintenance"
    aedgSmMdOffHowToTipHash["HV35"] = "HV35 Zone Temperature Control"
    aedgSmMdOffHowToTipHash["HV36"] = "HV36 Evaporative Condensers on Rooftop Units"

    # commissioning tips
    aedgSmMdOffHowToTipHash["QA01"] = "QA1 Selecting the Design and Construction Team"
    aedgSmMdOffHowToTipHash["QA02"] = "QA2 Selecting the QA Provider"
    aedgSmMdOffHowToTipHash["QA03"] = "QA3 Owner’s Project Requirements (OPR) and Basis of Design (BoD)"
    aedgSmMdOffHowToTipHash["QA04"] = "QA4 Design and Construction Schedule"
    aedgSmMdOffHowToTipHash["QA05"] = "QA5 Design Review"
    aedgSmMdOffHowToTipHash["QA06"] = "QA6 Defining QA at Pre-Bid"
    aedgSmMdOffHowToTipHash["QA07"] = "QA7 Verifying Building Envelope Construction"
    aedgSmMdOffHowToTipHash["QA08"] = "QA8 Verifying Lighting Construction"
    aedgSmMdOffHowToTipHash["QA09"] = "QA9 Verifying Electrical and HVAC Systems Construction"
    aedgSmMdOffHowToTipHash["QA10"] = "QA10 Performance Testing"
    aedgSmMdOffHowToTipHash["QA11"] = "QA11 Substantial Completion"
    aedgSmMdOffHowToTipHash["QA12"] = "QA12 Final Acceptance"
    aedgSmMdOffHowToTipHash["QA13"] = "QA13 Establish a Building Operation and Maintenance (O&M) Program"
    aedgSmMdOffHowToTipHash["QA14"] = "QA14 Monitor Post-Occupancy Performance"

    # natural ventilation tips
    aedgSmMdOffHowToTipHash["NV01"] = "NV1 Natural Ventilation and Naturally Conditioned Spaces"

    # renewable energy tips
    aedgSmMdOffHowToTipHash["RE01"] = "RE1 Photovoltaic (PV) Systems"
    aedgSmMdOffHowToTipHash["RE02"] = "RE2 Wind Turbine Power"
    aedgSmMdOffHowToTipHash["RE03"] = "RE3 Transpired Solar Collector"
    aedgSmMdOffHowToTipHash["RE04"] = "RE4 Power Purchase Agreements"

    result = aedgSmMdOffHowToTipHash
    return result

  end #end of OsLib_AedgMeasures.getSmMdOffTips

end # end of module OsLib_AedgMeasures