var minijasminelib = require('../lib/index');

describe('syntax-error', function() {
  var env;
  beforeEach(function() {
    subEnv = new jasmine.Env();
  });

  it('should report a failure when a syntax error happens', function(done) {
    minijasminelib.executeSpecs({
      specs: ['spec/syntax_error.js'],
      jasmineEnv: subEnv,
      onComplete: function(passed) {
        expect(passed).toEqual(false);
        console.log('End nested call');
        done();
      }
    });
  });
});
