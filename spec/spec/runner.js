describe('SVG.Runner', function () {

  var initFn = jasmine.createSpy('initFn')
  var runFn = jasmine.createSpy('runFn')

  describe('())', function () {
    it('creates a runner with defaults', function () {
      var runner = new SVG.Runner()
      expect(runner instanceof SVG.Runner).toBe(true)
      expect(runner._duration).toBe(SVG.timeline.duration)
      expect(runner._ease).toBe(SVG.timeline.ease)
      expect(runner._stepper).toBe(null)
    })

    it('creates a runner with duration set', function () {
      var runner = new SVG.Runner(1000)
      expect(runner instanceof SVG.Runner).toBe(true)
      expect(runner._duration).toBe(1000)
      expect(runner._ease).toBe(SVG.timeline.ease)
      expect(runner._stepper).toBe(null)
    })

    it('creates a runner with controller set', function () {
      var runner = new SVG.Runner(runFn)
      expect(runner instanceof SVG.Runner).toBe(true)
      expect(runner._duration).toBe(null)
      expect(runner._ease).toBe(SVG.timeline.ease)
      expect(runner._stepper).toBe(runFn)
    })
  })

  describe('constructors', function () {
    describe('animate()', function () {
      it('creates a runner with the element set and schedules it on the timeline', function () {
        spyOn(SVG, 'Runner').and.callTrough()

        var element = SVG('<rect>')
        var runner = element.animate()
        expect(SVG.Runner).toHaveBeenCalled();
        expect(runner instanceof SVG.Runner)
        expect(runner.element()).toBe(element)
        expect(element.timeline()._runners.length).toBe(1)
      })
    })

    describe('loop()', function () {
      it('calls animate with correct parameters', function () {
        var element = SVG('<rect>')

        spyOn(element, 'animate')
        element.loop()
        expect(element.animate).toHaveBeenCalledWith(objectContaining({
          duration: SVG.defaults.timeline.duration,
          times: Infinity,
          swing: false
        }));
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

      expect(runner.functions[0]).toEqual(jasmine.objectContaining({
        alwaysInitialise: true,
        initialiser: initFn,
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

  describe('step()', function () {
    it('calls initFn once and runFn at every step when alwaysInitialise is false', function() {
      var runner = new SVG.Runner()
      runner.queue(initFn, runFn, false)

      runner.step()
      expect(initFn).toHaveBeenCalled()
      expect(runFn).toHaveBeenCalled()

      runner.step()
      expect(init.calls.count()).toBe(1)
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

    it('returns false if not finished', function () {
      var runner = new SVG.Runner()
      runner.queue(initFn, runFn, false)

      expect(runner.step()).toBe(false)
    })

    it('returns true if finished', function () {
      var runner = new SVG.Runner()
      runner.queue(initFn, runFn, false)

      expect(runner.step()).toBe(true)
    })
  })

  describe('active()', function () {
    it('acts as a getter without parameters', function () {
      var runner = new SVG.Runner()
      expect(runner.active()).toBe(true)
    })

    it('disabled the runner when false is passed', function () {
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

  describe('element()', function () {
    it('returns the element bound to this runner if any', function () {
      var runner1 = new SVG.Runner()
      expect(runner1.element()).toBe(null)

      var element = SVG('<rect>')
      var runner2 = element.animate()
      expect(runner1.element()).toBe(element)
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

    it('calls queue giving only a function to call on every step', function () {
      var runner = new SVG.Runner()
      spyOn(runner.queue)
      runner.during(runFn)

      expect(runner.queue).toHaveBeenCalledWith(null, runFn)
    })
  })

  describe('finish()', function () {
    it('returns itself', function () {
      var runner = new SVG.Runner()
      expect(runner.finish()).toBe(runner)
    })

    it('calls step with Infinity as arument', function () {
      var runner = new SVG.Runner()
      spyOn(runner.step)
      runner.finish()

      expect(runner.step).toHaveBeenCalledWith(Infinity)
    })
  })

  describe('reverse()', function () {
    it('returns itself', function () {
      var runner = new SVG.Runner()
      expect(runner.reverse()).toBe(runner)
    })

    it('reverses the runner by setting the time to the end and going backwards', function () {
      var runner = new SVG.Runner()
      spyOn(runner.time)
      runner.reverse()

      expect(runner.time).toHaveBeenCalledWith(SVG.defaults.timeline.duration)
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

      expect(runner._stepper instanceof SVG.Stepper).toBe(true)
    })
  })
})
