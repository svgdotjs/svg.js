const methods = {}
const constructors = {}

export function registerMethods (name, m) {
  if (typeof name == 'object') {
    for (let [_name, _m] of Object.entries(name)) {
      registerMethods(_name, _m)
    }
  }

  methods[name] = Object.assign(methods[name] || {}, m)
}

export function getMethodsFor (name) {
  return methods[name]
}

// FIXME: save memory?
export function cleanMethods () {
  methods = {}
}


export function registerConstructor (name, setup) {
  constructors[name] = setup
}

export function getConstructor (name) {
  return {setup: constructors[name], name}
}
