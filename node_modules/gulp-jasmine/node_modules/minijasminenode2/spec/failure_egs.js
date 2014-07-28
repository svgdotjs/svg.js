describe('a pass and a failure', function(){
  it('should pass', function(){
    expect(1 + 2).toEqual(3);
  });

  describe('failure', function(){
    it('should report failure (THIS IS EXPECTED)', function(){
      expect(true).toBeFalsy();
    });
  });
});

describe('timeouts', function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 44;

  it('should timeout after 44ms (THIS IS EXPECTED)', function(done) {
    setTimeout(function() {
      expect(true).toBe(true);
      done();
    }, 1000);
  });

  it('should pass', function(){
    expect(1 + 2).toEqual(3);
  });
});
