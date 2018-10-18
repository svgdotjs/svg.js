    // Import raw svg
    svg: function (svg) {
      var well, len

      // act as getter if no svg string is given
      if(svg == null || svg === true) {
        // write svgjs data to the dom
        this.writeDataToDom()

        // return outer or inner content
        return svg
          ? this.node.innerHTML
          : this.node.outerHTML
      }

      // act as setter if we got a string

      // make sure we are on a parent when trying to import
      if(!(this instanceof SVG.Parent))
        throw Error('Cannot import svg into non-parent element')

      // create temporary holder
      well = document.createElementNS(SVG.ns, 'svg')

      // dump raw svg
      well.innerHTML = svg

      // transplant nodes
      for (len = well.children.length; len--;) {
        this.node.appendChild(well.firstElementChild)
      }

      return this
    },