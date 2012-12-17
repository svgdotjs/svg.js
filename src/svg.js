
this.SVG = {
  ns:     'http://www.w3.org/2000/svg',
  xlink:  'http://www.w3.org/1999/xlink',
  
  create: function(e) {
    return document.createElementNS(this.ns, e);
  }
};

this.svg = function(e) {
  return new SVG.Document(e);
};