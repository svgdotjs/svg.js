function print(mat) {
  let { a, b, c, d } = mat
  console.log(`
    a: ${a.toFixed(2)}
    b: ${b.toFixed(2)}
    c: ${c.toFixed(2)}
    d: ${d.toFixed(2)}
    `)
}

function moveit() {
  let { cx: x0, cy: y0 } = or.rbox(svg)
  let { cx: x1, cy: y1 } = b1.rbox(svg)
  let { cx: x2, cy: y2 } = b2.rbox(svg)

  let m = new SVG.Matrix(
    (x1 - x0) / 50,
    (y1 - y0) / 50,
    (x2 - x0) / 50,
    (y2 - y0) / 50,
    x0,
    y0
  )
  let com = m.decompose()
  let g = new SVG.Matrix().compose(com)

  // Transform both of the items
  target.transform(m)
  mover.transform(g)

  console.log(com)
  print(m)
  print(g)
}

// Declare the two points
let svg = SVG('svg')
var or = SVG('#or').draggable(moveit)
var b1 = SVG('#b1').draggable(moveit)
var b2 = SVG('#b2').draggable(moveit)

// Declare the squares
let target = SVG('#true')
let mover = SVG('#guess')
let tester = SVG('#tester')
