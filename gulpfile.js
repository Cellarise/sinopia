"use strict";
var gulp = require("gulp");
var browserify = require('gulp-browserify');
var less = require('gulp-less');

gulp.task('default', ["scripts"]);
// Basic usage
gulp.task('scripts', function() {
    // Single entry point to browserify
    gulp.src('./lib/GUI/js/main.js')
        .pipe(browserify({
            debug: true,
            transform: ['browserify-handlebars']
        }))
        .pipe(gulp.dest('./lib/static/'));

    gulp.src('./lib/GUI/css/main.less')
        .pipe(less({
            sourceMap: true
        }))
        .pipe(gulp.dest('./lib/static/'));
});
