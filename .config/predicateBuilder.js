'use strict'

const availablePlatforms = require('./platforms')

/**
 * Module loader that curries every exported function.
 * @param {object} module The module name you want to import from. E.I Prelude
 * @return {object} All functions in the module. It's up to you if/how, you want to assign them.
 */
function from(module) {
  let exports = {},
    P = Prelude(),
    each = P.each,
    curry = P.curry,
    assign = f => exports[f.name] = curry(f)

  each(assign, module())

  return exports
}

/**
 * The Prelude module contains all the standard functions.
 */
function Prelude() {
  // Note, that function inside the module are **not** curried.
  return { compose, composeL, curry, dot, each, filter, log, map, take }

  function curry(f) {
    let n = f.length
    return function partial(...xs) {
      // excessive arguments are ignored
      return n <= xs.length ? f.apply(f, xs) : partial.bind(f, ...xs)
      // we could also throw a type error instead of ignoring, that might be safer and easier to debug
      // if(n < xs.length) throw new TypeError((f.name || 'anonymous') + "does not accept ")
    }
  }
  function compose(...fs) {
    return x => fs.reduceRight((x,a) => a(x), x)
  }
  function composeL(...fs) {
    return x => fs.reduce((x,a) => a(x), x)
  }
  function dot(prop, obj) {
    return obj[prop]
  }
  function each(f, data) {
    for(let n in data)
      f(data[n]/*, n*/)
  }
  function filter(p, data) {
    let f = []
    each(d => {
      let r = p(d)
      if(r !== false) f.push(d)
    }, data)
    return f
  }
  function log(args) {
    console.log(args)
    return args
  }
  function map(f, data) {
    let m = []
    each(d => m.push(f(d)), data)
    return m
  }
  function take(n, a, accu = []) {
    if(a.length === 0 || n == 0) return accu
    accu.push(a[0])
    return take( n - 1, a.slice(1), accu ) // tail call
  }
}


let compose, filter, dot, log, each, map, take
({compose, filter, dot, log, each, map, take} = from (Prelude))

// Predicates
const brChrome  = filter(compose(d => d == 'chrome', d => d.toLowerCase(), dot('browserName')))
const brIE      = d => d.browserName.toLowerCase() === 'internet explorer'
const brEdge    = d => d.browserName.toLowerCase() === 'microsoftedge'
const brFF      = d => d.browserName.toLowerCase() === 'firefox'
const brAndroid = d => d.browserName.toLowerCase() === 'android'
const brSaf     = d => d.browserName.toLowerCase() === 'microsoftedge'
const pliOS     = d => d.platformName.toLowerCase().indexOf('ios') !== -1
const plwin     = d => d.platform.toLowerCase().indexOf('windows') !== -1
const plmac     = d => d.platform.toLowerCase().indexOf('macos') !== -1 || d.platform.toLowerCase().indexOf('os x') !== -1

const id = x => x
const onlyBr = d => !!d.browserName
//const onlyPl = d => !!d.platform
const onlyPl = compose(is, dot('platform'))

//const platforms = filter(onlyPl)
const macs = compose(filter(plmac), filter(onlyPl))
const below10 = filter(compose(d => d < 10, dot('version')))

log(brChrome(availablePlatforms))
let a = below10(availablePlatforms)
log(a[0] === below10(availablePlatforms)[0]) // referencial transparency
log(a)

/**
 * Filter to select objects that contain the property,
 * so that the next function doesn't have to deal with undefined values
 * @param {function} property Takes a proterty name that you are intested in querying
 * @return {function}
 */
function only(property) {
  // can be replaced with a Maybe Functor
  return filter(compose(is, dot(property)))
}

function is(a) {
  return !!a
}

function not(a) {
  return !a
}
/*
let b = macs(availablePlatforms)
log(b[0] === macs(availablePlatforms)[0]) // referencial transparency
log(b)
let fstTwo = map(take(2))
console.log(fstTwo(['jim', 'kate']))

let predicate = predicateBuilder()*/

/**
 * PredicateBuilder
 * @param {*} search
 */
function predicateBuilder() {
  let predicates = []
  return {
    and: p => {
      predicates.push(p)
      return this
    }
  }
}

// function spread() {
//   return [].splice.call(arguments)
// }


function List() {
  const keys = map(fst)
  const values = map(snd)
  function fst(a) { return a[0] }
  function snd(a) { return a[1] }
}
function Functors() {}

// Functors
/*function fmap(f, F) {
  return F.map(x => f(x))
}
function Maybe(val) {
  this.val = val
}
Maybe.prototype.map = function(f) {
  return this.val ? Maybe(f(this.val)) : Maybe(null)
}
var fmap = curry(fmap)

const maybe = curry(Maybe)
log(compose(filter(plwin), log, ))*/
