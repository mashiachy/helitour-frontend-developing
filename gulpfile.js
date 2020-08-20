'use strict';

const
  browserSync = require('browser-sync').create(),
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  purgecss = require('gulp-purgecss'),
  sassGlob = require('gulp-sass-glob'),
  autoprefixer = require('gulp-autoprefixer'),
  postcss = require('gulp-postcss'),
  postcssImport = require('postcss-import'),
  pug = require('gulp-pug'),
  beauty = require('gulp-html-beautify'),
  uglify = require('gulp-uglify-es').default,
  sourcemap = require('gulp-sourcemaps'),
  argv = require('yargs').argv,
  gulpif = require('gulp-if'),
  shell = require('gulp-shell'),
  rename = require('gulp-rename'),
  createFile = require('create-file'),
  webp = require('gulp-webp');

const {
  name = 'index',
  production = false,
} = argv;

gulp.task('fonts', () => {
  return gulp.src('app/fonts/*')
    .pipe(gulp.dest('dist/css/fonts'))
    .pipe(browserSync.stream());
});

const whiteListPatterns = {};

gulp.task('sass',  () => {
  return gulp.src(['!app/styles/mixins.sass', 'app/styles/base.sass', 'app/styles/blocks/*.sass', `app/styles/${name}.sass`])
    .pipe(sassGlob({
      ignorePaths: [
        'mixins.sass',
      ],
    }))
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(postcss([postcssImport()]))
    .pipe(concat(`${name}.css`))
    .pipe(gulpif(production, purgecss({
      content: [`dist/${name}.html`],
      whitelistPatternsChildren: whiteListPatterns[name],
    })))
    .pipe(autoprefixer({
      browsers: ['last 20 versions'],
      cascade: false,
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('js-bundle', shell.task(`node_modules\\.bin\\rollup app\\js\\${name}.js -c`));

gulp.task('js', gulp.series('js-bundle', () => {
  return gulp.src('app/js/bundle.js')
    .pipe(rename(`${name}.js`))
    .pipe(sourcemap.init({ loadMaps: true }))
    .pipe(gulpif(production, uglify()))
    .pipe(sourcemap.write('./'))
    .pipe(gulp.dest('dist/js'));
}));

gulp.task('js-watch', gulp.series('js', done => {
  browserSync.reload();
  done();
}));

gulp.task('pug', () => {
  return gulp.src([`app/views/${name}.pug`, '!app/views/mixins.pug'])
    .pipe(pug())
    .pipe(gulpif(!production, beauty()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src('app/img/*.+(png|jpeg|jpg|tiff)')
    .pipe(webp())
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('media', () => {
  return gulp.src('app/img/*')
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('default', () => {
  gulp.watch([`app/views/${name}.pug`, 'app/views/mixins.pug'], gulp.series('pug'));
  gulp.watch(['app/styles/blocks/*.sass', 'app/styles/_mixins.sass', `app/styles/${name}.sass`], gulp.series('sass'));
  gulp.watch("app/img/*", gulp.series('images', 'media'));
  gulp.watch([`app/js/${name}.js`, 'app/js/modules/*.js'], gulp.series('js-watch'));
  gulp.watch('dist/*.html',	browserSync.reload);
  gulp.watch('dist/img/*',	browserSync.reload);
  gulp.watch('dist/css/*.css',	browserSync.reload);
  gulp.watch('dist/css/fonts/*',	browserSync.reload);
  browserSync.init({
    server:  {
      baseDir: './dist',
      //index: name+'.html',
    },
  });
});

gulp.task('build', gulp.series('pug', 'js', 'sass', 'fonts', 'images', 'media'));

gulp.task('build-default', gulp.series('build', 'default'));

gulp.task('new-page', done => {
  createFile(`app/views/${name}.pug`,
    'include mixins\n\n' +
    'doctype html\n' +
    'html(lang="us")\n' +
    '  head\n' +
    '    meta(charset="utf-8")\n' +
    '    meta(http-equiv="X-UA-Compatible" content="IE=edge")\n' +
    '    meta(name="viewport" content="width=device-width, initial-scale=1")\n' +
    '    meta(name="robots" content="noindex, nofollow")\n' +
    `    title Helitour | ${name}\n` +
    //'    link(href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet")' +
    `    link(href="css/${name}.css" rel="stylesheet")\n` +
    `    script(defer src="js/${name}.js"\n`+
    '  body\n\n\n',
    console.log);
  createFile(`app/styles/${name}.sass`,
    '@import "mixins"\n\n',
    console.log);
  createFile(`app/js/${name}.js`,
    '',
    console.log);
  done();
});