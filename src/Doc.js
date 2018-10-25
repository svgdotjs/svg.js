import Container from './Container.js'
import Parent from './Parent.js'
import {adopt, extend} from './tools.js'
import {ns, xlink, xmlns, svgjs} from './namespaces.js'

export default class Doc extends Container {
   constructor (node) {
     super(nodeOrNew('svg', node))
     this.namespace()
   }

   isRoot () {
     return !this.node.parentNode || !(this.node.parentNode instanceof window.SVGElement) || this.node.parentNode.nodeName === '#document'
   }

   // Check if this is a root svg
   // If not, call docs from this element
   doc () {
     if (this.isRoot()) return this
     return super.doc()
   }

   // Add namespaces
   namespace () {
     if (!this.isRoot()) return this.doc().namespace()
     return this
       .attr({ xmlns: ns, version: '1.1' })
       .attr('xmlns:xlink', xlink, xmlns)
       .attr('xmlns:svgjs', svgjs, xmlns)
   }

   // Creates and returns defs element
   defs () {
     if (!this.isRoot()) return this.doc().defs()
     return adopt(this.node.getElementsByTagName('defs')[0]) ||
      this.put(new Defs())
   }

   // custom parent method
   parent (type) {
     if (this.isRoot()) {
       return this.node.parentNode.nodeName === '#document' ? null : this.node.parentNode
     }

     return super.parent(type)
   }

   // Removes the doc from the DOM
   remove () {
     if (!this.isRoot()) {
       return super.remove()
     }

     if (this.parent()) {
       this.parent().removeChild(this.node)
     }

     return this
   }

   clear () {
     // remove children
     while (this.node.hasChildNodes()) {
       this.node.removeChild(this.node.lastChild)
     }
     return this
   }
}

addFactory(Container, {
  // Create nested svg document
  nested () {
    return this.put(new Doc())
  }
})
