// Take two path array that don't have the same commands (which mean that they
// cannot be morphed in one another) and return 2 equivalent path array (meaning
// that they produce the same shape as the passed path array) that have the
// same commands (moveto and curveto)
//
// Algorithm used:
// First, convert every path segment of the two passed paths into equivalent cubic Bezier curves.
// Then, calculate the positions relative to the total length of the path of the endpoint of all those cubic Bezier curves.
// After that, split the Bezier curves of the source at the positions that the destination have that are not common to the source and vice versa.
// Finally, make the source and destination have the same number of subpaths.
SVG.utils.makePathsMorphable = function (sourcePathArray, destinationPathArray) {
  var source, sourcePositions, sourcePositionsToSplitAt
    , destination, destinationPositions, destinationPositionsToSplitAt
    , i, il, j, jl
    , s, d
    , sourceSubpath, destinationSubpath, lastSegPt

  // Convert every path segments into equivalent cubic Bezier curves
  source = cubicSuperPath(sourcePathArray)
  destination = cubicSuperPath(destinationPathArray)

  // The positions relative to the total length of the path is calculated for the endpoint of all those cubic bezier curves
  sourcePositions = cspPositions(source)
  destinationPositions = cspPositions(destination)

  // Find the positions that the destination have that are not in the source and vice versa
  sourcePositionsToSplitAt = []
  destinationPositionsToSplitAt = []
  i = 0, il = sourcePositions.length
  j = 0, jl = destinationPositions.length
  while(i < il && j < jl) {
    // Test if the two values are equal taking into account the imprecision of floating point number
    if (Math.abs(sourcePositions[i] - destinationPositions[j]) < 0.000001) {
      i++
      j++
    } else if(sourcePositions[i] > destinationPositions[j]){
      sourcePositionsToSplitAt.push(destinationPositions[j++])
    } else {
      destinationPositionsToSplitAt.push(sourcePositions[i++])
    }
  }
  // If there are still some destination positions left, they all are not in the source and vice versa
  sourcePositionsToSplitAt = sourcePositionsToSplitAt.concat(destinationPositions.slice(j))
  destinationPositionsToSplitAt = destinationPositionsToSplitAt.concat(sourcePositions.slice(i))

  // Split the source and the destination at the positions they don't have in common
  cspSplitAtPositions(source, sourcePositions, sourcePositionsToSplitAt)
  cspSplitAtPositions(destination, destinationPositions, destinationPositionsToSplitAt)


  // Break paths so that corresponding subpaths have an equal number of segments
  s = source, source = [], sourceSubpath = s[i = 0]
  d = destination, destination = [], destinationSubpath = d[j = 0]
  while (sourceSubpath && destinationSubpath) {
    // Push REFERENCES to the current subpath arrays in their respective array
    source.push(sourceSubpath)
    destination.push(destinationSubpath)

    il = sourceSubpath.length
    jl = destinationSubpath.length

    // If the current subpath of the source and the current subpath of the destination don't
    // have the same length, that mean that the biggest of the two must be split in two
    if(il > jl) {
      lastSegPt = sourceSubpath[jl-1]
      // Perform the split using splice that change the content of the array by removing elements and returning them in an array
      sourceSubpath = sourceSubpath.splice(jl)
      sourceSubpath.unshift(lastSegPt) // The last segment point is duplicated since these two segments must be joined together
      destinationSubpath = d[++j] // This subpath has been accounted for, past to the next
    } else if(il < jl) {
      lastSegPt = destinationSubpath[il-1]
      destinationSubpath = destinationSubpath.splice(il)
      destinationSubpath.unshift(lastSegPt)
      sourceSubpath = s[++i]
    } else {
      sourceSubpath = s[++i]
      destinationSubpath = d[++j]
    }
  }

  // Convert in path array and return
  return [uncubicSuperPath(source), uncubicSuperPath(destination)]
}






