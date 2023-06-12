/* globals describe, expect, it, beforeEach, afterEach, spyOn, jasmine */

import {
  Runner,
  defaults,
  Ease,
  Controller,
  SVG,
  Timeline,
  Rect,
  Morphable,
  Animator,
  Queue,
  Matrix,
  Color,
  Box,
  Polygon,
  PointArray
} from '../../../src/main.js'
import { FakeRunner, RunnerArray } from '../../../src/animation/Runner.js'
import { getWindow } from '../../../src/utils/window.js'
import SVGNumber from '../../../src/types/SVGNumber.js'

const { any, createSpy, objectContaining, arrayContaining } = jasmine

describe('Runner.js', () => {
  describe('Runner', () => {
    var initFn = createSpy('initFn')
    var runFn = createSpy('runFn')

    beforeEach(() => {
      jasmine.RequestAnimationFrame.install(getWindow())
      Animator.timeouts = new Queue()
      Animator.frames = new Queue()
      Animator.immediates = new Queue()
      Animator.nextDraw = null
      initFn.calls.reset()
      runFn.calls.reset()
    })

    afterEach(() => {
      jasmine.RequestAnimationFrame.uninstall(getWindow())
    })

    describe('sanitise()', () => {
      it('can handle all form of input', () => {
        var fn = Runner.sanitise

        expect(fn(200, 200, 'now')).toEqual(
          objectContaining({
            duration: 200,
            delay: 200,
            when: 'now',
            times: 1,
            wait: 0,
            swing: false
          })
        )

        expect(fn(200, 200)).toEqual(
          objectContaining({
            duration: 200,
            delay: 200,
            when: 'last',
            times: 1,
            wait: 0,
            swing: false
          })
        )

        expect(fn(200)).toEqual(
          objectContaining({
            duration: 200,
            delay: defaults.timeline.delay,
            when: 'last',
            times: 1,
            wait: 0,
            swing: false
          })
        )

        expect(fn(runFn)).toEqual(
          objectContaining({
            duration: runFn,
            delay: defaults.timeline.delay,
            when: 'last',
            times: 1,
            wait: 0,
            swing: false
          })
        )

        expect(fn({ delay: 200 })).toEqual(
          objectContaining({
            duration: defaults.timeline.duration,
            delay: 200,
            when: 'last',
            times: 1,
            wait: 0,
            swing: false
          })
        )

        expect(
          fn({ times: 3, delay: 200, when: 'now', swing: true, wait: 200 })
        ).toEqual(
          objectContaining({
            duration: defaults.timeline.duration,
            delay: 200,
            when: 'now',
            times: 3,
            wait: 200,
            swing: true
          })
        )
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

    describe('queue()', () => {
      it('adds another closure to the runner', () => {
        var runner = new Runner()
        runner.queue(initFn, runFn, true)

        expect(runner._queue[0]).toEqual(
          objectContaining({
            initialiser: initFn,
            initialised: false,
            runner: runFn,
            finished: false
          })
        )
      })
    })

    describe('step()', () => {
      it('returns itself', () => {
        var runner = new Runner()
        expect(runner.step()).toBe(runner)
      })

      it('does nothing when not active', () => {
        const runner = new Runner().active(false)
        const frozen = Object.freeze(runner)
        expect(frozen.step()).toEqual(runner)
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

      it('calls initFn on every step if its declarative', () => {
        var runner = new Runner(new Controller())
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

      it('makes this runner indefinitey by passing true', () => {
        var runner = new Runner(1000).loop(true)
        expect(runner.duration()).toBe(Infinity)
      })

      it('makes this runner indefinitey by passing nothing', () => {
        var runner = new Runner(1000).loop()
        expect(runner.duration()).toBe(Infinity)
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

      it('throws if no timeline is given', () => {
        var runner = new Runner()
        expect(() => runner.schedule(200, 'now')).toThrowError(
          'Runner cannot be scheduled without timeline'
        )
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

        expect(timeline.schedule()).toEqual(
          arrayContaining([
            objectContaining({
              start: t,
              duration: 1000,
              end: t + 1000,
              runner: runner
            }),
            objectContaining({
              start: t + 2000,
              duration: 500,
              end: t + 2500,
              runner: runner2
            })
          ])
        )
      })

      it('reuses timeline and element of current runner', () => {
        const element = new Rect()
        const timeline = new Timeline()
        const runner = new Runner().element(element).timeline(timeline)
        const after = runner.animate()
        expect(after.timeline()).toBe(timeline)
        expect(after.element()).toBe(element)
      })

      it('does not reuse element if not set', () => {
        const timeline = new Timeline()
        const runner = new Runner().timeline(timeline)
        const after = runner.animate()
        expect(after.element()).toBe(null)
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

    describe('after()', () => {
      it('returns itself', () => {
        var runner = new Runner()
        expect(runner.after(runFn)).toBe(runner)
      })

      it('binds a function to the after event', () => {
        var runner = new Runner()
        spyOn(runner, 'on')
        runner.after(runFn)

        expect(runner.on).toHaveBeenCalledWith('finished', runFn)
      })
    })

    describe('finish()', () => {
      it('returns itself', () => {
        var runner = new Runner()
        expect(runner.finish()).toBe(runner)
      })

      it('calls step with Infinity as argument', () => {
        var runner = new Runner()
        spyOn(runner, 'step')
        runner.finish()

        expect(runner.step).toHaveBeenCalledWith(Infinity)
      })
    })

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

      it('reverses the runner when true is passed', () => {
        var spy = createSpy('stepper')
        var runner = new Runner(1000).reverse(true).queue(null, spy)
        runner.step(750)
        expect(spy).toHaveBeenCalledWith(0.25)
      })

      it('unreverses the runner when true is passed', () => {
        var spy = createSpy('stepper')
        var runner = new Runner(1000).reverse(false).queue(null, spy)
        runner.step(750)
        expect(spy).toHaveBeenCalledWith(0.75)
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

    describe('reset()', () => {
      it('resets the runner by setting it to time 0', () => {
        var runner = new Runner().step(16)
        expect(runner.time()).toBe(16)
        expect(runner.reset()).toBe(runner)
        expect(runner.time()).toBe(0)
      })

      it('does not reset if already reset', () => {
        var runner = Object.freeze(new Runner().reset())
        expect(runner.reset()).toBe(runner)
      })
    })

    describe('private Methods', () => {
      describe('_rememberMorpher()', () => {
        it('adds a morpher for a method to the runner', () => {
          const runner = new Runner()
          const morpher = new Morphable()
          runner._rememberMorpher('move', morpher)
          expect(runner._history.move).toEqual({ morpher, caller: undefined })
        })

        it('resumes the timeline in case this runner uses a controller', () => {
          const timeline = new Timeline()
          const spy = spyOn(timeline, 'play')
          const runner = new Runner(new Controller(() => 0)).timeline(timeline)
          const morpher = new Morphable()
          runner._rememberMorpher('move', morpher)
          expect(spy).toHaveBeenCalled()
        })
      })

      describe('_tryRetarget()', () => {
        it('tries to retarget a morpher for the animation and returns true', () => {
          const rect = new Rect().move(0, 0)
          const runner = rect.animate().move(10, 10)
          jasmine.RequestAnimationFrame.tick(16)
          expect(runner._tryRetarget('x', 20)).toBe(true)
          expect(runner._history.x.morpher.to()).toEqual([20, ''])
        })

        it('throws away the morpher if it was not initialized yet and returns false', () => {
          const rect = new Rect().move(0, 0)
          const runner = rect.animate().move(10, 10)
          // In that case tryRetarget is not successful
          expect(runner._tryRetarget('x', 20)).toBe(false)
        })

        it('does nothing if method was not found', () => {
          const rect = new Rect().move(0, 0)
          const runner = rect.animate().move(10, 10)
          jasmine.RequestAnimationFrame.tick(16)
          // In that case tryRetarget is not successful
          expect(runner._tryRetarget('foo', 20)).toBe(false)
        })

        it('does only work with controller for transformations and uses retarget function when retargeting transformations', () => {
          const rect = new Rect()
          const runner = rect
            .animate(new Controller(() => 0))
            .transform({ translate: [10, 10] })
          jasmine.RequestAnimationFrame.tick(16)
          // In that case tryRetarget is not successful
          expect(
            runner._tryRetarget('transform', { translate: [20, 20] })
          ).toBe(true)
        })

        it('starts the timeline if retarget was successful', () => {
          const timeline = new Timeline()
          const rect = new Rect().move(0, 0).timeline(timeline)
          const runner = rect.animate().move(10, 10)
          jasmine.RequestAnimationFrame.tick(16)
          const spy = spyOn(timeline, 'play')
          expect(runner._tryRetarget('x', 20)).toBe(true)
          expect(runner._history.x.morpher.to()).toEqual([20, ''])
          expect(spy).toHaveBeenCalledTimes(1)
        })
      })

      describe('_initialise', () => {
        it('does nothing if false is passed', () => {
          const runner = Object.freeze(new Runner())
          expect(runner._initialise(false)).toBe(undefined)
        })

        it('does nothing if true is passed and runner is not declarative', () => {
          const runner = Object.freeze(new Runner())
          expect(runner._initialise(true)).toBe(undefined)
        })

        it('calls the initializer function on the queue when runner is declarative', () => {
          const runner = new Runner(() => 0).queue(initFn, runFn)
          runner._initialise()
          expect(initFn).toHaveBeenCalledTimes(1)
        })

        it('calls the initializer function on the queue when true is passed and runner is not declarative', () => {
          const runner = new Runner().queue(initFn, runFn)
          runner._initialise(true)
          expect(initFn).toHaveBeenCalledTimes(1)
        })

        it('does nothing if function is already initialized', () => {
          const runner = new Runner().queue(initFn, runFn)
          runner._initialise(true)
          runner._initialise(true)
          expect(initFn).toHaveBeenCalledTimes(1)
        })
      })

      describe('_run()', () => {
        it('runs each queued function for the position or dt given', () => {
          const runner = new Runner().queue(initFn, runFn)
          runner._run(16)
          expect(runFn).toHaveBeenCalledWith(16)
        })

        it('returns true if all runners converged', () => {
          const spy = createSpy().and.returnValue(true)
          const runner = new Runner().queue(initFn, spy)
          expect(runner._run(16)).toBe(true)
        })

        it('returns true if all runners finished', () => {
          const spy = createSpy().and.returnValue(true)
          const runner = new Runner(100).queue(initFn, spy)
          runner._run(200)
          expect(runner._run(1)).toBe(true)
        })
      })

      describe('addTransform()', () => {
        it('adds a transformation by multiplying', () => {
          const runner = new Runner()
          runner.addTransform({ translate: [10, 10] })
          expect(runner.transforms).toEqual(new Matrix(1, 0, 0, 1, 10, 10))
        })
      })

      describe('clearTransform()', () => {
        it('resets the transformations to identity', () => {
          const runner = new Runner()
          runner.addTransform({ translate: [10, 10] })
          runner.clearTransform()
          expect(runner.transforms).toEqual(new Matrix())
        })
      })

      describe('clearTransformsFromQueue', () => {
        it('deletes all functions from the queue which are transformations', () => {
          const runner = new Runner().queue(initFn, runFn)
          runner.transform({ translate: [10, 20] })
          runner.clearTransformsFromQueue()
          expect(runner._queue.length).toBe(1)
        })
      })
    })

    describe('Element', () => {
      describe('animate()', () => {
        it('creates a runner with the element set and schedules it on the timeline', () => {
          var element = SVG('<rect />')
          var runner = element.animate()
          expect(runner instanceof Runner)
          expect(runner.element()).toBe(element)
          expect(runner.timeline()).toBe(element.timeline())
          expect(element.timeline().getLastRunnerInfo().runner).toBe(runner)
        })
      })

      describe('delay()', () => {
        it('calls animate with correct parameters', () => {
          var element = SVG('<rect />')

          spyOn(element, 'animate')
          element.delay(100, 'now')
          expect(element.animate).toHaveBeenCalledWith(0, 100, 'now')
        })
      })

      describe('_clearTransformRunnersBefore()', () => {
        it('calls clearBefore on the runner array', () => {
          const rect = new Rect()
          rect._prepareRunner()
          const spy = spyOn(rect._transformationRunners, 'clearBefore')
          rect._clearTransformRunnersBefore({ id: 1 })
          expect(spy).toHaveBeenCalledWith(1)
        })
      })

      describe('_currentTransform()', () => {
        it('calculates the current transformation of this element', () => {
          const rect = new Rect()
          rect._prepareRunner()
          const runner1 = new Runner().addTransform({ translate: [10, 20] })
          const runner2 = new Runner().addTransform({ rotate: 45 })
          const runner3 = new Runner().addTransform({ translate: [10, 20] })

          rect._addRunner(runner1)
          rect._addRunner(runner2)
          rect._addRunner(runner3)
          expect(rect._currentTransform(runner3)).toEqual(
            new Matrix({ translate: [10, 20] }).rotate(45).translate(10, 20)
          )
        })
      })

      describe('_addRunner()', () => {
        it('adds a runner to the runner array of this element', () => {
          const rect = new Rect()
          rect._prepareRunner()
          const spy = spyOn(rect._transformationRunners, 'add')
          const runner = new Runner()
          rect._addRunner(runner)
          expect(spy).toHaveBeenCalledWith(runner)
        })
      })

      describe('_prepareRunner()', () => {
        it('adds a runner array to the element', () => {
          const rect = new Rect()
          expect(rect._transformationRunners).toBe(undefined)
          rect._prepareRunner()
          expect(rect._transformationRunners).toEqual(any(RunnerArray))
        })

        it('only adds it if no animation is in progress', () => {
          const rect = new Rect()
          expect(rect._transformationRunners).toBe(undefined)
          rect._prepareRunner()
          const arr = rect._transformationRunners
          rect._frameId = 1
          rect._prepareRunner()
          expect(rect._transformationRunners).toBe(arr)
        })
      })
    })

    describe('methods', () => {
      describe('attr()', () => {
        it('relays to styleAttr with "attr" as parameter', () => {
          const runner = new Runner()
          const spy = spyOn(runner, 'styleAttr')
          runner.attr(1, 2)
          expect(spy).toHaveBeenCalledWith('attr', 1, 2)
        })
      })

      describe('css()', () => {
        it('relays to styleAttr with "css" as parameter', () => {
          const runner = new Runner()
          const spy = spyOn(runner, 'styleAttr')
          runner.css(1, 2)
          expect(spy).toHaveBeenCalledWith('css', 1, 2)
        })
      })

      describe('styleAttr()', () => {
        it('adds a morpher for attr', () => {
          const runner = new Runner()
          runner.styleAttr('attr', 'x', 5)
          expect(runner._history.attr.morpher).toEqual(any(Morphable))
          expect(runner._history.attr.morpher.to()).toEqual([
            'x',
            SVGNumber,
            2,
            5,
            ''
          ])
        })

        it('adds a morpher for css', () => {
          const runner = new Runner()
          runner.styleAttr('css', 'x', 5)
          expect(runner._history.css.morpher).toEqual(any(Morphable))
          expect(runner._history.css.morpher.to()).toEqual([
            'x',
            SVGNumber,
            2,
            5,
            ''
          ])
        })

        it('adds init and run fn for execution when runner runs', () => {
          const element = new Rect().move(0, 0)
          const runner = new Runner(100).ease('-').element(element)
          runner.styleAttr('attr', 'x', 5)
          runner.step(50)
          expect(runner._history.attr.morpher.from()).toEqual([
            'x',
            SVGNumber,
            2,
            0,
            ''
          ])
          expect(runner._history.attr.morpher.to()).toEqual([
            'x',
            SVGNumber,
            2,
            5,
            ''
          ])
          expect(element.x()).toBe(2.5)
        })

        it('it also works when the object contains other morphable values', () => {
          const element = new Rect().fill('#fff').stroke('#000')
          const runner = new Runner(100).ease('-').element(element)
          runner.styleAttr('attr', { fill: '#000', stroke: new Color('#fff') })
          runner.step(50)
          expect(runner._history.attr.morpher.from()).toEqual([
            'fill',
            Color,
            5,
            255,
            255,
            255,
            0,
            'rgb',
            'stroke',
            Color,
            5,
            0,
            0,
            0,
            0,
            'rgb'
          ])

          expect(runner._history.attr.morpher.to()).toEqual([
            'fill',
            Color,
            5,
            0,
            0,
            0,
            0,
            'rgb',
            'stroke',
            Color,
            5,
            255,
            255,
            255,
            0,
            'rgb'
          ])
          const result = runner._history.attr.morpher.at(0.5).valueOf()
          expect(result.fill).toEqual(any(Color))
          expect(result.stroke).toEqual(any(Color))
          expect(result.fill.toArray()).toEqual([127.5, 127.5, 127.5, 0, 'rgb'])
          expect(result.stroke.toArray()).toEqual([
            127.5,
            127.5,
            127.5,
            0,
            'rgb'
          ])
        })

        it('it changes color space', () => {
          const element = new Rect().fill('#fff')
          const runner = new Runner(100).ease('-').element(element)
          runner.styleAttr('attr', { fill: new Color(100, 12, 12, 'hsl') })
          runner.step(50)
          expect(runner._history.attr.morpher.from()).toEqual([
            'fill',
            Color,
            5,
            0,
            0,
            100,
            0,
            'hsl'
          ])

          expect(runner._history.attr.morpher.to()).toEqual([
            'fill',
            Color,
            5,
            100,
            12,
            12,
            0,
            'hsl'
          ])
          const result = runner._history.attr.morpher.at(0.5).valueOf()
          expect(result.fill).toEqual(any(Color))
          expect(result.fill.toArray()).toEqual([50, 6, 56, 0, 'hsl'])
          expect(element.fill()).toBe('#969388')
        })

        it('retargets if called two times with new key', () => {
          const element = new Rect().fill('#fff')
          const runner = new Runner(100).ease('-').element(element)
          runner.styleAttr('attr', { fill: new Color(100, 12, 12, 'hsl') })
          runner.step(50)
          expect(element.fill()).toBe('#969388')
          runner.styleAttr('attr', {
            fill: new Color(100, 50, 50, 'hsl'),
            x: 50
          })
          runner.step(25)
          expect(element.fill()).toBe('#b1c37c')
          expect(element.x()).toBe(37.5)
        })

        it('retargets if called two times without new key', () => {
          const element = new Rect().fill('#fff')
          const runner = new Runner(100).ease('-').element(element)
          runner.styleAttr('attr', { fill: new Color(100, 12, 12, 'hsl') })
          runner.step(50)
          expect(element.fill()).toBe('#969388')
          runner.styleAttr('attr', { fill: new Color(100, 50, 50, 'hsl') })
          runner.step(25)
          expect(element.fill()).toBe('#b1c37c')
        })
      })

      function closeTo(number, precision = 2) {
        return {
          /*
           * The asymmetricMatch function is required, and must return a boolean.
           */
          asymmetricMatch: function (compareTo) {
            const factor = 10 ** precision
            return (
              Math.round(~~(compareTo * factor) / factor) ===
              Math.round(~~(number * factor) / factor)
            )
          },

          /*
           * The jasmineToString method is used in the Jasmine pretty printer, and will
           * be seen by the user in the message when a test fails.
           */
          jasmineToString: function () {
            return (
              '<close to: ' + number + ' with precision: ' + precision + '>'
            )
          }
        }
      }

      function equal(obj) {
        return {
          /*
           * The asymmetricMatch function is required, and must return a boolean.
           */
          asymmetricMatch: function (compareTo) {
            if (!(compareTo instanceof obj.constructor)) return false

            const keys = Object.keys(obj)
            const difference = Object.keys(compareTo).filter(
              (el) => !keys.includes(el)
            )

            if (difference.length) return false

            for (const key in obj) {
              if (obj[key] !== compareTo[key]) return false
            }

            return true
          },

          /*
           * The jasmineToString method is used in the Jasmine pretty printer, and will
           * be seen by the user in the message when a test fails.
           */
          jasmineToString: function () {
            return '<equal to: ' + obj + '>'
          }
        }
      }

      describe('zoom()', () => {
        it('adds a zoom morpher to the queue', () => {
          const element = SVG().size(100, 100).viewbox(0, 0, 100, 100)
          const runner = new Runner(100).ease('-').element(element)
          runner.zoom(2, { x: 0, y: 0 })
          runner.step(50)
          expect(runner._history.zoom.morpher.from()).toEqual([1, ''])
          expect(runner._history.zoom.morpher.to()).toEqual([2, ''])

          expect(element.zoom()).toBeCloseTo(1.5, 10)
          expect(element.viewbox().toArray()).toEqual([
            0,
            0,
            closeTo(66.666, 3),
            closeTo(66.666, 3)
          ])
        })

        it('retargets if called twice', () => {
          const element = SVG().size(100, 100).viewbox(0, 0, 100, 100)
          const runner = new Runner(100).ease('-').element(element)
          runner.zoom(2, { x: 0, y: 0 })
          runner.step(50)
          runner.zoom(4, { x: 0, y: 0 })
          expect(runner._history.zoom.morpher.from()).toEqual([1, ''])
          expect(runner._history.zoom.morpher.to()).toEqual([4, ''])

          runner.step(25)
          expect(element.zoom()).toBeCloseTo(3.25, 10)
          expect(element.viewbox().toArray()).toEqual([
            0,
            0,
            closeTo(30.769, 3),
            closeTo(30.769, 3)
          ])
        })
      })

      describe('transform()', () => {
        it('does not retarget for non-declarative transformations', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_tryRetarget')
          runner.transform({ translate: [10, 20] })
          expect(spy).not.toHaveBeenCalled()
        })

        it('does not retarget for relative transformations', () => {
          const runner = new Runner(new Controller(() => 0))
          const spy = spyOn(runner, '_tryRetarget')
          runner.transform({ translate: [10, 20] }, true)
          expect(spy).not.toHaveBeenCalled()
        })

        it('does retarget for absolute declarative transformations', () => {
          const runner = new Runner(new Controller(() => 0))
          const spy = spyOn(runner, '_tryRetarget')
          runner.transform({ translate: [10, 20] })
          expect(spy).toHaveBeenCalled()
        })

        it('calls queue with isTransform=true', () => {
          const runner = new Runner()
          const spy = spyOn(runner, 'queue')
          runner.transform({ translate: [10, 20] })
          expect(spy).toHaveBeenCalledWith(
            any(Function),
            any(Function),
            any(Function),
            true
          )
        })

        it('steps an affine transformation correctly', () => {
          const element = new Rect()
          const runner = new Runner(100).ease('-').element(element)
          runner.transform({ translate: [10, 20], scale: 2, rotate: 90 })
          runner.step(50)
          // transform sets an immediate callback to apply all merged transforms
          // when every runner had the chance to add its bit of transforms
          jasmine.RequestAnimationFrame.tick(1)
          expect(element.matrix().decompose()).toEqual(
            objectContaining({
              translateX: 5,
              translateY: 10,
              scaleX: closeTo(1.5, 10),
              scaleY: closeTo(1.5),
              rotate: closeTo(45, 10)
            })
          )
        })

        it('retargets an affine transformation correctly', () => {
          const element = new Rect()
          const runner = new Runner(() => 1).element(element)
          runner.transform({ translate: [10, 20], scale: 2, rotate: 90 })
          runner.step(50)
          runner.transform({ scale: 2 })

          // transform sets its to-target to the morpher in the initialisation step
          // because it depends on the from-target. Declaritive animation run the init-step
          // on every frame. That is why we step here to see the effect of our retargeting
          runner.step(25)

          expect(runner._history.transform.morpher.to()).toEqual([
            2, 2, 0, 0, 0, 0, 0, 0
          ])
        })

        it('retargets an affine transformation correctly and sets new origin', () => {
          const element = new Rect()
          const runner = new Runner(() => 1).element(element)
          runner.transform({ translate: [10, 20], scale: 2, rotate: 90 })
          runner.step(50)
          runner.transform({ scale: 2, origin: [10, 10] })

          // transform sets its to-target to the morpher in the initialisation step
          // because it depends on the from-target. Declaritive animation run the init-step
          // on every frame. That is why we step here to see the effect of our retargeting
          runner.step(25)

          expect(runner._history.transform.morpher.to()).toEqual([
            2, 2, 0, 0, 0, 0, 10, 10
          ])
        })

        it('steps multiple relative animations correctly', () => {
          const element = new Rect()
          const runner = new Runner(100).ease('-').element(element)
          runner.translate(10, 20).scale(2).rotate(45)
          runner.step(50)
          // transform sets an immediate callback to apply all merged transforms
          // when every runner had the chance to add its bit of transforms
          jasmine.RequestAnimationFrame.tick(1)

          // The origin is transformed with every
          expect(element.matrix()).toEqual(
            new Matrix().translate(5, 10).scale(1.5, 5, 10).rotate(22.5, 5, 10)
          )
        })

        it('steps multiple relative animations correctly from multiple runners', () => {
          const element = new Rect()
          const runner1 = new Runner(100).ease('-').element(element)
          const runner2 = new Runner(100).ease('-').element(element)
          const runner3 = new Runner(100).ease('-').element(element)
          runner1.translate(10, 20)
          runner2.scale(2)
          runner3.rotate(45)
          runner1.step(50)
          runner2.step(50)
          runner3.step(50)
          // transform sets an immediate callback to apply all merged transforms
          // when every runner had the chance to add its bit of transforms
          jasmine.RequestAnimationFrame.tick(1)

          // The origin is transformed with every
          expect(element.matrix()).toEqual(
            new Matrix().translate(5, 10).scale(1.5, 5, 10).rotate(22.5, 5, 10)
          )
        })

        it('absolute transformations correctly overwrite relatives', () => {
          const element = new Rect()
          const runner1 = new Runner(100).ease('-').element(element)
          const runner2 = new Runner(100).ease('-').element(element)
          const runner3 = new Runner(100).ease('-').element(element)
          runner1.translate(10, 20)
          runner2.transform({ scale: 2 })
          runner3.rotate(45)
          runner1.step(50)
          runner2.step(50)
          runner3.step(50)
          // transform sets an immediate callback to apply all merged transforms
          // when every runner had the chance to add its bit of transforms
          jasmine.RequestAnimationFrame.tick(1)

          expect(runner1._queue.length).toBe(0)

          // The origin is transformed with every
          expect(element.matrix()).toEqual(new Matrix().scale(1.5).rotate(22.5))
        })

        it('correctly animates matrices directly', () => {
          const element = new Rect()
          const runner = new Runner(100).ease('-').element(element)
          runner.transform(new Matrix({ rotate: 90 }))
          runner.step(50)
          // transform sets an immediate callback to apply all merged transforms
          // when every runner had the chance to add its bit of transforms
          jasmine.RequestAnimationFrame.tick(1)

          // The origin is transformed with every
          expect(element.matrix()).toEqual(
            new Matrix(0.5, 0.5, -0.5, 0.5, 0, 0)
          )
        })

        it('correctly animates matrices affine', () => {
          const element = new Rect()
          const runner = new Runner(100).ease('-').element(element)
          runner.transform(
            Object.assign({ affine: true }, new Matrix({ rotate: 90 }))
          )
          runner.step(50)
          // transform sets an immediate callback to apply all merged transforms
          // when every runner had the chance to add its bit of transforms
          jasmine.RequestAnimationFrame.tick(1)

          // The origin is transformed with every
          expect(element.matrix()).toEqual(new Matrix({ rotate: 45 }))
        })

        it('correctly animates matrices affine by passing third parameter', () => {
          const element = new Rect()
          const runner = new Runner(100).ease('-').element(element)
          runner.transform(new Matrix({ rotate: 90 }), true, true)
          runner.step(50)
          // transform sets an immediate callback to apply all merged transforms
          // when every runner had the chance to add its bit of transforms
          jasmine.RequestAnimationFrame.tick(1)

          // The origin is transformed with every
          expect(element.matrix()).toEqual(new Matrix({ rotate: 45 }))
        })

        it('correctly animates a declarative relative rotation', () => {
          const element = new Rect()
          const runner = new Runner(() => 1).element(element)
          runner.transform({ rotate: 90 }, true)
          runner.step(16)
          jasmine.RequestAnimationFrame.tick(1)
          runner.step(16)
          jasmine.RequestAnimationFrame.tick(1)
          expect(element.matrix()).not.toEqual(new Matrix())
        })
      })

      describe('x()', () => {
        it('queues a numer', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumber')
          runner.x(10)
          expect(spy).toHaveBeenCalledWith('x', 10)
        })
      })

      describe('y()', () => {
        it('queues a numer', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumber')
          runner.y(10)
          expect(spy).toHaveBeenCalledWith('y', 10)
        })
      })

      describe('dx()', () => {
        it('queues a numer', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumberDelta')
          runner.dx(10)
          expect(spy).toHaveBeenCalledWith('x', 10)
        })

        it('uses a delta of 0 by default', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumberDelta')
          runner.dx()
          expect(spy).toHaveBeenCalledWith('x', 0)
        })
      })

      describe('dy()', () => {
        it('queues a number', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumberDelta')
          runner.dy(10)
          expect(spy).toHaveBeenCalledWith('y', 10)
        })

        it('uses a delta of 0 by default', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumberDelta')
          runner.dy()
          expect(spy).toHaveBeenCalledWith('y', 0)
        })
      })

      describe('dmove()', () => {
        it('calls dx and dy', () => {
          const runner = new Runner()
          const spy1 = spyOn(runner, 'dx').and.returnValue(runner)
          const spy2 = spyOn(runner, 'dy').and.returnValue(runner)
          runner.dmove(10, 20)
          expect(spy1).toHaveBeenCalledWith(10)
          expect(spy2).toHaveBeenCalledWith(20)
        })
      })

      describe('_queueNumberDelta', () => {
        it('queues a morpher of type SVGNumber', () => {
          const element = new Rect().x(10)
          const runner = new Runner(100).ease('-').element(element)
          runner._queueNumberDelta('x', 10)
          runner.step(50)
          expect(runner._history.x.morpher.type()).toEqual(SVGNumber)
          expect(runner._history.x.morpher.from()).toEqual([10, ''])
          expect(runner._history.x.morpher.to()).toEqual([20, ''])

          expect(element.x()).toBe(15)
        })

        it('retargets correctly', () => {
          const element = new Rect().x(10)
          const runner = new Runner(100).ease('-').element(element)
          runner._queueNumberDelta('x', 10)
          runner.step(25)
          runner._queueNumberDelta('x', 20)

          expect(runner._history.x.morpher.to()).toEqual([30, ''])

          runner.step(25)
          expect(element.x()).toBe(20)
        })
      })

      describe('_queueObject', () => {
        it('queues a morphable object', () => {
          const element = new Rect().x(10)
          const runner = new Runner(100).ease('-').element(element)
          runner._queueObject('x', new SVGNumber(20))
          runner.step(50)
          expect(runner._history.x.morpher.type()).toEqual(SVGNumber)
          expect(runner._history.x.morpher.from()).toEqual([10, ''])
          expect(runner._history.x.morpher.to()).toEqual([20, ''])

          expect(element.x()).toBe(15)
        })

        it('queues a morphable primitive', () => {
          const element = new Rect().fill('#000')
          const runner = new Runner(100).ease('-').element(element)
          runner._queueObject('fill', '#fff')
          runner.step(50)
          expect(runner._history.fill.morpher.type()).toEqual(Color)

          expect(element.fill()).toBe('#808080')
        })

        it('retargets correctly', () => {
          const element = new Rect().x(10)
          const runner = new Runner(100).ease('-').element(element)
          runner._queueObject('x', 20)

          runner.step(25)

          runner._queueObject('x', 30)
          runner.step(25)
          expect(element.x()).toBe(20)
        })
      })

      describe('_queueNumber', () => {
        it('queues an SVGNumber with _queueObject', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueObject')
          runner._queueNumber('x', 10)
          expect(spy).toHaveBeenCalledWith('x', equal(new SVGNumber(10)))
        })
      })

      describe('cy()', () => {
        it('queues a numer', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumber')
          runner.cy(10)
          expect(spy).toHaveBeenCalledWith('cy', 10)
        })
      })

      describe('cx()', () => {
        it('queues a numer', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumber')
          runner.cx(10)
          expect(spy).toHaveBeenCalledWith('cx', 10)
        })
      })

      describe('move()', () => {
        it('calls x and y', () => {
          const runner = new Runner()
          const spy1 = spyOn(runner, 'x').and.returnValue(runner)
          const spy2 = spyOn(runner, 'y').and.returnValue(runner)
          runner.move(10, 20)
          expect(spy1).toHaveBeenCalledWith(10)
          expect(spy2).toHaveBeenCalledWith(20)
        })
      })

      describe('center()', () => {
        it('calls cx and cy', () => {
          const runner = new Runner()
          const spy1 = spyOn(runner, 'cx').and.returnValue(runner)
          const spy2 = spyOn(runner, 'cy').and.returnValue(runner)
          runner.center(10, 20)
          expect(spy1).toHaveBeenCalledWith(10)
          expect(spy2).toHaveBeenCalledWith(20)
        })
      })

      describe('size()', () => {
        it('calls width and height', () => {
          const runner = new Runner()
          const spy1 = spyOn(runner, 'width').and.returnValue(runner)
          const spy2 = spyOn(runner, 'height').and.returnValue(runner)
          runner.size(10, 20)
          expect(spy1).toHaveBeenCalledWith(10)
          expect(spy2).toHaveBeenCalledWith(20)
        })

        it('figures out height if only width given', () => {
          const element = new Rect().size(10, 10)
          const runner = new Runner().element(element)
          const spy1 = spyOn(runner, 'width').and.returnValue(runner)
          const spy2 = spyOn(runner, 'height').and.returnValue(runner)
          runner.size(20)
          expect(spy1).toHaveBeenCalledWith(20)
          expect(spy2).toHaveBeenCalledWith(20)
        })

        it('figures out width if only height given', () => {
          const element = new Rect().size(10, 10)
          const runner = new Runner().element(element)
          const spy1 = spyOn(runner, 'width').and.returnValue(runner)
          const spy2 = spyOn(runner, 'height').and.returnValue(runner)
          runner.size(null, 20)
          expect(spy1).toHaveBeenCalledWith(20)
          expect(spy2).toHaveBeenCalledWith(20)
        })
      })

      describe('width()', () => {
        it('queues a numer', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumber')
          runner.width(10)
          expect(spy).toHaveBeenCalledWith('width', 10)
        })
      })

      describe('height()', () => {
        it('queues a numer', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumber')
          runner.height(10)
          expect(spy).toHaveBeenCalledWith('height', 10)
        })
      })

      describe('plot()', () => {
        it('queues a morphable array', () => {
          const element = new Polygon().plot([10, 10, 20, 20])
          const runner = new Runner(100).ease('-').element(element)
          runner.plot(20, 20, 30, 30)
          runner.step(50)
          expect(runner._history.plot.morpher.from()).toEqual([10, 10, 20, 20])
          expect(runner._history.plot.morpher.to()).toEqual([20, 20, 30, 30])
          expect(element.array()).toEqual(new PointArray([15, 15, 25, 25]))
        })

        it('retargets correctly', () => {
          const element = new Polygon().plot([10, 10, 20, 20])
          const runner = new Runner(100).ease('-').element(element)
          runner.plot(20, 20, 30, 30)
          runner.step(25)
          runner.plot(30, 30, 40, 40)
          runner.step(25)
          expect(runner._history.plot.morpher.from()).toEqual([10, 10, 20, 20])
          expect(runner._history.plot.morpher.to()).toEqual([30, 30, 40, 40])
          expect(element.array()).toEqual(new PointArray([20, 20, 30, 30]))
        })
      })

      describe('leading()', () => {
        it('queues a numer', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueNumber')
          runner.leading(10)
          expect(spy).toHaveBeenCalledWith('leading', 10)
        })
      })

      describe('viewbox()', () => {
        it('queues a numer', () => {
          const runner = new Runner()
          const spy = spyOn(runner, '_queueObject')
          runner.viewbox(10, 10, 100, 100)
          expect(spy).toHaveBeenCalledWith(
            'viewbox',
            equal(new Box(10, 10, 100, 100))
          )
        })
      })

      describe('update()', () => {
        it('relays to attr call', () => {
          const runner = new Runner()
          const spy = spyOn(runner, 'attr')
          runner.update(0.5, '#fff', 1)
          expect(spy).toHaveBeenCalledWith('offset', 0.5)
          expect(spy).toHaveBeenCalledWith('stop-color', '#fff')
          expect(spy).toHaveBeenCalledWith('stop-opacity', 1)
        })
      })
    })
  })

  describe('FakeRunner', () => {
    describe('()', () => {
      it('creates a new FakeRunner with a new matrix which is always done', () => {
        const runner = new FakeRunner()
        expect(runner.transforms).toEqual(new Matrix())
        expect(runner.id).toBe(-1)
        expect(runner.done).toBe(true)
      })
    })

    describe('mergeWith()', () => {
      it('merges the transformations of a runner with another and returns a FakeRunner', () => {
        const fake = new FakeRunner()
        const runner = new Runner().addTransform({ translate: [10, 20] })
        const newRunner = fake.mergeWith(runner)
        expect(newRunner).toEqual(any(FakeRunner))
        expect(newRunner.transforms).toEqual(
          new Matrix({ translate: [10, 20] })
        )
      })
    })
  })

  describe('RunnerArray', () => {
    describe('add()', () => {
      it('adds a runner to the runner array', () => {
        const runner = new Runner()
        const arr = new RunnerArray()
        arr.add(runner)
        expect(arr.length()).toBe(1)
      })

      it('does not add the same runner twice', () => {
        const runner = new Runner()
        const arr = new RunnerArray()
        arr.add(runner)
        arr.add(runner)
        expect(arr.length()).toBe(1)
      })
    })

    describe('getByID()', () => {
      it('returns a runner by its id', () => {
        const runner = new Runner()
        const arr = new RunnerArray()
        arr.add(runner)
        expect(arr.getByID(runner.id)).toBe(runner)
      })
    })

    describe('remove()', () => {
      it('removes a runner by its id', () => {
        const runner = new Runner()
        const arr = new RunnerArray()
        arr.add(runner)
        arr.remove(runner.id)
        expect(arr.length()).toBe(0)
      })
    })

    describe('merge()', () => {
      it('merges all runners which are done', () => {
        const runner1 = new Runner().addTransform({ translate: [10, 20] })
        const runner2 = new Runner().addTransform({ rotate: 45 })
        const runner3 = new Runner().addTransform({ translate: [10, 20] })
        const arr = new RunnerArray()
        arr.add(runner1).add(runner2).add(runner3)
        runner1.done = true
        runner2.done = true
        runner3.done = true
        arr.merge()
        expect(arr.runners[0]).toEqual(any(FakeRunner))
        expect(arr.runners[0].transforms).toEqual(
          new Matrix({ translate: [10, 20] }).rotate(45).translate(10, 20)
        )
      })

      it('skips runners which are not done', () => {
        const runner1 = new Runner().addTransform({ translate: [10, 20] })
        const runner2 = new Runner().addTransform({ rotate: 45 })
        const runner3 = new Runner().addTransform({ rotate: 45 })
        const runner4 = new Runner().addTransform({ translate: [10, 20] })
        const runner5 = new Runner().addTransform({ rotate: 45 })
        const arr = new RunnerArray()
        arr.add(runner1).add(runner2).add(runner3).add(runner4).add(runner5)
        runner1.done = true
        runner2.done = true
        runner3.done = false
        runner4.done = true
        runner5.done = true
        arr.merge()
        expect(arr.runners[0]).toEqual(any(FakeRunner))
        expect(arr.runners[0].transforms).toEqual(
          new Matrix({ translate: [10, 20] }).rotate(45)
        )

        expect(arr.runners[2]).toEqual(any(FakeRunner))
        expect(arr.runners[2].transforms).toEqual(
          new Matrix({ translate: [10, 20] }).rotate(45)
        )

        expect(arr.runners[1]).toBe(runner3)
      })

      it('skips runners which have a timeline and are scheduled on that timeline', () => {
        const runner1 = new Runner().addTransform({ translate: [10, 20] })
        const runner2 = new Runner().addTransform({ rotate: 45 })
        const runner3 = new Runner().addTransform({ rotate: 45 })
        const runner4 = new Runner().addTransform({ translate: [10, 20] })
        const runner5 = new Runner().addTransform({ rotate: 45 })
        const arr = new RunnerArray()
        arr.add(runner1).add(runner2).add(runner3).add(runner4).add(runner5)
        runner1.done = true
        runner2.done = true
        runner3.done = true
        runner4.done = true
        runner5.done = true

        runner3.schedule(new Timeline())
        arr.merge()
        expect(arr.runners[0]).toEqual(any(FakeRunner))
        expect(arr.runners[0].transforms).toEqual(
          new Matrix({ translate: [10, 20] }).rotate(45)
        )

        expect(arr.runners[2]).toEqual(any(FakeRunner))
        expect(arr.runners[2].transforms).toEqual(
          new Matrix({ translate: [10, 20] }).rotate(45)
        )

        expect(arr.runners[1]).toBe(runner3)
      })
    })

    describe('edit()', () => {
      it('replaces one runner with another', () => {
        const arr = new RunnerArray()
        const runner1 = new Runner()
        const runner2 = new Runner()
        arr.add(runner1)
        arr.edit(runner1.id, runner2)
        expect(arr.length()).toBe(1)
        expect(arr.runners[0]).toBe(runner2)
      })
    })

    describe('length()', () => {
      it('returns the number of runners in the array', () => {
        const arr = new RunnerArray().add(new Runner()).add(new Runner())
        expect(arr.length()).toBe(2)
      })
    })

    describe('clearBefore', () => {
      it('removes all runners before a certain runner', () => {
        const runner1 = new Runner()
        const runner2 = new Runner()
        const runner3 = new Runner()
        const runner4 = new Runner()
        const runner5 = new Runner()
        const arr = new RunnerArray()
        arr.add(runner1).add(runner2).add(runner3).add(runner4).add(runner5)
        arr.clearBefore(runner3.id)
        expect(arr.length()).toBe(4)
        expect(arr.runners).toEqual([
          any(FakeRunner),
          runner3,
          runner4,
          runner5
        ])
      })
    })
  })
})
