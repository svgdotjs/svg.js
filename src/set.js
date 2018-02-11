SVG.Set = SVG.invent({
  create: function (members) {
    this.length = members.length
    for (var i = members.length - 1; i >= 0; --i) {
      this[i] = members[i]
    }
  }
  // Add class methods
, extend: {
    // Add element to set
    add: function() {
      Array.prototype.push.apply(this, arguments)
      return this
    }
    // Remove element from set
  , remove: function(element) {
      var i = this.index(element)

      // remove given child
      if (i > -1)
        Array.prototype.splice.call(this, i, 1)

      return this
    }
  , each: function (block, value) {
      if (typeof block == 'function') {
        for (var i = 0, il = this.members.length; i < il; i++) {
          block.call(this[i], i, this)
        }
      } else {
        for (var i = 0, il = this.members.length; i < il; i++) {
          this[i][block].call(this[i], value)
        }
      }
    }
    // Restore to defaults
  , clear: function() {
      while(this.length--) {
        delete this[this.length-1]
      }
      return this
    }
    // Checks if a given element is present in set
  , has: function(element) {
      return this.index(element) >= 0
    }
    // retuns index of given element in set
  , index: function(element) {
      return Array.prototype.indexOf(this, element)
    }
    // Get member at given index
  , get: function(i) {
      return this[i]
    }
    // Get first member
  , first: function() {
      return this.get(0)
    }
    // Get last member
  , last: function() {
      return this.get(this.length - 1)
    }
    // Default value
  , valueOf: function() {
      return Array.prototype.slice.call(this)
    }
    // Get the bounding box of all members included or empty box if set has no items
  , bbox: function(){
      // return an empty box of there are no members
      if (this.length == 0)
        return new SVG.Box()

      // get the first rbox and update the target bbox
      var rbox = this[0].rbox(this[0].doc())

      this.each(function() {
        // user rbox for correct position and visual representation
        rbox = rbox.merge(this.rbox(this.doc()))
      })

      return rbox
    }
  }

  // Add parent method
, construct: {
    // Create a new set
    set: function(members) {
      return new SVG.Set(members)
    }
  }
})
