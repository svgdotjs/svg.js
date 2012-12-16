
SVG.Nested = function Nested() {
  this.drag = new SVG.Draggable(this);
  this.constructor.call(this, SVG.createElement('svg'));
  this.setAttribute('overflow', 'visible');
};

// inherit from SVG.Element
SVG.Nested.prototype = new SVG.Element();

// include the container object
SVG.Nested.include(SVG.Container);