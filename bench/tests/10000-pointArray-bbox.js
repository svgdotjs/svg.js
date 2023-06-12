SVG.bench.describe('Generate 10000 pathArrays bbox', function (bench) {
  var data =
    '209,153 389,107 547,188 482,289 374,287 91,254 407,243 391,185 166,226 71,177 65,52 234,50 107,136 163,199 158,131 323,45 218,145 305,190 374,143 174,216 296,241'

  var dataArr = [
    [209, 153],
    [389, 107],
    [547, 188],
    [482, 289],
    [374, 287],
    [91, 254],
    [407, 243],
    [391, 185],
    [166, 226],
    [71, 177],
    [65, 52],
    [234, 50],
    [107, 136],
    [163, 199],
    [158, 131],
    [323, 45],
    [218, 145],
    [305, 190],
    [374, 143],
    [174, 216],
    [296, 241]
  ]

  bench.test('using SVG.js v3.0.0', function () {
    for (var i = 0; i < 10000; i++) {
      SVG.parser.poly.setAttribute('points', data)
      SVG.parser.poly.getBBox()
    }
  })

  bench.test('using SVG.js v3.0.0 without parser', function () {
    for (var i = 0; i < 10000; i++) {
      var maxX = -Infinity,
        maxY = -Infinity,
        minX = Infinity,
        minY = Infinity
      dataArr.forEach(function (el) {
        maxX = Math.max(el[0], maxX)
        maxY = Math.max(el[1], maxY)
        minX = Math.min(el[0], minX)
        minY = Math.min(el[1], minY)
      })
      var a = { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
    }
    //new SVG.Path().attr('d', data).addTo(draw).bbox()
  })
})
