import babel from 'rollup-plugin-babel'
import { uglify } from "rollup-plugin-uglify"
import filesize from 'rollup-plugin-filesize'

export default [{
  input: 'src/svg.js',
  output: {
    file: 'dist/svg.js',
    name: 'SVG',
    sourceMap: true,
    format: 'iife'
  },
  plugins: [
    babel({
      include: 'src/**'
    }),
    filesize(),
  ]
}, {
  input: 'src/svg.js',
  output: {
    file: 'dist/svg.min.js',
    name: 'SVG',
    sourceMap: true,
    format: 'iife'
  },
  plugins: [
    babel({
      include: 'src/**'
    }),
    uglify(),
  ]
}]
