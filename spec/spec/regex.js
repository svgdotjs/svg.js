describe('Regex', function() {

  describe('matchers', function() {
    describe('unit', function() {
      var match

      it('is true with a positive unit value', function() {
        match = ('10%').match(SVG.regex.unit)
        expect(match[1]).toBe('10')
        expect(match[2]).toBe('%')
      })
      it('is true with a negative unit value', function() {
        match = ('-11%').match(SVG.regex.unit)
        expect(match[1]).toBe('-11')
        expect(match[2]).toBe('%')
      })
      it('is false with a positive unit value', function() {
        match = ('NotAUnit').match(SVG.regex.unit)
        expect(match).toBeNull()
      })
    })
  })

  describe('testers', function() {
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

})