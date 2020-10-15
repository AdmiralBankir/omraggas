'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var atImport = require('postcss-import')
var autoprefixer = require('autoprefixer');
var server = require('browser-sync').create();
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var svgstore = require("gulp-svgstore")
var del = require('del');
var fs = require('fs');
var audioFiles = {};

gulp.task('css', function () {
  return gulp.src('css/style.css')
    .pipe(plumber())
    .pipe(
      postcss([autoprefixer(), atImport()])
    )
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('css/*.css', gulp.series('css', 'refresh'));
  gulp.watch('*.html', gulp.series('html', 'refresh'));
  gulp.watch('js/*.js', gulp.series('js', 'refresh'));
});

gulp.task('refresh', function (done) {
  server.reload();
  done();
});

gulp.task('html', function () {
  return gulp.src('*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('build'));
});

gulp.task('audio', function() {
  return gulp.src('src/audio/**/*')
    .pipe(gulp.dest('build/src/audio'))
});

gulp.task('copy', function () {
  return gulp.src('src/fonts/**.{woff,woff2}')
    .pipe(gulp.dest('build/src/fonts'))
});

gulp.task('js', function() {
  return gulp.src('js/**')
    .pipe(gulp.dest('build/js'))
})

gulp.task("sprite", function () {
  return gulp.src("src/img/*.svg")
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("sprite_auto.svg"))
    .pipe(gulp.dest("build/src/img"));
});

gulp.task("img", function () {
  return gulp.src("src/img/*.{gif,png}")
        .pipe(gulp.dest("build/src/img"))
})

gulp.task('clean', function () {
  return del('build');
});

function walk(currentDirPath, callback) {
  var fs = require('fs'),
      path = require('path');
  fs.readdir(currentDirPath, function (err, files) {
      if (err) {
          throw new Error(err);
      }
      files.forEach(function (name) {
          var filePath = path.join(currentDirPath, name);
          var stat = fs.statSync(filePath);
          if (stat.isFile()) {
              callback(filePath);
          } else if (stat.isDirectory()) {
              walk(filePath, callback);
          }
      });
  });
};

function makeJSON(path) {
 var arr = path.split('/');
 if (arr.length >= 4) {
   if(!audioFiles[arr[2]]) {
    audioFiles[arr[2]] = [arr[3]];
   } else {
    audioFiles[arr[2]].push(arr[3]);
   }
   fs.writeFileSync('src/audio/audio.json', JSON.stringify(audioFiles));
 }
};

gulp.task('json', function (done) {
   walk('src/audio/', makeJSON);
   done();
});

gulp.task('build', gulp.series('clean', 'copy', 'js', 'img', 'json', 'audio', 'css', 'html'));
gulp.task('start', gulp.series('build', 'server'));
