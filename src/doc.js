
SVG.Doc = function Doc(e) {
  this.constructor.call(this, SVG.create('svg'));
  
  
  this.
    attr({ xmlns: SVG.ns, version: '1.1' }).
    attr('xlink', SVG.xlink, SVG.ns).
    defs();
  
  if (typeof e == 'string')
    e = document.getElementById(e);
  
  e.appendChild(this.node);
};

// inherit from SVG.Element
SVG.Doc.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.Doc, SVG.Container);