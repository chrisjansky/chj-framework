var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["browser-*", "hygienist-*"]
  }),
  config = require(pathPrefix + "gulpconfig.json");

// Run a server for HTML files
gulp.task("server:html", ["styles", "templates"], function() {
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

// Set-up a proxy for PHP files
gulp.task("server:php", ["styles", "templates"], function() {
  plugins.browserSync.init({
    proxy: config.dev.proxy,
    xip: true,
    notify: false
  });
});
