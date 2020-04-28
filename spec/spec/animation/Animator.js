/* globals describe, expect, it, beforeEach, afterEach, jasmine */

import { Animator, Queue } from '../../../src/main.js'
import { getWindow } from '../../../src/utils/window.js'

describe('Animator.js', function () {

  beforeEach(function () {
    jasmine.RequestAnimationFrame.install(getWindow())
    Animator.timeouts = new Queue()
    Animator.frames = new Queue()
    Animator.nextDraw = null
  })

  afterEach(function () {
    jasmine.RequestAnimationFrame.uninstall(getWindow())
  })

  describe('timeout()', function () {
    it('calls a function after a specific time', function () {

      var spy = jasmine.createSpy('tester')
      Animator.timeout(spy, 100)

      jasmine.RequestAnimationFrame.tick(99)
      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('cancelTimeout()', function () {
    it('cancels a timeout which was created with timeout()', function () {
      var spy = jasmine.createSpy('tester')
      var id = Animator.timeout(spy, 100)
      Animator.clearTimeout(id)

      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick(100)
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('frame()', function () {
    it('calls a function at the next animationFrame', function () {
      var spy = jasmine.createSpy('tester')

      Animator.frame(spy)
      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

})
