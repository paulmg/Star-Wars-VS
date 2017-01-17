var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var commonConfig = require('./common.config');
var commonLoaders = commonConfig.commonLoaders;
var externals = commonConfig.externals;
var assetsPath = commonConfig.output.assetsPath;
var distPath = commonConfig.output.distPath;
var publicPath = commonConfig.output.publicPath;
var postCSSConfig = commonConfig.postCSSConfig;

module.exports = [
  {
    // The configuration for the client
    name: 'browser',
    // SourceMap without column-mappings
    devtool: 'cheap-module-source-map',
    context: path.join(__dirname, '..', 'app'),
    entry: {
      app: './client'
    },
    output: {
      // The output directory as absolute path
      path: assetsPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: '[name].js',
      // The output path from the view of the Javascript
      publicPath: publicPath

    },
    module: {
      loaders: commonLoaders.concat(
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1!postcss-loader')
        }
      )
    },
    resolve: {
      root: [path.join(__dirname, '..', 'app')],
      extensions: ['', '.js', '.jsx', '.css']
    },
    plugins: [
      // extract inline css from modules into separate files
      new ExtractTextPlugin('styles/main.css', { allChunks: true }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      new webpack.EnvironmentPlugin(['NODE_ENV'])
    ],
    postcss: postCSSConfig
  }, {
    // The configuration for the server-side rendering
    name: 'ssr',
    context: path.join(__dirname, '..', 'app'),
    entry: {
      server: '../server/index'
    },
    target: 'node',
    node: {
      __dirname: false
    },
    devtool: 'sourcemap',
    output: {
      // The output directory as absolute path
      path: distPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: 'server.js',
      // The output path from the view of the Javascript
      publicPath: publicPath,
      libraryTarget: 'commonjs2'
    },
    module: {
      loaders: commonLoaders.concat({
        test: /\.css$/,
        loader: 'css/locals?modules&importLoaders=1!postcss-loader'
      })
    },
    resolve: {
      root: [path.join(__dirname, '..', 'app')],
      extensions: ['', '.js', '.jsx', '.css']
    },
    externals: externals,
    plugins: [
      // Order the modules and chunks by occurrence.
      // This saves space, because often referenced modules
      // and chunks get smaller ids.
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new webpack.IgnorePlugin(/vertx/),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      new webpack.BannerPlugin(
        'require("source-map-support").install();',
        { raw: true, entryOnly: false }
      )
    ],
    postcss: postCSSConfig
  }
];
