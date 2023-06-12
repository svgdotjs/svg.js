/* globals jasmine */
/**
 * Jasmine RequestAnimationFrame: a set of helpers for testing functionality
 * that uses requestAnimationFrame under the Jasmine BDD framework for JavaScript.
 */
function RAFPlugin(jasmine) {
  var index = 0
  var callbacks = []

  function MockRAF() {
    this.nextTime = 0

    var _this = this

    /**
     * Mock for window.requestAnimationFrame
     */
    this.mockRAF = function (fn) {
      if (typeof fn !== 'function') {
        throw new Error('You should pass a function to requestAnimationFrame')
      }

      const i = index++
      callbacks[i] = fn

      return i
    }

    /**
     * Mock for window.cancelAnimationFrame
     */
    this.mockCAF = function (requestID) {
      callbacks.splice(requestID, 1)
    }

    this.mockPerf = {
      now: function () {
        return _this.nextTime
      }
    }

    /**
     * Install request animation frame mocks.
     */
    this.install = function (global) {
      _this.realRAF = global.requestAnimationFrame
      _this.realCAF = global.cancelAnimationFrame
      _this.realPerf = global.performance
      global.requestAnimationFrame = _this.mockRAF
      global.cancelAnimationFrame = _this.mockCAF
      global.performance = _this.mockPerf
    }

    /**
     * Uninstall request animation frame mocks.
     */
    this.uninstall = function (global) {
      global.requestAnimationFrame = _this.realRAF
      global.cancelAnimationFrame = _this.realCAF
      global.performance = _this.realPerf
      _this.nextTime = 0
      callbacks = []
    }

    /**
     * Simulate animation frame readiness.
     */
    this.tick = function (dt) {
      _this.nextTime += dt || 1

      var fns = callbacks
      var fn
      var i

      callbacks = []
      index = 0

      for (i in fns) {
        fn = fns[i]
        fn(_this.nextTime)
      }
    }
  }

  jasmine.RequestAnimationFrame = new MockRAF()
}

RAFPlugin(jasmine)
