describe('Image', function() {
  var image, loadCb

  beforeEach(function(done) {
    loadCb = {cb: function(){ done() }}
    spyOn(loadCb, 'cb').and.callThrough()
    image = draw.image(imageUrl, loadCb.cb).size(100,100)
  })

  afterEach(function() {
    draw.clear()
  })


  describe('()', function() {
    it('should set width and height automatically if no size is given', function(done) {
      image = draw.image(imageUrl, function() {
        expect(image.node.getAttribute('height')).toBe('1')
        expect(image.node.getAttribute('width')).toBe('1')
        done()
      })
    })
    it('should not change with and height when size already set', function(done) {
      image = draw.image(imageUrl, function() {
        expect(image.node.getAttribute('height')).toBe('100')
        expect(image.node.getAttribute('width')).toBe('100')
        done()
      }).size(100,100)
    })
    it('returns itself when no url given', function() {
      var img = new SVG.Image()
      expect(img.load()).toBe(img)
    })
    it('executes the load callback', function() {
      expect(loadCb.cb).toHaveBeenCalledWith(jasmine.any(Event))
    })
  })
})
