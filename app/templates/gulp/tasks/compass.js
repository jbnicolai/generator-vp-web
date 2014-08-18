JSON.minify = JSON.minify || require("node-json-minify");

var gulp = require('gulp');
var compass = require('gulp-compass');
var gulpif = require('gulp-if');
var notify = require("gulp-notify");
var ftp = require('gulp-ftp');
var fs = require('fs');
var ftpConfig = JSON.parse(JSON.minify(fs.readFileSync('./sftp-config.json', 'utf8')));

var upload = true;

gulp.task('compass', function() {
  gulp.src('./scss/*.scss')
  .pipe(compass({
    config_file: 'config.rb',
    css: '<%= cssLocation %>',
    sass: 'scss',
    relative: false
  }))
  .on("error", notify.onError({
    message: "<%= error.message %>",
    title: "Error CSS"
  }))
  .pipe(gulp.dest('<%= cssLocation %>'))
  .pipe(notify({
    title: "CSS",
    message: "Generated: <%= file.relative %>"
  }))
  .pipe(gulpif(upload, ftp({
    host: ftpConfig.host,
    port: ftpConfig.port,
    user: ftpConfig.user,
    pass: ftpConfig.password,
    remotePath: ftpConfig.remote_path
  })))
  .pipe(gulpif(upload, notify({
    title: "CSS uploaded",
    message: "Uploaded: <%= file.relative %>"
  })))
  ;
});