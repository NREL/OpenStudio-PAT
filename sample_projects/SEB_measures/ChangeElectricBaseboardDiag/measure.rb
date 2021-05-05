# see the URL below for information on how to write OpenStudio measures
# http://nrel.github.io/OpenStudio-user-documentation/measures/measure_writing_guide/

# start the measure
class ChangeElectricBaseboardDiag < OpenStudio::Ruleset::ModelUserScript

  # human readable name
  def name
    return "Change Electric Baseboard"
  end

  # human readable description
  def description
    return "Change Electric Baseboard"
  end

  # human readable description of modeling approach
  def modeler_description
    return "Change Electric Baseboard"
  end

  # define the arguments that the user will input
  def arguments(model)
    args = OpenStudio::Ruleset::OSArgumentVector.new

    #make integer arg to run measure [1 is run, 0 is no run]
    run_measure = OpenStudio::Ruleset::OSArgument::makeIntegerArgument("run_measure",true)
    run_measure.setDisplayName("Run Measure")
    run_measure.setDescription("integer argument to run measure [1 is run, 0 is no run]")
    run_measure.setDefaultValue(1)
    args << run_measure
    
    # efficiency
    base_eff = OpenStudio::Ruleset::OSArgument::makeDoubleArgument("base_eff",true)
    base_eff.setDisplayName("efficiency")
    base_eff.setDefaultValue(1.0)
    args << base_eff
    
    #capacity
    nom_cap = OpenStudio::Ruleset::OSArgument::makeDoubleArgument("nom_cap",true)
    nom_cap.setDisplayName("Nominal Capacity (W)")
    nom_cap.setDefaultValue(1500)
    args << nom_cap

    return args
  end

  # define what happens when the measure is run
  def run(model, runner, user_arguments)
    super(model, runner, user_arguments)

    # use the built-in error checking
    if !runner.validateUserArguments(arguments(model), user_arguments)
      return false
    end

    # Return N/A if not selected to run
    run_measure = runner.getIntegerArgumentValue("run_measure",user_arguments)
    if run_measure == 0
      runner.registerAsNotApplicable("Run Measure set to #{run_measure}.")
      return true     
    end
    
    # assign the user inputs to variables
    base_eff = runner.getDoubleArgumentValue("base_eff",user_arguments)
    nom_cap = runner.getDoubleArgumentValue("nom_cap",user_arguments)

    model.getZoneHVACBaseboardConvectiveElectrics.each do |zone|
      #base_eff = OpenStudio::Double.new(base_eff)
      #nom_cap = OpenStudio::OptionalDouble.new(nom_cap)
      zone.setEfficiency(base_eff)
      zone.setNominalCapacity(nom_cap)
      runner.registerInfo("Changing the base_eff to #{zone.efficiency} ")
      runner.registerInfo("Changing the nominal capacity to #{zone.nominalCapacity} ")
      
    end

    return true

  end
  
end

# register the measure to be used by the application
ChangeElectricBaseboardDiag.new.registerWithApplication
