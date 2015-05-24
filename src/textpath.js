SVG.TextPath = SVG.invent({
  // Initialize node
  create: 'textPath'

  // Inherit from
, inherit: SVG.Element

  // Define parent class
, parent: SVG.Text

  // Add parent method
, construct: {
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
      this.track = this.doc().defs().path(d)

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
  }
})