
this.SVG = {
  namespace: "http://www.w3.org/2000/svg",
  xlink:     "http://www.w3.org/1999/xlink",
  
  createElement: function(e) {
    return document.createElementNS(this.namespace, e);
  }
};