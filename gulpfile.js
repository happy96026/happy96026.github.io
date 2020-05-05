const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')

function sassTask () {
  return gulp.src('styles.scss')
    .pipe(sass())
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream())
}

function serveTask () {
  browserSync.init({
    server: '.',
    port: 8000
  })

  gulp.watch('styles.scss', gulp.series(sassTask))
  gulp.watch('index.html').on('change', browserSync.reload)
  gulp.watch('index.js').on('change', browserSync.reload)
}

gulp.task('default', gulp.series(sassTask, serveTask))