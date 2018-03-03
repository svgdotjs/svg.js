SVG.Set = SVG.invent({
  create: function (members) {
    this.length = members.length
    for (var i = members.length - 1; i >= 0; --i) {
      this[i] = members[i]
    }
  },
  // Add class methods
  extend: {
    // Add element to set
    add: function () {
      Array.prototype.push.apply(this, arguments)
      return this
    },
    // Remove element from set
    remove: function (element) {
      var i = this.index(element)

      // remove given child
      if (i > -1) {
        Array.prototype.splice.call(this, i, 1)
      }

      return this
    },
    each: function (block) {
      for (var i = 0, il = this.members.length; i < il; i++) {
        block.call(this[i], i, this)
      }
    },
    // Restore to defaults
    clear: function () {
      while (this.length) {
        delete this[--this.length]
      }
      return this
    },
    // Checks if a given element is present in set
    has: function (element) {
      return this.index(element) >= 0
    },
    // retuns index of given element in set
    index: function (element) {
      return Array.prototype.indexOf(this, element)
    },
    // Get member at given index
    get: function (i) {
      return this[i]
    },
    // Get first member
    first: function () {
      return this[0]
    },
    // Get last member
    last: function () {
      return this[this.length - 1]
    },
    // Default value
    valueOf: function () {
      return this.slice()
    },
    // Get the bounding box of all members included or empty box if set has no items
    bbox: function () {
      // return an empty box of there are no members
      if (this.length === 0) {
        return new SVG.Box()
      }

      // get the first rbox and update the target bbox
      var rbox = this[0].rbox(this[0].doc())

      this.each(function () {
        // user rbox for correct position and visual representation
        rbox = rbox.merge(this.rbox(this.doc()))
      })

      return rbox
    }
  },

  // Add parent method
  construct: {
    // Create a new set
    set: function (members) {
      return new SVG.Set(members)
    }
  }
})

;['splice', 'push', 'pop', 'shift', 'unshift', 'forEach', 'reduce', 'indexOf', 'sort'].forEach(function (method) {
  SVG.Set.prototype[method] = Array.prototype[method]
})

;['map', 'filter', 'slice', 'concat'].forEach(function (method) {
  SVG.Set.prototype[method] = function () {
    return new SVG.Set(Array.prototype[method].apply(this.valueOf(), arguments))
  }
})

SVG.FX.Set = SVG.invent({
  // Initialize node
  create: function (set) {
    // store reference to set
    this.set = set
  }
})

// Alias methods
SVG.Set.inherit = function () {
  var methods = []
  var m

  // gather shape methods
  for (m in SVG.Shape.prototype) {
    if (typeof SVG.Shape.prototype[m] === 'function' && typeof SVG.Set.prototype[m] !== 'function') {
      methods.push(m)
    }
  }

  // apply shape aliasses
  methods.forEach(function (method) {
    SVG.Set.prototype[method] = function () {
      for (var i = 0, il = this.length; i < il; ++i) {
        if (this[i] && typeof this[i][method] === 'function') {
          this[i][method].apply(this[i], arguments)
        }
      }

      return method === 'animate' ? (this.fx || (this.fx = new SVG.FX.Set(this))) : this
    }
  })

  // clear methods for the next round
  methods = []

  // gather fx methods
  for (m in SVG.FX.prototype) {
    if (typeof SVG.FX.prototype[m] === 'function' && typeof SVG.FX.Set.prototype[m] !== 'function') {
      methods.push(m)
    }
  }

  // apply fx aliasses
  methods.forEach(function (method) {
    SVG.FX.Set.prototype[method] = function () {
      for (var i = 0, il = this.set.length; i < il; i++) {
        this.set[i].fx[method].apply(this.set[i].fx, arguments)
      }

      return this
    }
  })
}
