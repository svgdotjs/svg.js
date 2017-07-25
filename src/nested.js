SVG.Nested = SVG.invent({
  // Initialize node
  create: 'svg'

  // Inherit from
, inherit: SVG.Container
  
  // Add parent method
, construct: {
    // Create nested svg document
    nested: function() {
      return this.put(new SVG.Nested)
    }
  }
})
