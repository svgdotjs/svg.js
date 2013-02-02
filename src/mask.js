SVG.Mask = function Mask() {
  this.constructor.call(this, SVG.create('mask'));
  
  /* set unique id */
  this.attr('id', (this.id = 'svgjs_element_' + (SVG.did++)));
};

// Inherit from SVG.Container
SVG.Mask.prototype = new SVG.Container();

SVG.extend(SVG.Element, {
  
  // Distribute mask to svg element
  maskWith: function(element) {
    return this.attr('mask', 'url(#' + (element instanceof SVG.Mask ? element : this.parent.mask().add(element)).id + ')');
  }
  
});