
var bind = function(fn, me) {
  return function() { return fn.apply(me, arguments); };
};

SVG.Draggable = function Draggable(e) {
  this._windowMouseUp = bind(this._windowMouseUp, this);
  this._windowMouseMove = bind(this._windowMouseMove, this);
  this.draggable = bind(this.draggable, this);
  this.element = e;
  this.element.draggable = this.draggable;
};

SVG.Draggable.prototype.draggable = function() {
  var self = this;
  this.element.on('mousedown', function(e) {
    self.startDragEvent = e;
    self.startDragPosition = {
      x: self.element.attributes.x || 0,
      y: self.element.attributes.y || 0
    };
    window.addEventListener('mousemove', self._windowMouseMove);
    window.addEventListener('mouseup', self._windowMouseUp);
    return typeof self.element.dragstart === 'function' ? self.element.dragstart(e) : void 0;
  });
  return this.element;
};

SVG.Draggable.prototype._windowMouseMove = function(e) {
  if (this.startDragEvent != null) {
    var d = {
      x: e.pageX - this.startDragEvent.pageX,
      y: e.pageY - this.startDragEvent.pageY
    };
    this.element.move(this.startDragPosition.x + d.x, this.startDragPosition.y + d.y);
    return typeof this.element.dragmove === 'function' ? this.element.dragmove(d, e) : void 0;
  }
};

SVG.Draggable.prototype._windowMouseUp = function(e) {
  this.startDragEvent = null;
  this.startDragPosition = null;
  window.removeEventListener('mousemove', this._windowMouseMove);
  window.removeEventListener('mouseup', this._windowMouseUp);
  return typeof this.element.dragend === 'function' ? this.element.dragend(e) : void 0;
};