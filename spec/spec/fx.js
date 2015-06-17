describe('FX', function() {
  var rect, fx;

  beforeEach(function() {
    rect = draw.rect(100,100).move(100,100)
    fx = rect.animate(500)
  })

  it('creates an instance of SVG.FX', function() {
    expect(fx instanceof SVG.FX).toBe(true)
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