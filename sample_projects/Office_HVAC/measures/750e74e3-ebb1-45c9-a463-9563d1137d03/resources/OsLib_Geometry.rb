module OsLib_Geometry

  # lower z value of vertices with starting value above x to new value of y
  def OsLib_Geometry.lowerSurfaceZvalue(surfaceArray, zValueTarget)

    counter = 0

    # loop over all surfaces
    surfaceArray.each do |surface|

      # create a new set of vertices
      newVertices = OpenStudio::Point3dVector.new

      # get the existing vertices for this interior partition
      vertices = surface.vertices
      flag = false
      vertices.each do |vertex|

        # initialize new vertex to old vertex
        x = vertex.x
        y = vertex.y
        z = vertex.z

        # if this z vertex is not on the z = 0 plane
        if z > zValueTarget
          z = zValueTarget
          flag = true
        end

        # add point to new vertices
        newVertices << OpenStudio::Point3d.new(x,y,z)
      end

      # set vertices to new vertices
      surface.setVertices(newVertices) #todo check if this was made, and issue warning if it was not. Could happen if resulting surface not planer.

      if flag then counter += 1 end

    end #end of surfaceArray.each do

    result = counter
    return result

  end


end
