
SVG.Doc = function Doc(e) {
  this.constructor.call(this, SVG.create('svg'));
  
  // ensure the presence of a html element
  if (typeof e == 'string')
    e = document.getElementById(e);
  
  // set 
  this.
    attr({ xmlns: SVG.ns, version: '1.1', style: 'position:relative;' }).
    attr('xlink', SVG.xlink, SVG.ns).
    size(e.offsetWidth, e.offsetHeight).
    defs();
  
  e.appendChild(this.node);
  
  // ensure 
  this.stage();
};

// inherit from SVG.Element
SVG.Doc.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.Doc, SVG.Container);


