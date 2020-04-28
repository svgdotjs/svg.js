/* globals describe, expect, it, beforeEach, afterEach, spyOn, jasmine */

import { Runner, defaults, Ease, Controller, SVG, Timeline } from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'

const { createSpy, objectContaining, arrayContaining } = jasmine

describe('Runner.js', () => {

  var initFn = createSpy('initFn')
  var runFn = createSpy('runFn')

  beforeEach(() => {
    jasmine.RequestAnimationFrame.install(getWindow())
    initFn.calls.reset()
    runFn.calls.reset()
  })

  afterEach(() => {
    jasmine.RequestAnimationFrame.uninstall(getWindow())
  })

  describe('sanitise()', () => {
    it('can handle all form of input', () => {
      var fn = Runner.sanitise

      expect(fn(200, 200, 'now')).toEqual(objectContaining({
        duration: 200,
        delay: 200,
        when: 'now',
        times: 1,
        wait: 0,
        swing: false
      }))

      expect(fn(200, 200)).toEqual(objectContaining({
        duration: 200,
        delay: 200,
        when: 'last',
        times: 1,
        wait: 0,
        swing: false
      }))

      expect(fn(200)).toEqual(objectContaining({
        duration: 200,
        delay: defaults.timeline.delay,
        when: 'last',
        times: 1,
        wait: 0,
        swing: false
      }))

      expect(fn(runFn)).toEqual(objectContaining({
        duration: runFn,
        delay: defaults.timeline.delay,
        when: 'last',
        times: 1,
        wait: 0,
        swing: false
      }))

      expect(fn({ delay: 200 })).toEqual(objectContaining({
        duration: defaults.timeline.duration,
        delay: 200,
        when: 'last',
        times: 1,
        wait: 0,
        swing: false
      }))

      expect(fn({ times: 3, delay: 200, when: 'now', swing: true, wait: 200 })).toEqual(objectContaining({
        duration: defaults.timeline.duration,
        delay: 200,
        when: 'now',
        times: 3,
        wait: 200,
        swing: true
      }))
    })
  })

  describe('())', () => {
    it('creates a runner with defaults', () => {
      var runner = new Runner()
      expect(runner instanceof Runner).toBe(true)
      expect(runner._duration).toBe(defaults.timeline.duration)
      expect(runner._stepper instanceof Ease).toBe(true)
    })

    it('creates a runner with duration set', () => {
      var runner = new Runner(1000)
      expect(runner instanceof Runner).toBe(true)
      expect(runner._duration).toBe(1000)
      expect(runner._stepper instanceof Ease).toBe(true)
    })

    it('creates a runner with controller set', () => {
      var runner = new Runner(runFn)
      expect(runner instanceof Runner).toBe(true)
      expect(runner._duration).toBeFalsy()
      expect(runner._stepper instanceof Controller).toBe(true)
    })
  })

  describe('constructors', () => {
    // FIXME: Not possible to spy like this in es6
    // describe('animate()',  () => {
    //   it('creates a runner with the element set and schedules it on the timeline',  () => {
    //     var orginalRunner = Runner
    //     spyOn(SVG, 'Runner').and.callFake(()  =>{
    //       return new orginalRunner()
    //     })
    //
    //     var element = SVG('<rect />')
    //     var runner = element.animate()
    //     expect(Runner).toHaveBeenCalled();
    //     expect(runner instanceof Runner)
    //     expect(runner.element()).toBe(element)
    //     expect(runner.timeline()).toBe(element.timeline())
    //   })
    // })

    describe('delay()', () => {
      it('calls animate with correct parameters', () => {
        var element = SVG('<rect />')

        spyOn(element, 'animate')
        element.delay(100, 'now')
        expect(element.animate).toHaveBeenCalledWith(0, 100, 'now')
      })
    })
  })

  describe('queue()', () => {
    it('adds another closure to the runner', () => {
      var runner = new Runner()
      runner.queue(initFn, runFn, true)

      expect(runner._queue[0]).toEqual(objectContaining({
        initialiser: initFn,
        initialised: false,
        runner: runFn,
        finished: false
      }))
    })
  })

  describe('step()', () => {

    it('returns itself', () => {
      var runner = new Runner()
      expect(runner.step()).toBe(runner)
    })

    it('calls initFn once and runFn at every step', () => {
      var runner = new Runner()
      runner.queue(initFn, runFn, false)

      runner.step()
      expect(initFn).toHaveBeenCalled()
      expect(runFn).toHaveBeenCalled()

      runner.step()
      expect(initFn.calls.count()).toBe(1)
      expect(runFn.calls.count()).toBe(2)
    })

    it('calls initFn on every step if its declaritive', () => {
      var runner = new Runner(new Controller())
      runner.queue(initFn, runFn, true)

      runner.step()
      expect(initFn).toHaveBeenCalled()
      expect(runFn).toHaveBeenCalled()

      runner.step()
      expect(initFn.calls.count()).toBe(2)
      expect(runFn.calls.count()).toBe(2)
    })

    function getLoop (r) {
      var loopDuration = r._duration + r._wait
      var loopsDone = Math.floor(r._time / loopDuration)
      return loopsDone
    }

    // step in time
    it('steps forward a certain time', () => {
      var spy = createSpy('stepper')
      var r = new Runner(1000).loop(10, false, 100)
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

    it('handles dts which are bigger than the animation time', () => {
      var runner = new Runner(1000)
      runner.queue(initFn, runFn, true)

      runner.step(1100)
      expect(initFn).toHaveBeenCalled()
      expect(runFn).toHaveBeenCalledWith(1)
    })

    describe('looping', () => {
      describe('without wait', () => {
        describe('unreversed', () => {
          describe('nonswinging', () => {
            it('does behave correctly at the end of an even loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(6, false)
              runner.queue(null, spy)

              runner.step(5750)
              expect(spy).toHaveBeenCalledWith(0.75)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(1)
            })

            it('does behave correctly at the end of an uneven loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(5, false)
              runner.queue(null, spy)

              runner.step(4750)
              expect(spy).toHaveBeenCalledWith(0.75)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(1)
            })
          })

          describe('swinging', () => {
            it('does behave correctly at the end of an even loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(6, true)
              runner.queue(null, spy)

              runner.step(5750)
              expect(spy).toHaveBeenCalledWith(0.25)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(0)
            })

            it('does behave correctly at the end of an uneven loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(5, true)
              runner.queue(null, spy)

              runner.step(4750)
              expect(spy).toHaveBeenCalledWith(0.75)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(1)
            })
          })
        })

        describe('reversed', () => {
          describe('nonswinging', () => {
            it('does behave correctly at the end of an even loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(6, false).reverse()
              runner.queue(null, spy)

              runner.step(5750)
              expect(spy).toHaveBeenCalledWith(0.25)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(0)
            })

            it('does behave correctly at the end of an uneven loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(5, false).reverse()
              runner.queue(null, spy)

              runner.step(4750)
              expect(spy).toHaveBeenCalledWith(0.25)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(0)
            })
          })

          describe('swinging', () => {
            it('does behave correctly at the end of an even loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(6, true).reverse()
              runner.queue(null, spy)

              runner.step(5750)
              expect(spy).toHaveBeenCalledWith(0.75)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(1)
            })

            it('does behave correctly at the end of an uneven loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(5, true).reverse()
              runner.queue(null, spy)

              runner.step(4750)
              expect(spy).toHaveBeenCalledWith(0.25)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(0)
            })
          })
        })
      })

      describe('with wait', () => {
        describe('unreversed', () => {
          describe('nonswinging', () => {
            it('does behave correctly at the end of an even loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(6, false, 100)
              runner.queue(null, spy)

              runner.step(5450)
              expect(spy).toHaveBeenCalledWith(1)
              spy.calls.reset()

              runner.step(800)
              expect(spy).toHaveBeenCalledWith(0.75)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(1)
            })

            it('does behave correctly at the end of an uneven loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(5, false, 100)
              runner.queue(null, spy)

              runner.step(4350)
              expect(spy).toHaveBeenCalledWith(1)
              spy.calls.reset()

              runner.step(800)
              expect(spy).toHaveBeenCalledWith(0.75)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(1)
            })
          })

          describe('swinging', () => {
            it('does behave correctly at the end of an even loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(6, true, 100)
              runner.queue(null, spy)

              runner.step(5450)
              expect(spy).toHaveBeenCalledWith(1)
              spy.calls.reset()

              runner.step(800)
              expect(spy).toHaveBeenCalledWith(0.25)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(0)
            })

            it('does behave correctly at the end of an uneven loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(5, true, 100)
              runner.queue(null, spy)

              runner.step(4350)
              expect(spy).toHaveBeenCalledWith(0)
              spy.calls.reset()

              runner.step(800)
              expect(spy).toHaveBeenCalledWith(0.75)

              runner.step(250)
              expect(spy).toHaveBeenCalledWith(1)
            })
          })
        })

        describe('reversed', () => {
          describe('nonswinging', () => {
            it('does behave correctly at the end of an even loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(6, false, 100).reverse()
              runner.queue(null, spy)

              runner.step(5450)
              expect(spy).toHaveBeenCalledWith(0)
              spy.calls.reset()

              runner.step(800)
              expect(spy).toHaveBeenCalledWith(0.25)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(0)
            })

            it('does behave correctly at the end of an uneven loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(5, false, 100).reverse()
              runner.queue(null, spy)

              runner.step(4350)
              expect(spy).toHaveBeenCalledWith(0)
              spy.calls.reset()

              runner.step(800)
              expect(spy).toHaveBeenCalledWith(0.25)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(0)
            })
          })

          describe('swinging', () => {
            it('does behave correctly at the end of an even loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(6, true, 100).reverse()
              runner.queue(null, spy)

              runner.step(5450)
              expect(spy).toHaveBeenCalledWith(0)
              spy.calls.reset()

              runner.step(800)
              expect(spy).toHaveBeenCalledWith(0.75)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(1)
            })

            it('does behave correctly at the end of an uneven loop', () => {
              var spy = createSpy('stepper')
              var runner = new Runner(1000).loop(5, true, 100).reverse()
              runner.queue(null, spy)

              runner.step(4350)
              expect(spy).toHaveBeenCalledWith(1)
              spy.calls.reset()

              runner.step(800)
              expect(spy).toHaveBeenCalledWith(0.25)
              runner.step(250)
              expect(spy).toHaveBeenCalledWith(0)
            })
          })
        })
      })
    })

  })

  describe('active()', () => {
    it('acts as a getter without parameters', () => {
      var runner = new Runner()
      expect(runner.active()).toBe(true)
    })

    it('disables the runner when false is passed', () => {
      var runner = new Runner()
      expect(runner.active(false)).toBe(runner)
      expect(runner.active()).toBe(false)
    })

    it('enables the runner when true is passed', () => {
      var runner = new Runner()
      expect(runner.active(false)).toBe(runner)
      expect(runner.active(true)).toBe(runner)
      expect(runner.active()).toBe(true)
    })
  })

  describe('duration()', () => {
    it('return the full duration of the runner including all loops and waits', () => {
      var runner = new Runner(800).loop(10, true, 200)
      expect(runner.duration()).toBe(9800)
    })
  })

  describe('loop()', () => {
    it('makes this runner looping', () => {
      var runner = new Runner(1000).loop(5)
      expect(runner.duration()).toBe(5000)
    })
  })

  describe('time()', () => {
    it('returns itself', () => {
      var runner = new Runner()
      expect(runner.time(0)).toBe(runner)
    })

    it('acts as a getter with no parameter passed', () => {
      var runner = new Runner()
      expect(runner.time()).toBe(0)
    })

    it('reschedules the runner to a new time', () => {
      var runner = new Runner()
      runner.time(10)

      expect(runner.time()).toBe(10)
    })

    it('calls step to reschedule', () => {
      var runner = new Runner()
      spyOn(runner, 'step')
      runner.time(10)

      expect(runner.step).toHaveBeenCalledWith(10)
    })
  })

  describe('loops()', () => {
    it('get the loops of a runner', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(1000).queue(null, spy)

      runner.step(300)
      expect(spy).toHaveBeenCalledWith(0.3)

      expect(runner.loops()).toBe(0.3)
    })
    it('sets the loops of the runner', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(1000).queue(null, spy)

      expect(runner.loops(0.5).loops()).toBe(0.5)
      expect(spy).toHaveBeenCalledWith(0.5)

      expect(runner.loops(0.1).loops()).toBe(0.1)
      expect(spy).toHaveBeenCalledWith(0.1)

      expect(runner.loops(1.5).loops()).toBe(1)
      expect(spy).toHaveBeenCalledWith(1)
    })
    it('sets the loops of the runner in a loop', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(1000).loop(5, true, 500).queue(null, spy)

      expect(runner.loops(1.3).loops()).toBe(1.3)
      expect(spy).toHaveBeenCalledWith(0.7)

      expect(runner.loops(0.3).loops()).toBe(0.3)
    })
  })

  describe('progress()', () => {
    it('gets the progress of a runner', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(1000).queue(null, spy)

      runner.step(300)
      expect(spy).toHaveBeenCalledWith(0.3)

      expect(runner.progress()).toBe(0.3)
    })

    it('gets the progress of a runner when looping', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(800).queue(null, spy).loop(10, false, 200) // duration should be 9800

      // middle of animation, in the middle of wait time
      runner.step(4900)
      expect(runner.progress()).toBe(0.5)
      expect(spy).toHaveBeenCalledWith(1)

      // start of next loop
      runner.step(100)
      expect(spy).toHaveBeenCalledWith(0)

      // move 400 into current loop which is 0.5 progress
      // the progress value is 5400 / 9800
      runner.step(400)
      expect(spy).toHaveBeenCalledWith(0.5)
      expect(runner.progress()).toBe(5400 / 9800)
    })

    it('sets the progress of a runner', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(1000).queue(null, spy)

      expect(runner.progress(0.5).progress()).toBe(0.5)
      expect(spy).toHaveBeenCalledWith(0.5)
    })

    it('sets the progress of a runner when looping', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(800).queue(null, spy).loop(10, false, 200)

      // progress 0.5 somewhere in the middle of wait time
      expect(runner.progress(0.5).progress()).toBe(0.5)
      expect(spy).toHaveBeenCalledWith(1)

      // start of next loop
      runner.step(100)
      expect(spy).toHaveBeenCalledWith(0)

      // should move 0.5 into the next loop
      expect(runner.progress(5400 / 9800).progress()).toBe(5400 / 9800)
      expect(spy.calls.mostRecent().args[0]).toBeCloseTo(0.5)
    })
  })

  describe('position()', () => {

    it('gets the position of a runner', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(1000).queue(null, spy)

      runner.step(300)
      expect(spy).toHaveBeenCalledWith(0.3)

      expect(runner.position()).toBe(0.3)
    })

    it('gets the position of a runner when looping', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(1000).loop(5, true, 100).queue(null, spy)

      runner.step(1200)
      expect(spy).toHaveBeenCalledWith(0.9)

      expect(runner.position()).toBe(0.9)
    })

    it('sets the position of a runner', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(1000).queue(null, spy)

      expect(runner.position(0.5).position()).toBe(0.5)
      expect(spy).toHaveBeenCalledWith(0.5)
    })

    it('sets the position of a runner in a loop', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(1000).loop(5, true, 100).queue(null, spy)

      runner.step(1200)
      expect(runner.position(0.4).position()).toBe(0.4)
      expect(spy).toHaveBeenCalledWith(0.4)

      expect(runner.position(0).position()).toBe(0)
      expect(spy).toHaveBeenCalledWith(0)

      expect(runner.position(1).position()).toBe(1)
      expect(spy).toHaveBeenCalledWith(1)
    })
  })

  describe('element()', () => {
    it('returns the element bound to this runner if any', () => {
      var runner1 = new Runner()
      expect(runner1.element()).toBe(null)

      var element = SVG('<rect />')
      var runner2 = element.animate()
      expect(runner2.element()).toBe(element)
    })

    it('sets an element to be bound to the runner', () => {
      var runner = new Runner()
      var element = SVG('<rect />')
      expect(runner.element(element)).toBe(runner)
      expect(runner.element()).toBe(element)
    })
  })

  describe('timeline()', () => {
    it('returns the timeline bound to this runner if any', () => {
      var runner1 = new Runner()
      expect(runner1.element()).toBe(null)

      var element = SVG('<rect />')
      var runner2 = element.animate()
      expect(runner2.timeline()).toBe(element.timeline())
    })

    it('sets a timeline to be bound to the runner', () => {
      var runner = new Runner()
      var timeline = new Timeline()
      expect(runner.timeline(timeline)).toBe(runner)
      expect(runner.timeline()).toBe(timeline)
    })
  })

  describe('schedule()', () => {
    it('schedules the runner on a timeline', () => {
      var runner = new Runner()
      var timeline = new Timeline()
      var spy = spyOn(timeline, 'schedule').and.callThrough()

      expect(runner.schedule(timeline, 200, 'now')).toBe(runner)
      expect(runner.timeline()).toBe(timeline)
      expect(spy).toHaveBeenCalledWith(runner, 200, 'now')
    })

    it('schedules the runner on its own timeline', () => {
      var runner = new Runner()
      var timeline = new Timeline()
      var spy = spyOn(timeline, 'schedule')
      runner.timeline(timeline)

      expect(runner.schedule(200, 'now')).toBe(runner)
      expect(runner.timeline()).toBe(timeline)
      expect(spy).toHaveBeenCalledWith(runner, 200, 'now')
    })
  })

  describe('unschedule()', () => {
    it('unschedules this runner from its timeline', () => {
      var runner = new Runner()
      var timeline = new Timeline()
      var spy = spyOn(timeline, 'unschedule').and.callThrough()

      expect(runner.schedule(timeline, 200, 'now')).toBe(runner)
      expect(runner.unschedule()).toBe(runner)
      expect(spy).toHaveBeenCalledWith(runner)
      expect(runner.timeline()).toBe(null)
    })
  })

  describe('animate()', () => {
    it('creates a new runner scheduled after the first', () => {
      var runner = new Runner(1000)
      var timeline = new Timeline()

      runner.schedule(timeline)

      var runner2 = runner.animate(500, 1000)

      var t = timeline.time()

      expect(runner2.timeline()).toBe(timeline)
      expect(runner2.time()).toBe(0)

      expect(timeline.schedule()).toEqual(arrayContaining([
        objectContaining({ start: t, duration: 1000, end: t + 1000, runner: runner }),
        objectContaining({ start: t + 2000, duration: 500, end: t + 2500, runner: runner2 })
      ]))
    })
  })

  describe('delay()', () => {
    it('calls animate with delay parameters', () => {
      var runner = new Runner(1000)
      spyOn(runner, 'animate')

      runner.delay(500)
      expect(runner.animate).toHaveBeenCalledWith(0, 500)
    })
  })

  describe('during()', () => {
    it('returns itself', () => {
      var runner = new Runner()
      expect(runner.during(runFn)).toBe(runner)
    })

    it('calls queue passing only a function to call on every step', () => {
      var runner = new Runner()
      spyOn(runner, 'queue')
      runner.during(runFn)

      expect(runner.queue).toHaveBeenCalledWith(null, runFn)
    })
  })

  // describe('after()',  () => {
  //   it('returns itself',  () => {
  //     var runner = new Runner()
  //     expect(runner.after(runFn)).toBe(runner)
  //   })
  //
  //   it('binds a function to the after event',  () => {
  //     var runner = new Runner()
  //     spyOn(runner, 'on')
  //     runner.after(runFn)
  //
  //     expect(runner.on).toHaveBeenCalledWith('finish', runFn)
  //   })
  // })
  //
  // describe('finish()',  () => {
  //   it('returns itself',  () => {
  //     var runner = new Runner()
  //     expect(runner.finish()).toBe(runner)
  //   })
  //
  //   it('calls step with Infinity as argument',  () => {
  //     var runner = new Runner()
  //     spyOn(runner, 'step')
  //     runner.finish()
  //
  //     expect(runner.step).toHaveBeenCalledWith(Infinity)
  //   })
  // })

  describe('reverse()', () => {
    it('returns itself', () => {
      var runner = new Runner()
      expect(runner.reverse()).toBe(runner)
    })

    it('reverses the runner', () => {
      var spy = createSpy('stepper')
      var runner = new Runner(1000).reverse().queue(null, spy)
      runner.step(750)
      expect(spy).toHaveBeenCalledWith(0.25)
    })
  })

  describe('ease()', () => {
    it('returns itself', () => {
      var runner = new Runner()
      expect(runner.ease(() => {})).toBe(runner)
    })

    it('creates an easing Controller from the easing function', () => {
      var runner = new Runner()
      runner.ease(() => {})

      expect(runner._stepper instanceof Ease).toBe(true)
    })
  })
})
