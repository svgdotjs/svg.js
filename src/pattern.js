SVG.Pattern = function Pattern(type) {
  this.constructor.call(this, SVG.create('pattern'));
  
  /* set unique id */
  this.id = 'svgjs_' + (SVG.did++);
  this.attr('id', this.id);
};

// Inherit from SVG.Element
SVG.Pattern.prototype = new SVG.Element();

// Include the container object
SVG.extend(SVG.Pattern, SVG.Container);

//
SVG.extend(SVG.Pattern, {
  // Return the fill id
  fill: function() {
    return 'url(#' + this.id + ')';
  }
  
});

//
SVG.extend(SVG.Defs, {
  
  /* define gradient */
  pattern: function(width, height, block) {
    var element = this.put(new SVG.Pattern());
    
    /* invoke passed block */
    block(element);
    
    return element.attr({
      x:            0,
      y:            0,
      width:        width,
      height:       height,
      patternUnits: 'userSpaceOnUse'
    });
  }
  
});