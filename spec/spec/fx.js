describe('FX', function() {
  var rect, fx, flag1 = flag2 = false

  beforeEach(function() {
    rect = draw.rect(100,100).move(100,100)
    fx = rect.animate(500)
    flag1 = flag2 = false
  })

  it('creates an instance of SVG.FX', function() {
    expect(fx instanceof SVG.FX).toBe(true)
  })

  it('animates the x/y-attr', function() {
  
    runs(function(){
      fx.move(200,200)
      
      setTimeout(function(){
        expect(rect.x()).toBeGreaterThan(100)
        expect(rect.y()).toBeGreaterThan(100)
        flag1 = true
      }, 250)
      
      setTimeout(function(){
        expect(rect.x()).toBe(200)
        expect(rect.y()).toBe(200)
        flag2 = true
      }, 600)
    })
    
    waitsFor(function() {
      return flag1;
    }, "x/y should be animated", 300);
    
    waitsFor(function() {
      return flag2;
    }, "x/y should be animated", 700);

  })
  
  it('animates transformations / sets rotation-center', function() {
    
    runs(function(){
    
      fx.transform({
          rotation: 30,
          cx: 10,
          cy: 10,
          x: 100,
          scaleX: 0.8,
          skewX: 1.2
      })
      
      setTimeout(function(){
        var trans = rect.transform()
        expect(trans.rotation).toBeGreaterThan(0)
        expect(trans.cx).toBe(10)
        expect(trans.cy).toBe(10)
        expect(trans.x).toBeGreaterThan(0)
        expect(trans.scaleX).toBeLessThan(1)
        expect(trans.skewX).toBeGreaterThan(0)
        flag1 = true
      }, 250)
      
      setTimeout(function(){
        var trans = rect.transform()
        expect(trans.rotation).toBe(30)
        expect(trans.cx).toBe(10)
        expect(trans.cy).toBe(10)
        expect(trans.x).toBe(100)
        expect(trans.scaleX).toBe(0.8)
        expect(trans.skewX).toBe(1.2)
        flag2 = true
      }, 600)
    })
    
    waitsFor(function() {
      return flag1;
    }, "transformation should be animated", 300);
    
    waitsFor(function() {
      return flag2;
    }, "transformation should be animated", 700);

  })

})