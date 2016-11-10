describe('FX', function() {
  var rect, fx;

  beforeEach(function() {
    rect = draw.rect(100,100).move(100,100)
    fx = rect.animate(500)

    jasmine.clock().install()
    jasmine.clock().mockDate() // This freeze the Date
  })

  afterEach(function() {
    jasmine.clock().uninstall()
  })


  it('creates an instance of SVG.FX and sets parameter', function() {
    expect(fx instanceof SVG.FX).toBe(true)
    expect(fx._target).toBe(rect)
    expect(fx.absPos).toBe(0)
    expect(fx.pos).toBe(0)
    expect(fx.lastPos).toBe(0)
    expect(fx.paused).toBe(false)
    expect(fx.active).toBe(false)
    expect(fx._speed).toBe(1)
    expect(fx.situations).toEqual([])
    expect(fx.situation.init).toBe(false)
    expect(fx.situation.reversed).toBe(false)
    expect(fx.situation.duration).toBe(500)
    expect(fx.situation.delay).toBe(0)
    expect(fx.situation.loops).toBe(false)
    expect(fx.situation.loop).toBe(0)
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


  describe('timeToAbsPos()', function() {
    it('converts a timestamp to an absolute progress', function() {
      expect(fx.timeToAbsPos( fx.situation.start + fx.situation.duration*0.5 )).toBe(0.5)
    })

    it('should take speed into consideration', function() {
      var spd

      spd = 4
      fx.speed(spd)
      expect(fx.timeToAbsPos( fx.situation.start + (fx.situation.duration/spd)*0.5 )).toBe(0.5)

      spd = 0.5
      fx.speed(spd)
      expect(fx.timeToAbsPos( fx.situation.start + (fx.situation.duration/spd)*0.25 )).toBe(0.25)
    })
  })


  describe('absPosToTime()', function() {
    it('converts an absolute progress to a timestamp', function() {
      expect(fx.absPosToTime(0.5)).toBe( fx.situation.start + fx.situation.duration*0.5 )
    })

    it('should take speed into consideration', function() {
      var spd

      spd = 4
      fx.speed(spd)
      expect(fx.absPosToTime(0.5)).toBe( fx.situation.start + (fx.situation.duration/spd)*0.5 )

      spd = 0.5
      fx.speed(spd)
      expect(fx.absPosToTime(0.25)).toBe( fx.situation.start + (fx.situation.duration/spd)*0.25 )
    })
  })


  describe('atStart()', function () {
    it('sets the animation at the start', function() {
      // When the animation is running forward, the start position is 0
      this.pos = 0.5
      expect(fx.atStart().pos).toBe(0)

      // When the animation is running backward, the start position is 1
      this.pos = 0.5
      expect(fx.reverse(true).atStart().pos).toBe(1)
    })

    it('sets the animation at the start, before any loops', function() {
      fx.loop(true)

      // When the animation is running forward, the start position is 0
      fx.at(3.7, true)
      expect(fx.absPos).toBe(3.7)
      expect(fx.pos).toBeCloseTo(0.7)
      expect(fx.situation.loop).toBe(3)

      fx.atStart()
      expect(fx.absPos).toBe(0)
      expect(fx.pos).toBe(0)
      expect(fx.situation.loop).toBe(0)

      // When the animation is running backward, the start position is 1
      fx.reverse(true).at(2.14, true)
      expect(fx.absPos).toBe(2.14)
      expect(fx.pos).toBeCloseTo(1 - 0.14)
      expect(fx.situation.loop).toBe(2)
      expect(fx.situation.reversed).toBe(true)

      fx.atStart()
      expect(fx.absPos).toBe(0)
      expect(fx.pos).toBe(1)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.reversed).toBe(true)
    })

    it('sets the animation at the start, before any loops when reversing is true', function() {
      fx.loop(true, true) // Set reversing to true

      // When the animation is running forward, the start position is 0
      fx.at(11.21, true)
      expect(fx.absPos).toBe(11.21)
      expect(fx.pos).toBeCloseTo(1 - 0.21)
      expect(fx.situation.loop).toBe(11)
      expect(fx.situation.reversed).toBe(true)

      fx.atStart()
      expect(fx.absPos).toBe(0)
      expect(fx.pos).toBe(0)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.reversed).toBe(false)

      // When the animation is running backward, the start position is 1
      fx.reverse(true).at(14.10, true)
      expect(fx.absPos).toBe(14.10)
      expect(fx.pos).toBeCloseTo(1 - 0.10)
      expect(fx.situation.loop).toBe(14)
      expect(fx.situation.reversed).toBe(true)

      fx.atStart()
      expect(fx.absPos).toBe(0)
      expect(fx.pos).toBe(1)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.reversed).toBe(true)
    })
  })


  describe('atEnd()', function () {
    it('sets the animation at the end', function() {
      // When the animation is running forward, the end position is 1
      this.pos = 0.5
      expect(fx.atEnd().pos).toBe(1)
      expect(fx.situation).toBeNull()

      // Recreate an animation since the other one was ended
      fx.animate()

      // When the animation is running backward, the end position is 0
      this.pos = 0.5
      expect(fx.reverse(true).atEnd().pos).toBe(0)
      expect(fx.situation).toBeNull()
    })

    it('sets the animation at the end, after all loops', function() {
      var loops

      // When the animation is running forward, the end position is 1
      loops = 12
      fx.loop(loops).start().step()
      expect(fx.absPos).toBe(0)
      expect(fx.pos).toBe(0)
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(loops)

      fx.atEnd()
      expect(fx.absPos).toBe(loops)
      expect(fx.pos).toBe(1)
      expect(fx.active).toBe(false)
      expect(fx.situation).toBeNull()

      // Recreate an animation since the other one was ended
      fx.animate()


      // When the animation is running backward, the end position is 0
      loops = 21
      fx.reverse(true).loop(loops).start().step()
      expect(fx.absPos).toBe(0)
      expect(fx.pos).toBe(1)
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(loops)
      expect(fx.situation.reversed).toBe(true)

      fx.atEnd()
      expect(fx.absPos).toBe(loops)
      expect(fx.pos).toBe(0)
      expect(fx.active).toBe(false)
      expect(fx.situation).toBeNull()
    })

    it('sets the animation at the end, after all loops when reversing is true', function() {
      var loops

      // When reversing is true, the end position equal the start position when
      // loops is even

      // The animation is running forward
      loops = 6
      fx.loop(loops, true).start().step()
      expect(fx.absPos).toBe(0)
      expect(fx.pos).toBe(0)
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(loops)
      expect(fx.situation.reversed).toBe(false)

      fx.atEnd()
      expect(fx.absPos).toBe(loops)
      expect(fx.pos).toBe(0) // Equal start position because loops is even
      expect(fx.active).toBe(false)
      expect(fx.situation).toBeNull()

      // Recreate an animation since the other one was ended
      fx.animate()


      // The animation is running backward
      loops = 3
      fx.reverse(true).loop(loops, true).start().step()
      expect(fx.absPos).toBe(0)
      expect(fx.pos).toBe(1)
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(loops)
      expect(fx.situation.reversed).toBe(true)

      fx.atEnd()
      expect(fx.absPos).toBe(loops)
      expect(fx.pos).toBe(0) // Not equal to the start position because loops is odd
      expect(fx.active).toBe(false)
      expect(fx.situation).toBeNull()
    })
  })


  describe('at()', function() {
    it('sets the progress to the specified position', function() {
      var pos

      // Animation running forward
      pos = 0.5
      expect(fx.at(pos).pos).toBe(pos)
      expect(fx.situation.start).toBe(+new Date - fx.situation.duration * pos)

      // Animation running backward
      pos = 0.4
      expect(fx.reverse(true).at(pos).pos).toBe(pos)
      expect(fx.situation.start).toBe(+new Date - fx.situation.duration * (1-pos))
    })

    it('should convert a position to an absolute position', function () {
      var pos, loop, absPos

      fx.loop(true)

      // Animation running forward
      pos = 0.7
      loop = 4
      absPos = pos+loop
      fx.situation.loop = loop
      expect(fx.at(pos).absPos).toBe(absPos)
      expect(fx.situation.start).toBe(+new Date - fx.situation.duration * absPos)

      // Animation running backward
      pos = 0.23
      loop = 9
      absPos = (1-pos)+loop
      fx.situation.loop = loop
      fx.situation.reversed = true
      expect(fx.at(pos).absPos).toBe(absPos)
      expect(fx.situation.start).toBe(+new Date - fx.situation.duration * absPos)

    })

    it('should end the animation when the end position is passed', function() {
      var pos

      fx.start()
      expect(fx.active).toBe(true)
      expect(fx.situation).not.toBeNull()

      // When running forward, the end position is 1
      pos = 1
      expect(fx.at(pos).pos).toBe(pos)
      expect(fx.active).toBe(false)
      expect(fx.situation).toBeNull()

      // Recreate an animation since the other one was ended
      fx.animate().start()
      expect(fx.active).toBe(true)
      expect(fx.situation).not.toBeNull()

      // When running backward, the end position is 0
      pos = 0
      expect(fx.reverse(true).at(pos).pos).toBe(pos)
      expect(fx.active).toBe(false)
      expect(fx.situation).toBeNull()
    })

    it('correct the passed position when it is out of [0,1] and the animation is not looping', function () {
      var pos

      pos = -0.7
      expect(fx.at(pos).pos).toBe(0)

      pos = 1.3
      expect(fx.at(pos).pos).toBe(1)

      // Recreate an animation since the other one was ended
      fx.animate()

      // Should work even when animation is running backward
      pos = 1.3
      expect(fx.reverse(true).at(pos).pos).toBe(1)

      pos = -0.7
      expect(fx.reverse(true).at(pos).pos).toBe(0)
    })

    it('should, when the animation is looping and the passed position is out of [0,1], use the integer part of postion to update the loop counter and set position to its fractional part', function(){
      var loop, pos, posFrac, posInt

      // Without the reverse flag
      fx.loop(10)
      expect(fx.situation.loops).toBe(10)
      expect(fx.situation.loop).toBe(loop = 0)

      pos = 1.3
      posFrac = pos % 1
      posInt = pos - posFrac
      expect(fx.at(pos).pos).toBeCloseTo(posFrac)
      expect(fx.situation.loop).toBe(loop += posInt)

      pos = 7.723
      posFrac = pos % 1
      posInt = pos - posFrac
      expect(fx.at(pos).pos).toBeCloseTo(posFrac)
      expect(fx.situation.loop).toBe(loop += posInt)

      // In this case, pos is above the remaining number of loops, so we expect
      // the position to be set to 1 and the animation to be ended
      pos = 4.3
      posFrac = pos % 1
      posInt = pos - posFrac
      expect(fx.at(pos).pos).toBe(1)
      expect(fx.situation).toBeNull()

      // Recreate an animation since the other one was ended
      fx.animate()

      // With the reverse flag, the position is reversed each time loop is odd
      fx.loop(10, true)
      expect(fx.situation.loops).toBe(10)
      expect(fx.situation.loop).toBe(loop = 0)
      expect(fx.situation.reversed).toBe(false)

      pos = 3.3
      posFrac = pos % 1
      posInt = pos - posFrac
      expect(fx.at(pos).pos).toBeCloseTo(1-posFrac) // Animation is reversed because 0+3 is odd
      expect(fx.situation.loop).toBe(loop += posInt)
      expect(fx.situation.reversed).toBe(true)

      // When the passed position is below 0, the integer part of position is
      // substracted from 1, so, in this case, -0.6 has 1 as is integer part
      // This is necessary so we can add something to the loop counter
      pos = -0.645
      posFrac = (1-pos) % 1
      posInt = (1-pos) - posFrac
      expect(fx.at(pos).pos).toBeCloseTo(posFrac)
      expect(fx.situation.loop).toBe(loop += posInt)
      expect(fx.situation.reversed).toBe(false)

      // In this case, pos is above the remaining number of loop, so we expect
      // the position to be set to 0 (since we end reversed) and the animation to
      // be ended
      pos = 7.2
      posFrac = pos % 1
      posInt = pos - posFrac
      expect(fx.at(pos).pos).toBe(0)
      expect(fx.situation).toBeNull()
    })

    it('should, when the animation is in a infinite loop and the passed position is out of [0,1], use the integer part of postion to update the loop counter and set position to its fractional part', function(){
      var loop, pos, posFrac, posInt

      // Without the reverse flag
      fx.loop(true)
      expect(fx.situation.loops).toBe(true)
      expect(fx.situation.loop).toBe(loop = 0)

      pos = 10.34
      posFrac = pos % 1
      posInt = pos - posFrac
      expect(fx.at(pos).pos).toBeCloseTo(posFrac)
      expect(fx.situation.loop).toBe(loop += posInt)

      // With the reverse flag, the position is reversed each time loop is odd
      fx.loop(true, true)
      expect(fx.situation.loops).toBe(true)
      expect(fx.situation.loop).toBe(loop = 0)
      expect(fx.situation.reversed).toBe(false)

      pos = 3.3
      posFrac = pos % 1
      posInt = pos - posFrac
      expect(fx.at(pos).pos).toBeCloseTo(1-posFrac) // Animation is reversed because 3+0 is odd
      expect(fx.situation.loop).toBe(loop += posInt)
      expect(fx.situation.reversed).toBe(true)

      pos = -8.41
      posFrac = (1-pos) % 1
      posInt = (1-pos) - posFrac
      expect(fx.at(pos).pos).toBeCloseTo(posFrac)
      expect(fx.situation.loop).toBe(loop += posInt)
      expect(fx.situation.reversed).toBe(false)
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

    it('should consider the first parameter as an absolute position when the second parameter is true', function() {
      var absPos

      fx.loop(true)

      absPos = 3.2
      expect(fx.at(absPos, true).absPos).toBe(absPos)

      absPos = -4.27
      expect(fx.at(absPos, true).absPos).toBe(absPos)

      absPos = 0
      expect(fx.at(absPos, true).absPos).toBe(absPos)

      absPos = 1
      expect(fx.at(absPos, true).absPos).toBe(absPos)
    })
  })


  describe('start()', function(){
    it('starts the animation', function() {
      fx.start()
      expect(fx.active).toBe(true)

      jasmine.clock().tick(200)
      fx.step() // Call step to update the animation

      expect(fx.pos).toBeGreaterThan(0)
    })

    it('should take speed into consideration', function() {
      var dur = 500
        , delay = 300
        , spd = 4


      fx.stop().animate(dur, '-', delay).speed(spd).start()
      expect(fx.situation.finish - new Date).toBe(delay/spd + dur/spd)
    })

    it('should do the delay', function() {
      fx.situation.delay = 1000
      expect(fx.start().active).toBe(true)

      jasmine.clock().tick(501)
      fx.step() // Call step to update the animation
      expect(fx.active).toBe(true)

      jasmine.clock().tick(501)
      fx.step() // Call step to update the animation
      expect(fx.active).toBe(true)

      jasmine.clock().tick(501)
      fx.step() // Call step to update the animation
      expect(fx.active).toBe(false)
    })
  })

  describe('delay()', function() {
    it('should push an empty situation with its duration attribute set to the duration of the delay', function() {
      var delay = 8300
      fx.delay(delay)
      expect(fx.situations[0].duration).toBe(delay)
    })
  })


  describe('pause()', function() {
    it('pause the animation', function() {
      expect(fx.pause().paused).toBe(true)
    })
  })

  describe('play()', function() {
    it('unpause the animation', function() {
      var start = fx.start().pause().situation.start

      jasmine.clock().tick(200)

      expect(fx.situation.start).toBe(start)
      expect(fx.play().paused).toBe(false)
      expect(fx.situation.start).not.toBe(start)
    })

    it('should not change the position when the animation is unpaused while it is set to run backward', function(){
      var pos = 0.4

      expect(fx.reverse(true).at(pos).pause().play().pos).toBe(pos)
    })

    it('should be able to unpause the delay', function () {
      fx.stop().animate(500, '-', 300).start().step()
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBeCloseTo(-0.6)

      // At this point, we should have an animation of 500 ms with a delay of
      // 300 ms that should be running.

      jasmine.clock().tick(150)

      // Should be halfway through the delay
      fx.step()
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(-0.3)

      expect(fx.pause().paused).toBe(true) // Pause the delay

      jasmine.clock().tick(150)

      // Unpause, should still be halfway through the delay
      expect(fx.play().paused).toBe(false)
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(-0.3)

      jasmine.clock().tick(150)

      // Delay should be done
      fx.step()
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(0)

      jasmine.clock().tick(500)

      // Animation and delay should be done
      fx.step()
      expect(fx.active).toBe(false)
      expect(fx.pos).toBe(1)
      expect(fx.absPos).toBe(1)
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

      expect(fx.reverse(true).at(pos).speed(2).pos).toBe(pos)
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

    it('should affect all animations in the queue', function(){
      fx.speed(2).animate(300)
      expect(fx.situations.length).not.toBe(0)
      expect(fx.pos).not.toBe(1)

      // At this point, there should be 2 animations in the queue to be played:
      // the one of 500ms that is added before every test and the one of 300ms
      // we just added. Normally, it would take 800ms before both of these
      // animations are done, but because we set the speed to 2, it should
      // only take 400ms to do both animations.
      fx.start().step()

      jasmine.clock().tick(250)

      // Should be playing the second animation
      fx.step()
      expect(fx.active).toBe(true)
      expect(fx.situations.length).toBe(0)
      expect(fx.pos).not.toBe(1)

      jasmine.clock().tick(150) // 400ms have passed

      // All animations should be done
      fx.step()
      expect(fx.active).toBe(false)
      expect(fx.situations.length).toBe(0)
      expect(fx.pos).toBe(1)
    })

    it('should affect the delay', function() {
      fx.stop().animate(500, '-', 300).start().step()
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBeCloseTo(-0.6)

      fx.speed(2)
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBeCloseTo(-0.6)

      // At this point, we should have an animation of 500 ms with a delay of
      // 300 ms that should be running. Normally, it would take 800 ms for the
      // animation and its delay to complete, but because the speed is set to 2
      // , it should only take 400ms

      jasmine.clock().tick(75)

      // Should be halfway through the delay
      fx.step()
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(-0.3)

      jasmine.clock().tick(75)

      // Delay should be done
      fx.step()
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(0)

      jasmine.clock().tick(250)

      // Animation and delay should be done
      fx.step()
      expect(fx.active).toBe(false)
      expect(fx.pos).toBe(1)
      expect(fx.absPos).toBe(1)
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


  describe('queue()', function() {
    it('can add a situation to the queue', function() {
      var situation = new SVG.Situation({duration: 1000, delay: 0, ease: SVG.easing['-']})

      fx.queue(situation)
      expect(fx.situations[0]).toBe(situation)
    })

    it('can add a function to the queue', function() {
      var f = function(){}

      fx.queue(f)
      expect(fx.situations[0]).toBe(f)
    })

    it('should set the situation attribute before pushing something in the situations queue', function(){
      var situation = new SVG.Situation({duration: 1000, delay: 0, ease: SVG.easing['-']})

      // Clear the animation that is created before each test
      fx.stop()

      expect(fx.situation).toBeNull()
      expect(fx.situations.length).toBe(0)
      fx.queue(situation)
      expect(fx.situation).toBe(situation)
      expect(fx.situations.length).toBe(0)
    })
  })


  describe('dequeue()', function() {
    it('should pull the next situtation from the queue', function() {
      var situation = new SVG.Situation({duration: 1000, delay: 0, ease: SVG.easing['-']})

      fx.queue(situation)
      expect(fx.situtation).not.toBe(situation)
      expect(fx.situations[0]).toBe(situation)

      fx.dequeue()
      expect(fx.situation).toBe(situation)
      expect(fx.situations.length).toBe(0)
    })

    it('initialize the animation pulled from the queue to its start position', function() {
      // When the animation is forward, the start position is 0
      fx.animate()
      fx.pos = 0.5
      expect(fx.dequeue().pos).toBe(0)

      // When the animation backward, the start position is 1
      fx.animate().reverse(true)
      fx.pos = 0.5
      expect(fx.dequeue().pos).toBe(1)
    })

    it('when the first element of the queue is a function, it should execute it', function() {
      var called = false

      fx.queue(function(){ called=true; expect(this).toBe(fx) }).dequeue()
      expect(called).toBe(true)
    })
  })


  describe('stop()', function() {
    it('stops the animation immediately without a parameter', function() {
      fx.animate(500).start()
      expect(fx.stop().situation).toBeNull()
      expect(fx.active).toBe(false)
      expect(fx.situations.length).toBe(1)
    })
  })

  describe('stop()', function() {
    it('stops the animation immediately and fullfill it if first parameter true', function() {
      fx.animate(500).start()
      expect(fx.stop(true).situation).toBeNull()
      expect(fx.active).toBe(false)
      expect(fx.pos).toBe(1)
      expect(fx.situations.length).toBe(1)
    })
  })

  describe('stop()', function() {
    it('stops the animation immediately and remove all items from queue when second parameter true', function() {
      fx.animate(500).start()
      expect(fx.stop(false, true).situation).toBeNull()
      expect(fx.active).toBe(false)
      expect(fx.situations.length).toBe(0)
    })
  })


  describe('reset()', function() {
    it('resets the element to the state it was when the current animation was started', function() {
      var loops = 4
        , situation = fx.situation

      // These settings make the animations run backward
      fx.situation.loop = 2
      fx.situation.loops = loops
      fx.situation.reversed = true
      fx.pos = 0.5
      fx.absPos = 2.5

      fx.reset()

      expect(fx.situation).toBe(situation)
      expect(fx.situation.loops).toBe(loops)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.reversed).toBe(true) // True because the animation is backward
      expect(fx.pos).toBe(1)
      expect(fx.absPos).toBe(0)
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
    it('adds a callback which is called when the current animation is finished', function() {
      var called = false

      fx.start().after(function(situation){
        expect(fx.situation).toBe(situation)
        expect(fx.pos).toBe(1)
        called = true
      })

      jasmine.clock().tick(500)
      fx.step()
      expect(called).toBe(true)
    })
  })


  describe('afterAll()', function() {
    it('adds a callback which is called when all animations are finished', function() {
      var called = false

      fx.animate(150).animate(125).start().afterAll(function(){
        expect(fx.pos).toBe(1)
        expect(fx.situations.length).toBe(0)
        called = true
      })

      expect(fx.situations.length).toBe(2)

      // End of the first animation
      jasmine.clock().tick(500)
      fx.step()
      expect(fx.situations.length).toBe(1)
      expect(called).toBe(false)

      // End of the second animation
      jasmine.clock().tick(150)
      fx.step()
      expect(fx.situations.length).toBe(0)
      expect(called).toBe(false)

      // End of the third and last animation
      jasmine.clock().tick(125)
      fx.step()
      expect(fx.situation).toBeNull()
      expect(called).toBe(true)
    })
  })


  describe('during()', function() {
    it('adds a callback which is called on every animation step', function() {
      var called = 0

      fx.start().during(function(pos, morph, eased, situation){

        expect(fx.situation).toBe(situation)

        switch(++called) {
          case 1:
            expect(pos).toBeCloseTo(0.25)
            break

          case 2:
            expect(pos).toBeCloseTo(0.5)
            break

          case 3:
            expect(pos).toBeCloseTo(0.65)
            break

          case 4:
            expect(pos).toBe(1)
            break
        }

        expect(morph(0, 100)).toBeCloseTo(pos*100)

      })

      jasmine.clock().tick(125)
      fx.step()
      expect(called).toBe(1)

      jasmine.clock().tick(125) // 250 ms have passed
      fx.step()
      expect(called).toBe(2)

      jasmine.clock().tick(75) // 325 ms have passed
      fx.step()
      expect(called).toBe(3)

      jasmine.clock().tick(175) // 500 ms have passed
      fx.step()
      expect(called).toBe(4)
    })
  })


  describe('duringAll()', function() {
    it('adds a callback which is called on every animation step for the whole chain', function() {

      fx.finish()
      rect.off('.fx')

      fx.animate(500).start().animate(500)

      var sit = null

      var pos1 = false
      var pos2 = false

      fx.duringAll(function(pos, morph, eased, situation){

        if(pos1){
          pos1 = false
          sit = situation
          expect(this.fx.pos).toBeCloseTo(0.6)
        }

        if(pos2){
          pos2 = null
          expect(situation).not.toBe(sit)
          expect(this.fx.pos).toBeCloseTo(0.75)
        }
      })

      pos1 = true
      jasmine.clock().tick(300)
      fx.step()

      jasmine.clock().tick(200) // End of the first animation
      fx.step()

      pos2 = true
      jasmine.clock().tick(375)
      fx.step()

      if(pos1 || pos2) {
        fail('Not enough situations called')
      }
    })
  })


  describe('once()', function() {
    it('adds a callback which is called once at the specified position', function() {
      var called = false

      fx.start().once(0.5, function(pos, eased){
        called = true
        expect(pos).toBeCloseTo(0.5)
      })

      jasmine.clock().tick(125)
      fx.step()
      expect(called).toBe(false)

      jasmine.clock().tick(125) // 250 ms have passed
      fx.step()
      expect(called).toBe(true)
    })
  })


  describe('loop()', function() {
    it('should create an eternal loop when no arguments are given', function() {
      var time = 10523, dur = fx.situation.duration

      fx.loop()
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(true)
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(0)

      fx.start().step()
      jasmine.clock().tick(time)
      fx.step()

      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe( Math.floor(time/dur) )
      expect(fx.situation.loops).toBe(true)
      expect(fx.pos).toBeCloseTo((time/dur) % 1)
      expect(fx.absPos).toBeCloseTo(time/dur)
    })

    it('should create an eternal loop when the first argument is true', function() {
      var time = 850452, dur = fx.situation.duration

      fx.loop(true)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(true)
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(0)

      fx.start().step()
      jasmine.clock().tick(time)
      fx.step()

      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe( Math.floor(time/dur) )
      expect(fx.situation.loops).toBe(true)
      expect(fx.pos).toBeCloseTo((time/dur) % 1)
      expect(fx.absPos).toBeCloseTo(time/dur)
    })

    it('should loop for the specified number of times', function() {
      var time = 0, dur = fx.situation.duration

      fx.loop(3)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(3)
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(0)

      fx.start().step()
      jasmine.clock().tick(200)
      time = 200

      fx.step()
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(3)
      expect(fx.pos).toBeCloseTo((time/dur) % 1)
      expect(fx.absPos).toBeCloseTo(time/dur)

      jasmine.clock().tick(550)
      time += 550 // time at 750

      fx.step()
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(1)
      expect(fx.situation.loops).toBe(3)
      expect(fx.pos).toBeCloseTo((time/dur) % 1)
      expect(fx.absPos).toBeCloseTo(time/dur)

      jasmine.clock().tick(570)
      time += 570 // time at 1320

      fx.step()
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(2)
      expect(fx.situation.loops).toBe(3)
      expect(fx.pos).toBeCloseTo((time/dur) % 1)
      expect(fx.absPos).toBeCloseTo(time/dur)

      jasmine.clock().tick(180)
      time += 180 // time at 1500

      fx.step()
      expect(fx.active).toBe(false)
      expect(fx.situation).toBeNull()
      expect(fx.pos).toBe(1)
      expect(fx.absPos).toBe(3)
    })

    it('should go from beginning to end and start over again (0->1.0->1.0->1.) by default', function() {
      var time = 0, dur = fx.situation.duration

      fx.loop(2)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(2)
      expect(fx.situation.reversing).toBe(false)
      expect(fx.situation.reversed).toBe(false)
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(0)

      fx.start().step()
      jasmine.clock().tick(325)
      time = 325

      fx.step()
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(2)
      expect(fx.situation.reversing).toBe(false)
      expect(fx.situation.reversed).toBe(false)
      expect(fx.pos).toBeCloseTo((time/dur) % 1)
      expect(fx.absPos).toBeCloseTo(time/dur)

      jasmine.clock().tick(575)
      time += 575 // time at 900

      fx.step()
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(1)
      expect(fx.situation.loops).toBe(2)
      expect(fx.situation.reversing).toBe(false)
      expect(fx.situation.reversed).toBe(false)
      expect(fx.pos).toBeCloseTo((time/dur) % 1)
      expect(fx.absPos).toBeCloseTo(time/dur)

      jasmine.clock().tick(200)
      time += 200 // time at 1100

      fx.step()
      expect(fx.active).toBe(false)
      expect(fx.situation).toBeNull()
      expect(fx.pos).toBe(1)
      expect(fx.absPos).toBe(2)
    })

    it('should be completely reversed before starting over (0->1->0->1->0->1.) when the reverse flag is passed', function() {
      var time = 0, dur = fx.situation.duration

      fx.loop(2, true)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(2)
      expect(fx.situation.reversing).toBe(true)
      expect(fx.situation.reversed).toBe(false)
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(0)

      fx.start().step()
      jasmine.clock().tick(325)
      time = 325

      fx.step()
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(2)
      expect(fx.situation.reversing).toBe(true)
      expect(fx.situation.reversed).toBe(false)
      expect(fx.pos).toBeCloseTo((time/dur) % 1)
      expect(fx.absPos).toBeCloseTo(time/dur)

      jasmine.clock().tick(575)
      time += 575 // time at 900

      fx.step()
      expect(fx.active).toBe(true)
      expect(fx.situation.loop).toBe(1)
      expect(fx.situation.loops).toBe(2)
      expect(fx.situation.reversing).toBe(true)
      expect(fx.situation.reversed).toBe(true)
      expect(fx.pos).toBeCloseTo(1 - (time/dur) % 1)
      expect(fx.absPos).toBeCloseTo(time/dur)

      jasmine.clock().tick(200)
      time += 200 // time at 1100

      fx.step()
      expect(fx.active).toBe(false)
      expect(fx.situation).toBeNull()
      expect(fx.pos).toBe(0)
      expect(fx.absPos).toBe(2)
    })

    it('should be applied on the last situation', function() {
      fx.loop(5)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(5)
      expect(fx.situation.reversing).toBe(false)

      fx.animate().loop(3, true)
      expect(fx.situation.loop).toBe(0)
      expect(fx.situation.loops).toBe(5)
      expect(fx.situation.reversing).toBe(false)

      var c = fx.last()
      expect(c.loop).toBe(0)
      expect(c.loops).toBe(3)
      expect(c.reversing).toBe(true)
    })

    it('should be possible to call it with false as the first argument', function() {
      fx.situation.loops = true
      fx.loop(false)
      expect(fx.situation.loops).toBe(false)
    })
  })


  describe('step()', function() {
    it('should not recalculate the absolute position if the first parameter is true', function() {
      var absPos

      // We shift start to help us see if the absolute position get recalculated
      // If it get recalculated, the result would be 0.5
      fx.situation.start -= 250

      absPos = 0.4
      fx.absPos = absPos
      expect(fx.step(true).absPos).toBe(absPos)

      absPos = 0
      fx.absPos = absPos
      expect(fx.step(true).absPos).toBe(absPos)

      absPos = -3.7
      fx.absPos = absPos
      expect(fx.step(true).absPos).toBe(absPos)

      absPos = 1
      fx.absPos = absPos
      expect(fx.step(true).absPos).toBe(absPos)
    })

    it('should not allow an absolute position to be above the end', function() {
      var absPos, loops

      // With no loops, absolute position should not go above 1
      absPos = 4.26
      fx.absPos = absPos
      expect(fx.step(true).absPos).toBe(1)
      expect(fx.situation).toBeNull()

      fx.animate() // Recreate an animation since the other one was ended

      // With loops, absolute position should not go above loops
      loops = 4
      absPos = 7.42
      fx.absPos = absPos
      expect(fx.loop(loops).step(true).absPos).toBe(loops)
      expect(fx.situation).toBeNull()
    })

    describe('when converting an absolute position to a position', function() {
      it('should, when the absolute position is below the maximum number of loops, use the integer part of the absolute position to set the loop counter and use its fractional part to set the position', function(){
        var absPos, absPosFrac, absPosInt, loops

        // Without the reverse flag
        loops = 12
        absPos = 4.52
        absPosInt = Math.floor(absPos)
        absPosFrac = absPos - absPosInt
        fx.absPos = absPos
        fx.loop(loops).step(true)
        expect(fx.pos).toBe(absPosFrac)
        expect(fx.situation.loop).toBe(absPosInt)

        fx.stop().animate()

        loops = true
        absPos = 2.57
        absPosInt = Math.floor(absPos)
        absPosFrac = absPos - absPosInt
        fx.absPos = absPos
        fx.loop(loops).step(true)
        expect(fx.pos).toBe(absPosFrac)
        expect(fx.situation.loop).toBe(absPosInt)

        fx.stop().animate()

        // With the reverse flag, the position is reversed at each odd loop
        loops = 412
        absPos = 6.14
        absPosInt = Math.floor(absPos)
        absPosFrac = absPos - absPosInt
        fx.absPos = absPos
        fx.loop(loops, true).step(true)
        expect(fx.pos).toBe(absPosFrac)
        expect(fx.situation.loop).toBe(absPosInt)
        expect(fx.situation.reversed).toBe(false)

        fx.stop().animate()

        loops = true
        absPos = 5.12
        absPosInt = Math.floor(absPos)
        absPosFrac = absPos - absPosInt
        fx.absPos = absPos
        fx.loop(loops, true).step(true)
        expect(fx.pos).toBe(1-absPosFrac) // Odd loop, so it is reversed
        expect(fx.situation.loop).toBe(absPosInt)
        expect(fx.situation.reversed).toBe(true)

        fx.stop().animate()

        // When the animation is set to run backward, it is the opposite, the position is reversed at each even loop
        loops = 14
        absPos = 8.46
        absPosInt = Math.floor(absPos)
        absPosFrac = absPos - absPosInt
        fx.absPos = absPos
        fx.reverse(true).loop(loops, true).step(true)
        expect(fx.pos).toBe(1-absPosFrac) // Even loop, so it is reversed
        expect(fx.situation.loop).toBe(absPosInt)
        expect(fx.situation.reversed).toBe(true)

        fx.stop().animate()

        loops = true
        absPos = 3.12
        absPosInt = Math.floor(absPos)
        absPosFrac = absPos - absPosInt
        fx.absPos = absPos
        fx.reverse(true).loop(loops, true).step(true)
        expect(fx.pos).toBe(absPosFrac)
        expect(fx.situation.loop).toBe(absPosInt)
        expect(fx.situation.reversed).toBe(false)
      })

      it('should, when the absolute position is above or equal to the the maximum number of loops, set the position to its end value and end the animation', function() {
        var absPos, loops

        // Without the reverse flag, the end value of position is 1
        loops = 6
        absPos = 13.52
        fx.absPos = absPos
        fx.loop(loops).step(true)
        expect(fx.pos).toBe(1)
        expect(fx.situation).toBeNull()

        fx.animate() // Recreate an animation since the other one was ended

        loops = false
        absPos = 146.22
        fx.absPos = absPos
        fx.loop(loops).step(true)
        expect(fx.pos).toBe(1)
        expect(fx.situation).toBeNull()

        fx.animate() // Recreate an animation since the other one was ended

        // With the reverse flag, the end value of position is 0 when loops is even and 1 when loops is an odd number or false
        loops = 6
        absPos = 6
        fx.absPos = absPos
        fx.loop(loops, true).step(true)
        expect(fx.pos).toBe(0) // Even loops
        expect(fx.situation).toBeNull()

        fx.animate() // Recreate an animation since the other one was ended

        loops = false
        absPos = 4.47
        fx.absPos = absPos
        fx.loop(loops, true).step(true)
        expect(fx.pos).toBe(1) // 1 since loops is false
        expect(fx.situation).toBeNull()

        fx.animate() // Recreate an animation since the other one was ended

        // When the animation is set to run backward, it is the opposite, the end value of position is 1 when loops is even and 0 when loops is an odd number or false
        loops = 8
        absPos = 12.65
        fx.absPos = absPos
        fx.reverse(true).loop(loops, true).step(true)
        expect(fx.pos).toBe(1) // Even loops
        expect(fx.situation).toBeNull()

        fx.animate() // Recreate an animation since the other one was ended

        loops = 11
        absPos = 12.41
        fx.absPos = absPos
        fx.reverse(true).loop(loops, true).step(true)
        expect(fx.pos).toBe(0) // Odd loops
        expect(fx.situation).toBeNull()
      })

      it('should set the position to its start value when the absolute position is below 0', function() {
        var absPos

        // When the animation is not set to run backward the start value is 0
        absPos = -2.27
        fx.loop(7)
        fx.situation.loop = 3
        fx.absPos = absPos
        fx.step(true)
        expect(fx.pos).toBe(0)
        expect(fx.absPos).toBe(absPos)
        expect(fx.situation.loop).toBe(0)

        fx.stop().animate()

        // When the animation is set to run backward the start value is 1
        absPos = -4.12
        fx.absPos = absPos
        fx.reverse(true).step(true)
        expect(fx.pos).toBe(1)
        expect(fx.absPos).toBe(absPos)
      })

      it('should, when looping with the reverse flag, toggle reversed only when the difference between the new value of loop counter and its old value is odd', function() {
        // The new value of the loop counter is the integer part of absPos

        fx.loop(9, true)
        expect(fx.situation.loop).toBe(0)
        expect(fx.pos).toBe(0)
        expect(fx.situation.reversed).toBe(false)

        fx.absPos = 3
        fx.step(true)
        expect(fx.situation.reversed).toBe(true) // (3-0) is odd

        fx.absPos = 1
        fx.step(true)
        expect(fx.situation.reversed).toBe(true) // (1-3) is even

        fx.absPos = 6
        fx.step(true)
        expect(fx.situation.reversed).toBe(false) // (6-1) is odd

        fx.absPos = 9
        fx.step(true)
        expect(fx.situation).toBeNull()
        expect(fx.pos).toBe(1) // It should end not reversed, which mean the position is expected to be 1
                               // ((9-1)-6) is even, the -1 is because we do not want reversed to be toggled after the last loop
      })
    })
  })


  it('animates the x/y-attr', function() {
    var called = false

    fx.move(200,200).after(function(){

      expect(rect.x()).toBe(200)
      expect(rect.y()).toBe(200)
      called = true

    })

    jasmine.clock().tick(250)
    fx.step()
    expect(rect.x()).toBeGreaterThan(100)
    expect(rect.y()).toBeGreaterThan(100)

    jasmine.clock().tick(250)
    fx.step()
    expect(called).toBe(true)
  })


  it('animates matrix', function() {
    var ctm, called = false

    fx.transform({a:0.8, b:0.4, c:-0.15, d:0.7, e: 90.3, f: 27.07}).after(function(){

      var ctm = rect.ctm()
      expect(ctm.a).toBeCloseTo(0.8)
      expect(ctm.b).toBeCloseTo(0.4)
      expect(ctm.c).toBeCloseTo(-0.15)
      expect(ctm.d).toBeCloseTo(0.7)
      expect(ctm.e).toBeCloseTo(90.3)
      expect(ctm.f).toBeCloseTo(27.07)
      called = true

    })

    jasmine.clock().tick(250)
    fx.step()
    ctm = rect.ctm()
    expect(ctm.a).toBeLessThan(1)
    expect(ctm.b).toBeGreaterThan(0)
    expect(ctm.c).toBeLessThan(0)
    expect(ctm.d).toBeGreaterThan(0)
    expect(ctm.e).toBeGreaterThan(0)
    expect(ctm.f).toBeGreaterThan(0)

    jasmine.clock().tick(250)
    fx.step()
    expect(called).toBe(true)
  })

  it('animate a scale transform using the passed center point when there is already a transform in place', function(){
    var ctm

    // When no ceter point is passed to the method scale, it use the center of the element as the center point

    rect.scale(2) // The transform in place

    fx.scale(0.5)
    jasmine.clock().tick(500) // Have the animation reach its end
    fx.step()

    ctm = rect.ctm()
    expect(ctm.a).toBe(0.5)
    expect(ctm.b).toBe(0)
    expect(ctm.c).toBe(0)
    expect(ctm.d).toBe(0.5)
    expect(ctm.e).toBe(75)
    expect(ctm.f).toBe(75)
  })

  it('animate relative matrix transform', function(){
    var ctm

    fx.transform(new SVG.Matrix().scale(2,0,0), true)

    jasmine.clock().tick(250) // Have the animation be half way
    fx.step()

    ctm = rect.ctm()
    expect(ctm.a).toBe(1.5)
    expect(ctm.b).toBe(0)
    expect(ctm.c).toBe(0)
    expect(ctm.d).toBe(1.5)
    expect(ctm.e).toBe(0)
    expect(ctm.f).toBe(0)

    jasmine.clock().tick(250) // Have the animation reach its end
    fx.step()

    ctm = rect.ctm()
    expect(ctm.a).toBe(2)
    expect(ctm.b).toBe(0)
    expect(ctm.c).toBe(0)
    expect(ctm.d).toBe(2)
    expect(ctm.e).toBe(0)
    expect(ctm.f).toBe(0)
  })
})