// This function converts every segment of a path array into equivalent cubic Bezier curves
// and return the results in a 3 dimensional array that have the following hierarchy:
// Cubic super path:  [                                           ]
// Segments:           [                                     ] ...
// Segment points:      [SVG.Point, SVG.Point, SVG.Point] ...
//
// A segment point is a point with the two control points that are attached to it:
// [First control point, Point, Second control point]
//
// If the passed path array cannot be converted in a cubic super path, this function return an empty array.
function cubicSuperPath(pathArray) {
  pathArray = new SVG.PathArray(pathArray)

  var cubicSP = []
    , subpath = null
    , subpathStartPt = null
    , lastPt = null
    , lastCtrlPt = null
    , i, il, cmd = null, params, lastCmd
    , start, control, end
    , arcSegPoints, segPt

  for (i = 0, il = pathArray.value.length; i < il; i++) {
    lastCmd = cmd
    cmd = pathArray.value[i][0]
    params = pathArray.value[i].slice(1)

    switch (cmd) {
      case 'M': // moveto
        // Parameters: x y
        if (lastPt) {
          subpath.push([lastCtrlPt, lastPt, lastPt.clone()])
        }
        subpath = []
        cubicSP.push(subpath) // Push a reference to the current subpath array in the cubic super path array
        subpathStartPt = new SVG.Point(params)
        lastPt = subpathStartPt.clone()
        lastCtrlPt = subpathStartPt.clone()
        break

      case 'L': // lineto
        // Parameters: x y
        subpath.push([lastCtrlPt, lastPt, lastPt.clone()])
        lastPt = new SVG.Point(params)
        lastCtrlPt = lastPt.clone()
        break

      case 'H': // horizontal lineto
        // Parameters: x
        subpath.push([lastCtrlPt, lastPt, lastPt.clone()])
        lastPt = new SVG.Point(params[0], lastPt.y)
        lastCtrlPt = lastPt.clone()
        break

      case 'V': // vertical lineto
        // Parameters: y
        subpath.push([lastCtrlPt, lastPt, lastPt.clone()])
        lastPt = new SVG.Point(lastPt.x, params[0])
        lastCtrlPt = lastPt.clone()
        break

      case 'C': // curveto
        // Parameters: x1 y1 x2 y2 x y
        subpath.push([lastCtrlPt, lastPt, new SVG.Point(params.slice(0,2))])
        lastPt = new SVG.Point(params.slice(4,6))
        lastCtrlPt = new SVG.Point(params.slice(2,4))
        break

      case 'S': // shorthand/smooth curveto
        // Parameters: x2 y2 x y
        // For this version of curveto, the first control point is the reflection of the second control point on the previous command relative to the current point
        // If the previous command is not a curveto command, then the first control point is the same as the current point
        if(lastCmd === 'C' || lastCmd === 'S') {
          subpath.push([lastCtrlPt, lastPt, lastPt.times(2).minus(lastCtrlPt)])
        } else {
          subpath.push([lastCtrlPt, lastPt, lastPt.clone()])
        }
        lastPt = new SVG.Point(params.slice(2,4))
        lastCtrlPt = new SVG.Point(params.slice(0,2))
        break

      case 'Q': // quadratic Bezier curveto
        // Parameters: x1 y1 x y
        // For an explanation of the method used, see: https://pomax.github.io/bezierinfo/#reordering
        start = lastPt
        control = new SVG.Point(params.slice(0,2))
        end = new SVG.Point(params.slice(2,4))

        subpath.push([lastCtrlPt, start, start.times(1/3).plus(control.times(2/3))])
        lastPt = end
        lastCtrlPt = control.times(2/3).plus(end.times(1/3))
        break

      case 'T': // shorthand/smooth quadratic Bézier curveto
        // Parameters: x y
        // For this version of quadratic Bézier curveto, the control point is the reflection of the control point on the previous command relative to the current point
        // If the previous command is not a quadratic Bézier curveto command, then the control point is the same as the current point
        start = lastPt
        if(lastCmd === 'Q' || lastCmd === 'T') {
          control = start.times(2).minus(control)
        } else {
          control = start
        }
        end = new SVG.Point(params.slice(0,2))

        subpath.push([lastCtrlPt, start, start.times(1/3).plus(control.times(2/3))])
        lastPt = end
        lastCtrlPt = control.times(2/3).plus(end.times(1/3))
        break

      case 'A': // elliptical arc
        // Parameters: rx ry x-axis-rotation large-arc-flag sweep-flag x y
        arcSegPoints = arcToPath(lastPt, params)
        arcSegPoints[0][0] = lastCtrlPt
        segPt = arcSegPoints.pop()
        lastPt = segPt[1]
        lastCtrlPt = segPt[0]
        Array.prototype.push.apply(subpath, arcSegPoints)
        break

      case 'Z': // closepath
        // Parameters: none
        subpath.push([lastCtrlPt, lastPt, lastPt.clone()])
        // Close the path only if it is not already closed
        if(lastPt.x != subpathStartPt.x && lastPt.y != subpathStartPt.y) {
          lastPt = subpathStartPt
          lastCtrlPt = subpathStartPt.clone()
        } else {
          lastPt = null
          lastCtrlPt = null
        }
        break
    }
  }

  // Push final segment point if any
  if(lastPt) {
    subpath.push([lastCtrlPt, lastPt, lastPt.clone()])
  }

  return cubicSP
}


