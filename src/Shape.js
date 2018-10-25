
SVG.Shape = SVG.invent({
  // Initialize node
  create: function (node) {
    SVG.Element.call(this, node)
  },

  // Inherit from
  inherit: SVG.Element
})
