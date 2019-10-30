//http://abdelraoof.com/blog/2015/04/02/css-optimization-using-gulp/

// Require all the things
const gulp = require('gulp'),
      argv  = require('yargs').argv,
      when = require('gulp-if'),
      browserSync = require('browser-sync').create(),
      sass = require('gulp-sass'),
      plumber = require('gulp-plumber'),
      rename = require('gulp-rename'),
      purify = require('gulp-purifycss'),
      minifyCSS = require('gulp-clean-css'),
      prefixer = require('gulp-autoprefixer'),
      minify = require('gulp-uglify'),
      htmlmin = require('gulp-htmlmin'),
      watch = require('gulp-watch'),
      critical = require('critical'),
      shell = require('gulp-shell'),
      svgmin = require('gulp-svgmin'),
      svgstore = require('gulp-svgstore'),
      cheerio = require('gulp-cheerio'),
      download = require('gulp-download'),
      imagemin = require('gulp-imagemin'),
      cache = require('gulp-cache'),
      imageminPngquant = require('imagemin-pngquant'),
      imageminZopfli = require('imagemin-zopfli'),
      imageminJpegRecompress = require('imagemin-jpeg-recompress'),
      imageminGiflossy = require('imagemin-giflossy')
    ;

// Set the path variables
const base_path = './',
  src = base_path + 'assets',
  dist = base_path + 'assets',
  paths = {
    js: src + '/js/*.js',
    scss: [ src +'/css/*.scss',
            src +'/css/**/*.scss',
            src +'/css/**/**/*.scss'],
    jekyll: [ 'index.html', '_posts/*', '_pages/*', '_layouts/*', '_includes/*' , 'assets/*', 'assets/**/*', 'uploads/*', 'uploads/**/*', '_data/*' ],
    html: [
            base_path +'_site/index.html',
            base_path +'_site/*/*.html',
            base_path +'_site/**/*/*.html',
            base_path +'_site/*.html',
          ],
    imgsSrc: [
            base_path +'uploads/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)',
            base_path +'uploads/**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)',
            base_path +'uploads/**/**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)',
          ],
    imgsDest: base_path +'_site/uploads',
  };


// Compile sass to css
gulp.task('compile-sass', () => {
  gulp.src(paths.scss)
    .pipe(sass())
    .pipe(purify([src + '/js/*.js', src + '/js/**/*.js', './*.html', './**/*.html']))
    .pipe(when(argv.prod, prefixer('last 3 versions', 'ie 9') ))
    .pipe(when(argv.prod, minifyCSS() ))
    .pipe(rename({dirname: dist + '/css'}))
    .pipe(gulp.dest('./'))
    .pipe(rename({dirname: './_includes/critical'}))
    .pipe(gulp.dest('./'));
});


// Minify JS
// CAN'T BE USED WITH ECMS 6
gulp.task('compress-js', function () {
  return gulp.src(paths.js)
    .pipe(when(argv.prod, minify()))
    .pipe(gulp.dest(src + '/js/dist'))
    .on('error', function(err) {
      console.error('Error in compress task', err.toString());
    });
});

// Minify HTML
gulp.task('minify-html', function() {
  return gulp.src("./_site/index.html")
    .pipe(when(argv.prod, htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: false,
      removeAttributeQuotes: false,
      removeRedundantAttributes: false,
      minifyJS: true,
      minifyCSS: true
    })))
    .pipe(when(argv.prod, gulp.dest("./_site")))

  return gulp.src("./_site/**/*.html")
    .pipe(when(argv.prod, htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: false,
      removeAttributeQuotes: false,
      removeRedundantAttributes: false,
      minifyJS: true,
      minifyCSS: true
    })))
    .pipe(when(argv.prod, gulp.dest("./_site/./")))
});

// Google Analytics
gulp.task('fetch-newest-analytics', function() {
  return when(argv.prod, download('https://www.google-analytics.com/analytics.js'))
    .pipe(when(argv.prod, gulp.dest('./assets/js')));
});

// SVG Icons
gulp.task('icons', function () {
  return gulp.src('./assets/icons/*')
    .pipe(svgmin())
    .pipe(svgstore({ fileName: 'icons.svg', inlineSvg: true}))
    .pipe(cheerio({
      run: function ($, file) {
        $('svg').addClass('hide');
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest('./_includes/icons/'));
});

// Image Resize
// I RECOMMEND USING THE MAC APP IMAGEOPTIMIN instead
gulp.task('img-compress', function () {
  return gulp.src(paths.imgsSrc)

    .pipe(when(argv.prod, imagemin([
      //png
      imageminPngquant({
        speed: 1,
        quality: 70 //lossy settings
      }),
      imageminZopfli({
        more: true
      }),
      //gif
      imageminGiflossy({
        optimizationLevel: 3,
        optimize: 3, //keep-empty: Preserve empty transparent frames
        lossy: 2
      }),
      //svg
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      }),
      imageminJpegRecompress({
        loops:6,
        // min: 35,
        // max: 65,
        quality:'low',
        buffer:'buffer'
      }),

    ], {verbose: true})))

    .pipe(gulp.dest(paths.imgsDest))
});

// Rebuild Jekyll
gulp.task('build-jekyll', function(code) {
  if (!argv.prod) {
    gulp.task('build-jekyll', shell.task(['bundle exec jekyll build --incremental --config _config.yml,_config.dev.yml']));
  } else if (argv.prod) {
    gulp.task('build-jekyll', shell.task(['JEKYLL_ENV=production jekyll build']));
  }
})

// Setup Server
gulp.task('sync', function () {
  browserSync.init({
    server: "./_site",
    port: 4000,
    browser: "google chrome"
  });
});

// Watch files
gulp.task('watch', function() {
  gulp.watch(paths.js, ['compress-js']);
  gulp.watch(paths.scss, ['compile-sass']);
  gulp.watch(paths.html, ['minify-html']);
  gulp.watch(['fetch-newest-analytics']);
  gulp.watch('./assets/icons/*', ['icons']);
  gulp.watch(paths.imgsSrc, ['img-compress']);
  gulp.watch(paths.jekyll, ['build-jekyll']);
  gulp.watch('_site/**/*.*').on('change', browserSync.reload);
});

// Start Everything with the default task
gulp.task('default', [ 'compress-js', 'compile-sass', 'minify-html', 'fetch-newest-analytics', 'icons', 'img-compress', 'build-jekyll', 'sync', 'watch' ]);
