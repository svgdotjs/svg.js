import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import { xlink } from '../modules/core/namespaces.js'
import Path from './Path.js'
import PathArray from '../types/PathArray.js'
import Text from './Text.js'
import baseFind from '../modules/core/selector.js'

export default class TextPath extends Text {

  // Initialize node
  constructor ( node ) {

    super( nodeOrNew( 'textPath', node ), node )

  }

  // return the array of the path track element
  array () {

    var track = this.track()

    return track ? track.array() : null

  }

  // Plot path if any
  plot ( d ) {

    var track = this.track()
    var pathArray = null

    if ( track ) {

      pathArray = track.plot( d )

    }

    return ( d == null ) ? pathArray : this

  }

  // Get the path element
  track () {

    return this.reference( 'href' )

  }

}

registerMethods( {
  Container: {
    textPath: wrapWithAttrCheck( function ( text, path ) {

      return this.defs().path( path ).text( text ).addTo( this )

    } )
  },
  Text: {
    // Create path for text to run on
    path: wrapWithAttrCheck( function ( track ) {

      var path = new TextPath()

      // if track is a path, reuse it
      if ( !( track instanceof Path ) ) {

        // create path element
        track = this.root().defs().path( track )

      }

      // link textPath to path and add content
      path.attr( 'href', '#' + track, xlink )

      // add textPath element as child node and return textPath
      return this.put( path )

    } ),

    // Get the textPath children
    textPath () {

      return this.find( 'textPath' )[0]

    }
  },
  Path: {
    // creates a textPath from this path
    text: wrapWithAttrCheck( function ( text ) {

      if ( text instanceof Text ) {

        var txt = text.text()
        return text.clear().path( this ).text( txt )

      }
      return this.parent().put( new Text() ).path( this ).text( text )

    } ),

    targets () {

      return baseFind( 'svg [href*="' + this.id() + '"]' )

    }
  }
} )

TextPath.prototype.MorphArray = PathArray
register( TextPath )
