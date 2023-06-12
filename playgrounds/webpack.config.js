var path = require('path')
module.exports = function (env) {
  let currentTest = path.resolve(__dirname, env)
  return {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      contentBase: [currentTest, __dirname]
    },

    devServer: {
      contentBase: [currentTest, '..']
    },

    entry: {
      app: path.resolve(currentTest, 'main.js')
    },

    output: {
      path: currentTest,
      filename: 'bundle.js'
    },

    resolve: {
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
    }
  }
}
