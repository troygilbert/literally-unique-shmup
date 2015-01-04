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

var bundler = watchify(browserify('./scripts/src/main.js', {
	cache: {}, packageCache: {}, fullPaths: true,
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
		.pipe(gulp.dest('./dist/'))
		.pipe(livereload());
}

gulp.task('webserver', function() {
	var port = 3000;
	var hostname = null;
	var base = path.resolve('dist');
	var directory = path.resolve('dist');
	var app = connect().use(serveStatic(base)).use(serveIndex(directory));
	return http.createServer(app).listen(port, hostname);
});

gulp.task('vendor', function() {
	return gulp.src('scripts/vendor/*.js')
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('dist/'))
		.pipe(livereload());
});

gulp.task('styles', function() {
	return gulp.src('styles/*.css')
		.pipe(concat('styles.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('dist/'))
		.pipe(livereload());
});

gulp.task('html', function() {
	return gulp.src('html/*.html')
		.pipe(gulp.dest('dist/'))
		.pipe(livereload());
});

gulp.task('images', function() {
	return gulp.src('images/**')
		.pipe(gulp.dest('dist/images/'))
		.pipe(livereload());
});

gulp.task('sounds', function() {
	return gulp.src('sounds/**')
		.pipe(gulp.dest('dist/sounds/'))
		.pipe(livereload());
});

gulp.task('watch', ['webserver'], function() {
	livereload.listen({ basePath: 'dist' });
	gulp.watch('scripts/vendor/**', ['vendor']);
	gulp.watch('styles/**', ['styles']);
	gulp.watch('images/**', ['images']);
	gulp.watch('sounds/**', ['sounds']);
	gulp.watch('html/*.html', ['html']);
});

gulp.task('clean', function() {
	return rmdir('dist', function() {});
});

gulp.task('build', ['clean', 'vendor', 'scripts', 'styles', 'images', 'sounds', 'html']);

gulp.task('default', ['build', 'watch']);
