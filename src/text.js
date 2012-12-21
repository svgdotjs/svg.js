
SVG.Text = function Text() {
  this.constructor.call(this, SVG.create('text'));
  
  this.style = { 'font-size':  16, 'font-family': 'Helvetica' };
  this.leading = 1.2;
  this.anchor = 'start';
  this._s = ('size family weight stretch variant style').split(' ');
  this._p = ('leading anchor').split(' ');
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
  
  font: function(a, v) {
    if (typeof a == 'object') {
      var i, s = this._s;

      for (i = s.length - 1; i >= 0; i--)
        if (a[s[i]] != null)
          this.style['font-' + s[i]] = a[s[i]];

      s = this._p;

      for (i = s.length - 1; i >= 0; i--)
        if (a[s[i]] != null)
          this[s[i]] = a[s[i]];
      
    } else if (v != null) {
      var s = {};
      s[a] = v;
      this.font(s);
      
    } else {
      return this._p.indexOf(a) > -1 ? this[a] : this._s.indexOf(a) > -1 ? this.style['font-' + a] : void 0;
    }
    
    return this.text(this.content);
  },
  
  _style: function() {
    var i, o = '', s = this._s;
    
    for (i = s.length - 1; i >= 0; i--)
      if (this.style['font-' + s[i]] != null)
        o += 'font-' + s[i] + ':' + this.style['font-' + s[i]] + ';';
    
    if (this.anchor != null)
      o += 'text-anchor:' + this.anchor + ';';
      
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