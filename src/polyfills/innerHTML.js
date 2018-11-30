/* globals SVGElement, DOMParser */

(function () {
  try {
    if (SVGElement.prototype.innerHTML) return
  } catch (e) { return }

  var serializeXML = function (node, output) {
    var nodeType = node.nodeType
    if (nodeType === 3) {
      output.push(node.textContent.replace(/&/, '&amp;').replace(/</, '&lt;').replace('>', '&gt;'))
    } else if (nodeType === 1) {
      output.push('<', node.tagName)
      if (node.hasAttributes()) {
        [].forEach.call(node.attributes, function (attrNode) {
          output.push(' ', attrNode.name, '=\'', attrNode.value, '\'')
        })
      }
      if (node.hasChildNodes()) {
        output.push('>');
        [].forEach.call(node.childNodes, function (childNode) {
          serializeXML(childNode, output)
        })
        output.push('</', node.tagName, '>')
      } else {
        output.push('/>')
      }
    } else if (nodeType === 8) {
      output.push('<!--', node.nodeValue, '-->')
    }
  }

  Object.defineProperty(SVGElement.prototype, 'innerHTML', {
    get: function () {
      var output = []
      var childNode = this.firstChild
      while (childNode) {
        serializeXML(childNode, output)
        childNode = childNode.nextSibling
      }
      return output.join('')
    },
    set: function (markupText) {
      while (this.firstChild) {
        this.removeChild(this.firstChild)
      }

      try {
        var dXML = new DOMParser()
        dXML.async = false

        var sXML = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\'>' + markupText + '</svg>'
        var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement

        var childNode = svgDocElement.firstChild
        while (childNode) {
          this.appendChild(this.ownerDocument.importNode(childNode, true))
          childNode = childNode.nextSibling
        }
      } catch (e) {
        throw new Error('Can not set innerHTML on node')
      };
    }
  })

  Object.defineProperty(SVGElement.prototype, 'outerHTML', {
    get: function () {
      var output = []
      serializeXML(this, output)
      return output.join('')
    },
    set: function (markupText) {
      while (this.firstChild) {
        this.removeChild(this.firstChild)
      }

      try {
        var dXML = new DOMParser()
        dXML.async = false

        var sXML = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\'>' + markupText + '</svg>'
        var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement

        var childNode = svgDocElement.firstChild
        while (childNode) {
          this.parentNode.insertBefore(this.ownerDocument.importNode(childNode, true), this)
          // this.appendChild(this.ownerDocument.importNode(childNode, true));
          childNode = childNode.nextSibling
        }
      } catch (e) {
        throw new Error('Can not set outerHTML on node')
      };
    }
  })
})()
