var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["browser-*", "hygienist-*"]
  }),
  config = require("../gulpconfig.json");

gulp.task("server", ["styles", "templates"], function() {
  plugins.browserSync.init({
    server: {
      baseDir: config.dev.root,
      routes: {
        "/bower_components": "./bower_components"
      },
      middleware: plugins.hygienistMiddleware(config.dev.root)
    },
    xip: true,
    notify: false
  });
});
