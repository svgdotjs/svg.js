describe('Symbol', function() {
  var symbol

  beforeEach(function() {
    symbol = draw.symbol()
  })

  it('creates an instance of SVG.Symbol', function() {
    expect(symbol instanceof SVG.Symbol).toBeTruthy()
  })

  it('creates symbol in defs', function() {
    expect(symbol.parent instanceof SVG.Defs).toBeTruthy()
  })

})