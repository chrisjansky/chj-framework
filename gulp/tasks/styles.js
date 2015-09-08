var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "browser-*"]
  }),
  config = require("../gulpconfig.json");

gulp.task("styles", function () {
  return gulp.src(config.dev.scssBase)

    .pipe(plugins.sass({
      includePaths: require("node-neat").with("bower_components/")
    }).on("error", plugins.sass.logError))

    .pipe(gulp.dest(config.dev.cssRoot))
    
    .pipe(plugins.browserSync.reload({
      stream: true
    }));
});
