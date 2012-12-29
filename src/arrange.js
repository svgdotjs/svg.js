
// add backward / forward functionality to elements
SVG.extend(SVG.Element, {
  
  // get all siblings, including myself
  siblings: function() {
    return this.parent.children();
  },
  
  // send given element one step forwards
  forward: function() {
    var i = this.siblings().indexOf(this);
    
    return this.parent.remove(this).put(this, i + 1);
  },
  
  // send given element one step backwards
  backward: function() {
    var i, p = this.parent.level();
    
    i = this.siblings().indexOf(this);
    
    if (i > 1)
      p.remove(this).add(this, i - 1);
    
    return this;
  },
  
  // send given element all the way to the front
  front: function() {
    return this.parent.remove(this).put(this);
  },
  
  // send given element all the way to the back
  back: function() {
    var i, p = this.parent.level();
    
    i = this.siblings().indexOf(this);
    
    if (i > 1)
      p.remove(this).add(this, 0);
    
    return this;
  }
  
});