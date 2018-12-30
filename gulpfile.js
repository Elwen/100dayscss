'use strict';

/* Plugins */

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');





/* Paths & names */

const folder = {
  src: 'src',
  output: 'web'
};

const path = {
  src: {
    styles:     folder.src + '/!(common)**/*.sass',
    templates:  folder.src + '/!(common)**/*.pug'
  },
  build: {
    styles:     folder.output,
    templates:  folder.output
  },
  watch: {
    styles:     folder.src + '/**/*.sass',
    templates:  folder.src + '/**/*.pug'
  }
};





/* Tasks */

gulp.task('sass', () => {
  return gulp.src(path.src.styles)
  .pipe(plumber())
  .pipe(sass().on('error', (error) => {
    process.stderr.write(`${error.messageFormatted}\n`);
    process.exit(1)
  }))
  .pipe(autoprefixer({
    browsers: ['last 3 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(path.build.styles))
  .pipe(browserSync.reload({
    stream: true
  }))
});



gulp.task('pug', () => {
  return gulp.src(path.src.templates)
  .pipe(pug({
    pretty: true
  }).on('error', (error) => {
    browserSync.notify(error.message);
    console.log(error.message)
  }))
  .pipe(gulp.dest(path.build.templates))
  .pipe(browserSync.reload({
    stream: true
  }))
});



gulp.task('browser-sync', () => {
  browserSync.init({
    reloadOnRestart: false,
    server: {
      baseDir: folder.output,
      directory: true
    }
  });
});



gulp.task('watch', () => {
  gulp.watch(path.watch.styles, gulp.task('sass'));
  gulp.watch([path.watch.templates, path.src.templates], gulp.task('pug'));
});



gulp.task('default', gulp.parallel(['sass', 'pug']));

gulp.task('devs', gulp.parallel(['sass', 'pug', 'watch', 'browser-sync']));
