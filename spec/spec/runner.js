describe('SVG.Runner', function () {

  var initFn = jasmine.createSpy('initFn')
  var runFn = jasmine.createSpy('runFn')

  beforeEach(function () {
    initFn.calls.reset()
    runFn.calls.reset()
  })

  describe('())', function () {
    it('creates a runner with defaults', function () {
      var runner = new SVG.Runner()
      expect(runner instanceof SVG.Runner).toBe(true)
      expect(runner._duration).toBe(SVG.defaults.timeline.duration)
      expect(runner._stepper instanceof SVG.Ease).toBe(true)
    })

    it('creates a runner with duration set', function () {
      var runner = new SVG.Runner(1000)
      expect(runner instanceof SVG.Runner).toBe(true)
      expect(runner._duration).toBe(1000)
      expect(runner._stepper instanceof SVG.Ease).toBe(true)
    })

    it('creates a runner with controller set', function () {
      var runner = new SVG.Runner(runFn)
      expect(runner instanceof SVG.Runner).toBe(true)
      expect(runner._duration).toBeFalsy()
      expect(runner._stepper instanceof SVG.Controller).toBe(true)
    })
  })

  describe('constructors', function () {
    describe('animate()', function () {
      it('creates a runner with the element set and schedules it on the timeline', function () {
        var orginalRunner = SVG.Runner
        spyOn(SVG, 'Runner').and.callFake(function() {
          return new orginalRunner()
        })

        var element = SVG('<rect>')
        var runner = element.animate()
        expect(SVG.Runner).toHaveBeenCalled();
        expect(runner instanceof SVG.Runner)
        expect(runner.element()).toBe(element)
        expect(element.timeline()._runners.length).toBe(1)
      })
    })

    describe('delay()', function () {
      it('calls animate with correct parameters', function () {
        var element = SVG('<rect>')

        spyOn(element, 'animate')
        element.delay(100, 'now')
        expect(element.animate).toHaveBeenCalledWith(0, 100, 'now')
      })
    })
  })

  describe('queue()', function () {
    it('adds another closure to the runner', function () {
      var runner = new SVG.Runner()
      runner.queue(initFn, runFn, true)

      expect(runner._queue[0]).toEqual(jasmine.objectContaining({
        alwaysInitialise: true,
        initialiser: initFn,
        initialised: false,
        runner: runFn
      }))
    })
  })

  describe('tag()', function () {
    it('acts as a getter', function () {
      var runner = new SVG.Runner()

      runner.tags = {foo: true}
      expect(runner.tag()).toEqual(jasmine.arrayContaining(['foo']))
    })

    it('sets one tag with a string given', function () {
      var runner = new SVG.Runner()

      runner.tag('foo')
      expect(runner.tags).toEqual(jasmine.objectContaining({foo: true}))
    })

    it('sets multiple tags with an array given', function () {
      var runner = new SVG.Runner()

      runner.tag(['foo', 'bar', 'baz'])
      expect(runner.tags).toEqual(jasmine.objectContaining({foo: true, bar: true, baz: true}))
    })
  })

  describe('untag()', function () {
    it('untags with a string given', function () {
      var runner = new SVG.Runner()

      runner.tag('foo')
      runner.untag('foo')
      expect(runner.tags).toEqual(jasmine.objectContaining({}))
    })

    it('untags multiple tags with an array given', function () {
      var runner = new SVG.Runner()

      runner.tag(['foo', 'bar', 'baz'])
      runner.untag(['bar', 'baz'])
      expect(runner.tags).toEqual(jasmine.objectContaining({foo: true}))
    })
  })


  describe('step()', function () {

    it('returns itself', function () {
      var runner = new SVG.Runner()
      expect(runner.step()).toBe(runner)
    })

    it('calls initFn once and runFn at every step when alwaysInitialise is false', function() {
      var runner = new SVG.Runner()
      runner.queue(initFn, runFn, false)

      runner.step()
      expect(initFn).toHaveBeenCalled()
      expect(runFn).toHaveBeenCalled()

      runner.step()
      expect(initFn.calls.count()).toBe(1)
      expect(runFn.calls.count()).toBe(2)
    })

    it('calls initFn and runFn at every step when alwaysInitialise is true', function() {
      var runner = new SVG.Runner()
      runner.queue(initFn, runFn, true)

      runner.step()
      expect(initFn).toHaveBeenCalled()
      expect(runFn).toHaveBeenCalled()

      runner.step()
      expect(initFn.calls.count()).toBe(2)
      expect(runFn.calls.count()).toBe(2)
    })

    function getLoop(r) {
      var loopDuration = r._duration + r._wait
      var loopsDone = Math.floor(r._time / loopDuration)
      return loopsDone
    }

    // step in time
    it('steps forward a certain time', function () {
      var spy = jasmine.createSpy('stepper')
      var r = new SVG.Runner(1000).loop(10, false, 100)
      r.queue(null, spy)

      r.step(300) // should be 0.3s
      expect(spy).toHaveBeenCalledWith(0.3)
      expect(getLoop(r)).toBe(0)

      r.step(300) // should be 0.6s
      expect(spy).toHaveBeenCalledWith(0.6)
      expect(getLoop(r)).toBe(0)

      r.step(600) // should be 0.1s
      expect(spy).toHaveBeenCalledWith(0.1)
      expect(getLoop(r)).toBe(1)

      r.step(-300) // should be 0.9s
      expect(spy).toHaveBeenCalledWith(0.9)
      expect(getLoop(r)).toBe(0)

      r.step(2000) // should be 0.7s
      expect(spy).toHaveBeenCalledWith(0.7)
      expect(getLoop(r)).toBe(2)

      r.step(-2000) // should be 0.9s
      expect(spy).toHaveBeenCalledWith(0.9)
      expect(getLoop(r)).toBe(0)
    })

    it('handles dts which are bigger than the animation time', function () {
      var runner = new SVG.Runner(1000)
      runner.queue(initFn, runFn, true)

      runner.step(1100)
      expect(initFn).toHaveBeenCalled()
      expect(runFn).toHaveBeenCalledWith(1)
    })
  })

  describe('active()', function () {
    it('acts as a getter without parameters', function () {
      var runner = new SVG.Runner()
      expect(runner.active()).toBe(true)
    })

    it('disables the runner when false is passed', function () {
      var runner = new SVG.Runner()
      expect(runner.active(false)).toBe(runner)
      expect(runner.active()).toBe(false)
    })

    it('enables the runner when true is passed', function () {
      var runner = new SVG.Runner()
      expect(runner.active(false)).toBe(runner)
      expect(runner.active(true)).toBe(runner)
      expect(runner.active()).toBe(true)
    })
  })

  describe('time()', function () {
    it('returns itself', function () {
      var runner = new SVG.Runner()
      expect(runner.time(0)).toBe(runner)
    })

    it('acts as a getter with no parameter passed', function () {
      var runner = new SVG.Runner()
      expect(runner.time()).toBe(0)
    })

    it('reschedules the runner to a new time', function () {
      var runner = new SVG.Runner()
      runner.time(10)

      expect(runner.time()).toBe(10)
    })

    it('calls step to reschedule', function () {
      var runner = new SVG.Runner()
      spyOn(runner, 'step')
      runner.time(10)

      expect(runner.step).toHaveBeenCalledWith(10)
    })
  })

  describe('position()', function () {
    it('get the position of a runner', function () {
      var spy = jasmine.createSpy('stepper')
      var runner = new SVG.Runner(1000).queue(null, spy)

      runner.step(300)
      expect(spy).toHaveBeenCalledWith(0.3)

      expect(runner.position()).toBe(0.3)
    })
    it('sets the position of the runner', function () {
      var spy = jasmine.createSpy('stepper')
      var runner = new SVG.Runner(1000).queue(null, spy)

      expect(runner.position(0.5).position()).toBe(0.5)
      expect(spy).toHaveBeenCalledWith(0.5)

      expect(runner.position(0.1).position()).toBe(0.1)
      expect(spy).toHaveBeenCalledWith(0.1)

      expect(runner.position(1.5).position()).toBe(1)
      expect(spy).toHaveBeenCalledWith(1)
    })
    it('sets the position of the runner in a loop', function () {
      var spy = jasmine.createSpy('stepper')
      var runner = new SVG.Runner(1000).loop(5, true, 500).queue(null, spy)

      expect(runner.position(1.3).position()).toBe(1.3)
      expect(spy).toHaveBeenCalledWith(0.7)

      expect(runner.position(0.3).position()).toBe(0.3)
    })
  })

  describe('element()', function () {
    it('returns the element bound to this runner if any', function () {
      var runner1 = new SVG.Runner()
      expect(runner1.element()).toBe(null)

      var element = SVG('<rect>')
      var runner2 = element.animate()
      expect(runner2.element()).toBe(element)
    })

    it('sets an element to be bound to the runner', function () {
      var runner = new SVG.Runner()
      var element = SVG('<rect>')
      runner.element(element)
      expect(runner.element()).toBe(element)
    })
  })

  describe('during()', function () {
    it('returns itself', function () {
      var runner = new SVG.Runner()
      expect(runner.during(runFn)).toBe(runner)
    })

    it('calls queue passing only a function to call on every step', function () {
      var runner = new SVG.Runner()
      spyOn(runner, 'queue')
      runner.during(runFn)

      expect(runner.queue).toHaveBeenCalledWith(null, runFn)
    })
  })

  describe('finish()', function () {
    it('returns itself', function () {
      var runner = new SVG.Runner()
      expect(runner.finish()).toBe(runner)
    })

    it('calls step with Infinity as argument', function () {
      var runner = new SVG.Runner()
      spyOn(runner, 'step')
      runner.finish()

      expect(runner.step).toHaveBeenCalledWith(Infinity)
    })
  })

  describe('reverse()', function () {
    it('returns itself', function () {
      var runner = new SVG.Runner()
      expect(runner.reverse()).toBe(runner)
    })

    it('reverses the runner', function () {
      var spy = jasmine.createSpy('stepper')
      var runner = new SVG.Runner(1000).reverse().queue(null, spy)
      runner.step(750)
      expect(spy).toHaveBeenCalledWith(0.25)
    })
  })

  describe('ease()', function () {
    it('returns itself', function () {
      var runner = new SVG.Runner()
      expect(runner.ease(function () {})).toBe(runner)
    })

    it('creates an easing Controller from the easing function', function () {
      var runner = new SVG.Runner()
      runner.ease(function () {})

      expect(runner._stepper instanceof SVG.Ease).toBe(true)
    })
  })
})
