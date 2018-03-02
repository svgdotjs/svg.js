
// let mover = SVG.select("#new")[0]
// mover.transform({
//   // position: [800, 500],
//   // origin: [200, 400],
//   // skew: [20, 0],
//   // rotate: 30,
// })


// var draw = SVG.select('svg')[0]
// var rect = draw.rect(100, 100)
//   .transform({
//     // rotate: -10,
//     translate: [-50, -50],
//     // scale: 2
//   }).opacity(0.3)
//
//
// var es = SVG.select('ellipse')

draw = SVG("svg")


offset = draw.screenCTM()
draw.viewbox(100,100, 200, 200)
nested = draw.nested().size(200, 200).move(100,100).viewbox(0, 0, 100, 100)
rect = nested.rect(50, 180).stroke({width:0}).move(25, 90).scale(2, 0, 0).transform({tx:10, ty:10}, true)

var box = rect.rbox()
draw.rect(box.width, box.height).move(box.x, box.y).fill("blue")
draw.rect(78, 226).move(100, 360).fill("blue")

// rect1.toParent(nested).transform()
// rect2.toParent(g2).transform()
