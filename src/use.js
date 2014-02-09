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
    , width: function(width) {
        var w = (this.bbox().width * this.trans.scaleX)
        if(width) {
            this.scale(width / w)
        }
        return w
      }
    , height: function(height) {
        var h = (this.bbox().height * this.trans.scaleY)
        if(height) {
            this.scale(height / h)
        }
        return h
      }
    , x: function(x) {
        if (x) {
          x = new SVG.Number(x)
          x.value = x.value / this.trans.scaleX - this.bbox().x
        }
        return this.attr('x', x)
      }
    , y: function(y) {
        if (y) {
          y = new SVG.Number(y)
          y.value = y.value / this.trans.scaleY - this.bbox().y
        }
        return this.attr('y', y)
      }
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
