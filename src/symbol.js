
SVG.Symbol = SVG.invent({
  // Initialize node
  create: 'symbol'

  // Inherit from
, inherit: SVG.Container

  // Add parent method
, construct: {
    // Create a new symbol
    symbol: function() {
      return this.defs().put(new SVG.Symbol)
    }
  }
  
})