// This function convert a cubic super path into a path array
function uncubicSuperPath (cubicSP) {
  var i, il, j, jl, array = [], pathArray = new SVG.PathArray, subpath

  for (i = 0, il = cubicSP.length; i < il; i++) {
    subpath = cubicSP[i]

    if (subpath.length) {
      array.push(['M'].concat(subpath[0][1].toArray()))

      for (j = 1, jl = subpath.length; j < jl; j++) {
        array.push(['C'].concat(subpath[j-1][2].toArray(), subpath[j][0].toArray(), subpath[j][1].toArray()))
      }
    }
  }

  // Directly modify the value of a path array, this is done this way for performance
  pathArray.value = array
  return pathArray
}

// Convert an arc segment into equivalent cubic Bezier curves
// Depending on the arc, up to 4 curves might be used to represent it since a
// curve gives a good approximation for only a quarter of an ellipse
// The curves are returned as an array of segment points:
// [ [SVG.Point, SVG.Point, SVG.Point] ... ]
function arcToPath(lastPt, params) {
    // Parameters extraction, handle out-of-range parameters as specified in the SVG spec
    // See: https://www.w3.org/TR/SVG11/implnote.html#ArcOutOfRangeParameters
    var rx = Math.abs(params[0]), ry = Math.abs(params[1]), xAxisRotation = params[2] % 360
      , largeArcFlag = params[3], sweepFlag = params[4], x2  = params[5], y2 = params[6]
      , A = lastPt, B = new SVG.Point(x2, y2)
      , primedCoord, lambda, mat, k, c, cSquare, t, O, OA, OB, tetaStart, tetaEnd
      , deltaTeta, nbSectors, f, arcSegPoints, angle, sinAngle, cosAngle, pt, i, il

    // Ensure radii are non-zero
    if(rx === 0 || ry === 0 || (A.x === B.x && A.y === B.y)) {
      // treat this arc as a straight line segment
      return [[A, A.clone(), A.clone()], [B, B.clone(), B.clone()]]
    }

    // Ensure radii are large enough using the algorithm provided in the SVG spec
    // See: https://www.w3.org/TR/SVG11/implnote.html#ArcCorrectionOutOfRangeRadii
    primedCoord = A.minus(B).divide(2).transform(new SVG.Matrix().rotate(xAxisRotation))
    lambda = (primedCoord.x * primedCoord.x) / (rx * rx) + (primedCoord.y * primedCoord.y) / (ry * ry)
    if(lambda > 1) {
      lambda = Math.sqrt(lambda)
      rx = lambda*rx
      ry = lambda*ry
    }

    // To simplify calculations, we make the arc part of a unit circle (rayon is 1) instead of an ellipse
    mat = new SVG.Matrix().rotate(xAxisRotation).scale(1/rx, 1/ry).rotate(-xAxisRotation)
    A = A.transform(mat)
    B = B.transform(mat)

    // Calculate the horizontal and vertical distance between the initial and final point of the arc
    k = [B.x-A.x, B.y-A.y]

    // Find the length of the chord formed by A and B
    cSquare = k[0]*k[0] + k[1]*k[1]
    c = Math.sqrt(cSquare)

    // Calculate the ratios of the horizontal and vertical distance on the length of the chord
    k[0] /= c
    k[1] /= c

    // Calculate the distance between the circle center and the chord midpoint
    // using this formula: t = sqrt(r^2 - c^2 / 4)
    // where t is the distance between the cirle center and the chord midpoint,
    //       r is the rayon of the circle and c is the chord length
    // From: http://www.ajdesigner.com/phpcircle/circle_segment_chord_t.php
    // Because of the imprecision of floating point numbers, cSquare might end
    // up being slightly above 4 which would result in a negative radicand
    // To prevent that, a test is made before computing the square root
    t = (cSquare < 4) ? Math.sqrt(1 - cSquare/4) : 0

    // For most situations, there are actually two different ellipses that
    // satisfy the constraints imposed by the points A and B, the radii rx and ry,
    // and the xAxisRotation
    // When the flags largeArcFlag and sweepFlag are equal, it means that the
    // second ellipse is used as a solution
    // See: https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
    if(largeArcFlag === sweepFlag) {
        t *= -1
    }

    // Calculate the coordinates of the center of the circle from the midpoint of the chord
    // This is done by multiplying the ratios calculated previously by the distance between
    // the circle center and the chord midpoint and using these values to go from the midpoint
    // to the center of the circle
    // The negative of the vertical distance ratio is used to modify the x coordinate while
    // the horizontal distance ratio is used to modify the y coordinate
    // That is because the center of the circle is perpendicular to the chord and perpendicular
    // lines are negative reciprocals
    O = new SVG.Point((B.x+A.x)/2 + t*-k[1], (B.y+A.y)/2 + t*k[0])
    // Move the center of the circle at the origin
    OA = A.minus(O)
    OB = B.minus(O)

    // Calculate the start and end angle
    tetaStart = Math.acos(OA.x/OA.norm())
    if (OA.y < 0) {
      tetaStart *= -1
    }
    tetaEnd = Math.acos(OB.x/OB.norm())
    if (OB.y < 0) {
      tetaEnd *= -1
    }

    // If sweep-flag is '1', then the arc will be drawn in a "positive-angle" direction,
    // make sure that the end angle is above the start angle
    if (sweepFlag && tetaStart > tetaEnd) {
      tetaEnd += 2*Math.PI
    }
    // If sweep-flag is '0', then the arc will be drawn in a "negative-angle" direction,
    // make sure that the end angle is below the start angle
    if (!sweepFlag && tetaStart < tetaEnd) {
      tetaEnd -= 2*Math.PI
    }

    // Find the number of Bezier curves that are required to represent the arc
    // A cubic Bezier curve gives a good enough approximation when representing at most a quarter of a circle
    nbSectors = Math.ceil(Math.abs(tetaStart-tetaEnd) * 2/Math.PI)

    // Calculate the coordinates of the points of all the Bezier curves required to represent the arc
    // For an in-depth explanation of this part see: http://pomax.github.io/bezierinfo/#circles_cubic
    arcSegPoints = []
    angle = tetaStart
    deltaTeta = (tetaEnd-tetaStart)/nbSectors
    f = 4*Math.tan(deltaTeta/4)/3
    for (i = 0; i <= nbSectors; i++) { // The <= is because a Bezier curve have a start and a endpoint
      cosAngle = Math.cos(angle)
      sinAngle = Math.sin(angle)

      pt = O.plus(cosAngle, sinAngle)
      arcSegPoints[i] = [pt.plus(+f*sinAngle, -f*cosAngle), pt, pt.plus(-f*sinAngle, +f*cosAngle)]

      angle += deltaTeta
    }

    // Remove the first control point of the first segment point and remove the second control point of the last segment point
    // These two control points are not used in the approximation of the arc, that is why they are removed
    arcSegPoints[0][0] = arcSegPoints[0][1].clone()
    arcSegPoints[arcSegPoints.length-1][2] = arcSegPoints[arcSegPoints.length-1][1].clone()

    // Revert the transformation that was applied to make the arc part of a unit circle instead of an ellipse
    mat = new SVG.Matrix().rotate(xAxisRotation).scale(rx, ry).rotate(-xAxisRotation)
    for (i = 0, il = arcSegPoints.length; i < il; i++) {
      arcSegPoints[i][0] = arcSegPoints[i][0].transform(mat)
      arcSegPoints[i][1] = arcSegPoints[i][1].transform(mat)
      arcSegPoints[i][2] = arcSegPoints[i][2].transform(mat)
    }

    return arcSegPoints
}


