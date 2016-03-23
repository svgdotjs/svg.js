describe('FX', function() {
  var rect, fx;

  beforeEach(function() {
    rect = draw.rect(100,100).move(100,100)
    fx = rect.animate(500)
  })
  
  afterEach(function() {
    //fx.finish()
    //rect.off('.fx')
  })

  it('creates an instance of SVG.FX and sets parameter', function() {
    expect(fx instanceof SVG.FX).toBe(true)
    expect(fx._target).toBe(rect)
    expect(fx.pos).toBe(0)
    expect(fx.lastPos).toBe(0)
    expect(fx.paused).toBeFalsy()
    expect(fx.active).toBeFalsy()
    expect(fx.situations).toEqual([])
    expect(fx.current.init).toBeFalsy()
    expect(fx.current.reversed).toBeFalsy()
    expect(fx.current.duration).toBe(500)
    expect(fx.current.delay).toBe(0)
    expect(fx.current.animations).toEqual({})
    expect(fx.current.attrs).toEqual({})
    expect(fx.current.styles).toEqual({})
    expect(fx.current.transforms).toEqual([])
    expect(fx.current.once).toEqual({})
  })

  describe('target()', function(){
    it('returns the current fx object', function(){
      expect(fx.target()).toBe(rect)
    })
  })

  describe('timeToPos()', function() {
    it('converts a timestamp to a progress', function() {
      expect(fx.timeToPos(fx.current.start+fx.current.duration/2)).toBe(0.5)
    })
  })

  describe('posToTime()', function() {
    it('converts a progress to a timestamp', function() {
      expect(fx.posToTime(0.5)).toBe(fx.current.start+fx.current.duration/2)
    })
  })

  describe('seek()', function() {
    it('sets the progress to the specified position', function() {
      var start = fx.current.start
      expect(fx.seek(0.5).pos).toBe(0.5)
      // time is running so we cant compare it directly
      expect(fx.current.start).toBeLessThan(start - fx.current.duration * 0.5 + 1)
      expect(fx.current.start).toBeGreaterThan(start - fx.current.duration * 0.5 - 10)
    })
  })

  describe('start()', function(){
    it('starts the animation', function(done) {
      fx.start()
      expect(fx.active).toBe(true)
      expect(fx.timeout).not.toBe(0)
      setTimeout(function(){
        expect(fx.pos).toBeGreaterThan(0)
        done()
      }, 200)
    })
  })

  describe('pause()', function() {
    it('pause the animation', function() {
      expect(fx.pause().paused).toBe(true)
    })
  })

  describe('play()', function() {
    it('unpause the animation', function(done) {
      var start = fx.start().pause().current.start
      setTimeout(function(){
        expect(fx.play().paused).toBe(false)
        expect(fx.current.start).not.toBe(start)
        done()
      }, 200)
    })
  })

  describe('speed()', function() {
    it('speeds up the animation by the given factor', function(){

      expect(fx.speed(2).current.duration).toBe(250)
      expect(fx.speed(0.5).current.duration).toBe(500)
      expect(fx.seek(0.2).speed(2).current.duration).toBe(0.2 * 500 + 0.8 * 500 / 2)
    })
  })

  describe('reverse()', function() {
    it('toggles the direction of the animation without a parameter', function() {
      expect(fx.reverse().current.reversed).toBe(true)
    })
  })

  describe('reverse()', function() {
    it('sets the direction to backwards with true given', function() {
      expect(fx.reverse(true).current.reversed).toBe(true)
    })
  })

  describe('reverse()', function() {
    it('sets the direction to forwards with false given', function() {
      expect(fx.reverse(false).current.reversed).toBe(false)
    })
  })

  describe('stop()', function() {
    it('stops the animation immediately without a parameter', function() {
      fx.animate(500)
      expect(fx.stop().current).toBeNull()
      expect(fx.active).toBeFalsy()
      expect(fx.situations.length).toBe(1)
    })
  })

  describe('stop()', function() {
    it('stops the animation immediately and fullfill it if first parameter true', function() {
      fx.animate(500)
      expect(fx.stop(true).current).toBeNull()
      expect(fx.active).toBeFalsy()
      expect(fx.pos).toBe(1)
      expect(fx.situations.length).toBe(1)
    })
  })

  describe('stop()', function() {
    it('stops the animation immediately and remove all items from queue when second parameter true', function() {
      fx.animate(500)
      expect(fx.stop(false, true).current).toBeNull()
      expect(fx.active).toBeFalsy()
      expect(fx.situations.length).toBe(0)
    })
  })

  describe('finish()', function() {
    it('finish the whole animation by fullfilling every single one', function() {
      fx.animate(500)
      expect(fx.finish().pos).toBe(1)
      expect(fx.situations.length).toBe(0)
      expect(fx.current).toBeNull()
    })
  })

  describe('progress()', function() {
    it('returns the current position', function() {
      expect(fx.progress()).toBe(0)
      expect(fx.progress()).toBe(fx.pos)
    })
  })

  describe('after()', function() {
    it('adds a callback which is called when the current animation is finished', function(done) {
      fx.start().after(function(situation){
        expect(fx.current).toBe(situation)
        expect(fx.pos).toBe(1)
        done()
      })
    })
  })

  describe('afterAll()', function() {
    it('adds a callback which is called when the current animation is finished', function(done) {
      fx.start().after(function(){
        expect(fx.pos).toBe(1)
        expect(fx.situations.length).toBe(0)
        done()
      })
    })
  })

  describe('during()', function() {
    it('adds a callback which is called on every animation step', function(done) {

      fx.start().during(function(pos, eased, situation){

        expect(fx.current).toBe(situation)

        if(fx.pos > 0.9){
          rect.off('.fx')
          fx.stop()
          
          done()
        }
      })
    })
  })

  describe('duringAll()', function() {
    it('adds a callback which is called on every animation step for the whole chain', function(done) {

      fx.finish()
      rect.off('.fx')
    
      fx.animate(500).start().animate(500)

      var sit = null

      var pos1 = false
      var pos2 = false

      setTimeout(function(){
        pos1 = true
      }, 300)

      setTimeout(function(){
        pos2 = true
      }, 800)

      fx.duringAll(function(pos, eased, fx2, situation){

        if(pos1){
          pos1 = false
          sit = situation
          expect(fx2.pos).toBeGreaterThan(0.5)
        }

        if(pos2){
          console.log('asd')
          pos2 = null
          expect(situation).not.toBe(sit)
          expect(fx2.pos).toBeGreaterThan(0.5)
          done()
        }
      })

      setTimeout(function(){
        if(pos2 === null) return
        fail('Not enough situations called')
        done()
      }, 1200)
    })
  })

  describe('once()', function() {
    it('adds a callback which is called once at the specified position', function(done) {

      fx.start().once(0.5, function(pos, eased){
        expect(true).toBe(true)
        done()
      })
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