var path                  = require('path');
var glob                  = require('glob');
var webpack               = require('webpack');
var ExtractTextPlugin     = require('extract-text-webpack-plugin');

var bindBowerPath = function (filepath) {
  return path.resolve(__dirname, 'frontend/bower/', filepath);
}

var node_modules_dir = path.resolve(__dirname, 'node_modules');
var bower_modules_dir = path.resolve(__dirname, 'frontend/bower');

function getEntries() {
  var entry = {};
  glob.sync(__dirname + '/frontend/entries/*.js').forEach(function (name) {
    var n = name.match(/([^/]+?)\.js/)[1];
    entry[n] = path.resolve(__dirname, 'frontend/entries/', n+'.js');
  });
  return entry;
}

module.exports = {
  entry: getEntries(),
  target: 'web',
  watch: false,
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: '/public/dist/',
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    //filename: "[name].[chunkhash].js",
    //chunkFilename: "[chunkhash].js",
  },
  resolve: {
    modulesDirectories: [
      'frontend',
      'frontend/bower',
      'node_modules'
    ],
    alias: {
      jquery: bindBowerPath('jquery/dist/jquery.js'),
      bootstrapjs: bindBowerPath('bootstrap/dist/js/bootstrap.js'),
      bootstrapcss: bindBowerPath('bootstrap/dist/css/bootstrap.css'),
      bootstrapthemecss: bindBowerPath('bootstrap/dist/css/bootstrap-theme.css'),
      fontawesome: bindBowerPath('fontawesome/css/font-awesome.css'),
      underscore: bindBowerPath('underscore/underscore.js'),
      backbone: bindBowerPath('backbone/backbone.js'),
      backbonelocalstorage: bindBowerPath('backbone.localstorage/backbone.localStorage.js'),
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [node_modules_dir, bower_modules_dir],
        loader: 'babel'
      },
      { 
        test: /\.less$/, 
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader',
          { publicPath: '/public/dist/' })
      }, 
      { 
        test: /\.css$/, 
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 
          { publicPath: '/public/dist/' })
      },
      { 
        test: /\.(png|jpg|gif)([\?]?.*)$/, 
        loader: 'url?limit=8192&minetype=image/[ext]' 
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      },
    ],
    noParse: /\.min\.js/
  },
  plugins: [
    //new webpack.optimize.CommonsChunkPlugin("admin-commons.js", ["adminPageA", "adminPageB"]),
    new ExtractTextPlugin("[name].css"),
    //new webpack.dependencies.LabeledModulesPlugin(),
    //new webpack.optimize.CommonsChunkPlugin('vendor.js', ['todomvc']),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        _: 'underscore'
    })
  ]
};