'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('autoprefixer');
const minify = require('gulp-csso');
const imagemin = require('gulp-imagemin');
// const webp = require('gulp-webp');
const rename = require('gulp-rename');
const server = require('browser-sync').create();
const run = require('run-sequence');
const del = require('del');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;

gulp.task('style', function () {
  gulp.src('src/sass/styles.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(
        {
          grid: true
        }
      )
    ]))
    .pipe(gulp.dest('dist/css'))
    .pipe(minify())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(server.stream());
});

gulp.task('html', function () {
  return gulp.src('*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('data', function () {
  return gulp.src('data/**/*')
    .pipe(gulp.dest('dist/data'));
});

gulp.task('scripts', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(concat('index.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename('index.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('serve', function () {
  server.init({
    server: 'dist/'
  });
  gulp.watch('src/sass/**/*.scss', ['style']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('data/**/*', ['data']);
  gulp.watch('*.html', ['html']);
});


gulp.task('clean', function () {
  return del('dist');
});

gulp.task('build', function (done) {
  run(
    'clean',
    'style',
    'data',
    'html',
    'scripts',
    done);
});

gulp.task('build-full', function (done) {
  run(
    'build',
    'images',
    done);
});
