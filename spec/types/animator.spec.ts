import * as SVGJS from '@svgdotjs/svg.js'

describe('SVG.Animator', function () {

  let jasm = jasmine as any

  beforeEach(function () {
    jasm.RequestAnimationFrame.install()
    SVGJS.Animator.timeouts = new SVGJS.Queue()
    SVGJS.Animator.frames = new SVGJS.Queue()
    SVGJS.Animator.nextDraw = null
  })

  afterEach(function () {
    jasm.RequestAnimationFrame.uninstall()
  })

  describe('timeout()', function () {
    it('calls a function after a specific time', function () {

      var spy = jasmine.createSpy('tester')
      var id = SVGJS.Animator.timeout(spy, 100)

      jasm.RequestAnimationFrame.tick(99)
      expect(spy).not.toHaveBeenCalled()
      jasm.RequestAnimationFrame.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('cancelTimeout()', function () {
    it('cancels a timeout which was created with timeout()', function () {
      var spy = jasmine.createSpy('tester')
      var id = SVGJS.Animator.timeout(spy, 100)
      SVGJS.Animator.clearTimeout(id)

      expect(spy).not.toHaveBeenCalled()
      jasm.RequestAnimationFrame.tick(100)
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('frame()', function () {
    it('calls a function at the next animationFrame', function () {
      var spy = jasmine.createSpy('tester')

      SVGJS.Animator.frame(spy)
      expect(spy).not.toHaveBeenCalled()
      jasm.RequestAnimationFrame.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

})
