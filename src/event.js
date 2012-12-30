
var eventTypes = ['click', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove'];

// generate events
for (var i = eventTypes.length - 1; i >= 0; i--) {
  var t = eventTypes[i];
  SVG.Element.prototype[t] = function(f) {
    var e = this;
    this.node['on' + t] = function() {
      return f.apply(e, arguments);
    };
    
    return e;
  };
};