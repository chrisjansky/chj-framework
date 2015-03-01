var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "browser-*"]
  }),
  config = require("../gulpconfig.json");

gulp.task("styles", function () {
  return gulp.src(config.dev.scssBase)
    .pipe(plugins.plumber())

    .pipe(plugins.sass({
      errLogToConsole: true,
      includePaths: require("node-neat").with("bower_components/")
    }))

    .pipe(gulp.dest(config.dev.cssRoot))
    
    .pipe(plugins.browserSync.reload({
      stream: true
    }));
});
