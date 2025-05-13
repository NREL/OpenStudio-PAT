module OsLib_HelperMethods

  # populate choice argument from model objects
  def OsLib_HelperMethods.populateChoiceArgFromModelObjects(model,modelObject_args_hash, includeBuilding = nil)

    # populate choice argument for constructions that are applied to surfaces in the model
    modelObject_handles = OpenStudio::StringVector.new
    modelObject_display_names = OpenStudio::StringVector.new

    # looping through sorted hash of constructions
    modelObject_args_hash.sort.map do |key,value|
      modelObject_handles << value.handle.to_s
      modelObject_display_names << key
    end

    if not includeBuilding == nil
      #add building to string vector with space type
      building = model.getBuilding
      modelObject_handles << building.handle.to_s
      modelObject_display_names << includeBuilding
    end

    result = {"modelObject_handles" => modelObject_handles, "modelObject_display_names" => modelObject_display_names}
    return result

  end #end of OsLib_HelperMethods.populateChoiceArgFromModelObjects

  # check choice argument made from model objects
  def OsLib_HelperMethods.checkChoiceArgFromModelObjects(object, variableName,to_ObjectType, runner,user_arguments)

    apply_to_building = false
    modelObject = nil
    if object.empty?
      handle = runner.getStringArgumentValue(variableName,user_arguments)
      if handle.empty?
        runner.registerError("No #{variableName} was chosen.") # this logic makes this not work on an optional model object argument
      else
        runner.registerError("The selected #{variableName} with handle '#{handle}' was not found in the model. It may have been removed by another measure.")
      end
      return false
    else
      if not eval("object.get.#{to_ObjectType}").empty?
        modelObject = eval("object.get.#{to_ObjectType}").get
      elsif not object.get.to_Building.empty?
        apply_to_building = true
      else
        runner.registerError("Script Error - argument not showing up as #{variableName}.")
        return false
      end
    end  #end of if construction.empty?

    result = {"modelObject" => modelObject, "apply_to_building" => apply_to_building}

  end #end of OsLib_HelperMethods.checkChoiceArgFromModelObjects

  # check choice argument made from model objects
  def OsLib_HelperMethods.checkOptionalChoiceArgFromModelObjects(object, variableName,to_ObjectType, runner, user_arguments)

    apply_to_building = false
    modelObject = nil
    if object.empty?
      handle = runner.getOptionalStringArgumentValue(variableName,user_arguments)
      if handle.empty?
        # do nothing, this is a valid option
        modelObject = nil
        apply_to_building = false
      else
        runner.registerError("The selected #{variableName} with handle '#{handle}' was not found in the model. It may have been removed by another measure.")
        return false
      end
    else
      if not eval("object.get.#{to_ObjectType}").empty?
        modelObject = eval("object.get.#{to_ObjectType}").get
      elsif not object.get.to_Building.empty?
        apply_to_building = true
      else
        runner.registerError("Script Error - argument not showing up as #{variableName}.")
        return false
      end
    end  #end of if construction.empty?

    result = {"modelObject" => modelObject, "apply_to_building" => apply_to_building}

  end #end of OsLib_HelperMethods.checkChoiceArgFromModelObjects

  # check value of double arguments
  def OsLib_HelperMethods.checkDoubleArguments(runner, min, max, argumentHash)

    #error flag
    error = false

    argumentHash.each do |display, argument|
      if not min == nil
        if argument < min
          runner.registerError("Please enter value between #{min} and #{max} for #{display}.") # add in argument display name
          error = true
        end
      end
      if not max == nil
        if argument > max
          runner.registerError("Please enter value between #{min} and #{max} for #{display}.") # add in argument display name
          error = true
        end
      end
    end # end of argumentArray.each do

    # check for any errors
    if error
      return false
    else
      return true
    end

  end #end of OsLib_HelperMethods.checkDoubleArguments

  # OpenStudio has built in toNeatString method
  # OpenStudio::toNeatString(double,2,true)# double,decimals, show commas

  # OpenStudio has built in helper for unit conversion. That can be done using OpenStudio::convert() as shown below.
  # OpenStudio::convert(double,"from unit string","to unit string").get

end
