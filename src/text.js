
SVG.Text = function Text() {
  this.constructor.call(this, SVG.create('text'));
  
  this.style = { 'font-size':  16 };
  this.leading = 1.2;
  this.anchor = 'start';
};

// inherit from SVG.Element
SVG.Text.prototype = new SVG.Shape();

// Add image-specific functions
SVG.extend(SVG.Text, {
  
  text: function(t) {
    this.content = t = t || 'text';
    
    var i,
        p = this.parentDoc(),
        a = t.split("\n");
    
    while (this.node.hasChildNodes())
      this.node.removeChild(this.node.lastChild);
    
    for (i = 0, l = a.length; i < l; i++) 
      this.node.appendChild(new TSpan().
        text(a[i]).
        attr('style', this._style()).
        attr({ dy: this.style['font-size'] * this.leading, x: (this.attr('x') || 0) }).node  );

    return this;
  },
  
  font: function(o) {
    var i, a = ('size family weight stretch variant style').split(' ');
    
    for (i = a.length - 1; i >= 0; i--)
      if (o[a[i]] != null)
        this.style['font-' + a[i]] = o[a[i]];
   
    a = ('leading anchor').split(' ');
    
    for (i = a.length - 1; i >= 0; i--)
      if (o[a[i]] != null)
        this[a[i]] = o[a[i]];
    
    return this.text(this.content);
  },
  
  _style: function() {
    var i, s = '', a = ('size family weight stretch variant style').split(' ');
    
    for (i = a.length - 1; i >= 0; i--)
      if (this.style['font-' + a[i]] != null)
        s += 'font-' + a[i] + ':' + this.style['font-' + a[i]] + ';';
    
    if (this.anchor != null)
      s += 'text-anchor:' + this.anchor + ';';
      
    return s;
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