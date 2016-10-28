
const gulp = require('gulp');
const browserify = require('browserify');
const es6ify = require('es6ify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const header = require('gulp-header');
const rename = require('gulp-rename');

const pkg = require('./package.json');

const banner = ['/**',
  ' * <%= pkg.name %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' * @author <%=pkg.author.name %>',
  ' */',
  ''].join('\n');
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
    .pipe(header(banner, {pkg}))
    .pipe(rename('codemirror-typo.min.js'))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('minify-css', () => {
  return gulp.src('src/codemirror-typo.css')
    .pipe(cleanCSS())
    .pipe(header(banner, {pkg}))
    .pipe(rename('codemirror-typo.min.css'))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('default', ['build', 'minify-css']);
