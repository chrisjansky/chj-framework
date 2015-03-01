var
  gulp = require("gulp"),
  fs = require("fs"),
  argv = require("yargs").argv,
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "del", "vinyl-paths"]
  }),
  config = require("../gulpconfig.json");

// Delete the previous build.
gulp.task("build:wipe", function() {
  if (argv.full) {
    return gulp.src(config.dist.root, {read: false})
      .pipe(plugins.vinylPaths(plugins.del));
  } else return;
});

// Read paths to assets.
var resources;
gulp.task("build:resources", function() {
  var readFile = fs.readFileSync(config.dev.resources, "utf8");
  resources = JSON.parse(readFile);
});

// Move other assets to production folder.
gulp.task("build:move", ["build:wipe", "build:resources"], function() {
  return gulp.src(resources.toMove, {base: config.dev.root})
    .pipe(gulp.dest(config.dist.root));
});

// Minify CSS and JS.
gulp.task("build:compile", ["build:move"], function() {
  return gulp.src(config.dev.styleguide + "index.html")
    .pipe(plugins.usemin(
      {
        js: [plugins.uglify()],
        css: [
          plugins.autoprefixer({
            cascade: false
          }),
          plugins.minifyCss({
            keepSpecialComments: 0
        })]
      }
    ))
    .pipe(gulp.dest(config.dist.styleguide))
    .pipe(plugins.size({
      showFiles: true
    }));
});

// Inject production assets into all pages.
gulp.task("build:inject", ["build:compile"], function() {
  return gulp.src(config.dist.root + "**/*.html")
    .pipe(plugins.inject(gulp.src(
        resources.injectDist.site, {read: false}), {
          relative: true,
          name: "site"
        }
      ))
      .pipe(plugins.inject(gulp.src(
        resources.injectDist.vendor, {read: false}), {
          relative: true,
          name: "vendor"
        }
      ))
      .pipe(plugins.inject(gulp.src(
        resources.injectDist.guide, {read: false}), {
          relative: true,
          name: "guide"
        }
      ))
    .pipe(gulp.dest(config.dist.root));
});

// Minify images if provided with --full argument.
gulp.task("build:images", ["build:wipe"], function() {
  if (argv.full) {
    return gulp.src([config.dev.imagesGlob, config.dev.imagesIgnore], {base: config.dev.root})
      .pipe(plugins.imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
      }))
      .pipe(gulp.dest(config.dist.root));
  }
});

// Wipe first. Move, produce. Images if --full.
gulp.task("build", ["build:inject", "build:images"]);
