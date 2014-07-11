SVG.extend(SVG.Element, {
  // Set svg element attribute
  attr: function(a, v, n) {
    // Act as full getter
    if (a == null) {
      // Get an object of attributes
      a = {}
      v = this.node.attributes
      for (n = v.length - 1; n >= 0; n--)
        a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue
      
      return a
      
    } else if (typeof a == 'object') {
      // Apply every attribute individually if an object is passed
      for (v in a) this.attr(v, a[v])
      
    } else if (v === null) {
        // Remove value
        this.node.removeAttribute(a)
      
    } else if (v == null) {
      // Act as a getter if the first and only argument is not an object
      v = this.node.getAttribute(a)
      return v == null ? 
        SVG.defaults.attrs[a] :
      SVG.regex.isNumber.test(v) ?
        parseFloat(v) : v
    
    } else {
      // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
      if (a == 'stroke-width')
        this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
      else if (a == 'stroke')
        this._stroke = v

      // Convert image fill and stroke to patterns
      if (a == 'fill' || a == 'stroke') {
        if (SVG.regex.isImage.test(v))
          v = this.doc().defs().image(v, 0, 0)

        if (v instanceof SVG.Image)
          v = this.doc().defs().pattern(0, 0, function() {
            this.add(v)
          })
      }
      
      // Ensure correct numeric values (also accepts NaN and Infinity)
      if (typeof v === 'number')
        v = new SVG.Number(v)

      // Ensure full hex color
      else if (SVG.Color.isColor(v))
        v = new SVG.Color(v)
      
      // Parse array values
      else if (Array.isArray(v))
        v = new SVG.Array(v)

      // If the passed attribute is leading...
      if (a == 'leading') {
        // ... call the leading method instead
        if (this.leading)
          this.leading(v)
      } else {
        // Set given attribute on node
        typeof n === 'string' ?
          this.node.setAttributeNS(n, a, v.toString()) :
          this.node.setAttribute(a, v.toString())
      }
      
      // Rebuild if required
      if (this.rebuild && (a == 'font-size' || a == 'x'))
        this.rebuild(a, v)
    }
    
    return this
  }
})