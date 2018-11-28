import babel from 'rollup-plugin-babel'
import * as pkg from '../package.json'
import filesize from 'rollup-plugin-filesize'
// import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'

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

const getBabelConfig = (esm, targets = { esmodules: true }, corejs = false) => babel({
  include: 'src/**',
  runtimeHelpers: true,
  babelrc: false,
  presets: [['@babel/preset-env', {
    modules: false,
    targets: esm ? targets : pkg.browserslist,
    useBuiltIns: 'usage'
  }]],
  plugins: [['@babel/plugin-transform-runtime', {
    corejs: corejs,
    helpers: true,
    useESModules: true
  }]]
})

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

const config = esm => ({
  input: esm ? './src/main.js' : './src/svg.js',
  output: {
    file: esm ? './dist/svg.js' : './dist/svg.min.js',
    name: 'SVG',
    sourcemap: 'external',
    format: esm ? 'esm' : 'iife',
    banner: esm ? headerLong : headerShort
  },
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    getBabelConfig(esm),
    filesize(),
    esm ? {} : uglify({
      mangle: {
        reserved: classes
      },
      output: {
        preamble: headerShort
      }
    })
  ]
})

const nodeConfig = () => ({
  input: './src/main.js',
  output: {
    file: './dist/svg.node.js',
    name: 'SVG',
    sourcemap: 'external',
    format: 'cjs',
    banner: headerLong
  },
  plugins: [
    resolve(),
    commonjs(),
    getBabelConfig(true, 'maintained node versions'),
    filesize()
  ]
})

const modes = [true, false]

export default modes.map(config).concat(nodeConfig())