// Use de Casteljau's algorithm to split a cubic Bezier curve
// For a description of the algorithm, see: https://pomax.github.io/bezierinfo/#decasteljau
// Return an array of 3 segment points
function cspSegSplit(segPt1, segPt2, t) {
  segPt1 = [segPt1[0].clone(), segPt1[1].clone(), segPt1[2].clone()]
  segPt2 = [segPt2[0].clone(), segPt2[1].clone(), segPt2[2].clone()]

  var m1 = segPt1[1].morph(segPt1[2]).at(t)
    , m2 = segPt1[2].morph(segPt2[0]).at(t)
    , m3 = segPt2[0].morph(segPt2[1]).at(t)
    , m4 = m1.morph(m2).at(t)
    , m5 = m2.morph(m3).at(t)
    , m = m4.morph(m5).at(t)

  return [[segPt1[0], segPt1[1], m1], [m4, m, m5], [m3, segPt2[1], segPt2[2]]]
}


// Find the length of a cubic Bezier curve using the built-in method getTotalLength of SVGPathElement
// For more info, see: https://www.w3.org/TR/SVG11/paths.html#InterfaceSVGPathElement
function cspSegLength(segPt1, segPt2) {
  var path = document.createElementNS(SVG.ns, "path")
    , d = ['M', segPt1[1].toArray(), 'C', segPt1[2].toArray(), segPt2[0].toArray(), segPt2[1].toArray()].join(' ')

  path.setAttribute('d', d)

  return path.getTotalLength()
}


