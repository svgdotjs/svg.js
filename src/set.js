SVG.Set = function() {
  this.children = []
}

SVG.extend(SVG.Set, {
  // Add element to set
  add: function(element) {
    this.children.push(element)

    return this
  }
  // Remove element from set
, remove: function(element) {
    var i = this.children.indexOf(element)
    
    if (i > -1)
      this.children.splice(i, 1)

    return this
  }
  // Move all children
, move: function(x, y) {
    return this.x(x).y(y)
  }

})

// Create method aliases
;['attr'].forEach(function(method) {

  SVG.Set.prototype[method] = function() {
    for (var i = 0, il = this.children.length; i < il; i++)
      this.children[i][method](arguments)

  }

})