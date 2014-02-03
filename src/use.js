SVG.Use = SVG.invent({
  // Initialize node
  create: 'use'

  // Inherit from
, inherit: SVG.Shape

  // Add class methods
, extend: {
    // Use element as a reference
    element: function(element) {
      /* store target element */
      this.target = element

      /* set lined element */
      return this.attr('href', '#' + element, SVG.xlink)
    }
  }
  
  // Add parent method
, construct: {
    // Create a use element
    use: function(element) {
      return this.put(new SVG.Use).element(element)
    }
  }
})