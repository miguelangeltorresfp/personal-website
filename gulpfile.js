'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
     babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify-css'),
    rename = require('gulp-rename'),
     gutil = require('gulp-util'),
      sass = require('gulp-sass'),
      maps = require('gulp-sourcemaps'),
   nodemon = require('nodemon');


gulp.task('concatScripts', () => {
  return gulp.src([
    'public/js/jquery.js',
    'public/js/bootstrap.js',
    'public/js/main.js'])
      .pipe(maps.init())
      .pipe(concat('index.js'))
      .pipe(maps.write('./'))
      .pipe(gulp.dest('public/js'));
});

gulp.task('minifyScripts', ['concatScripts'], () => {
  return gulp.src('public/js/index.js')
      .pipe(babel({presets: ['es2015']}))
      .pipe(uglify())
      .pipe(rename('index.min.js'))
      .pipe(gulp.dest('public/js'));
});

gulp.task('compileSass', () => {
  return gulp.src('scss/application.scss')
      .pipe(sass())
      .pipe(gulp.dest('public/css'));
});

gulp.task('concatCss', () => {
  return gulp.src([
    'public/css/normalize.css',
    'public/css/font-awesome.css',
    'public/css/bootstrap.css',
    'public/css/application.css'])
      .pipe(maps.init())
      .pipe(concat('main.css'))
      .pipe(maps.write('./'))
      .pipe(gulp.dest('public/css'));
});

gulp.task('minifyCss', ['compileSass', 'concatCss'], () => {
  return gulp.src('public/css/main.css')
      .pipe(minify())
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('public/css'));
});

gulp.task('watchFiles', () => {
  gulp.watch('scss/application.scss', ['minifyCss']);
  gulp.watch('js/main.js', ['concatScripts']);
});

gulp.task('serve', ['watchFiles'], () => {
  nodemon({ script: 'app.js', env: { 'NODE_ENV': 'development' }});
});

gulp.task('build', ['minifyScripts', 'compileSass']);

gulp.task('default', ['build']);
