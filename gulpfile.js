"use strict";
const gulp = require("gulp");
const browserSync = require("browser-sync");
const reload = browserSync.reload;
const watch = require("gulp-watch");
const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const notify = require("gulp-notify");
const imagemin = require("gulp-imagemin");
const rimraf = require("rimraf");
const wait = require("gulp-wait");

gulp.task("html:build", function() {
  gulp
    .src("source/index.html")
    .pipe(gulp.dest("build/"))
    .pipe(
      reload({
        stream: true
      })
    );
});

gulp.task("css:build", function() {
  gulp
    .src("source/sass/main.scss")
    .pipe(wait(200)) // only for visual code
    .pipe(plumber())
    .pipe(sass())
    .pipe(plumber.stop())
    .pipe(gulp.dest("build/css"))
    // .pipe(notify("css DONE!!!"))
    .pipe(
      reload({
        stream: true
      })
    );
});

gulp.task("image:build", function() {
  gulp
    .src("source/img/**/*.*")
    .pipe(
      imagemin({
        svgoPlugins: [
          {
            removeViewBox: false
          }
        ], //сжиманн .svg
        interlaced: true, //сжиманн .gif
        optimizationLevel: 3 //від т 0 до 7
      })
    )
    .pipe(gulp.dest("build/img"))
    // .pipe(notify("images were changed"))
    .pipe(
      reload({
        stream: true
      })
    );
});

gulp.task("server", function() {
  browserSync.init({
    server: {
      baseDir: "./build"
    },
    notify: false
  });
});

gulp.task("img:clean", function(cb) {
  rimraf("build/img/**/*.*", cb);
});

gulp.task("build", ["html:build", "css:build", "image:build", "img:clean"]);

gulp.task("watch", function() {
  watch("source/**/*.html", function() {
    gulp.start("html:build");
  });
  watch("source/**/*.scss", function() {
    gulp.start("css:build");
  });
  watch("source/img/**/*.*", function() {
    gulp.start("image:build");
  });
});
gulp.task("default", ["build", "watch", "server"]);
