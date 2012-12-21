
SVG.Text = function Text() {
  this.constructor.call(this, SVG.create('text'));
  
  this.style = { 'font-size':  16, 'font-family': 'Helvetica', 'text-anchor': 'start' };
  this.leading = 1.2;
  this.lines = [];
};

// inherit from SVG.Element
SVG.Text.prototype = new SVG.Shape();

// Add image-specific functions
SVG.extend(SVG.Text, {
  
  text: function(t) {
    this.content = t = t || 'text';
    this.lines = [];
    
    var i, s,
        p = this.parentDoc(),
        a = t.split("\n");
    
    while (this.node.hasChildNodes())
      this.node.removeChild(this.node.lastChild);
    
    for (i = 0, l = a.length; i < l; i++) {
      s = new TSpan().
        text(a[i]).
        attr({
          dy:     this.style['font-size'] * this.leading,
          x:      (this.attr('x') || 0),
          style:  this._style()
        });
      
      this.node.appendChild(s.node);
      this.lines.push(s);
    };
    
    return this;
  },
  
  _style: function() {
    var i, o = '', s = this._s;
    
    for (i = s.length - 1; i >= 0; i--)
      if (this.style['font-' + s[i]] != null)
        o += 'font-' + s[i] + ':' + this.style['font-' + s[i]] + ';';
    
    o += 'text-anchor:' + this.style['text-anchor'] + ';';
      
    return o;
  }
  
});


function TSpan() {
  this.constructor.call(this, SVG.create('tspan'));
};

// inherit from SVG.Element
TSpan.prototype = new SVG.Shape();

// include the container object
SVG.extend(TSpan, {
  
  text: function(t) {
    this.node.appendChild(document.createTextNode(t));
    
    return this;
  }
  
});