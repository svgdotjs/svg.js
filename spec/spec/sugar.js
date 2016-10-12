describe('Sugar', function() {

  var rect

  beforeEach(function() {
    draw.attr('viewBox', null)
  })

  afterEach(function() {
    draw.clear()
  })

  describe('fill()', function() {
    it('returns the node reference', function() {
      rect = draw.rect(100,100)
      expect(rect.fill('red')).toBe(rect)
    })

    it('sets the given value', function() {
      rect = draw.rect(100,100)
      expect(rect.fill('red').attr('fill')).toBe('red')
    })

    it('sets the given value with object given', function() {
      rect = draw.rect(100,100)
      rect.fill({color: 'red', opacity: 0.5, rule: 'odd'})
      expect(rect.attr('fill')).toBe('red')
      expect(rect.attr('fill-opacity')).toBe(0.5)
      expect(rect.attr('fill-rule')).toBe('odd')
    })

    it('is a nop with no argument given and returns noce reference', function() {
      rect = draw.rect(100,100).fill('red')
      expect(rect.fill()).toBe(rect)
      expect(rect.attr('fill')).toBe('red')
    })
  })
})
