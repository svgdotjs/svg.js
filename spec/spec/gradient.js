describe('Gradient', function() {
  var rect = draw.rect(100,100)
    , gradient = draw.gradient('linear', function(stop) {
      stop.at({ offset: 0, color: '#333', opacity: 1 })
      stop.at({ offset: 100, color: '#fff', opacity: 1 })
    })
  
  it('should be an instance of SVG.Gradient', function() {
    expect(gradient instanceof SVG.Gradient).toBe(true)
  })
  
  describe('fill()', function() {
    it('should return the id of the gradient wrapped in url()', function() {
      expect(gradient.fill()).toBe('url(#' + gradient.attr('id') + ')')
    })
  })
  
})