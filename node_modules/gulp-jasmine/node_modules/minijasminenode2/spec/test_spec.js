
describe('jasmine-node-flat', function(){
  it('should pass', function(){
    expect(1 + 2).toEqual(3);
  });
});

describe('root', function () {

  describe('nested', function () {

    it('nested statement', function () {
      expect(1).toBeTruthy();
    });

  });

  it('root statement', function () {
    expect(1).toBeTruthy();
  });

});

describe("Top level describe block", function() {
  it("first it block in top level describe", function() {
    expect(true).toEqual(true);
  });
  describe("Second level describe block", function() {
    it("first it block in second level describe", function() {
      expect(true).toBe(true);
    });
  });
  it("second it block in top level describe", function() {
    expect(true).toEqual(true);
  });
});

describe('async', function () {
  var request = function (str, func) {
    setTimeout(function() {
      func('1', '2', 'hello world');
    }, 200);
  };

  it("should respond with hello world", function(done) {
    request("http://localhost:3000/hello", function(error, response, body) {
      expect(body).toEqual("hello world");
      done();
    });
  });

  it("should respond with hello world", function(done) {
    request("http://localhost:3000/hello", function(error, response, body) {
      expect(body).toEqual("hello world");
      done();
    });
  }, 250); // timeout after 250 ms
});
