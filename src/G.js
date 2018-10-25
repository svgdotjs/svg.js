SVG.G = SVG.invent({
  // Initialize node
  create: 'g',

  // Inherit from
  inherit: SVG.Container,

  // Add class methods
  extend: {
  },

  // Add parent method
  construct: {
    // Create a group element
    group: function () {
      return this.put(new SVG.G())
    }
  }
})
