
SVG.Doc = function Doc(e) {
  this.constructor.call(this, SVG.create('svg'));
  
  // create extra wrapper
  var w = document.createElement('div');
  w.style.cssText = 'position:relative;width:100%;height:100%;';
  
  // ensure the presence of a html element
  if (typeof e == 'string')
    e = document.getElementById(e);
  
  // set svg element attributes
  this.
    attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' }).
    attr('xlink', SVG.xlink, SVG.ns).
    defs();
  
  // add elements
  e.appendChild(w);
  w.appendChild(this.node);
  
  // ensure correct rendering for safari
  this.stage();
};

// inherit from SVG.Element
SVG.Doc.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.Doc, SVG.Container);


