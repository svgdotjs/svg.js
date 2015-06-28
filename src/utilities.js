SVG.utils = {
    // Map function
    map: function(array, block) {
    var i
      , il = array.length
      , result = []
    
    for (i = 0; i < il; i++)
      result.push(block(array[i]))
    
    return result
  }

  // Degrees to radians
, radians: function(d) {
    return d % 360 * Math.PI / 180
  }
  // Radians to degrees
, degrees: function(r) {
    return r * 180 / Math.PI % 360
  }
, filterSVGElements: function(p) {
    return [].filter.call(p, function(el){ return el instanceof SVGElement })
  }

}