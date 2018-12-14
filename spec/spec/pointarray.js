describe('PointArray', function() {
  const squareString = '0,0 1,0 1,1 0,1';
  const square = new SVG.PointArray(squareString)

  describe('toString()', function() {
    it('round trips with string', () => {
      expect(square.toString()).toEqual(squareString)
    })
  })

  describe('transform()', function() {
    it('translates correctly', () => {
      const translation = new SVG.Matrix().translate(2,1)
      const newSquare = square.transform(translation)
      expect(newSquare.toString()).toEqual('2,1 3,1 3,2 2,2')
    })

    it('transforms like Point', () => {
      const matrix = new SVG.Matrix(1, 2, 3, 4, 5, 6)
      const newSquare = square.transform(matrix)
      for (let i = 0; i < square.length; i++) {
        const squarePoint = new SVG.Point(square[i])
        const newSquarePoint = new SVG.Point(newSquare[i])
        expect(squarePoint.transform(matrix)).toEqual(newSquarePoint)
      }
    })
  })
})
