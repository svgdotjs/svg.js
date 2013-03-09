
// List font style attributes as they should be applied to style 
var _styleAttr = ('size family weight stretch variant style').split(' ')

SVG.Text = function() {
  this.constructor.call(this, SVG.create('text'))
  
  /* define default style */
  this.styles = {
    'font-size':    16
  , 'font-family':  'Helvetica'
  , 'text-anchor':  'start'
  }
  
  this._leading = 1.2
}

// Inherit from SVG.Element
SVG.Text.prototype = new SVG.Shape

SVG.extend(SVG.Text, {
  // Set the text content
  text: function(text) {
    /* act as getter */
    if (text == null)
      return this.content
    
    /* remove existing lines */
    this.clear()
    
    /* update the content */
    this.content = SVG.regex.isBlank.test(text) ? 'text' : text
    
    var i, il
      , lines = text.split('\n')
    
    /* build new lines */
    for (i = 0, il = lines.length; i < il; i++)
      this.tspan(lines[i])
      
    /* set style */
    return this.attr('style', this.style())
  }
  // Create a tspan
, tspan: function(text) {
    var tspan = new SVG.TSpan().text(text)
    
    /* add new tspan */
    this.node.appendChild(tspan.node)
    this.lines.push(tspan)
    
    return tspan.attr('style', this.style())
  }
  // Move element by its center
, center: function(x, y) {
    var anchor = this.style('text-anchor')
      , box = this.bbox()
      , x = anchor == 'start' ?
          x - box.width / 2 :
        anchor == 'end' ?
          x + box.width / 2 : x
    
    return this.move(x, y - box.height / 2)
  }
  // Set font size
, size: function(size) {
    return this.attr('font-size', size)
  }
  // Set / get leading
, leading: function(value) {
    /* act as getter */
    if (value == null)
      return this._leading
    
    /* act as setter */
    this._leading = value
    
    return this.rebuild()
  }
  // rebuild appearance type
, rebuild: function() {
    var i, il
      , size = this.styles['font-size']
    
    /* define position of all lines */
    for (i = 0, il = this.lines.length; i < il; i++)
      this.lines[i].attr({
        dy: size * this._leading - (i == 0 ? size * 0.3 : 0)
      , x: (this.attrs.x || 0)
      , style: this.style()
      })
    
    return this
  }
  // Clear all lines
, clear: function() {
    /* remove existing child nodes */
    while (this.node.hasChildNodes())
      this.node.removeChild(this.node.lastChild)
    
    this.lines = []
    
    return this
  }
  
})

// tspan class
SVG.TSpan = function() {
  this.constructor.call(this, SVG.create('tspan'))
}

// Inherit from SVG.Shape
SVG.TSpan.prototype = new SVG.Shape

// Include the container object
SVG.extend(SVG.TSpan, {
  // Set text content
  text: function(text) {
    this.node.appendChild(document.createTextNode(text))
    
    return this
  }
  
})