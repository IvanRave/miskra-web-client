var gulp = require('gulp');
var path = require('path');
var htmlmin = require('gulp-htmlmin');
var minifyOpts = require('./minify-opts');
//var minifyCss = require('gulp-minify-css');
var cleanCss = require('gulp-clean-css');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var pkg = require('./package');
var exec = require('child_process').exec;
var rename = require('gulp-rename');
var del = require('del');

var AUTOGEN = 'autogen',
    SRC = 'src',
    DST = 'dist',
    LIBS = 'node_modules',
    OUTNAME = pkg.name;

gulp.task('clean', function(cb){
  del(path.join(DST, '*'), cb);
});

// https://github.com/miickel/gulp-angular-templatecache
gulp.task('tcache', function() {
  return gulp.src([
    'src/**/*.tpl.html'
  ])
    .pipe(htmlmin(minifyOpts))
    .pipe(templateCache({
	  standalone: true,
	  module: 'myApp.templateFactory',
	  filename: 'template-factory.js'
    }))
    .pipe(gulp.dest(AUTOGEN));
});

// cache templates before concat
gulp.task('js', [
  'tcache'
], function() {
  // TODO: vNext browserify overrides Concat module

  //	Creates a through stream which takes text as input, and emits a single vinyl file instance for streams down the pipeline to consume.

  //filename is a "pretend" filename to use for your file, which some streams might use to determine various factors such as the final filename of your file. It should be a string, and though recommended, using this argument is optional.
  
  
  var appScripts = [
	path.join(SRC, '**', '*.js'),
	path.join(AUTOGEN, '**', '*.js'),
	'!' + path.join(SRC, '**', '*.spec.js')
  ];
  
  return gulp.src(appScripts)
  //	https://babeljs.io/docs/usage/options/
  // all options inside .babelrc file
	.pipe(babel())
  // removed v0.6: enable support for JSX and Flow.
  // nonStandard: false,
  // sourcemap overhead: 175 kb
  //      .pipe(sourcemaps.init())
    .pipe(concat(OUTNAME + '.js'))
  //      .pipe(sourcemaps.write())
    .pipe(gulp.dest(DST));
});

gulp.task('min-js', ['js'], function(){
  var srcFile = path.join(DST, OUTNAME + '.js');
  return gulp.src(srcFile)
    .pipe(uglify())
    .pipe(rename(OUTNAME + '.min.js'))
    .pipe(gulp.dest(DST));  
});

gulp.task('css', [], function(cb) {
  var srcFile = path.join(SRC, 'app.scss');
  var dstFile = path.join(DST, OUTNAME + '.css');
  
  exec(`scss --sourcemap=none ${srcFile} ${dstFile}`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('min-css', ['css'], function(){
  var srcFile = path.join(DST, OUTNAME + '.css');

  return gulp.src(srcFile)
    .pipe(cleanCss({compatibility: 'ie9'}))
    .pipe(rename(OUTNAME + '.min.css'))
    .pipe(gulp.dest(DST));
});

gulp.task('build', ['min-js', 'min-css']);

// handle js and html during watch changes
gulp.task('watch', function() {
  gulp.watch([
    path.join(SRC, '**', '*.js'),
    '!' + path.join(SRC, '**', '*.spec.js'),
    // html templates (not index file)
    path.join(SRC, '**', '*.html')
  ], ['min-js']);
});
