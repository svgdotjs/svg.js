SVG.Set = class extends Set {
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
