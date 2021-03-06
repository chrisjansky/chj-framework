var
  gulp = require("gulp"),
  fs = require("fs"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "del", "kss"]
  }),
  config = require(pathPrefix + "gulpconfig.json");

// Delete previous KSS build.
gulp.task("guide:wipe", function() {
  return plugins.del(config.dev.styleguide);
});

// Construct KSS template using PUG and HTML partial.
gulp.task("guide:scaffold", ["guide:wipe"], function() {
  return gulp.src(config.dev.pugRoot + "templates/_guide.pug")

    .pipe(plugins.pug({
      pretty: true,
      basedir: config.dev.root
    }))
    .pipe(plugins.rename({
      basename: "index",
      extname: ".hbs"
    }))
    .pipe(gulp.dest(config.dev.kssRoot));
});

// Run KSS.
gulp.task("guide:compile", ["guide:scaffold"], function() {
  return plugins.kss({
    source:      config.dev.cssRoot,
    destination: config.dev.styleguide,
    builder:     config.dev.kssRoot,
    homepage:    config.dev.kssMarkdown
  })
});

// Read paths to assets.
var resources;
gulp.task("guide:resources", function() {
  var readFile = fs.readFileSync(config.dev.resources, "utf8");
  resources = JSON.parse(readFile);
});

// Inject dev styles into styleguide.
gulp.task("guide:inject", ["guide:compile", "guide:resources"], function() {
  return gulp.src(config.dev.styleguide + "**/*.html")
    .pipe(plugins.inject(gulp.src(
      resources.injectDev.site, {read: false}), {
        relative: true,
        name: "site"
      }
    ))
    .pipe(plugins.inject(gulp.src(
      resources.injectDev.vendor, {read: false}), {
        relative: true,
        name: "vendor"
      }
    ))
    .pipe(plugins.inject(gulp.src(
      resources.injectDev.guide, {read: false}), {
        relative: true,
        name: "guide"
      }
    ))
    .pipe(gulp.dest(config.dev.styleguide));
});

gulp.task("guide", ["guide:inject"]);
