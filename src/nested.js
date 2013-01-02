
SVG.Nested = function Nested() {
  this.constructor.call(this, SVG.create('svg'));
  this.attr('overflow', 'visible');
};

// inherit from SVG.Element
SVG.Nested.prototype = new SVG.Element();

// include the container object
SVG.extend(SVG.Nested, SVG.Container);