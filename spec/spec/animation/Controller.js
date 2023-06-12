/* globals describe, expect, it, jasmine */

import { easing, defaults } from '../../../src/main.js'
import {
  Stepper,
  Ease,
  Controller,
  Spring,
  PID
} from '../../../src/animation/Controller.js'

const { any, createSpy } = jasmine

describe('Controller.js', () => {
  describe('easing', () => {
    var easedValues = {
      '-': 0.5,
      '<>': 0.5,
      '>': 0.7071,
      '<': 0.2929
    }

    ;['-', '<>', '<', '>'].forEach((el) => {
      describe(el, () => {
        it('is 0 at 0', () => {
          expect(easing[el](0)).toBe(0)
        })
        it('is 1 at 1', () => {
          expect(Math.round(easing[el](1) * 1000) / 1000).toBe(1) // we need to round cause for some reason at some point 1==0.999999999
        })
        it('is eased at 0.5', () => {
          expect(easing[el](0.5)).toBeCloseTo(easedValues[el])
        })
      })
    })

    describe('beziere()', () => {
      const b1 = easing.bezier(0.25, 0.25, 0.75, 0.75)
      const b2 = easing.bezier(-0.25, -0.25, 0.75, 0.75)
      const b3 = easing.bezier(0.5, 0.5, 2, 2)
      const b4 = easing.bezier(1, 1, 2, 2)
      const b5 = easing.bezier(-1, -1, -2, -2)

      it('is 0 at 0', () => {
        expect(b1(0)).toBe(0)
      })

      it('is 1 at 1', () => {
        expect(b1(1)).toBe(1)
      })

      it('is eased at 0.5', () => {
        expect(b1(0.5)).toBe(0.5)
        expect(b2(0.5)).toBe(0.3125)
        expect(b3(0.5)).toBe(1.0625)
        expect(b4(0.5)).toBe(1.25)
        expect(b5(0.5)).toBe(-1)
      })

      it('handles values bigger 1', () => {
        expect(b1(1.5)).toBe(1.5)
        expect(b2(1.5)).toBe(1.5)
        expect(b3(1.5)).toBe(1.5)
        expect(b4(1.5)).toBe(1)
        expect(b5(1.5)).toBe(1.5)
      })

      it('handles values lower 0', () => {
        expect(b1(-0.5)).toBe(-0.5)
        expect(b2(-0.5)).toBe(-0.5)
        expect(b3(-0.5)).toBe(-0.5)
        expect(b4(-0.5)).toBe(-0.5)
        expect(b5(-0.5)).toBe(0)
      })
    })

    describe('steps()', () => {
      const s1 = easing.steps(5)
      const s2 = easing.steps(5, 'start')
      const s3 = easing.steps(5, 'end')
      const s4 = easing.steps(5, 'none')
      const s5 = easing.steps(5, 'both')

      it('is 0 at 0', () => {
        expect(s1(0)).toBe(0)
        expect(s1(0, true)).toBe(0)
        expect(s2(0)).toBe(0.2)
        expect(s2(0, true)).toBe(0)
        expect(s3(0)).toBe(0)
        expect(s3(0, true)).toBe(0)
        expect(s4(0)).toBe(0)
        expect(s4(0, true)).toBe(0)
        expect(s5(0)).toBe(1 / 6)
        expect(s5(0, true)).toBe(0)
      })

      it('also works at values < 0', () => {
        expect(s1(-0.1)).toBe(-0.2)
        expect(s1(-0.1, true)).toBe(-0.2)
        expect(s2(-0.1)).toBe(0)
        expect(s2(-0.1, true)).toBe(0)
        expect(s3(-0.1)).toBe(-0.2)
        expect(s3(-0.1, true)).toBe(-0.2)
        expect(s4(-0.1)).toBe(-0.25)
        expect(s4(-0.1, true)).toBe(-0.25)
        expect(s5(-0.1)).toBe(0)
        expect(s5(-0.1, true)).toBe(0)
      })

      it('is 1 at 1', () => {
        expect(s1(1)).toBe(1)
        expect(s1(1, true)).toBe(0.8)
        expect(s2(1)).toBe(1)
        expect(s2(1, true)).toBe(1)
        expect(s3(1)).toBe(1)
        expect(s3(1, true)).toBe(0.8)
        expect(s4(1)).toBe(1)
        expect(s4(1, true)).toBe(1)
        expect(s5(1)).toBe(1)
        expect(s5(1, true)).toBe(5 / 6)
      })

      it('also works at values > 1', () => {
        expect(s1(1.1)).toBe(1)
        expect(s1(1.1, true)).toBe(1)
        expect(s2(1.1)).toBe(1.2)
        expect(s2(1.1, true)).toBe(1.2)
        expect(s3(1.1)).toBe(1)
        expect(s3(1.1, true)).toBe(1)
        expect(s4(1.1)).toBe(1.25)
        expect(s4(1.1, true)).toBe(1.25)
        expect(s5(1.1)).toBe(1)
        expect(s5(1.1, true)).toBe(1)
      })

      it('is eased at 0.1', () => {
        expect(s1(0.1)).toBe(0)
        expect(s1(0.1, true)).toBe(0)
        expect(s2(0.1)).toBe(0.2)
        expect(s2(0.1, true)).toBe(0)
        expect(s3(0.1)).toBe(0)
        expect(s3(0.1, true)).toBe(0)
        expect(s4(0.1)).toBe(0)
        expect(s4(0.1, true)).toBe(0)
        expect(s5(0.1)).toBe(1 / 6)
        expect(s5(0.1, true)).toBe(0)
      })

      it('is eased at 0.15', () => {
        expect(s1(0.15)).toBe(0)
        expect(s1(0.15, true)).toBe(0)
        expect(s2(0.15)).toBe(0.2)
        expect(s2(0.15, true)).toBe(0)
        expect(s3(0.15)).toBe(0)
        expect(s3(0.15, true)).toBe(0)
        expect(s4(0.15)).toBe(0)
        expect(s4(0.15, true)).toBe(0)
        expect(s5(0.15)).toBe(1 / 6)
        expect(s5(0.15, true)).toBe(0)
      })

      it('is eased at 0.2', () => {
        expect(s1(0.2)).toBe(0.2)
        expect(s1(0.2, true)).toBe(0.2)
        expect(s2(0.2)).toBe(0.4)
        expect(s2(0.2, true)).toBe(0.4)
        expect(s3(0.2)).toBe(0.2)
        expect(s3(0.2, true)).toBe(0.2)
        expect(s4(0.2)).toBe(0.25)
        expect(s4(0.2, true)).toBe(0.25)
        expect(s5(0.2)).toBe(1 / 3)
        expect(s5(0.2, true)).toBe(1 / 3)
      })

      it('is eased at 0.25', () => {
        expect(s1(0.25)).toBe(0.2)
        expect(s1(0.25, true)).toBe(0.2)
        expect(s2(0.25)).toBe(0.4)
        expect(s2(0.25, true)).toBe(0.4)
        expect(s3(0.25)).toBe(0.2)
        expect(s3(0.25, true)).toBe(0.2)
        expect(s4(0.25)).toBe(0.25)
        expect(s4(0.25, true)).toBe(0.25)
        expect(s5(0.25)).toBe(1 / 3)
        expect(s5(0.25, true)).toBe(1 / 3)
      })
    })
  })

  describe('Stepper', () => {
    it('has a done() method', () => {
      const stepper = new Stepper()
      expect(stepper).toEqual(any(Stepper))
      expect(stepper.done()).toBe(false)
    })
  })

  describe('Ease', () => {
    describe('()', () => {
      it('wraps the default easing function by default', () => {
        const ease = new Ease()
        expect(ease.ease).toBe(easing[defaults.timeline.ease])
      })

      it('wraps an easing function found in "easing"', () => {
        const ease = new Ease('-')
        expect(ease.ease).toBe(easing['-'])
      })

      it('wraps a a custom easing function', () => {
        const ease = new Ease(easing['-'])
        expect(ease.ease).toBe(easing['-'])
      })
    })

    describe('step()', () => {
      it('provides an eased value to a position', () => {
        let ease = new Ease(easing['-'])
        expect(ease.step(2, 4, 0.5)).toBe(3)

        ease = new Ease(() => 3)
        expect(ease.step(2, 4, 0.5)).toBe(8)

        ease = new Ease()
        expect(ease.step(2, 4, 0.5)).toBeCloseTo(3.414, 3)
      })

      it('jumps to "to" value at pos 1 if from is not a number', () => {
        const ease = new Ease('-')
        expect(ease.step('Hallo', 'Welt', 0.999)).toBe('Hallo')
        expect(ease.step('Hallo', 'Welt', 1)).toBe('Welt')
      })
    })
  })

  describe('Controller', () => {
    describe('()', () => {
      it('constructs a controller with the given stepper function set', () => {
        const spy = createSpy()
        const controller = new Controller(spy)
        expect(controller).toEqual(any(Controller))
        expect(controller.stepper).toBe(spy)
      })
    })

    describe('step()', () => {
      it('runs the stepper with current value, target value, dt and context', () => {
        const spy = createSpy().and.returnValue('foo')
        const controller = new Controller(spy)
        expect(controller.step(10, 20, 30, 'bar')).toBe('foo')
        expect(spy).toHaveBeenCalledWith(10, 20, 30, 'bar')
      })
    })

    describe('done()', () => {
      it('returns given values "done" property', () => {
        const spy = createSpy()
        const controller = new Controller(spy)
        expect(controller.done({ done: 'yes' })).toBe('yes')
      })
    })
  })

  describe('Spring', () => {
    describe('()', () => {
      it('creates a spring with default duration and overshoot', () => {
        const spring = new Spring()
        expect(spring).toEqual(any(Spring))
        expect(spring.duration()).toBe(500)
        expect(spring.overshoot()).toBe(0)
      })

      it('creates a spring with given duration and overshoot', () => {
        const spring = new Spring(100, 10)
        expect(spring).toEqual(any(Spring))
        expect(spring.duration()).toBe(100)
        expect(spring.overshoot()).toBe(10)
      })
    })

    describe('duration()', () => {
      it('gets and sets a new duration for the spring controller', () => {
        const spring = new Spring().duration(100)
        expect(spring.duration()).toBe(100)
      })
    })

    describe('overshoot()', () => {
      it('gets and sets a new overshoot for the spring controller', () => {
        const spring = new Spring().overshoot(10)
        expect(spring.overshoot()).toBe(10)
      })
    })

    describe('step()', () => {
      it('calculates the new spring position', () => {
        const spring = new Spring()
        expect(spring.step(0, 100, 16, {})).toBeCloseTo(0.793, 3)
      })

      it('returns current if current is a string', () => {
        const spring = new Spring()
        expect(spring.step('Hallo', 'Welt', 16, {})).toBe('Hallo')
      })

      it('returns current if dt is 0', () => {
        const spring = new Spring()
        expect(spring.step(0, 100, 0, {})).toBe(0)
      })

      it('is done if dt is infinity and returns target', () => {
        const spring = new Spring()
        const context = {}
        expect(spring.step(0, 100, Infinity, context)).toBe(100)
        expect(spring.done(context)).toBe(true)
      })

      it('uses dt of 16 if it is over 100', () => {
        const spring = new Spring()
        expect(spring.step(0, 100, 101, {})).toBe(spring.step(0, 100, 16, {}))
      })
    })
  })

  describe('PID', () => {
    describe('()', () => {
      it('creates a PID controller with default values', () => {
        const pid = new PID()
        expect(pid).toEqual(any(PID))
        expect(pid.p()).toBe(0.1)
        expect(pid.i()).toBe(0.01)
        expect(pid.d()).toBe(0)
        expect(pid.windup()).toBe(1000)
      })

      it('creates a PID controller with given values', () => {
        const pid = new PID(1, 2, 3, 4)
        expect(pid).toEqual(any(PID))
        expect(pid.p()).toBe(1)
        expect(pid.i()).toBe(2)
        expect(pid.d()).toBe(3)
        expect(pid.windup()).toBe(4)
      })
    })

    describe('p()', () => {
      it('gets and sets the p parameter of the controller', () => {
        const pid = new PID().p(100)
        expect(pid.p()).toBe(100)
      })
    })

    describe('i()', () => {
      it('gets and sets the i parameter of the controller', () => {
        const pid = new PID().i(100)
        expect(pid.i()).toBe(100)
      })
    })

    describe('d()', () => {
      it('gets and sets the d parameter of the controller', () => {
        const pid = new PID().d(100)
        expect(pid.d()).toBe(100)
      })
    })

    describe('windup()', () => {
      it('gets and sets the windup parameter of the controller', () => {
        const pid = new PID().windup(100)
        expect(pid.windup()).toBe(100)
      })
    })

    describe('step()', () => {
      it('returns current if current is a string', () => {
        const pid = new PID()
        expect(pid.step('Hallo', 'Welt', 16, {})).toBe('Hallo')
      })

      it('returns current if dt is 0', () => {
        const pid = new PID()
        expect(pid.step(0, 100, 0, {})).toBe(0)
      })

      it('is done if dt is infinity and returns target', () => {
        const pid = new PID()
        const context = {}
        expect(pid.step(0, 100, Infinity, context)).toBe(100)
        expect(pid.done(context)).toBe(true)
      })

      it('calculates a new value', () => {
        const pid = new PID()
        expect(pid.step(0, 100, 16, {})).toBe(20)
      })

      it('uses antiwindup to restrict i power', () => {
        const pid = new PID(0, 5, 0, 100)
        expect(pid.step(0, 100, 1000, {})).toBe(500)
      })

      it('does not use antiwindup if disabled', () => {
        const pid = new PID(0, 5, 0, false)
        expect(pid.step(0, 100, 1000, {})).toBe(500000)
      })
    })
  })
})
