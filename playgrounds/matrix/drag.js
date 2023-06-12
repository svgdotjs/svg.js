function reactToDrag(element, onDrag, beforeDrag) {
  let xStart, yStart
  let startDrag = (event) => {
    // Avoid the default events
    event.preventDefault()

    // Store the position where the drag started
    xStart = event.pageX
    yStart = event.pageY

    // Fire the start drag event
    if (beforeDrag) {
      var { x, y } = parent.point(event.pageX, event.pageY)
      beforeDrag(event, x, y)
    }

    // Register events to react to dragging and drag ends
    SVG.on(window, ['mousemove.drag', 'touchmove.drag'], reactDrag)
    SVG.on(window, ['mouseup.drag', 'touchend.drag'], stopDrag)
  }

  let reactDrag = (event) => {
    // Convert screen coordinates to svg coordinates and use them
    var { x, y } = parent.point(event.pageX, event.pageY)
    if (onDrag) onDrag(event, x, y)
  }

  let stopDrag = (event) => {
    SVG.off(window, ['mousemove.drag', 'touchmove.drag'])
    SVG.off(window, ['mouseup.drag', 'touchend.drag'])
  }

  // Bind the drag tracker to this element directly
  let parent = element.root()
  let point = new SVG.Point()
  element.mousedown(startDrag).touchstart(startDrag)
}

SVG.extend(SVG.Element, {
  draggable: function (after) {
    let sx, sy

    reactToDrag(
      this,
      (e, x, y) => {
        this.transform({
          origin: [sx, sy],
          position: [x, y]
        })

        if (after) {
          after(this, x, y)
        }
      },
      (e, x, y) => {
        var toAbsolute = new SVG.Matrix(this).inverse()
        var p = new SVG.Point(x, y).transform(toAbsolute)
        sx = p.x
        sy = p.y
      }
    )
    return this
  }
})
