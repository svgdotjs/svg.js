
SVG.Shape = SVG.invent({
  // Initialize node
  create: function (node) {
    this.constructor(node)
  },

  // Inherit from
  inherit: SVG.Element
})
