import babel from 'rollup-plugin-babel'
import { uglify } from "rollup-plugin-uglify"
import filesize from 'rollup-plugin-filesize'
const pkg = require('./package.json')

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

var headerShort = `/*! ${pkg.name} v${pkg.version} ${pkg.license}*/;`

export default [{
  input: 'src/svg.js',
  output: {
    file: 'dist/svg.js',
    name: 'SVG',
    sourceMap: true,
    format: 'iife',
    banner: headerLong
  },
  plugins: [
    babel({
      include: 'src/**'
    }),
    filesize(),
  ]
}, {
  input: 'src/main.js',
  output: {
    file: 'dist/svg.es6.js',
    name: 'SVG',
    sourceMap: true,
    format: 'esm',
    banner: headerLong
  },
  plugins: [
    babel({
      include: 'src/**'
    })
  ]
}, {
  input: 'src/svg.js',
  output: {
    file: 'dist/svg.min.js',
    name: 'SVG',
    sourceMap: true,
    format: 'iife',
    banner: headerShort
  },
  plugins: [
    babel({
      include: 'src/**'
    }),
    uglify(),
  ]
}]
