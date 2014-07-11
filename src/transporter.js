SVG.extend(SVG.Parent, SVG.Text, {
  // Import svg SVG data
  svg: function(svg) {
    // create temporary div to receive svg content
    var element = document.createElement('div')

    if (svg) {
      // strip away newlines and properly close tags
      svg = svg
        .replace(/\n/, '')
        .replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>')

      // ensure SVG wrapper for correct element type casting
      element.innerHTML = '<svg>' + svg + '</svg>'

      // transplant content from well to target
      for (var i = element.firstChild.childNodes.length - 1; i >= 0; i--)
        if (element.firstChild.childNodes[i].nodeType == 1)
          this.node.appendChild(element.firstChild.childNodes[i])

      return this

    } else {
      // clone element and its contents
      var clone  = this.node.cloneNode(true)

      // add target to clone
      element.appendChild(clone)

      return element.innerHTML
    }
  }
})