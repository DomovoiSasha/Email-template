var gulp = require('gulp');
var stylus = require('gulp-stylus');
var watch = require('gulp-watch');
var inline = require('gulp-inline-css');
var inky = require('inky');
var bs = require('browser-sync').create();
var plumber = require('gulp-plumber');
var remember = require('gulp-remember');
var del = require('del');
var debug = require('gulp-debug');
const imagemin = require('gulp-imagemin');
var remove = require('gulp-email-remove-unused-css');


gulp.task('img', function(){
	return gulp.src('app/images/*.*')
		.pipe(remember())
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'));
});

gulp.task('css', function(){
	return gulp.src('app/style.styl')
		.pipe(plumber())
		.pipe(stylus())
		.pipe(gulp.dest('app'));
});

gulp.task('html', function(){
	return gulp.src('app/index.html')
		.pipe(plumber())
		.pipe(inky())
		.pipe(debug({title: 'inky'}))
		.pipe(remove({whitelist: ['.email*']}))
		.pipe(inline())
		.pipe(debug({title: 'inline'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('img', 'css', 'html'));

gulp.task('clean', function(){
	return del('dist');
});

gulp.task('watch', function(){
	gulp.watch(('app/index.html'), gulp.series('html'));
	gulp.watch(('app/style.styl'), gulp.series('css', 'html'));
	gulp.watch(('app/style.css'), gulp.series('html'));
});

gulp.task('server', function(){
	bs.init({
		server: 'dist'
	});
	bs.watch('dist/**/*.*').on('change', bs.reload);
});

gulp.task('dev', gulp.series('clean', 'build', gulp.parallel('watch', 'server')));