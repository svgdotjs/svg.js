import babel from 'rollup-plugin-babel'
import * as pkg from '../package.json'
// import filesize from 'rollup-plugin-filesize'
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

const config = esm => ({
  input: './src/svg.js',
  output: {
    file: esm ? './dist/svg.js' : './dist/svg.min.js',
    name: 'SVG',
    sourceMap: !esm,
    format: esm ? 'esm' : 'iife',
    banner: esm ? headerShort : headerLong,
    plugins:
      esm
        ? []
        : [
          babel({
            include: 'src/**',
            runtimeHelpers: true,
            babelrc: false,
            presets: [["@babel/preset-env", {
              modules: false,
              targets: {
                ie: 9,
                chrome: 49,
                edge: 14,
                firefox: 45,
                safari: 10
              },
              useBuiltIns: 'usage'
            }]]
          }),
          terser()
        ]
  }
})

const modes = [true, false]

// console.log(modes.map(config))
export default modes.map(config)

// export default [
//   {
//     input: './src/svg.js',
//     output: {
//       file: 'dist/svg.js',
//       name: 'SVG',
//       sourceMap: true,
//       format: 'iife',
//       banner: headerLong
//     },
//     plugins: [
//       // resolve({browser: true}),
//       // commonjs(),
//       babel({
//         include: 'src/**',
//         runtimeHelpers: true,
//         babelrc: false,
//         presets: [["@babel/preset-env", {
//           modules: false,
//           targets: {
//             ie: "9"
//           },
//           useBuiltIns: 'usage'
//         }]],
//       }),
//       filesize()
//     ]
//   },{
//     input: './.config/polyfills.js',
//     output: {
//       file: 'dist/polyfills.js',
//       name: 'SVG',
//       sourceMap: true,
//       format: 'umd',
//       banner: headerLong
//     },
//     treeshake: false,
//     plugins: [
//       // babel({
//       //   runtimeHelpers: true,
//       //   babelrc: false,
//       //   presets: [["@babel/preset-env", {
//       //     modules: false,
//       //     targets: {
//       //       ie: "11"
//       //     },
//       //     useBuiltIns: 'usage'
//       //   }]],
//       // }),
//       filesize()
//     ]
//   },
// ]
