var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

module.exports = {
  entry: fs.readdirSync(path.join(__dirname, './lambdas'))
           .filter(filename => /\.js$/.test(filename))
           .map((filename) => {
             var entry = {};
             entry[filename.replace('.js', '')] = path.join(__dirname, './lambdas/', filename);
             return entry;
           })
           .reduce((acc, entry) => Object.assign(acc, entry), {}),
  output: {
    path: path.join(__dirname, 'dist'),
    library: '[name]',
    libraryTarget: 'commonjs2',
    filename: '[name].js'
  },
  //plugins: [
  //  new webpack.optimize.UglifyJsPlugin({
  //    compressor: {
  //      warnings: false
  //    }
  //  })
  //],
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: JSON.parse(
          fs.readFileSync(path.join(__dirname, '.babelrc'), { encoding: 'utf8' })
        )
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
};
