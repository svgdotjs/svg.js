// ### This module accounts for the main svg document

//
SVG.Doc = function Doc(element) {
  this.constructor.call(this, SVG.create('svg'));
  
  /* create an extra wrapper */
  var wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:relative;width:100%;height:100%;';
  
  /* ensure the presence of a html element */
  if (typeof element == 'string')
    element = document.getElementById(element);
  
  /* set svg element attributes and create the <defs> node */
  this.
    attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' }).
    attr('xlink', SVG.xlink, SVG.ns).
    defs();
  
  /* add elements */
  element.appendChild(wrapper);
  wrapper.appendChild(this.node);
  
  /* ensure correct rendering for safari */
  this.stage();
};

// Inherits from SVG.Element
SVG.Doc.prototype = new SVG.Element();

// Include the container object
SVG.extend(SVG.Doc, SVG.Container);