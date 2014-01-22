SVG.TextPath = function() {
  this.constructor.call(this, SVG.create('textPath'))
}

// Inherit from SVG.Element
SVG.TextPath.prototype = new SVG.Element

//
SVG.extend(SVG.Text, {
  // Create path for text to run on
  path: function(d) {
    /* create textPath element */
    this.textPath = new SVG.TextPath

    /* move lines to textpath */
    while(this.node.hasChildNodes())
      this.textPath.node.appendChild(this.node.firstChild)

    /* add textPath element as child node */
    this.node.appendChild(this.textPath.node)

    /* create path in defs */
    this.track = this.doc().defs().path(d, true)

    /* create circular reference */
    this.textPath.parent = this

    /* link textPath to path and add content */
    this.textPath.attr('href', '#' + this.track, SVG.xlink)

    return this
  }
  // Plot path if any
, plot: function(d) {
    if (this.track) this.track.plot(d)
    return this
  }

})