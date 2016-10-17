describe('FX', function() {
  var rect, fx;

  beforeEach(function() {
    rect = draw.rect(100,100).move(100,100)
    fx = rect.animate(500)
  })

  it('creates an instance of SVG.FX and sets parameter', function() {
    expect(fx instanceof SVG.FX).toBe(true)
    expect(fx._target).toBe(rect)
    expect(fx.pos).toBe(0)
    expect(fx.lastPos).toBe(0)
    expect(fx.paused).toBeFalsy()
    expect(fx.active).toBeFalsy()
    expect(fx._speed).toBe(1)
    expect(fx.situations).toEqual([])
    expect(fx.situation.init).toBeFalsy()
    expect(fx.situation.reversed).toBeFalsy()
    expect(fx.situation.duration).toBe(500)
    expect(fx.situation.delay).toBe(0)
    expect(fx.situation.animations).toEqual({})
    expect(fx.situation.attrs).toEqual({})
    expect(fx.situation.styles).toEqual({})
    expect(fx.situation.transforms).toEqual([])
    expect(fx.situation.once).toEqual({})
  })

  describe('target()', function(){
    it('returns the current fx object with no argument given', function(){
      expect(fx.target()).toBe(rect)
    })

    it('changes the target of the animation when parameter given', function(){
      var c = draw.circle(5)
      expect(fx.target(c).target()).toBe(c)
    })
  })

  describe('timeToPos()', function() {
    it('converts a timestamp to a progress', function() {
      expect(fx.timeToPos( fx.situation.start + fx.situation.duration*0.5 )).toBe(0.5)
    })

    it('should take speed into consideration', function() {
      var spd

      spd = 4
      fx.speed(spd)
      expect(fx.timeToPos( fx.situation.start + (fx.situation.duration/spd)*0.5 )).toBe(0.5)

      spd = 0.5
      fx.speed(spd)
      expect(fx.timeToPos( fx.situation.start + (fx.situation.duration/spd)*0.25 )).toBe(0.25)
    })
  })

  describe('posToTime()', function() {
    it('converts a progress to a timestamp', function() {
      expect(fx.posToTime(0.5)).toBe( fx.situation.start + fx.situation.duration*0.5 )
    })

    it('should take speed into consideration', function() {
      var spd

      spd = 4
      fx.speed(spd)
      expect(fx.posToTime(0.5)).toBe( fx.situation.start + (fx.situation.duration/spd)*0.5 )

      spd = 0.5
      fx.speed(spd)
      expect(fx.posToTime(0.25)).toBe( fx.situation.start + (fx.situation.duration/spd)*0.25 )
    })
  })

  describe('at()', function() {
    it('sets the progress to the specified position', function() {
      var start = fx.situation.start
      expect(fx.at(0.5).pos).toBe(0.5)
      // time is running so we cant compare it directly
      expect(fx.situation.start).toBeLessThan(start - fx.situation.duration * 0.5 + 1, 0.0001)
      expect(fx.situation.start).toBeGreaterThan(start - fx.situation.duration * 0.5 - 10)
    })

    it('should take speed into consideration', function() {
      var dur, spd

      dur = fx.situation.duration

      spd = 4
      fx.speed(spd).at(0)
      expect(fx.situation.finish-fx.situation.start).toBe(dur/spd)

      spd = 5
      fx.speed(spd).at(0.15)
      expect(fx.situation.finish-fx.situation.start).toBe(dur/spd)

      spd = 0.25
      fx.speed(spd).at(0.75)
      expect(fx.situation.finish-fx.situation.start).toBe(dur/spd)

      spd = 0.5
      fx.speed(spd).at(0.83)
      expect(fx.situation.finish-fx.situation.start).toBe(dur/spd)
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

    it('should take speed into consideration', function() {
      var dur = fx.situation.duration
        , spd = 4

      fx.speed(spd).start()
      expect(fx.situation.finish-fx.situation.start).toBe(dur/spd)
    })
  })

  describe('pause()', function() {
    it('pause the animation', function() {
      expect(fx.pause().paused).toBe(true)
    })
  })

  describe('play()', function() {
    it('unpause the animation', function(done) {
      var start = fx.start().pause().situation.start
      setTimeout(function(){
        expect(fx.play().paused).toBe(false)
        expect(fx.situation.start).not.toBe(start)
        done()
      }, 200)
    })
  })

  describe('speed()', function() {
    it('set the speed of the animation', function(){
      var dur, spd

      dur = fx.situation.duration

      spd = 2
      fx.speed(spd)
      expect(fx._speed).toBe(spd)
      expect(fx.situation.finish-fx.situation.start).toBe(dur/spd)

      spd = 0.5
      fx.speed(spd)
      expect(fx._speed).toBe(spd)
      expect(fx.situation.finish-fx.situation.start).toBe(dur/spd)

      spd = 2
      fx.at(0.2).speed(spd)
      expect(fx._speed).toBe(spd)
      expect(fx.situation.finish-fx.situation.start).toBe(dur/spd)

      spd = 1
      fx.speed(spd)
      expect(fx._speed).toBe(spd)
      expect(fx.situation.finish-fx.situation.start).toBe(dur)
    })

    it('should not change the position when the animation is run backward', function(){
      var pos = 0.4

      expect(fx.at(pos).reverse(true).speed(2).pos).toBe(pos)
    })

    it('return the current speed with no argument given', function(){
      var spd

      spd = 2
      fx._speed = spd
      expect(fx.speed()).toBe(spd)

      spd = 0.5
      fx._speed = spd
      expect(fx.speed()).toBe(spd)

      spd = 1
      fx._speed = spd
      expect(fx.speed()).toBe(spd)
    })

    it('pause the animation when a speed of 0 is passed', function(){
      var spd = fx._speed

      expect(fx.speed(0)).toBe(fx)
      expect(fx._speed).toBe(spd)
      expect(fx.paused).toBe(true)
    })

    it('should affect all animations in the queue', function(done){
      fx.speed(2).animate(300)
      expect(fx.situations.length).not.toBe(0)
      expect(fx.pos).not.toBe(1)

      // At this point, there should be 2 animations in the queue to be played:
      // the one of 500ms that is added before every test and the one of 300ms
      // we just added. Normally, it would take 800ms before both of these
      // animations are done, but because we set the speed to 2, it should
      // only take 400ms to do both animations.
      fx.start()

      // We expect this timeout to happen while the second animation is running
      setTimeout(function(){
        expect(fx.active).toBe(true)
        expect(fx.situations.length).toBe(0)
        expect(fx.pos).not.toBe(1)
      }, 300)

      // Here, we expect that all the animations are done
      setTimeout(function(){
        expect(fx.active).toBe(false)
        expect(fx.situations.length).toBe(0)
        expect(fx.pos).toBe(1)
        done()
      }, 450)
    })
  })

  describe('reverse()', function() {
    it('toggles the direction of the animation without a parameter', function() {
      expect(fx.reverse().situation.reversed).toBe(true)
    })
  })

  describe('reverse()', function() {
    it('sets the direction to backwards with true given', function() {
      expect(fx.reverse(true).situation.reversed).toBe(true)
    })
  })

  describe('reverse()', function() {
    it('sets the direction to forwards with false given', function() {
      expect(fx.reverse(false).situation.reversed).toBe(false)
    })
  })

  describe('stop()', function() {
    it('stops the animation immediately without a parameter', function() {
      fx.animate(500)
      expect(fx.stop().situation).toBeNull()
      expect(fx.active).toBeFalsy()
      expect(fx.situations.length).toBe(1)
    })
  })

  describe('stop()', function() {
    it('stops the animation immediately and fullfill it if first parameter true', function() {
      fx.animate(500)
      expect(fx.stop(true).situation).toBeNull()
      expect(fx.active).toBeFalsy()
      expect(fx.pos).toBe(1)
      expect(fx.situations.length).toBe(1)
    })
  })

  describe('stop()', function() {
    it('stops the animation immediately and remove all items from queue when second parameter true', function() {
      fx.animate(500)
      expect(fx.stop(false, true).situation).toBeNull()
      expect(fx.active).toBeFalsy()
      expect(fx.situations.length).toBe(0)
    })
  })

  describe('finish()', function() {
    it('finish the whole animation by fullfilling every single one', function() {
      fx.animate(500)
      expect(fx.finish().pos).toBe(1)
      expect(fx.situations.length).toBe(0)
      expect(fx.situation).toBeNull()
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
        expect(fx.situation).toBe(situation)
        expect(fx.pos).toBe(1)
        done()
      })
    })
  })

  describe('afterAll()', function() {
    it('adds a callback which is called when all animations are finished', function(done) {
      fx.animate(150).animate(125).start().afterAll(function(){
        expect(fx.pos).toBe(1)
        expect(fx.situations.length).toBe(0)
        done()
      })
    })
  })

  describe('during()', function() {
    it('adds a callback which is called on every animation step', function(done) {

      fx.start().during(function(pos, morph, eased, situation){

        expect(fx.situation).toBe(situation)
        expect(morph(0, 100)).toBeCloseTo(pos*100)

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

      fx.duringAll(function(pos, morph, eased, situation){

        if(pos1){
          pos1 = false
          sit = situation
          expect(this.fx.pos).toBeGreaterThan(0.5)
        }

        if(pos2){
          pos2 = null
          expect(situation).not.toBe(sit)
          expect(this.fx.pos).toBeGreaterThan(0.5)
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
        expect(pos).toBeGreaterThan(0.49)
        done()
      })
    })
  })

  describe('loop()', function() {
    it('should create an eternal loop when no arguments are given', function(done) {
      fx.loop()
      expect(fx.situation.loop).toBe(true)
      expect(fx.situation.loops).toBe(true)

      fx.start()
      setTimeout(function(){
        expect(fx.active).toBe(true)
        expect(fx.situation.loop).toBe(true)
        expect(fx.situation.loops).toBe(true)
        expect(fx.pos).toBeCloseTo(0.6, 1)
        done()
      }, 800)
    })

    it('should create an eternal loop when the first argument is true', function(done) {
      fx.loop(true)
      expect(fx.situation.loop).toBe(true)
      expect(fx.situation.loops).toBe(true)

      fx.start()
      setTimeout(function(){
        expect(fx.active).toBe(true)
        expect(fx.situation.loop).toBe(true)
        expect(fx.situation.loops).toBe(true)
        expect(fx.pos).toBeCloseTo(0.3, 1)
        done()
      }, 650)
    })

    it('should loop for the specified number of times', function(done) {
      fx.loop(3)
      expect(fx.situation.loop).toBe(3)
      expect(fx.situation.loops).toBe(3)

      fx.start()
      setTimeout(function(){
        expect(fx.active).toBe(true)
        expect(fx.situation.loop).toBe(3)
        expect(fx.situation.loops).toBe(3)
        expect(fx.pos).toBeCloseTo(0.4, 1)
      }, 200)

      setTimeout(function(){
        expect(fx.active).toBe(true)
        expect(fx.situation.loop).toBe(2)
        expect(fx.situation.loops).toBe(3)
        expect(fx.pos).toBeCloseTo(0.5, 1)
      }, 750)

      setTimeout(function(){
        expect(fx.active).toBe(true)
        expect(fx.situation.loop).toBe(1)
        expect(fx.situation.loops).toBe(3)
        expect(fx.pos).toBeCloseTo(0.64, 1)
      }, 1320)

      setTimeout(function(){
        expect(fx.active).toBe(false)
        expect(fx.situation).toBeNull()
        expect(fx.pos).toBe(1)
        done()
      }, 1600)
    })

    it('should go from beginning to end and start over again (0->1.0->1.0->1.) by default', function(done) {
      fx.loop(2)
      expect(fx.situation.loop).toBe(2)
      expect(fx.situation.loops).toBe(2)
      expect(fx.situation.reversing).toBe(false)
      expect(fx.situation.reversed).toBe(false)

      fx.start()
      setTimeout(function(){
        expect(fx.active).toBe(true)
        expect(fx.situation.loop).toBe(2)
        expect(fx.situation.loops).toBe(2)
        expect(fx.situation.reversing).toBe(false)
        expect(fx.situation.reversed).toBe(false)
        expect(fx.pos).toBeCloseTo(0.65, 1)
      }, 325)

      setTimeout(function(){
        expect(fx.active).toBe(true)
        expect(fx.situation.loop).toBe(1)
        expect(fx.situation.loops).toBe(2)
        expect(fx.situation.reversing).toBe(false)
        expect(fx.situation.reversed).toBe(false)
        expect(fx.pos).toBeCloseTo(0.8, 1)
      }, 900)

      setTimeout(function(){
        expect(fx.active).toBe(false)
        expect(fx.situation).toBeNull()
        expect(fx.pos).toBe(1)
        done()
      }, 1100)
    })

    it('should be completely reversed before starting over (0->1->0->1->0->1.) when the reverse flag is passed', function(done) {
      fx.loop(2, true)
      expect(fx.situation.loop).toBe(2)
      expect(fx.situation.loops).toBe(2)
      expect(fx.situation.reversing).toBe(true)
      expect(fx.situation.reversed).toBe(false)

      fx.start()
      setTimeout(function(){
        expect(fx.active).toBe(true)
        expect(fx.situation.loop).toBe(2)
        expect(fx.situation.loops).toBe(2)
        expect(fx.situation.reversing).toBe(true)
        expect(fx.situation.reversed).toBe(false)
        expect(fx.pos).toBeCloseTo(0.65, 1)
      }, 325)

      setTimeout(function(){
        expect(fx.active).toBe(true)
        expect(fx.situation.loop).toBe(1)
        expect(fx.situation.loops).toBe(2)
        expect(fx.situation.reversing).toBe(true)
        expect(fx.situation.reversed).toBe(true)
        expect(fx.pos).toBeCloseTo(0.2, 1)
      }, 900)

      setTimeout(function(){
        expect(fx.active).toBe(false)
        expect(fx.situation).toBeNull()
        expect(fx.pos).toBe(0)
        done()
      }, 1100)
    })

    it('should be applied on the last situation', function() {
      fx.loop(5)
      expect(fx.situation.loop).toBe(5)
      expect(fx.situation.loops).toBe(5)
      expect(fx.situation.reversing).toBe(false)

      fx.animate().loop(3, true)
      expect(fx.situation.loop).toBe(5)
      expect(fx.situation.loops).toBe(5)
      expect(fx.situation.reversing).toBe(false)

      var c = fx.last()
      expect(c.loop).toBe(3)
      expect(c.loops).toBe(3)
      expect(c.reversing).toBe(true)
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
