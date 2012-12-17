

SVG.Utils = {
  
  merge: function(o, m) {
    for (var k in m)
      o.prototype[k] = m[k];
  }
  
};