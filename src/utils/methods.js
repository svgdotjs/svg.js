const methods = {}
const constructors = {}
const names = []

export function registerMethods ( name, m ) {

  if ( Array.isArray( name ) ) {

    for ( let _name of name ) {

      registerMethods( _name, m )

    }
    return

  }

  if ( typeof name === 'object' ) {

    for ( let [ _name, _m ] of Object.entries( name ) ) {

      registerMethods( _name, _m )

    }
    return

  }

  addMethodNames( Object.keys( m ) )
  methods[name] = Object.assign( methods[name] || {}, m )

}

export function getMethodsFor ( name ) {

  return methods[name] || {}

}

export function getMethodNames () {

  return [ ...new Set( names ) ]

}

export function addMethodNames ( _names ) {

  names.push( ..._names )

}

export function registerConstructor ( name, setup ) {

  constructors[name] = setup

}

export function getConstructor ( name ) {

  return constructors[name] ? { setup: constructors[name], name } : {}

}
