SVG.Set = function() {
  /* set initial state */
  this.clear()
}

// Set FX class
SVG.SetFX = function(set) {
  /* store reference to set */
  this.set = set
}

//
SVG.extend(SVG.Set, {
  // Add element to set
  add: function() {
    var i, il, elements = [].slice.call(arguments)

    for (i = 0, il = elements.length; i < il; i++)
      this.members.push(elements[i])
    
    return this
  }
  // Remove element from set
, remove: function(element) {
    var i = this.members.indexOf(element)
    
    /* remove given child */
    if (i > -1)
      this.members.splice(i, 1)

    return this
  }
  // Iterate over all members
, each: function(block) {
    for (var i = 0, il = this.members.length; i < il; i++)
      block.apply(this.members[i], [i, this.members])

    return this
  }
  // Restore to defaults
, clear: function() {
    /* initialize store */
    this.members = []

    return this
  }
  // Default value
, valueOf: function() {
    return this.members
  }

})



// Alias methods
SVG.Set.inherit = function() {
  var m
    , methods = []
  
  /* gather shape methods */
  for(var m in SVG.Shape.prototype)
    if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
      methods.push(m)

  /* apply shape aliasses */
  methods.forEach(function(method) {
    SVG.Set.prototype[method] = function() {
      for (var i = 0, il = this.members.length; i < il; i++)
        if (this.members[i] && typeof this.members[i][method] == 'function')
          this.members[i][method].apply(this.members[i], arguments)

      return method == 'animate' ? (this.fx || (this.fx = new SVG.SetFX(this))) : this
    }
  })

  /* clear methods for the next round */
  methods = []

  /* gather fx methods */
  for(var m in SVG.FX.prototype)
    if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.SetFX.prototype[m] != 'function')
      methods.push(m)

  /* apply fx aliasses */
  methods.forEach(function(method) {
    SVG.SetFX.prototype[method] = function() {
      for (var i = 0, il = this.set.members.length; i < il; i++)
        this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)

      return this
    }
  })
}

//
SVG.extend(SVG.Container, {
  // Create a new set
  set: function() {
    return new SVG.Set
  }

})



