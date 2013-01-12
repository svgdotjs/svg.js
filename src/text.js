
// List font style attributes as they should be applied to style 
var _styleAttr = ['size', 'family', 'weight', 'stretch', 'variant', 'style'];

SVG.Text = function Text() {
  this.constructor.call(this, SVG.create('text'));
  
  /* define default style */
  this.style = { 'font-size':  16, 'font-family': 'Helvetica', 'text-anchor': 'start' };
  this.leading = 1.2;
};

// Inherit from SVG.Element
SVG.Text.prototype = new SVG.Shape();

SVG.extend(SVG.Text, {
  // Set the text content
  text: function(text) {
    /* update the content */
    this.content = text = text || 'text';
    this.lines = [];
    
    var index, length, tspan,
        style   = this._style(),
        parent  = this.doc(),
        lines   = text.split("\n"),
        size    = this.style['font-size'];
    
    /* remove existing child nodes */
    while (this.node.hasChildNodes())
      this.node.removeChild(this.node.lastChild);
    
    /* build new lines */
    for (index = 0, length = lines.length; index < length; index++) {
      /* create new tspan and set attributes */
      tspan = new TSpan().
        text(lines[index]).
        attr({
          dy:     size * this.leading - (index == 0 ? size * 0.3 : 0),
          x:      (this.attrs.x || 0),
          style:  style
        });
      
      /* add new tspan */
      this.node.appendChild(tspan.node);
      this.lines.push(tspan);
    };
    
    /* set style */
    return this.attr('style', style);
  },
  
  // Build style based on _styleAttr
  _style: function() {
    var index, style = '';
    
    for (index = _styleAttr.length - 1; index >= 0; index--)
      if (this.style['font-' + _styleAttr[index]] != null)
        style += 'font-' + _styleAttr[index] + ':' + this.style['font-' + _styleAttr[index]] + ';';
    
    style += 'text-anchor:' + this.style['text-anchor'] + ';';
      
    return style;
  }
  
});


function TSpan() {
  this.constructor.call(this, SVG.create('tspan'));
};

// Inherit from SVG.Shape
TSpan.prototype = new SVG.Shape();

// Include the container object
SVG.extend(TSpan, {
  // Set text content
  text: function(text) {
    this.node.appendChild(document.createTextNode(text));
    
    return this;
  }
  
});