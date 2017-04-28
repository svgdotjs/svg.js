/*const sauceLabsLaunchers = {
  //  * Real mobile devices are not available
  //  *  Your account does not have access to Android devices.
  //  *  Please contact sales@saucelabs.com to add this feature to your account.
  sl_android_chrome: {
    base: 'SauceLabs',
    browserName: 'Android',
    appiumVersion: '1.5.3',
    deviceName: 'Samsung Galaxy S7 Device',
    deviceOrientation: 'portrait',
    browserName: 'Chrome',
    platformVersion: '6.0',
    platformName: 'Android'
  },
  sl_android: {
    base: 'SauceLabs',
    browserName: 'Android',
    deviceName: 'Android Emulator',
    deviceOrientation: 'portrait'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest'
  },
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest'
  },
  sl_windows_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    version: 'latest',
    platform: 'Windows 10'
  },
  sl_macos_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.12',
    version: '10.0'
  },
  sl_macos_iphone: {
    base: 'SauceLabs',
    browserName: 'Safari',
    deviceName: 'iPhone SE Simulator',
    deviceOrientation: 'portrait',
    platformVersion: '10.2',
    platformName: 'iOS'
  },
  foo: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows XP',
    version: '6.0'
  },
  bar: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.11',
    version: '9.0'
  }
}*/
const sauceLabsLaunchers = [{
  //  * Real mobile devices are not available
  //  *  Your account does not have access to Android devices.
  //  *  Please contact sales@saucelabs.com to add this feature to your account.
  base: 'SauceLabs',
  browserName: 'Android',
  appiumVersion: '1.5.3',
  deviceName: 'Samsung Galaxy S7 Device',
  deviceOrientation: 'portrait',
  browserName: 'Chrome',
  platformVersion: '6.0',
  platformName: 'Android'
}, {
  base: 'SauceLabs',
  browserName: 'Android',
  deviceName: 'Android Emulator',
  deviceOrientation: 'portrait'
}, {
  base: 'SauceLabs',
  browserName: 'firefox',
  version: 'latest'
}, {
  base: 'SauceLabs',
  browserName: 'chrome',
  version: 'latest'
}, {
  base: 'SauceLabs',
  browserName: 'MicrosoftEdge',
  version: 'latest',
  platform: 'Windows 10'
}, {
  base: 'SauceLabs',
  browserName: 'safari',
  platform: 'macOS 10.12',
  version: '10.0'
}, {
  base: 'SauceLabs',
  browserName: 'Safari',
  deviceName: 'iPhone SE Simulator',
  deviceOrientation: 'portrait',
  platformVersion: '10.2',
  platformName: 'iOS'
}, {
  base: 'SauceLabs',
  browserName: 'internet explorer',
  platform: 'Windows XP',
  version: '6.0'
}, {
  base: 'SauceLabs',
  browserName: 'safari',
  platform: 'OS X 10.11',
  version: '9.0'
}]

//each(sauceLabsLaunchers)(tuple => console.log(tuple[1].browserName))
//map(sauceLabsLaunchers)()
// each(sauceLabsLaunchers, tuple => console.log(snd(tuple).browserName))
// console.log( map(sauceLabsLaunchers, tuple => 'browser: ' + snd(tuple).browserName) )
// console.log( filter(sauceLabsLaunchers, tuple => snd(tuple).version > 5 ) )

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

function spread() {
  return [].splice.call(arguments)
}

// var spread = curry(spread)
//var compose = spread(compose)
var filter = curry(filter)
var map = curry(map)
var take = curry(take)
var dot = curry(dot)


const log = (args) => {
  console.log(args)
  return args
}
const id = x => x
const onlyBr = d => !!d.browserName
//const onlyPl = d => !!d.platform
const onlyPl = compose(only, dot('platform'))

//const platforms = filter(onlyPl)
const macs = compose(filter(plmac), filter(onlyPl))
const below10 = compose(filter(compose(d => d < 10, dot('version'))), filter(compose(only, dot('version'))))

let a = below10(sauceLabsLaunchers)
let b = macs(sauceLabsLaunchers)
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

function dot(prop, obj) {
  return obj[prop]
}

function take(n, a, accu = []) {
	if(a.length === 0 || n === 0) return accu
	accu.push(a[0])
	return take( n - 1, a.slice(1), accu ) // tail call
}

function each(f, data) {
  for(let n in data)
    f(data[n], n)
}
function map(f, data) {
  let m = []
  each(d => m.push(f(d)), data)
  return m
}
function filter(p, data) {
  let f = []
  each(d => {
    let r = p(d)
    if(r !== false) f.push(d)
  }, data)
  return f
}

function curry(f) {
	let n = f.length
	return function partial(...xs) {
    // excessive arguments are ignored
		return n <= xs.length ? f.apply(f, xs) : partial.bind(f, ...xs)
	}
}
function composeL(...fs) {
  return x => fs.reduce((x,a) => a(x), x)
}
function compose(...fs) {
  return x => fs.reduceRight((x,a) => a(x), x)
}


function prelude(im) {}
function predicate() {}
function list() {
  const keys = map(fst)
  const values = map(snd)
  function fst(a) { return a[0] }
  function snd(a) { return a[1] }
}
function functors() {}
