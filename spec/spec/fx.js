describe('FX', function() {
  var rect, fx;

  beforeEach(function() {
    rect = draw.rect(100,100).move(100,100)
    fx = rect.animate(500)
    fx2 = fx.enqueue()
  })

  it('creates an instance of SVG.FX and sets parameter', function() {
    expect(fx instanceof SVG.FX).toBe(true)
    expect(fx.target).toBe(rect)
    expect(fx.pos).toBe(0)
    expect(fx.paused).toBe(false)
    expect(fx.finished).toBe(false)
    expect(fx.active).toBe(false)
    expect(fx.shared.current).toBe(fx)
    expect(fx._next).toBe(fx2)
    expect(fx._prev).toBe(null)
    expect(fx._duration).toBe(500)

  })

  describe('current()', function(){
    it('returns the current fx object', function(){
      expect(fx.current()).toBe(fx.shared.current)
    })
  })

  describe('first()', function(){
    it('returns the first fx object in the queue', function(){
      expect(fx.first()).toBe(fx)
    })
  })

  describe('last()', function(){
    it('returns the last fx object in the queue', function(){
      expect(fx.last()).toBe(fx2)
    })
  })

  describe('next()', function(){
    it('returns the next fx object in the queue', function(){
      expect(fx.next()).toBe(fx2)
    })
    it('returns null when it hits the end of the queue', function(){
      expect(fx2.next()).toBe(null)
    })
  })

  describe('prev()', function(){
    it('returns the previous fx object in the queue', function(){
      expect(fx2.prev()).toBe(fx)
    })
    it('returns null whn it hits the start of the queue', function(){
      expect(fx.prev()).toBe(null)
    })
  })

  describe('share()', function() {
    it('sets a new shared object', function() {
      var newObj = {}
      var ret = fx.share(newObj)

      expect(fx.shared).toBe(newObj)
      expect(ret).toBe(fx)

      // reset the value
      fx.share({current:fx})
    })
  })

  describe('timeToPos()', function() {
    it('converts a timestamp to a progress', function() {
      expect(fx.timeToPos(fx._start+fx._duration/2)).toBe(0.5)
    })
  })

  describe('posToTime()', function() {
    it('converts a progress to a timestamp', function() {
      expect(fx.posToTime(0.5)).toBe(fx._start+fx._duration/2)
    })
  })

  describe('seek()', function() {
    it('sets the progress to the specified position', function() {
      var start = fx._start
      expect(fx.seek(0.5).pos).toBe(0.5)
      // time is running so we cant compare it directly
      expect(fx._start).toBeLessThan(start - fx._duration * 0.5 + 1)
      expect(fx._start).toBeGreaterThan(start - fx._duration * 0.5 - 10)
    })
  })

  describe('start()', function(){
    it('starts the animation if it is the current', function(done) {
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
    it('starts the animation if it is the current', function() {
      expect(fx.pause().paused).toBe(true)
    })
  })

  describe('play()', function() {
    it('unpause the animation', function(done) {
      var start = fx.start().pause()._start
      setTimeout(function(){
        expect(fx.play().paused).toBe(false)
        expect(fx._start).not.toBe(start)
        done()
      }, 200)
    })
  })

  describe('speed()', function() {
    it('speeds up the animation by the given factor', function(){
    //console.log(fx.pos)
      expect(fx.speed(2)._duration).toBe(250)
      expect(fx.speed(0.5)._duration).toBe(500)
      expect(fx.seek(0.2).speed(2)._duration).toBe(0.2 * 500 + 0.8 * 500 / 2)
    })
  })

  /*describe('reverse()', function() {
    it('sets the direction of the animation to -1', function() {
      expect(fx.reverse()._direction).toBe(-1)
    })
  })

  describe('finish()', function() {
    it('sets the position of the whole animation queue to 1', function() {
      expect(fx.finish()._pos).toBe(1)
    })
  })*/

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