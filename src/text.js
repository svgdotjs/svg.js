
// list font style attributes as they should be applied to style 
var _styleAttr = ['size', 'family', 'weight', 'stretch', 'variant', 'style'];


SVG.Text = function Text() {
  this.constructor.call(this, SVG.create('text'));
  
  // define default style
  this.style = { 'font-size':  16, 'font-family': 'Helvetica', 'text-anchor': 'start' };
  this.leading = 1.2;
};

// inherit from SVG.Element
SVG.Text.prototype = new SVG.Shape();

// Add image-specific functions
SVG.extend(SVG.Text, {
  
  text: function(t) {
    // update the content
    this.content = t = t || 'text';
    this.lines = [];
    
    var i, n,
        s = this._style(),
        p = this.parentDoc(),
        a = t.split("\n"),
        f = this.style['font-size'];
    
    // remove existing child nodes
    while (this.node.hasChildNodes())
      this.node.removeChild(this.node.lastChild);
    
    // build new lines
    for (i = 0, l = a.length; i < l; i++) {
      // create new tspan and set attributes
      n = new TSpan().
        text(a[i]).
        attr({
          dy:     f * this.leading - (i == 0 ? f * 0.3 : 0),
          x:      (this.attrs.x || 0),
          style:  s
        });
      
      // add new tspan
      this.node.appendChild(n.node);
      this.lines.push(n);
    };
    
    // set style
    return this.attr('style', s);
  },
  
  // build style based on _styleAttr
  _style: function() {
    var i, o = '';
    
    for (i = _styleAttr.length - 1; i >= 0; i--)
      if (this.style['font-' + _styleAttr[i]] != null)
        o += 'font-' + _styleAttr[i] + ':' + this.style['font-' + _styleAttr[i]] + ';';
    
    o += 'text-anchor:' + this.style['text-anchor'] + ';';
      
    return o;
  }
  
});


function TSpan() {
  this.constructor.call(this, SVG.create('tspan'));
};

// inherit from SVG.Shape
TSpan.prototype = new SVG.Shape();

// include the container object
SVG.extend(TSpan, {
  
  text: function(t) {
    this.node.appendChild(document.createTextNode(t));
    
    return this;
  }
  
});