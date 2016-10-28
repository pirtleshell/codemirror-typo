
const gulp = require('gulp');
const browserify = require('browserify');
const es6ify = require('es6ify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

es6ify.traceurOverrides = {asyncFunctions: true};

gulp.task('build', () => {
  const b = browserify({
    entries: 'src/index.js',
    standalone: 'codeMirrorTypo'
  }).transform(es6ify);

  return b.bundle()
    .pipe(source('src/index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./lib/'))
    .pipe(rename('codemirror-typo.min.js'))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('default', ['build']);
