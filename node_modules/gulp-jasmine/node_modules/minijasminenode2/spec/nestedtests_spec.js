var minijasminelib = require('../lib/index');

describe('nested calls to executeSpecs', function() {
  var subEnv;
  beforeEach(function() {
    subEnv = new jasmine.Env();
  });

  it('should allow a nested call to minijasminelib', function(done) {
    console.log('Begin nested call');
    minijasminelib.executeSpecs({
      specs: ['spec/simplefail.js'],
      jasmineEnv: subEnv,
      onComplete: function(passed) {
        expect(passed).toEqual(false);
        console.log('End nested call');
        done();
      }
    });
  });
});
