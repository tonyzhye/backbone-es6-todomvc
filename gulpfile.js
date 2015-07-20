var path        = require('path');
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var babel       = require('gulp-babel');
var sourcemaps  = require('gulp-sourcemaps');
var watch       = require('gulp-watch');
var server      = require('gulp-develop-server');
var eslint      = require('gulp-eslint');
//var rev       = require('gulp-rev');
var webpack     = require('webpack');
var del         = require('del');
var mergeStream = require('merge-stream');

var argv          = require('yargs').argv;
var webpackConfig = require('./webpack.config.js');
var globs = {
  assets: [
    'frontend/images/**/*'
  ]
};

if (argv.production) {
  gutil.log("production env");
  webpackConfig.plugins = webpackConfig.plugins.concat(new webpack.optimize.UglifyJsPlugin());
}

gulp.task('clean', function (cb) {
  del(['dist', 'public/dist'], cb);
});

gulp.task('webpack', function (cb) {
  execWebpack(webpackConfig);
  return cb();
});

gulp.task('lint-server', function () {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint-client', function () {
  return gulp.src(['frontend/js/**/*.js', 'frontend/entries/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint', ['lint-server', 'lint-client'], function () {});

gulp.task('assets', function () {
  return mergeStream.apply(null, globs.assets.map(function(glob) {
    return gulp.src(glob)
      .pipe(gulp.dest(glob.replace(/\/\*.*$/, '').replace(/^frontend/, 'public')));
  }));
});

gulp.task('build-client', ['lint-client', 'webpack', 'assets'], function () {});

gulp.task('build-server', ['lint-server'], function () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('server:start', function () {
  server.listen({
    path: 'dist/server.js'
  });
});

gulp.task('server:restart', function () {
  server.restart(function () {});
});

gulp.task('watch', ['server:start'], function () {
  // client side
  gulp.watch('frontend/**/*', ['build-client', 'server:restart']);
  // server side
  gulp.watch('src/**/*', ['build-server', 'server:restart']);
  // views
  gulp.watch('views/**/*', ['server:restart']);
});

gulp.task('build', ['build-client', 'build-server'], function () {});

gulp.task('dev', ['build'], function () {
  gulp.start('watch');
});

gulp.task('default', ['build'], function () {
  setTimeout(function () {
    gutil.log("******************************************************************");
    gutil.log("* gulp              (development build)");
    gutil.log("* gulp clean        (rm /dist, /public/dist)");
    gutil.log("* gulp --production (production build)");
    gutil.log("* gulp dev          (build and run dev server, watch files change)");
    gutil.log("* gulp lint         (eslint validate js files");
    gutil.log("******************************************************************");
  }, 3000);
});

// helper methods
var execWebpack = function (config) {
  webpack(config, function (err, stats) {
    if (err) {
      throw new gutil.PluginError("execWebpack", err);
    }
    gutil.log("[execWebpack]", stats.toString({ colors: true }));
  });
};
