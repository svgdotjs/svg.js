## 1.0.0-beta.1

This change migrates to using Jasmine 2.0, and thus contains any [breaking changes](http://jasmine.github.io/2.0/upgrading.html) from
Jasmine 1.3.1 to Jasmine 2.0.

Notably

 - The interface for reporters has completely changed
 - The interface for custom matchers has changed
 - per-spec timeouts (e.g. `it('does foo', fn, 1000))` no longer work

If you would like to continue using MiniJasmineNode against Jamsmine 1.3.1, please use version 0.4.0. This can be downloaded with `npm install minijasminenode@jasmine1`.

