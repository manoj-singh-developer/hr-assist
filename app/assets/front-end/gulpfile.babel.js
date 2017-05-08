/*jshint esversion: 6 */
'use strict';

//--------------------------------------------------------------------------
//  @IMPORTS
//--------------------------------------------------------------------------

/* beautify preserve:start */
import browser          from 'browser-sync';
import fs               from 'fs';
import gulp             from 'gulp';
import gulpLiveReload   from 'gulp-livereload';
import plugins          from 'gulp-load-plugins';
import rimraf           from 'rimraf';
import yaml             from 'js-yaml';
import yargs            from 'yargs';
import ngAnnotate       from 'gulp-ng-annotate';
/* beautify preserve:end */





//--------------------------------------------------------------------------
//  @VARIABLES
//--------------------------------------------------------------------------

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const {
  COMPATIBILITY,
  PORT,
  UNCSS_OPTIONS,
  PATHS
} = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}





//--------------------------------------------------------------------------
//  @BUILD
//--------------------------------------------------------------------------

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
  gulp.series(clean, gulp.parallel(pages, views, css, sass, javascriptVendor, javascriptCustom, copy)));

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch));





//--------------------------------------------------------------------------
//  @CLEAN
//--------------------------------------------------------------------------

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf(PATHS.release, done);
}





//--------------------------------------------------------------------------
//  @COPY
//--------------------------------------------------------------------------

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
  return gulp.src(PATHS.assets)
    .pipe(gulp.dest(PATHS.release + '/assets'));
}


function pages() {
  return gulp.src(PATHS.pages)
    .pipe(gulp.dest(PATHS.release));
}

function views() {
  return gulp.src(PATHS.views)
    .pipe(gulp.dest(PATHS.release + '/views'));
}





//--------------------------------------------------------------------------
//  @STYLEGUIDE
//--------------------------------------------------------------------------

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
  return gulp.src(PATHS.sass)
    .pipe($.sourcemaps.init())
    .pipe($.sass()
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    // Comment in the pipe below to run UnCSS in production
    //.pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.release))
    .pipe(browser.reload({
      stream: true
    }));
}


// Copy and concat css dependencies
function css() {
  return gulp.src(PATHS.css)
    .pipe($.concat('vendor.css'))
    .pipe(gulp.dest(PATHS.release))
    .pipe(browser.reload({
      stream: true
    }));
}





//--------------------------------------------------------------------------
//  @JAVASCRIPT
//--------------------------------------------------------------------------

// Combine JavaScript into one file
// In production, the file is minified
function javascriptCustom() {
  return gulp.src(PATHS.javascriptCustom)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe(ngAnnotate())
    .pipe($.concat('app.js'))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => {
        console.log(e);
      })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.release));

}

// javascript files from different Vendors (Jquery, moustache, etc.)
function javascriptVendor() {
  return gulp.src(PATHS.javascriptVendor)
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest(PATHS.release));
}





//--------------------------------------------------------------------------
//  @IMAGES
//--------------------------------------------------------------------------

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src('src/assets/img/**/*')
    .pipe($.if(PRODUCTION, $.imagemin({
      progressive: true
    })))
    .pipe(gulp.dest(PATHS.release + '/assets/img'));
}





//--------------------------------------------------------------------------
//  @SERVER
//--------------------------------------------------------------------------

// Start a server with BrowserSync to preview the site in
function server(done) {
  browser.init({
    server: PATHS.release,
    port: PORT
  });
  done();
}





//--------------------------------------------------------------------------
//  @WATCH FILES
//--------------------------------------------------------------------------

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
  gulp.watch(PATHS.assets, copy);

  gulp.watch(PATHS.pages)
    .on('all', gulp.series(pages, browser.reload));

  gulp.watch(PATHS.views)
    .on('all', gulp.series(views, browser.reload));

  gulp.watch(PATHS.sass)
    .on('all', gulp.series(sass, gulpLiveReload.changed));

  gulp.watch(PATHS.javascriptAll)
    .on('all', gulp.series(javascriptCustom, browser.reload));

  // gulp.watch('src/assets/img/**/*')
  //   .on('all', gulp.series(images, browser.reload));

}
