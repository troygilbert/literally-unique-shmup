var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var watchify = require('watchify');
var browserify = require('browserify');
var connect = require('connect');
var http = require('http');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var path = require('path');
var rmdir = require('rimraf');
var source = require('vinyl-source-stream');
var minifyCSS = require('gulp-minify-css');

var SRC = './src/';
var SRC_MAIN_JS = SRC + 'js/game/main.js';
var SRC_VENDOR_JS = SRC + 'js/lib/*.js';
var SRC_STYLES = SRC + 'css/*.css';
var SRC_HTML = SRC + 'html/*.html';
var SRC_IMAGES = SRC + 'images/**';
var SRC_SOUNDS = SRC + 'sounds/**';
var DIST = './dist/';
var DIST_JS = DIST + 'js/';
var DIST_STYLES = DIST + 'styles/';
var DIST_HTML = DIST;
var DIST_IMAGES = DIST + 'images/';
var DIST_SOUNDS = DIST + 'sounds/';

var bundler = watchify(browserify(SRC_MAIN_JS, {
	cache: {}, packageCache: {}, fullPaths: true,
	transform: ['browserify-shim'],
	extensions: ['.js'],
	debug: !gutil.env.production
}));

gulp.task('scripts', bundle);
bundler.on('update', bundle);

function bundle() {
	return bundler.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('scripts.js'))
		.pipe(gulpif(gutil.env.production, uglify()))
		.pipe(gulp.dest(DIST_JS))
		.pipe(livereload());
}

gulp.task('webserver', function() {
	var port = 3000;
	var hostname = null;
	var base = path.resolve(DIST);
	var directory = path.resolve(DIST);
	var app = connect().use(serveStatic(base)).use(serveIndex(directory));
	return http.createServer(app).listen(port, hostname);
});

gulp.task('vendor', function() {
	return gulp.src(SRC_VENDOR_JS)
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest(DIST_JS))
		.pipe(livereload());
});

gulp.task('styles', function() {
	return gulp.src(SRC_STYLES)
		.pipe(concat('styles.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest(DIST_STYLES))
		.pipe(livereload());
});

gulp.task('html', function() {
	return gulp.src(SRC_HTML)
		.pipe(gulp.dest(DIST_HTML))
		.pipe(livereload());
});

gulp.task('images', function() {
	return gulp.src(SRC_IMAGES)
		.pipe(gulp.dest(DIST_IMAGES))
		.pipe(livereload());
});

gulp.task('sounds', function() {
	return gulp.src(SRC_SOUNDS)
		.pipe(gulp.dest(DIST_SOUNDS))
		.pipe(livereload());
});

gulp.task('watch', ['webserver'], function() {
	livereload.listen({ basePath: DIST });
	gulp.watch(SRC_VENDOR_JS, ['vendor']);
	gulp.watch(SRC_STYLES, ['styles']);
	gulp.watch(SRC_IMAGES, ['images']);
	gulp.watch(SRC_SOUNDS, ['sounds']);
	gulp.watch(SRC_HTML, ['html']);
});

gulp.task('clean', function() {
	return rmdir('dist', function() {});
});

gulp.task('build', ['clean', 'vendor', 'scripts', 'styles', 'images', 'sounds', 'html']);

gulp.task('default', ['build', 'watch']);
