import babel from 'rollup-plugin-babel'
import multiEntry from 'rollup-plugin-multi-entry'

export default {
  input: [
    'spec/setupBrowser.js',
    'spec/spec/*/*.js'
  ],
  output: {
    file: 'spec/es5TestBundle.js',
    name: 'SVGTests',
    sourceMap: true,
    format: 'iife'
  },
  plugins: [
    babel({
      include: 'src/**',
      runtimeHelpers: true,
      babelrc: false,
      presets: [['@babel/preset-env', {
        modules: false
      }]]
      // plugins: [["@babel/plugin-transform-runtime", {
      //   corejs: false,
      //   helpers: true,
      //   regenerator: true,
      //   useESModules: true
      // }]]
    }),
    multiEntry()
  ]
}
