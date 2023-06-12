SVG.bench.describe(
  'Access a dom attributes vs dom properties vs object properties',
  function (bench) {
    bench.test('using an object', function () {
      var sum = 0
      var obj = { x: '30' }
      for (var i = 0; i < 1000000; i++) {
        sum += obj.x * i
      }
      console.log(sum)
    })

    bench.test('figure out what the overhead is', function () {
      var obj = bench.draw.rect(100, 100).move(0, 0)
    })

    bench.test('using dom attributes', function () {
      var sum = 0
      var obj = bench.draw.rect(100, 100).move(0, 0)
      var node = obj.node
      for (var i = 0; i < 1000000; i++) {
        sum += node.getAttribute('x') * i
      }
      console.log(sum, node.getAttribute('x'))
    })

    bench.test('using dom properties', function () {
      var sum = 0
      var obj = bench.draw.rect(100, 100).move(0, 0)
      var node = obj.node
      for (var i = 0; i < 1000000; i++) {
        sum += node.x.baseVal * i
      }
      console.log(sum, node.x)
    })
  }
)
