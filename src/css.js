SVG.extend(SVG.Element, {
  // Dynamic style generator
  css: function(s, v) {
    var t, i, ret = {}
    if (arguments.length == 0) {
      // get full style as object
      this.node.style.cssText.split(/\s*;\s*/).filter(function(el) { return !!el.length }).forEach(function(el) {
        t = el.split(/\s*:\s*/)
        ret[t[0]] = t[1]
      })
      return ret
    }

    if (arguments.length < 2) {
      // get style properties in the array
      if(Array.isArray(s)) {
        for(i = s.length; i--;) {
          ret[camelCase(s[i])] = this.node.style[camelCase(s[i])]
        }
        return ret
      }

      // get style for property
      if(typeof s == 'string') {
        return this.node.style[camelCase(s)]
      }

      // set styles in object
      if(typeof s == 'object') {
        for(i in s) {
          // set empty string if null/undefined/'' was given
          this.node.style[camelCase(i)] = (s[i] == null || SVG.regex.isBlank.test(s[i])) ? '' : s[i]
        }
      }
    }

    // set style for property
    if (arguments.length == 2) {
      this.node.style[camelCase(s)] = (v == null || SVG.regex.isBlank.test(v)) ? '' : v
    }

    return this
  }
})
