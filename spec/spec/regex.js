describe('Regex', function() {

  describe('unit', function() {
    it('is true with a positive unit value', function() {
      expect(SVG.regex.unit.test('10%')).toBeTruthy()
    })
    it('is true with a negative unit value', function() {
      expect(SVG.regex.unit.test('-11%')).toBeTruthy()
    })
    it('is false with a positive unit value', function() {
      expect(SVG.regex.unit.test('NotAUnit')).toBeFalsy()
    })
  })

  describe('isEvent', function() {
    it('is true with a namespaced and lowercase name', function() {
      expect(SVG.regex.isEvent.test('my:event')).toBeTruthy()
    })
    it('is true with a namespaced and camelCase name', function() {
      expect(SVG.regex.isEvent.test('mt:fabulousEvent')).toBeTruthy()
    })
    it('is false without a namespace', function() {
      expect(SVG.regex.isEvent.test('idontlinkenamespaces')).toBeFalsy()
    })
  })

})