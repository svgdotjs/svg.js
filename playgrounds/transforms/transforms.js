
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
draw.viewbox(100,100, 1000, 1000)
nested = draw.nested().size(200, 200).move(100,100).viewbox(0, 0, 100, 100)
rect = nested.rect(50, 50).stroke({width:0}).move(25, 90).scale(2, 0, 0).transform({tx:10, ty:10}, true).fill("red")

var box = rect.rbox()

div = document.createElement('div')
div.style.position = 'absolute'
div.style.left = box.x + 'px'
div.style.top = box.y + 'px'
div.style.width = box.width + 'px'
div.style.opacity = 0.4
div.style.height = box.height + 'px'
div.style.background = 'blue'

document.body.appendChild(div)

// rect1.toParent(nested).transform()
// rect2.toParent(g2).transform()
