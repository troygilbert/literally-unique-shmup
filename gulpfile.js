var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var coffee = require('gulp-coffee');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var refresh = require('gulp-livereload');
var imagemin = require('gulp-imagemin');
var connect = require('connect');
var http = require('http');
var path = require('path');
var lr = require('tiny-lr');
var server = lr();
var rmdir = require('rimraf');

gulp.task('webserver', function() {
	var port = 3000;
	var hostname = null;
	var base = path.resolve('dist');
	var directory = path.resolve('dist');
	var app = connect().use(connect["static"](base)).use(connect.directory(directory));
	return http.createServer(app).listen(port, hostname);
});

gulp.task('livereload', function() {
	return server.listen(35729, function(err) {
		if (err != null) {
			return console.log(err);
		}
	});
});

gulp.task('vendor', function() {
	return gulp.src('scripts/vendor/*.js')
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('dist/assets/'))
		.pipe(refresh(server));
});

gulp.task('scripts', function() {
	return gulp.src('scripts/coffee/app.coffee', { read: false })
		.pipe(browserify({
			transform: ['coffeeify'],
			extensions: ['.coffee'],
			debug: !gutil.env.production
		}))
		.pipe(concat('scripts.js'))
		.pipe(gulpif(gutil.env.production, uglify()))
		.pipe(gulp.dest('dist/assets/'))
		.pipe(refresh(server));
});

gulp.task('styles', function() {
	return gulp.src('styles/scss/init.scss')
		.pipe(sass({
			includePaths: ['styles/scss/includes']
		}))
		.pipe(concat('styles.css'))
		.pipe(gulp.dest('dist/assets/'))
		.pipe(refresh(server));
});

gulp.task('html', function() {
	return gulp.src('*.html')
		.pipe(gulp.dest('dist/'))
		.pipe(refresh(server));
});

gulp.task('images', function() {
	return gulp.src('resources/images/**')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/assets/images/'))
		.pipe(refresh(server));
});

gulp.task('sounds', function() {
	return gulp.src('resources/sounds/**')
		.pipe(gulp.dest('dist/assets/sounds/'))
		.pipe(refresh(server));
});

gulp.task('watch', function() {
	gulp.watch('scripts/vendor/**', ['vendor']);
	gulp.watch('scripts/coffee/**', ['scripts']);
	gulp.watch('styles/scss/**', ['styles']);
	gulp.watch('resources/images/**', ['images']);
	gulp.watch('resources/sounds/**', ['sounds']);
	return gulp.watch('*.html', ['html']);
});

gulp.task('clean', function() {
	return rmdir('dist', function() {});
});

gulp.task('build', ['clean', 'vendor', 'scripts', 'styles', 'images', 'sounds', 'html']);

gulp.task('default', ['webserver', 'livereload', 'build', 'watch']);
