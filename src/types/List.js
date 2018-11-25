import { extend } from '../utils/adopter.js'
import { subClassArray } from './ArrayPolyfill.js'

const List = subClassArray( 'List', Array, function ( arr = [] ) {

  // This catches the case, that native map tries to create an array with new Array(1)
  if ( typeof arr === 'number' ) return this
  this.length = 0
  this.push( ...arr )

} )

export default List

extend( List, {
  each ( fnOrMethodName, ...args ) {

    if ( typeof fnOrMethodName === 'function' ) {

      this.forEach( ( el ) => {

        fnOrMethodName.call( el, el )

      } )

    } else {

      return this.map( el => {

        return el[fnOrMethodName]( ...args )

      } )

    }

    return this

  },

  toArray () {

    return Array.prototype.concat.apply( [], this )

  }
} )

List.extend = function ( methods ) {

  methods = methods.reduce( ( obj, name ) => {

    obj[name] = function ( ...attrs ) {

      return this.each( name, ...attrs )

    }
    return obj

  }, {} )

  extend( List, methods )

}
