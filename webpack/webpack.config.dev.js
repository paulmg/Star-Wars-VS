var path = require('path');
var webpack = require('webpack');
var styleLintPlugin = require('stylelint-webpack-plugin');

var commonConfig = require('./common.config');
var postCSSConfig = commonConfig.postCSSConfig;
var assetsPath = commonConfig.output.assetsPath;
var publicPath = commonConfig.output.publicPath;
var externals = commonConfig.externals;

var commonLoaders = [
  {
    /*
     * TC39 categorises proposals for babel in 4 stages
     * Read more http://babeljs.io/docs/usage/experimental/
     */
    test: /\.js$|\.jsx$/,
    loader: 'babel-loader',
    // Reason why we put this here instead of babelrc
    // https://github.com/gaearon/react-transform-hmr/issues/5#issuecomment-142313637
    query: {
      presets: ['es2015', 'react', 'stage-0'],
      plugins: ['transform-decorators-legacy']
    },
    exclude: path.join(__dirname, '..', 'node_modules')
  },
  {
    test: /\.json$/,
    loader: 'json'
  },
  {
    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
    loader: 'url',
    query: {
      name: '[hash].[ext]',
      limit: 10000
    }
  },
  {
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader'
  },
  {
    test: /\.css$/,
    loader: 'css/locals?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
  }
];

module.exports = [
  {
    // eval - Each module is executed with eval and //@ sourceURL.
    devtool: 'eval',
    // The configuration for the client
    name: 'browser',
    context: path.join(__dirname, '..', 'app'),
    // Multiple entry with hot loader
    // https://github.com/glenjamin/webpack-hot-middleware/blob/master/example/webpack.config.multientry.js
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
      loaders: commonLoaders
    },
    resolve: {
      root: [path.join(__dirname, '..', 'app')],
      extensions: ['', '.js', '.jsx', '.css'],
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new styleLintPlugin({
        configFile: path.join(__dirname, '..', '.stylelintrc'),
        context: path.join(__dirname, '..', 'app'),
        files: '**/*.?(sa|sc|c)ss'
      })
    ],
    postcss: postCSSConfig
  }, {
    // The configuration for the server-side rendering
    name: 'ssr',
    context: path.join(__dirname, '..', 'app'),
    entry: {
      server: './server'
    },
    target: 'node',
    node: {
      __dirname: false
    },
    devtool: 'sourcemap',
    output: {
      // The output directory as absolute path
      path: assetsPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: '[name].js',
      // The output path from the view of the Javascript
      publicPath: publicPath,
      libraryTarget: 'commonjs2'
    },
    module: {
      loaders: commonLoaders
    },
    resolve: {
      root: [path.join(__dirname, '..', 'app')],
      extensions: ['', '.js', '.jsx', '.css'],
    },
    externals: externals,
    plugins: [
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new webpack.IgnorePlugin(/vertx/),
      new webpack.BannerPlugin(
        'require("source-map-support").install();',
        { raw: true, entryOnly: false }
      )
    ],
    postcss: postCSSConfig
  }
];
