'use strict'

const availablePlatforms = require('./platforms')

/**
 * Module loader that curries every exported function.
 * @param {Object} module The module name you want to import from. E.I Prelude
 * @return {Object} All functions in the module. It's up to you if/how, you want to assign them.
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
 * The Prelude module contains all the basic functions you need.
 * Note, that function inside the module are **not** curried.
 */
function Prelude() {
  return { compose, composeL, curry, dot, each, filter, log, map, take }

  function curry(f) {
    let n = f.length
    return function partial(...xs) {
      // excessive arguments are ignored
      return n <= xs.length ? f.apply(f, xs) : partial.bind(f, ...xs)
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
      f(data[n], n)
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
    if(a.length === 0 || n === 0) return accu
    accu.push(a[0])
    return take( n - 1, a.slice(1), accu ) // tail call
  }
}


let compose, filter, dot, log, each, map
({compose, filter, dot, log, each, map} = from (Prelude))

// Predicates
const brChrome  = d => d.browserName.toLowerCase() === 'chrome'
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


// function spread() {
//   return [].splice.call(arguments)
// }
//const onlyPl = d => !!d.platform

const onlyPl = compose(only, dot('platform'))

//const platforms = filter(onlyPl)
const macs = compose(filter(plmac), filter(onlyPl))
const below10 = compose(filter(compose(d => d < 10, dot('version'))), filter(compose(only, dot('version'))))

let a = below10(availablePlatforms)
let b = macs(availablePlatforms)
log(a)
log(b)
// let fstTwo = map(take(2))
// console.log(fstTwo(['jim', 'kate']))

function only(a) {
  return !!a
}

function not(a) {
  return !a
}



function predicate() {}
function list() {
  const keys = map(fst)
  const values = map(snd)
  function fst(a) { return a[0] }
  function snd(a) { return a[1] }
}
function functors() {}

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
