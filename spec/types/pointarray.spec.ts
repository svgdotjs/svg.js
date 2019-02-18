import * as SVGJS from '@svgdotjs/svg.js'


describe('PointArray', function () {
  const squareString = '0,0 1,0 1,1 0,1';
  const square = new SVGJS.PointArray(squareString)

  describe('toString()', function() {
    it('round trips with string', () => {
      expect(square.toString()).toEqual(squareString)
    })
  })

  describe('transform()', function() {
    it('translates correctly', () => {
      const translation = new SVGJS.Matrix().translate(2,1)
      const newSquare = square.transform(translation)
      expect(newSquare.toString()).toEqual('2,1 3,1 3,2 2,2')
    })

    it('transforms like Point', () => {
      const matrix = new SVGJS.Matrix(1, 2, 3, 4, 5, 6)
      const newSquare = square.transform(matrix)
      for (let i = 0; i < square.length; i++) {
        const squarePoint = new SVGJS.Point(square[i])
        const newSquarePoint = new SVGJS.Point(newSquare[i])
        expect(squarePoint.transform(matrix)).toEqual(newSquarePoint)
      }
    })
  })
})
