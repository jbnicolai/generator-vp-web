var gulp = require('gulp');
var watch = require('gulp-watch');
var cache = require('gulp-cached');
var notify = require("gulp-notify");
var svg2png = require('gulp-svg2png');
var svgmin = require('gulp-svgmin');
var gulpif = require('gulp-if');
var notify = require("gulp-notify");
var ftp = require('gulp-ftp');
var fs = require('fs');
var ftpConfig = JSON.parse(JSON.minify(fs.readFileSync('./sftp-config.json', 'utf8')));

var upload = true;

gulp.task('watch', ['setWatch'], function() {
  
  gulp.watch('scss/**/*.scss', ['compass']);

  watch({glob: './<%= imgLocation %>/sprite/svg/**/*.svg'}, function(files) {
    files.pipe(cache('sprite@1x', {optimizeMemory: true}))
      .pipe(svgmin([{removeViewBox: true}]))
      .pipe(svg2png())
      .pipe(gulp.dest('./<%= imgLocation %>/sprite/@1x'))
      .pipe(notify({
        title: "PNG @1x",
        message: "Created: <%= file.relative %>"
      }));
    files.pipe(cache('sprite@2x', {optimizeMemory: true}))
      .pipe(svgmin([{removeViewBox: true}]))
      .pipe(svg2png(2))
      .pipe(gulp.dest('./<%= imgLocation %>/sprite/@2x'))
      .pipe(notify({
        title: "PNG @2x",
        message: "Created: <%= file.relative %>"
      }));
  });

  watch({glob: './<%= imgLocation %>/inline/svg/**/*.svg'}, function(files) {
    files.pipe(cache('inline@1x', {optimizeMemory: true}))
      .pipe(svgmin([{removeViewBox: true}]))
      .pipe(svg2png())
      .pipe(gulp.dest('./<%= imgLocation %>/inline/@1x'))
      .pipe(notify({
        title: "PNG @1x",
        message: "Created: <%= file.relative %>"
      }));
    files.pipe(cache('inline@2x', {optimizeMemory: true}))
      .pipe(svgmin([{removeViewBox: true}]))
      .pipe(svg2png(2))
      .pipe(gulp.dest('./<%= imgLocation %>/inline/@2x'))
      .pipe(notify({
        title: "PNG @2x",
        message: "Created: <%= file.relative %>"
      }));
  });

  watch({glob: './<%= imgLocation %>/sprite/@*.svg'}, function(files) {
      files.pipe(gulpif(upload, ftp({
        host: ftpConfig.host,
        port: ftpConfig.port,
        user: ftpConfig.user,
        pass: ftpConfig.password,
        remotePath: ftpConfig.remote_path
      })))
      .pipe(gulpif(upload, notify({
        title: "Sprite uploaded",
        message: "Uploaded: <%= file.relative %>"
      })))
  });
});