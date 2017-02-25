const gulp = require('gulp');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');

gulp.task('compress', function(){
  gulp.src('js/*.js')
    .pipe(minify({
      ext:{
        src: 'bundle.js',
        min: '.js'
      },
    }))
    .pipe(gulp.dest('build/js'))
});

gulp.task('compressCss', function(){
  return gulp.src('css/*.css')
  .pipe(cleanCSS())
  .pipe(gulp.dest('build/css'));
});

gulp.task('default', ['compress', 'compressCss']);
