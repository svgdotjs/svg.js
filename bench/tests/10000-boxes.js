SVG.bench.describe('Generate 100000 bbox', function (bench) {
  var rect = bench.draw.rect(100, 100)

  bench.test('using SVG.js v3.0.0', function () {
    for (var i = 0; i < 100000; i++) rect.bbox()
  })
  //bench.test('using vanilla js', function() {
  //  var node = rect.node
  //  for (var i = 0; i < 10000; i++) {
  //    node.getBBox()
  //  }
  //})
  //bench.test('using Snap.svg v0.5.1', function() {
  //  for (var i = 0; i < 10000; i++)
  //    bench.snap.rect(50, 50, 100, 100)
  //})
})

SVG.bench.describe('Generate 100000 rbox', function (bench) {
  var rect = bench.draw.rect(100, 100)

  bench.test('using SVG.js v3.0.0', function () {
    for (var i = 0; i < 100000; i++) rect.bbox()
  })
  //bench.test('using vanilla js', function() {
  //  var node = rect.node
  //  for (var i = 0; i < 10000; i++) {
  //    node.getBoundingClientRect()
  //  }
  //})
  //bench.test('using Snap.svg v0.5.1', function() {
  //  for (var i = 0; i < 10000; i++)
  //    bench.snap.rect(50, 50, 100, 100)
  //})
})
SVG.bench.describe('Generate 100000 viewbox', function (bench) {
  var nested = bench.draw.nested().viewbox(10, 10, 100, 100)

  bench.test('using SVG.js v3.0.0', function () {
    for (var i = 0; i < 100000; i++) nested.viewbox()
  })
  //bench.test('using vanilla js', function() {
  //  var node = rect.node
  //  for (var i = 0; i < 10000; i++) {
  //    node.getAttribute('viewBox')
  //  }
  //})
  //bench.test('using Snap.svg v0.5.1', function() {
  //  for (var i = 0; i < 10000; i++)
  //    bench.snap.rect(50, 50, 100, 100)
  //})
})
