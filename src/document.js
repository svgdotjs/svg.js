
SVG.Document = function Document(c) {
  this.constructor.call(this, SVG.createElement('svg'));
  
  this.setAttribute('xmlns', SVG.namespace);
  this.setAttribute('version', '1.1');
  this.setAttribute('xlink', 'http://www.w3.org/1999/xlink', SVG.namespace);
  
  document.getElementById(c).appendChild(this.svgElement);
};

// inherit from SVG.Element
SVG.Document.prototype = new SVG.Element();

// include the container object
SVG.Document.include(SVG.Container);