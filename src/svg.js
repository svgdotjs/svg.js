
this.SVG = {
  // define default namespaces
  ns:         'http://www.w3.org/2000/svg',
  xlink:      'http://www.w3.org/1999/xlink',
  
  // method for element creation
  create: function(e) {
    return document.createElementNS(this.ns, e);
  },
  
  // method for extending objects
  extend: function(o, m) {
    for (var k in m)
      o.prototype[k] = m[k];
  }
  
};