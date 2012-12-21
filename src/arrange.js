
// add backward / forward functionality to elements
SVG.extend(SVG.Element, {
  
  // get all siblings, including me
  siblings: function() {
    return this.mother().children();
  },
  
  // send given element one step forwards
  forward: function() {
    var i = this.siblings().indexOf(this);
    this.mother().remove(this).add(this, i + 1);
    
    return this;
  },
  
  // send given element one step backwards
  backward: function() {
    var i, p = this.mother().levelDefs();
    
    i = this.siblings().indexOf(this);
    
    if (i > 1)
      p.remove(this).add(this, i - 1);
    
    return this;
  },
  
  // send given element all the way to the front
  front: function() {
    this.mother().remove(this).add(this);
    
    return this;
  },
  
  // send given element all the way to the back
  back: function() {
    var i, p = this.mother().levelDefs();
    
    i = this.siblings().indexOf(this);
    
    if (i > 1)
      p.remove(this).add(this, 0);
    
    return this;
  }
  
});