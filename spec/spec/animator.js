describe('SVG.Animator', function () {

  beforeEach(function () {
    jasmine.RequestAnimationFrame.install()
    SVG.Animator.timeouts = new SVG.Queue()
    SVG.Animator.frames = new SVG.Queue()
    SVG.Animator.nextDraw = null
  })

  afterEach(function () {
    jasmine.RequestAnimationFrame.uninstall()
  })

  describe('timeout()', function () {
    it('calls a function after a specific time', function () {

      var spy = jasmine.createSpy('tester')
      var id = SVG.Animator.timeout(spy, 100)

      jasmine.RequestAnimationFrame.tick(99)
      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('cancelTimeout()', function () {
    it('cancels a timeout which was created with timeout()', function () {
      var spy = jasmine.createSpy('tester')
      var id = SVG.Animator.timeout(spy, 100)
      SVG.Animator.clearTimeout(id)

      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick(100)
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('frame()', function () {
    it('calls a function at the next animationFrame', function () {
      var spy = jasmine.createSpy('tester')

      SVG.Animator.frame(spy)
      expect(spy).not.toHaveBeenCalled()
      jasmine.RequestAnimationFrame.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

})
