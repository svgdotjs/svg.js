describe('FX', function() {
  var rect, fx;

  beforeEach(function() {
    rect = draw.rect(100,100).move(100,100)
    fx = rect.animate(500)
  })

  it('creates an instance of SVG.FX', function() {
    expect(fx instanceof SVG.FX).toBe(true)
  })
  
  it('creates a new queue and pushes one animation into it', function() {
    expect(fx._queue.length).toBe(1)
    expect(fx._queue[0] instance of SVG.Situation).toBe(true)
  })
  
  describe('queue()', function() {
    it('returns the queue of this animation instance', function() {
      expect(fx.queue() instanceof Array).toBe(true)
    })
  })
  
  describe('enqueue()', function() {
    it('pushes one item to the animation queue', function() {
      expect(fx.enqueue(500).queue().length).toBe(2)
    })
  })
  
  describe('reverse()', function() {
    it('sets the direction of the animation to -1', function() {
      expect(fx.reverse()._direction).toBe(-1)
    })
  })
  
  describe('play()', function() {
    it('sets the direction of the animation to 1', function() {
      expect(fx.play()._direction).toBe(1)
    })
  })
  
  describe('get()', function() {
    it('gets the specified situation object from the queue', function() {
      expect(fx.get(0)).toBe(fx.queue()[0])
    })
  })
  
  describe('seek()', function() {
    it('sets the position of the whole animation queue to the specified position', function() {
      expect(fx.seek(0.5)._pos).toBe(0.5)
    })
  })
  
  describe('get(0).seek()', function() {
    it('sets the position of a certain animation in the queue to the specified position', function() {
      expect(fx.get(0).seek(0.5)._pos).toBe(0.5)
    })
  })
  
  describe('stop()', function() {
    it('sets the direction of the animation to 0', function() {
      expect(fx.stop()._direction).toBe(0)
    })
  })
  
  describe('finish()', function() {
    it('sets the position of the whole animation queue to 1', function() {
      expect(fx.finish()._pos).toBe(1)
    })
  })
  
  describe('get(0).finish()', function() {
    it('sets the position of a certain animation in the queue to 1', function() {
      expect(fx.get(0).finish(1)._pos).toBe(1)
    })
  })

  it('animates the x/y-attr', function(done) {
  
    fx.move(200,200).after(function(){
    
      expect(rect.x()).toBe(200)
      expect(rect.y()).toBe(200)
      done()
    
    });
    
    setTimeout(function(){
      expect(rect.x()).toBeGreaterThan(100)
      expect(rect.y()).toBeGreaterThan(100)
    }, 250)

  })
  
  it('animates matrix', function(done) {
    
    fx.transform({a:0.8, b:0.4, c:-0.15, d:0.7, e: 90.3, f: 27.07}).after(function(){
    
      var ctm = rect.ctm()
      expect(ctm.a).toBeCloseTo(0.8)
      expect(ctm.b).toBeCloseTo(0.4)
      expect(ctm.c).toBeCloseTo(-0.15)
      expect(ctm.d).toBeCloseTo(0.7)
      expect(ctm.e).toBeCloseTo(90.3)
      expect(ctm.f).toBeCloseTo(27.07)
      
      done()
    
    })
    
    setTimeout(function(){
    
      var ctm = rect.ctm();
      expect(ctm.a).toBeLessThan(1)
      expect(ctm.b).toBeGreaterThan(0)
      expect(ctm.c).toBeLessThan(0)
      expect(ctm.d).toBeGreaterThan(0)
      expect(ctm.e).toBeGreaterThan(0)
      expect(ctm.f).toBeGreaterThan(0)
    }, 250)
    
  })

})