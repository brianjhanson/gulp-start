'use strict';

var gulp = require('gulp');

// Plugins

var $               = require('gulp-load-plugins')();
var watchify        = require('watchify');
var source          = require('vinyl-source-stream');
var browserSync     = require('browser-sync');
var reload          = browserSync.reload;

var src = {
  stylesBase: './src/styles/',
  scripts: {
    head: './src/vendor/modernizr/modernizr.js',
    coffee: [
      './src/scripts/main.coffee'
    ]
  }
}

// browser-sync task for starting the server.
gulp.task('browser-sync', function() {
  browserSync({
    proxy: '',
    open: false
  });
});

gulp.task('styles', function() {
  gulp.src(src.stylesBase + '/main.scss')
    .pipe($.compass({
      config_file: './config.rb',
      css: 'dist',
      sass: 'src/styles',
      time: true,
      require: ['sass-globbing', 'susy']
    }))
    .on('error', function(error) {
      // Would like to catch the error here
      console.log(error);
      this.emit('end');
    })
    .pipe($.autoprefixer({
      browsers: ['> 5%', 'last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist'))
    .pipe($.minifyCss())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream:true}));
});

gulp.task('scripts-head', function() {
  gulp.src(src.scripts.head)
    .pipe($.uglify())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('scripts', function() {
  var bundler = watchify(src.scripts.coffee, {
    entries: [src.scripts.coffee],
    extensions: ['.coffee']
  });

  bundler.on('update', rebundle);

  function rebundle() {
    $.util.log('Browserfifying Scripts');

    return bundler.bundle()
      .on('error', function(e){
        $.util.log('Browserify Error', e);
      })
      .pipe(source('main.js'))
      .pipe($.streamify($.uglify()))
      .pipe($.rename({
        suffix: ".min"
      }))
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.reload({stream: true, once: true}))
  }

  return rebundle();
});

gulp.task('clean', function() {
  gulp.src('temp', {read: false})
    .pipe($.clean())
})

gulp.task('default', ['styles', 'scripts-head', 'scripts', 'browser-sync'], function() {
  gulp.watch(src.stylesBase + '/**/*.scss', ['styles']);
  gulp.watch([ src.scripts.coffee], ['scripts', reload]);
});