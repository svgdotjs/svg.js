;( function() {

  SVG.bench = {
    // Initalize test store
    _tests:  []
  , _before: function() {}
  , _after:  function() {}
  , draw:    SVG('draw')

    // Add test
  , test: function(name, closure) {
      this._tests.push({
        name: name
      , test: closure
      })

      return this
    }

    // Set before runner
  , before: function(closure) {
      this._before = closure

      return this
    }

    // Set after runner
  , after: function(closure) {
      this._after = closure

      return this
    }

    // Run tests
  , run: function() {
      this.pad(true)
      
      for (var s, i = 0, il = this._tests.length; i < il; i++) {
        // run before
        this._before(this._tests[i])

        // run test
        s = ( new Date ).getTime()
        this._tests[i].test()
        this.write( this._tests[i].name, ( new Date ).getTime() - s )

        // run after
        this._after(this._tests[i])        
      }
    }

    // Write result
  , write: function(name, ms) {
      var test = document.createElement('div')
      test.className = 'test'
      test.innerHTML = 'Compleded "' + name + '"" in ' + ms + 'ms'

      this.pad().appendChild(test)

      return this
    }

    // Reference writable element
  , pad: function(regenerate) {
      var pad = document.getElementById('pad')

      if (regenerate || !pad) {
        pad = document.createElement('div')
        document.getElementsByTagName('body')[0].appendChild(pad)
      }

      return pad
    }
  }

})();