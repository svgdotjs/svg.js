
this.SVG = {
  ns:     'http://www.w3.org/2000/svg',
  xlink:  'http://www.w3.org/1999/xlink',
  
  create: function(e) {
    return document.createElementNS(this.ns, e);
  },
  
  extend: function(o, m) {
    for (var k in m)
      o.prototype[k] = m[k];
  }
};

this.svg = function(e) {
  return new SVG.Doc(e);
};