import * as pkg from '../package.json'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import { terser } from 'rollup-plugin-terser'

const buildDate = Date()

const headerLong = `/*!
* ${pkg.name} - ${pkg.description}
* @version ${pkg.version}
* ${pkg.homepage}
*
* @copyright ${pkg.author}
* @license ${pkg.license}
*
* BUILT: ${buildDate}
*/;`

const headerShort = `/*! ${pkg.name} v${pkg.version} ${pkg.license}*/;`

const getBabelConfig = (node = false) => {
  
  let targets = pkg.browserslist
  const plugins = [
    ['@babel/plugin-transform-classes'],
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
      helpers: true,
      useESModules: true,
      version: "^7.9.6",
      regenerator: false
    }]
  ]

  if (node) {
    plugins.shift()
    targets = 'maintained node versions'
  }

  return babel({
    include: 'src/**',
    babelHelpers: 'runtime',
    babelrc: false,
    presets: [['@babel/preset-env', {
      modules: false,
      targets: targets || pkg.browserslist,
      // useBuildins and plugin-transform-runtime are mutually exclusive
      // https://github.com/babel/babel/issues/10271#issuecomment-528379505
      // use babel-polyfills when released
      useBuiltIns: false,
      bugfixes: true
    }]],
    plugins
  })
}

// When few of these get mangled nothing works anymore
// We loose literally nothing by let these unmangled
const classes = [
  'A',
  'ClipPath',
  'Defs',
  'Element',
  'G',
  'Image',
  'Marker',
  'Path',
  'Polygon',
  'Rect',
  'Stop',
  'Svg',
  'Text',
  'Tspan',
  'Circle',
  'Container',
  'Dom',
  'Ellipse',
  'Gradient',
  'Line',
  'Mask',
  'Pattern',
  'Polyline',
  'Shape',
  'Style',
  'Symbol',
  'TextPath',
  'Use'
]

const config = (node, min, esm = false) => ({
  input: (node || esm) ? './src/main.js' : './src/svg.js',
  output: {
    file: esm ? './dist/svg.esm.js'
      : node ? './dist/svg.node.js'
      : min ? './dist/svg.min.js'
      : './dist/svg.js',
    format: esm ? 'esm' : node ? 'cjs' : 'iife',
    name: 'SVG',
    sourcemap: true,
    banner: headerLong,
    // remove Object.freeze
    freeze: false
  },
  treeshake: {
    // property getter have no sideeffects
    propertyReadSideEffects: false
  },
  plugins: [
    resolve({ browser: !node }),
    commonjs(),
    getBabelConfig(node && 'maintained node versions'),
    filesize(),
    !min ? {} : terser({
      mangle: {
        reserved: classes
      },
      output: {
        preamble: headerShort
      }
    })
  ],
  //external: ['@babel/runtime', '@babel/runtime-corejs3']
})

// [node, minified, esm]
const modes = [[false], [false, true], [true], [false, false, true]]

export default modes.map(m => config(...m))
