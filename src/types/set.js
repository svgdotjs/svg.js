/* eslint no-unused-vars: "off" */
class SVGSet extends Set {
  // constructor (arr) {
  //   super(arr)
  // }

  each (cbOrName, ...args) {
    if (typeof cbOrName === 'function') {
      this.forEach((el) => { cbOrName.call(el, el) })
    } else {
      this.forEach((el) => {
        el[cbOrName](...args)
      })
    }

    return this
  }
}
