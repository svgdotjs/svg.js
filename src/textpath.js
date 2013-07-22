SVG.TextPath = function() {
  this.constructor.call(this, SVG.create('textPath'))
}

// Inherit from SVG.Element
SVG.TextPath.prototype = new SVG.Path

//
SVG.extend(SVG.TextPath, {
  text: function(text) {
    /* remove children */
    while (this.node.firstChild)
      this.node.removeChild(this.node.firstChild)

    /* add text */
    this.node.appendChild(document.createTextNode(text))

    return this.parent
  }
})

//
SVG.extend(SVG.Text, {
  // Create path for text to run on
  path: function(d) {
    /* create textPath element */
    this.textPath = new SVG.TextPath

    /* remove all child nodes */
    while (this.node.firstChild)
      this.node.removeChild(this.node.firstChild)

    /* add textPath element as child node */
    this.node.appendChild(this.textPath.node)

    /* create path in defs */
    this.track = this.doc().defs().path(d, true)

    /* create circular reference */
    this.textPath.parent = this

    /* alias local text() method to textPath's text() method  */
    this.text = function(text) {
      return this.textPath.text(text)
    }

    /* alias plot() method on track */
    this.plot = function(d) {
      this.track.plot(d)
      return this
    }

    /* link textPath to path and add content */
    return this.textPath.attr('href', '#' + this.track, SVG.xlink).text(this.content)
  }

})