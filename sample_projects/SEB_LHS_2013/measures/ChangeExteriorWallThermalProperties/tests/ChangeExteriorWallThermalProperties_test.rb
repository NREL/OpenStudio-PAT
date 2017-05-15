require 'openstudio'

require 'openstudio/ruleset/ShowRunnerOutput'

require "#{File.dirname(__FILE__)}/../measure.rb"

#require 'minitest/spec'
require 'minitest/autorun'

class ChangeExteriorWallThermalPropertiesByPercentage_Test  < MiniTest::Test

  def test_ChangeExteriorWallThermalPropertiesByPercentage

    # create an instance of the measure
    measure = ChangeExteriorWallThermalPropertiesByPercentage.new

    # create an instance of a runner
    runner = OpenStudio::Ruleset::OSRunner.new

    # load the test model
    translator = OpenStudio::OSVersion::VersionTranslator.new
    path = OpenStudio::Path.new(File.dirname(__FILE__) + "/EnvelopeAndLoadTestModel_01.osm")
    model = translator.loadModel(path)

    assert((model.is_initialized))

    model = model.get

    # get arguments and test that they are what we are expecting
    arguments = measure.arguments(model)
    count = -1
    assert_equal(3, arguments.size)
    assert_equal("r_value_mult", arguments[count += 1].name)
    assert_equal("solar_abs_mult", arguments[count += 1].name)
    assert_equal("thermal_mass_mult", arguments[count += 1].name)

    # set argument values to good values and run the measure on model with spaces
    argument_map = OpenStudio::Ruleset::OSArgumentMap.new

    # set all argument values
    count = -1

    meta_r_value_mult = 1.2
    meta_solar_abs_mult = 1.35
    meta_thermal_mass_mult = 1.5

    r_value_mult = arguments[count += 1].clone
    assert(r_value_mult.setValue(meta_r_value_mult))
    argument_map["r_value_mult"] = r_value_mult

    solar_abs_mult = arguments[count += 1].clone
    assert(solar_abs_mult.setValue(meta_solar_abs_mult))
    argument_map["solar_abs_mult"] = solar_abs_mult

    thermal_mass_mult = arguments[count += 1].clone
    assert(thermal_mass_mult.setValue(meta_thermal_mass_mult))
    argument_map["thermal_mass_mult"] = thermal_mass_mult

    surface_array = model.getSurfaces
    exterior_surface_array = []
    construction_array = []
    surface_array.each do |surface|
      if surface.outsideBoundaryCondition == "Outdoors" and surface.surfaceType == "Wall"
        exterior_surface_array << surface
        exterior_surface_const = surface.construction.get
        unless construction_array.include?(exterior_surface_const)
          construction_array << exterior_surface_const.to_Construction.get
        end
      end
    end

    initial_layers = Array.new
    initial_r_val = Array.new
    initial_sol_abs = Array.new
    initial_thm_mass = Array.new
    construction_array.each_with_index do |construction, con_index|
      initial_layers[con_index] = construction.layers
      puts "I hate everything" if construction.layers.empty?
      initial_sol_abs[con_index] = construction.layers[0].to_StandardOpaqueMaterial.get.solarAbsorptance
      initial_sol_abs[con_index] ||= 0
      initial_r_val[con_index] = Array.new
      initial_thm_mass[con_index] = Array.new
      initial_layers[con_index].each_with_index do |layer, lay_index|
        initial_r_val[con_index][lay_index] = layer.to_OpaqueMaterial.get.thermalResistance
        initial_r_val[con_index][lay_index] ||= 0
        initial_thm_mass[con_index][lay_index] = layer.to_StandardOpaqueMaterial.get.density if layer.to_StandardOpaqueMaterial.is_initialized
        initial_thm_mass[con_index][lay_index] ||= 0
      end
    end


    desired_r_val = Array.new
    desired_sol_abs = Array.new
    desired_thm_mass = Array.new

    puts("Initial R Values: #{initial_r_val}")
    initial_r_val.each_index do |index1|
      desired_r_val[index1] = Array.new
      initial_r_val[index1].each_index do |index2|
        desired_r_val[index1][index2] = initial_r_val[index1][index2] * meta_r_value_mult if initial_r_val[index1][index2]
        puts("The value of index1 is #{index1}, the value of index2 is #{index2}, the initial value is #{initial_r_val[index1][index2]}, and the desired value is #{desired_r_val[index1][index2]}")
      end
    end
    puts("Desired R Values: #{desired_r_val}")
    puts("Initial Solar Absorptance: #{initial_sol_abs}")
    initial_sol_abs.each_index do |index1|
      desired_sol_abs[index1] = initial_sol_abs[index1] * meta_solar_abs_mult if initial_sol_abs[index1]
      puts("The value of index1 is #{index1}, the initial value is #{initial_sol_abs[index1]}, and the desired value is #{desired_sol_abs[index1]}")
    end
    puts("Desired Solar Absorptance: #{desired_sol_abs}")
    puts("Initial Thermal Mass: #{initial_thm_mass}")
    initial_thm_mass.each_index do |index1|
      desired_thm_mass[index1] = Array.new
      initial_thm_mass[index1].each_index do |index2|
        desired_thm_mass[index1][index2] = initial_thm_mass[index1][index2] * meta_thermal_mass_mult if initial_thm_mass[index1][index2]
        puts("The value of index1 is #{index1}, the value of index2 is #{index2}, the initial value is #{initial_thm_mass[index1][index2]}, and the desired value is #{desired_thm_mass[index1][index2]}")
      end
    end
    puts("Desired Thermal Mass: #{desired_thm_mass}")

    runner.registerInfo("Successfully reached the measure")

    measure.run(model, runner, argument_map)

    runner.registerInfo("Successfully exited the measure")

    exterior_surface_array = []
    construction_array = []
    surface_array.each do |surface|
      if surface.outsideBoundaryCondition == "Outdoors" and surface.surfaceType == "Wall"
        exterior_surface_array << surface
        exterior_surface_const = surface.construction.get
        unless construction_array.include?(exterior_surface_const)
          construction_array << exterior_surface_const.to_Construction.get
        end
      end
    end

    final_layers = Array.new
    final_r_val = Array.new
    final_sol_abs = Array.new
    final_thm_mass = Array.new
    construction_array.each_with_index do |construction, con_index|
      final_layers[con_index] = construction.layers
      final_sol_abs[con_index] = construction.layers[0].to_StandardOpaqueMaterial.get.solarAbsorptance
      final_r_val[con_index] = Array.new
      final_thm_mass[con_index] = Array.new
      final_layers[con_index].each_with_index do |layer, lay_index|
        final_r_val[con_index][lay_index] = layer.to_OpaqueMaterial.get.thermalResistance
        final_thm_mass[con_index][lay_index] = layer.to_StandardOpaqueMaterial.get.density if layer.to_StandardOpaqueMaterial.is_initialized
      end
    end

    puts("Final R-Value: #{final_r_val}")
    puts("Final Solar Absorptance: #{final_sol_abs}")
    puts("Final Thermal Mass: #{final_thm_mass}")

    result = runner.result
    puts "Begin Runner:"
    show_output(result) #this displays the output when you run the test
    puts "End Runner"

    construction_array.each_with_index do |cons, cons_index|
      assert(final_layers[cons_index].size == initial_layers[cons_index].size, "Construction '#{cons.name.to_s}' previously had #{initial_layers[cons_index].size} surfaces, but now only has #{final_layers[cons_index].size}")
      final_layers[cons_index].each_with_index do |layer, layer_index|
        assert_in_epsilon(final_r_val[cons_index][layer_index]/initial_r_val[cons_index][layer_index], meta_r_value_mult, e=0.001, "R-Value multiplier for layer '#{layer.name.to_s}' was set to #{meta_r_value_mult} but appears to be #{final_r_val[cons_index][layer_index]/initial_r_val[cons_index][layer_index]}") if initial_r_val[cons_index][layer_index]
        assert_in_epsilon(final_thm_mass[cons_index][layer_index]/initial_thm_mass[cons_index][layer_index], meta_thermal_mass_mult, e=0.001, "Thermal mass multiplier for layer '#{layer.name.to_s}' was set to #{meta_thermal_mass_mult} but appears to be #{final_thm_mass[cons_index][layer_index]/initial_thm_mass[cons_index][layer_index]}") if initial_thm_mass[cons_index][layer_index] && initial_thm_mass[cons_index][layer_index] != 0
        if layer_index == 0
          assert_in_epsilon(final_sol_abs[cons_index], [initial_sol_abs[cons_index] * meta_solar_abs_mult, 1].min, e=0.001, "Solar Absorptance multiplier for layer '#{layer.name.to_s}' was set to #{meta_solar_abs_mult} but appears to be #{final_sol_abs[cons_index]/initial_sol_abs[cons_index]}") if initial_sol_abs[cons_index]
        end
      end
    end

    assert(result.value.valueName == "Success")

  end
end