SVG.Container = SVG.invent({
  // Initialize node
  create: function (node) {
    this.constructor.call(this, node)
  },

  // Inherit from
  inherit: SVG.Parent
})
