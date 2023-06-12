SVG.bench.describe('Transform 1000000 rects', function (bench) {
  let parameters = {
    translate: [20, 30],
    origin: [100, 100],
    rotate: 25,
    skew: [10, 30],
    scale: 0.5
  }

  let matrixLike = { a: 2, b: 3, c: 1, d: 2, e: 49, f: 100 }
  let matrix = new SVG.Matrix(matrixLike)

  let worker = new SVG.Matrix()
  bench.test('with parameters', function () {
    for (var i = 0; i < 1000000; i++) worker.transform(parameters)
  })

  worker = new SVG.Matrix()
  bench.test('with matrix like', function () {
    for (var i = 0; i < 1000000; i++) {
      worker.transform(matrixLike)
    }
  })

  worker = new SVG.Matrix()
  bench.test('with SVG.Matrix', function () {
    for (var i = 0; i < 1000000; i++) worker.transform(matrix)
  })
})
