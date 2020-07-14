'use strict';


var del = require('del');
var gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;


// Gulp task to minify all files
gulp.task('default', gulp.series(() => del(['dist']), function () {
    return gulp.src('./shahada.js')
    // Minify the file
        .pipe(uglify())
        // Output
        .pipe(gulp.dest('./dist/'))
}));


