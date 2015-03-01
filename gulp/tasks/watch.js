var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["browser-*"]
  }),
  config = require("../gulpconfig.json");

gulp.task("watch", function() {
  gulp.watch(
    config.dev.scssGlob,
    ["styles"]
  );

  gulp.watch(
    [config.dev.jadeGlob, config.dev.dataGlob, config.dev.resources],
    ["templates:reload"]
  );

  gulp.watch(
    config.dev.jsGlob,
    function() {
      plugins.browserSync.reload();
    }
  );
});
