SVG.bench.describe('Change textContent 10000 times', function (bench) {
  var data =
    'M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100'

  var node = bench.draw.plain('').node

  bench.test('using appendChild', function () {
    for (var i = 0; i < 1000000; i++) {
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild)
      }

      node.appendChild(document.createTextNode('test' + i))
    }
  })
  bench.test('using textContent', function () {
    for (var i = 0; i < 1000000; i++) {
      node.textContent = 'test' + i
    }
  })
})
