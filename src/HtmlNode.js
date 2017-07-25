SVG.HtmlNode = SVG.invent({
  create: function(element) {
    this.node = element
  }

, extend: {
    add: function(element, i) {
      element = createElement(element)
      if(element instanceof SVG.Nested) {
        element = new SVG.Doc(element.node)
        element.setData(JSON.parse(element.node.getAttribute('svgjs:data')) || {})
      }

      if (i == null)
        this.node.appendChild(element.node)
      else if (element.node != this.node.children[i])
        this.node.insertBefore(element.node, this.node.children[i])

      return this
    }

  , put: function(element, i) {
      this.add(element, i)
      return element
    }
  }
})
