'use strict';

const assemble = require('assemble');
const extname   = require('gulp-extname');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sassSrc = 'sass/**/*.scss';
const watch = require('base-watch');


const app = assemble();
app.use(watch());

app.task('html', function() {
    app.layouts('layouts/*.hbs');
    app.partials('partials/*.hbs');
    app.data('data/*.hbs');
    app.pages('templates/*.hbs');
    return app.toStream('pages')
        .pipe(extname('.html'))
        .pipe(app.renderFile())
        .pipe(app.dest('dist'));
});

app.task('sass', function () {
    const processors = [
        autoprefixer({
            browsers: 'last 4 versions',
            cascade: true
        })
    ];
    return app.src(sassSrc)
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(app.dest('dist/assets/css/'));
});

app.task('watch', function() {
    app.watch('**/*.scss', ['sass']);
    app.watch('**/*.hbs', ['html']);
});

app.task('default',['sass', 'html']);

module.exports = app;