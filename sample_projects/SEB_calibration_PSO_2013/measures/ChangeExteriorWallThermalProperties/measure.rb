#start the measure
class ChangeExteriorWallThermalProperties < OpenStudio::Ruleset::ModelUserScript

  #define the name that a user will see
  def name
    return "Change Exterior Wall Thermal Properties"
  end

  #define the arguments that the user will input
  def arguments(model)
    args = OpenStudio::Ruleset::OSArgumentVector.new

    #make an argument insulation R-value
    r_value_mult = OpenStudio::Ruleset::OSArgument::makeDoubleArgument("r_value_mult",true)
    r_value_mult.setDisplayName("Exterior wall total R-value multiplier")
    r_value_mult.setDefaultValue(1)
    args << r_value_mult

    solar_abs_mult = OpenStudio::Ruleset::OSArgument::makeDoubleArgument("solar_abs_mult",true)
    solar_abs_mult.setDisplayName("Exterior wall solar absorptance multiplier")
    solar_abs_mult.setDefaultValue(1)
    args << solar_abs_mult

    thermal_mass_mult = OpenStudio::Ruleset::OSArgument::makeDoubleArgument("thermal_mass_mult",true)
    thermal_mass_mult.setDisplayName("Exterior wall thermal mass multiplier")
    thermal_mass_mult.setDefaultValue(1)
    args << thermal_mass_mult

    return args
  end #end the arguments method

  #define what happens when the measure is run
  def run(model, runner, user_arguments)
    super(model, runner, user_arguments)

    #use the built-in error checking
    unless runner.validateUserArguments(arguments(model), user_arguments)
      return false
    end

    #assign the user inputs to variables
    r_value_mult = runner.getDoubleArgumentValue("r_value_mult",user_arguments)
    solar_abs_mult = runner.getDoubleArgumentValue("solar_abs_mult",user_arguments)
    thermal_mass_mult = runner.getDoubleArgumentValue("thermal_mass_mult",user_arguments)

    #check the input arguments for percentage input or problomatically small values
    arg_in = [r_value_mult, solar_abs_mult, thermal_mass_mult]
    arg_in_d = ["R-value multiplier","Solar absorptance multiplier", "Thermal mass multiplier"]
    arg_flag = FALSE
    arg_in.each_with_index do |arg, arg_index|
      if arg.round(2) == 0
        runner.registerError("#{arg_in_d[arg_index]} was set equal to #{arg}. Please input a value greater that 1*e-2.")
        arg_flag = TRUE
      elsif arg < 0
        runner.registerError("#{arg_in_d[arg_index]} was set equal to #{arg}. Please input a number greater than zero. Remember a multiplier, not a percentage, is being specified.")
        arg_flag = TRUE
      elsif arg >= 3
        runner.registerWarning("#{arg_in_d[arg_index]} was set equal to #{arg}. Please ensure that the desired value was entered as a multiplier, not a percentage.")
      end
    end
    return false if arg_flag

    #short def to make numbers pretty (converts 4125001.25641 to 4,125,001.26 or 4,125,001). The definition be called through this measure
    def neat_numbers(number, roundto = 2) #round to 0 or 2)
      if roundto == 2
        number = sprintf "%.2f", number
      else
        number = number.round
      end
      #regex to add commas
      number.to_s.reverse.gsub(%r{([0-9]{3}(?=([0-9])))}, "\\1,").reverse
    end #end def neat_numbers

    #helper to make it easier to do unit conversions on the fly
    def unit_helper(number,from_unit_string,to_unit_string)
      OpenStudio::convert(OpenStudio::Quantity.new(number, OpenStudio::createUnit(from_unit_string).get), OpenStudio::createUnit(to_unit_string).get).get.value
    end

    #create an array of exterior surfaces and construction types
    surfaces = model.getSurfaces
    exterior_surfaces = []
    exterior_surface_constructions = []
    surfaces.each do |surface|
      if surface.outsideBoundaryCondition == "Outdoors" && surface.surfaceType == "Wall"
        exterior_surfaces << surface
        exterior_surface_const = surface.construction.get
        #only add construction if it hasn't been added yet
        unless exterior_surface_constructions.include?(exterior_surface_const)
          exterior_surface_constructions << exterior_surface_const.to_Construction.get
        end
      end
    end

    # nothing will be done if there are no exterior surfaces
    if exterior_surfaces.empty?
      runner.registerAsNotApplicable("Model does not have any exterior walls.")
      return true
    end

    #get initial number of surfaces having each construction type
    initial_condition_string = "Initial number of surfaces of each construction type: "
    exterior_surface_construction_numbers = []
    exterior_surface_constructions.each_with_index do |construction,index|
      exterior_surface_construction_numbers[index] = 0
      initial_condition_string << "'#{construction.name.to_s}': "
      exterior_surfaces.each do |surface|
        exterior_surface_construction_numbers[index] += 1 if surface.construction.get.handle.to_s == construction.handle.to_s
      end
      initial_condition_string << "#{exterior_surface_construction_numbers[index]}, "
    end

    runner.registerInitialCondition(initial_condition_string)

    # get initial sets of construction layers and desired values
    initial_layers = Array.new
    initial_r_val = Array.new
    initial_sol_abs = Array.new
    initial_thm_mass = Array.new
    initial_r_val_d = Array.new
    initial_sol_abs_d = Array.new
    initial_thm_mass_d = Array.new
    exterior_surface_constructions.each_with_index do |construction, con_index|
      initial_layers[con_index] = exterior_surface_constructions[con_index].layers
      initial_sol_abs[con_index] = initial_layers[con_index][0].to_StandardOpaqueMaterial.get.solarAbsorptance
      initial_r_val[con_index] = Array.new
      initial_thm_mass[con_index] = Array.new
      initial_sol_abs_d[con_index] = neat_numbers(initial_layers[con_index][0].to_StandardOpaqueMaterial.get.solarAbsorptance)
      initial_r_val_d[con_index] = Array.new
      initial_thm_mass_d[con_index] = Array.new
      initial_layers[con_index].each_with_index do |layer, lay_index|
        initial_r_val[con_index][lay_index] = initial_layers[con_index][lay_index].to_OpaqueMaterial.get.thermalResistance
        initial_thm_mass[con_index][lay_index] = initial_layers[con_index][lay_index].to_StandardOpaqueMaterial.get.density if layer.to_StandardOpaqueMaterial.is_initialized
        initial_r_val_d[con_index][lay_index] = neat_numbers(initial_layers[con_index][lay_index].to_OpaqueMaterial.get.thermalResistance) if layer.to_OpaqueMaterial.is_initialized
        initial_thm_mass_d[con_index][lay_index] = neat_numbers(initial_layers[con_index][lay_index].to_StandardOpaqueMaterial.get.density) if layer.to_StandardOpaqueMaterial.is_initialized
      end
    end
    initial_r_val_units = "m^2*K/W"
    initial_thm_mass_units = "kg/m3"

    #calculate desired values for each construction and layer
    desired_r_val = Array.new
    desired_sol_abs = Array.new
    desired_thm_mass = Array.new
    initial_r_val.each_index do |index1|
      desired_r_val[index1] = Array.new
      initial_r_val[index1].each_index do |index2|
        desired_r_val[index1][index2] = initial_r_val[index1][index2] * r_value_mult if initial_r_val
      end
    end
    initial_sol_abs.each_index do |index1|
      desired_sol_abs[index1] = [initial_sol_abs[index1] * solar_abs_mult, 1].min if initial_sol_abs
      runner.registerWarning("Initial solar absorptance of '#{initial_layers[index1][0].name.to_s}' was #{initial_sol_abs[index1]}. Multiplying it by #{solar_abs_mult} results in a number greater than 1, which is outside the allowed range. The value is instead being set to #{desired_sol_abs[index1]}") if desired_sol_abs[index1] == 1
    end
    initial_thm_mass.each_index do |index1|
      desired_thm_mass[index1] = Array.new
      initial_thm_mass[index1].each_index do |index2|
        desired_thm_mass[index1][index2] = initial_thm_mass[index1][index2] * thermal_mass_mult if initial_thm_mass[index1][index2]
      end
    end

    #initalize final values arrays
    final_construction = Array.new
    final_r_val = Array.new
    final_sol_abs = Array.new
    final_thm_mass = Array.new
    final_r_val_d = Array.new
    final_sol_abs_d = Array.new
    final_thm_mass_d = Array.new
    initial_r_val.each_with_index {|_,index| final_r_val[index] = Array.new}
    initial_thm_mass.each_with_index {|_,index| final_thm_mass[index] = Array.new}
    initial_r_val_d.each_with_index {|_,index| final_r_val_d[index] = Array.new}
    initial_thm_mass_d.each_with_index {|_,index| final_thm_mass_d[index] = Array.new}

    #replace exterior surface wall constructions
    exterior_surface_constructions.each_with_index do |construction, con_index|
      #create and name new construction
      new_construction = construction.clone
      new_construction = new_construction.to_Construction.get
      new_construction.setName("Calibrated Exterior #{construction.name.to_s}")
      #replace layers in new construction
      new_construction.layers.each_with_index do |layer, lay_index|
        new_layer = layer.clone
        new_layer = new_layer.to_Material.get
        #update thermal properties for the layer based on desired arrays
        new_layer.to_StandardOpaqueMaterial.get.setSolarAbsorptance(desired_sol_abs[con_index]) if lay_index == 0 && layer.to_StandardOpaqueMaterial.is_initialized #only apply to outer surface
        new_layer.to_OpaqueMaterial.get.setThermalResistance(desired_r_val[con_index][lay_index]) if layer.to_OpaqueMaterial.is_initialized
        new_layer.to_StandardOpaqueMaterial.get.setDensity(desired_thm_mass[con_index][lay_index]) if layer.to_StandardOpaqueMaterial.is_initialized && desired_thm_mass[con_index][lay_index] != 0
        new_layer.setName("#{new_layer.name.to_s} in #{new_construction.name.to_s}")
        new_construction.setLayer(lay_index, new_layer)
        #calculate properties of new layer and output nice names
        final_r_val[con_index][lay_index] = new_construction.layers[lay_index].to_OpaqueMaterial.get.thermalResistance if layer.to_OpaqueMaterial.is_initialized
        final_sol_abs[con_index] = new_construction.layers[lay_index].to_StandardOpaqueMaterial.get.getSolarAbsorptance.value if lay_index == 0 && layer.to_StandardOpaqueMaterial.is_initialized
        final_thm_mass[con_index][lay_index] = new_construction.layers[lay_index].to_StandardOpaqueMaterial.get.getDensity.value if layer.to_StandardOpaqueMaterial.is_initialized
        final_r_val_d[con_index][lay_index] = neat_numbers(final_r_val[con_index][lay_index])
        final_sol_abs_d[con_index] = neat_numbers(final_sol_abs[con_index]) if lay_index == 0 && layer.to_StandardOpaqueMaterial.is_initialized
        final_thm_mass_d[con_index][lay_index] = neat_numbers(final_thm_mass[con_index][lay_index]) if layer.to_StandardOpaqueMaterial.is_initialized
        runner.registerInfo("Updated material '#{layer.name.to_s}' in construction '#{construction.name.to_s}' to '#{new_layer.name.to_s}' as follows:")
        final_r_val[con_index][lay_index] ? runner.registerInfo(" R-Value updated from #{initial_r_val_d[con_index][lay_index]} to #{final_r_val_d[con_index][lay_index]} (#{final_r_val[con_index][lay_index]/initial_r_val[con_index][lay_index]} mult)") : runner.registerInfo("R-Value was #{initial_r_val_d[con_index][lay_index]} and now is nil_value")
        final_thm_mass[con_index][lay_index] ? runner.registerInfo("Thermal Mass updated from #{initial_thm_mass_d[con_index][lay_index]} to #{final_thm_mass_d[con_index][lay_index]} (#{final_thm_mass[con_index][lay_index]/initial_thm_mass[con_index][lay_index]} mult)") : runner.registerInfo("Thermal Mass was #{initial_thm_mass[con_index][lay_index]} and now is nil_value")
        if lay_index == 0
          final_sol_abs[con_index] ? runner.registerInfo("Solar Absorptance updated from #{initial_sol_abs_d[con_index]} to #{final_sol_abs_d[con_index]} (#{final_sol_abs[con_index]/initial_sol_abs[con_index]} mult)") : runner.registerInfo("Solar Absorptance was #{initial_sol_abs[con_index][lay_index]} and now is nil_value")
        end
      end
      final_construction[con_index] = new_construction
      #update surfaces with construction = construction to new_construction
      exterior_surfaces.each do |surface|
        surface.setConstruction(new_construction) if surface.construction.get.handle.to_s == construction.handle.to_s
      end
    end

    #create an array of exterior surfaces and construction types
    final_surfaces = model.getSurfaces
    final_exterior_surfaces = []
    final_exterior_surface_constructions = []
    final_surfaces.each do |surface|
      if surface.outsideBoundaryCondition == "Outdoors" && surface.surfaceType == "Wall"
        final_exterior_surfaces << surface
        final_exterior_surface_const = surface.construction.get
        #only add construction if it hasn't been added yet
        unless final_exterior_surface_constructions.include?(final_exterior_surface_const)
          final_exterior_surface_constructions << final_exterior_surface_const.to_Construction.get
        end
      end
    end

    #get final number of surfaces having each construction type
    final_condition_string = "Final number of surfaces of each construction type: "
    final_exterior_surface_construction_numbers = []
    final_exterior_surface_constructions.each_with_index do |construction,index|
      final_exterior_surface_construction_numbers[index] = 0
      final_condition_string << "'#{construction.name.to_s}': "
      final_exterior_surfaces.each do |surface|
        final_exterior_surface_construction_numbers[index] += 1 if surface.construction.get.handle.to_s == construction.handle.to_s
      end
      final_condition_string << "#{exterior_surface_construction_numbers[index]}, "
    end

    #report desired condition
    runner.registerFinalCondition(final_condition_string)

    return true

  end #end the run method

end #end the measure

#this allows the measure to be used by the application
ChangeExteriorWallThermalProperties.new.registerWithApplication