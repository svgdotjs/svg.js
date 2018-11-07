/**
 * Jasmine RequestAnimationFrame: a set of helpers for testing funcionality
 * that uses requestAnimationFrame under the Jasmine BDD framework for JavaScript.
 */
;(function() {

    var index = 0,
        callbacks = [];

    function MockRAF(global) {
        this.realRAF  = global.requestAnimationFrame,
        this.realCAF  = global.cancelAnimationFrame,
        this.realPerf = global.performance,
        this.nextTime = 0

        var _this = this

        /**
         * Mock for window.requestAnimationFrame
         */
        this.mockRAF = function(fn) {
            if (typeof fn !== 'function') {
                throw new Error('You should pass a function to requestAnimationFrame');
            }

            callbacks[index++] = fn;

            return index;
        };

        /**
         * Mock for window.cancelAnimationFrame
         */
        this.mockCAF = function(requestID) {
            callbacks.splice(requestID, 1)
        };

        this.mockPerf = {
            now: function () {
                return _this.nextTime
            }
        }

        /**
         * Install request animation frame mocks.
         */
        this.install = function() {
            global.requestAnimationFrame = _this.mockRAF;
            global.cancelAnimationFrame = _this.mockCAF;
            global.performance = _this.mockPerf;
        };

        /**
         * Uninstall request animation frame mocks.
         */
        this.uninstall = function() {
            global.requestAnimationFrame = _this.realRAF;
            global.cancelAnimationFrame = _this.realCAF;
            global.performance = _this.realPerf;
            _this.nextTime = 0
            callbacks = []
        };

        /**
         * Simulate animation frame readiness.
         */
        this.tick = function(dt) {
          _this.nextTime += (dt || 1)

            var fns = callbacks, fn, i;

            callbacks = [];
            index = 0;

            for (i in fns) {
                fn = fns[i];
                fn(_this.nextTime);
            }
        };
    }


    jasmine.RequestAnimationFrame = new MockRAF(window);
}());
