var path = require ('path');
var bower = require('bower');
var sh = require('shelljs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');

var paths = {
  sass: './www/assets/scss/**/*',
  views: './www/views/**/*',
  build: '.app'
};

gulp.task('watch', function() {
  gulp.watch(paths, ['webpack']);
});

gulp.task('webpack', function() {
  webpack(require('./webpack.config.js'), function(err, stats) {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString());
    });
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('default', ['webpack']);