// Find the length of all the cubic Bezier curves of a cubic super path and return
// the results in a 2 dimensional array that have the following hierarchy:
// Cubic super path lengths:  [                ]
// Segments lengths:           [          ] ...
// Cubic Bezier curves length:  Number ...
//
// On the returned array, the property total is set to the sum of all the lengths
function cspLengths(cubicSP) {
  var total = 0
    , subpath, lengths = [], lengthsSubpath, length
    , i, il, j, jl

  for (i = 0, il = cubicSP.length; i < il; i++) {
    subpath = cubicSP[i]
    lengthsSubpath = []
    lengths[i] = lengthsSubpath // Save a reference to the current subpath lengths array in the cubic super path lengths array

    for (j = 1, jl = subpath.length; j < jl; j++) {
      length = cspSegLength(subpath[j-1], subpath[j])
      lengthsSubpath[j-1] = length
      total += length
    }
  }

  lengths.total = total
  return lengths
}


// Split a cubic Bezier curve at the given length ratio
// Return an array of 3 segment points
function cspSegSplitAtLengthRatio(segPt1, segPt2, lengthRatio) {
  var t = 1.0
    , tdiv = t
    , currentLength = cspSegLength(segPt1, segPt2)
    , targetLength = lengthRatio * currentLength
    , diff = currentLength - targetLength
    , split = cspSegSplit(segPt1, segPt2, t)
    , maxNbLoops = 4096 // For not getting stuck in an infinite loop

  while (Math.abs(diff) > 0.001 && maxNbLoops--) {
    tdiv /= 2
    t += (diff < 0) ? tdiv : -tdiv
    split = cspSegSplit(segPt1, segPt2, t)
    currentLength = cspSegLength(split[0], split[1])
    diff = currentLength - targetLength
  }

  return split
}



// Find the position relative to the total length of the endpoint of all the cubic Bezier curves
// of a cubic super path and return the results in a 1 dimensional array
function cspPositions(cubicSP) {
  var lengths = cspLengths(cubicSP), total = lengths.total
    , pos = 0, positions = []
    , i, il, j, jl

  for (i = 0, il = lengths.length; i < il; i++) {
    for (j = 0, jl = lengths[i].length; j < jl; j++) {
      pos += lengths[i][j] / total
      positions.push(pos)
    }
  }

  return positions
}

// Split the passed cubic super path at the specified positions and return the results as a new cubic super path
// For performance reasons, the positions of the passed cubic super path must also be provided
function cspSplitAtPositions(cubicSP, positions, positionsToSplitAt){
  var subpath, newSubpath
    , accumNbPositions = 0, segPt, lengthRatio, split, pos, prevPos
    , i, il, j, jl // indexes on the cubicSP array
    , k = 0 // index on the positions array
    , l = 0, ll = positionsToSplitAt.length

  for (i = 0, il = cubicSP.length; i < il && l < ll; i++) {
    subpath = cubicSP[i]
    // The positions are only for the endpoints of the cubic Bezier curves, so
    // a subpath need at least 2 segment points for a position to be on it
    if(subpath.length < 2) {continue}
    // Test if there are splits to be performed on the current subpath
    if(positionsToSplitAt[l] < positions[accumNbPositions + subpath.length-2]) {
      k = accumNbPositions
      newSubpath = []
      cubicSP[i] = newSubpath // Save a reference to the new current subpath array in the cubic super path array
      pos = positions[k-1] || 0

      // Recopy the content of the current subpath, performing splits where necessary
      newSubpath.push(subpath[0])
      for (j = 1, jl = subpath.length; j < jl; j++) {
        prevPos = pos
        pos = positions[k++]
        segPt = subpath[j]

        while(l < ll && positionsToSplitAt[l] < pos) {
          lengthRatio = (positionsToSplitAt[l] - prevPos) / (pos - prevPos)
          split = cspSegSplitAtLengthRatio(newSubpath[newSubpath.length-1], segPt, lengthRatio)
          newSubpath[newSubpath.length-1] = split[0]
          newSubpath.push(split[1])
          segPt = split[2]
          prevPos = positionsToSplitAt[l++]
        }

        newSubpath.push(segPt)
      }
    }

    // -1 because positions are only for endpoints of Bezier curves
    accumNbPositions += subpath.length - 1
  }
}
