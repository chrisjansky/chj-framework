var
  gulp = require("gulp"),
  fs = require("fs"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "del", "vinyl-paths", "json-sass"]
  }),
  config = require("../gulpconfig.json");

// Delete previous KSS build.
gulp.task("guide:wipe", function() {
  return gulp.src(config.dev.styleguide, {read: false})
    .pipe(plugins.vinylPaths(plugins.del));
});

// Construct KSS template using JADE and HTML partial.
gulp.task("guide:scaffold", ["guide:wipe"], function() {
  return gulp.src(config.dev.jadeRoot + "templates/_guide.jade")
    .pipe(plugins.plumber())
    .pipe(plugins.jade({
      pretty: true,
      basedir: config.dev.root
    }))
    .pipe(plugins.rename(function (path) {
      path.basename = "index";
    }))
    .pipe(gulp.dest(config.dev.kssRoot));
});

// Run KSS in shell.
gulp.task("guide:compile", ["guide:scaffold"], function() {
  return gulp.src("", {read: false})
    .pipe(plugins.shell([
      "kss-node <%= source %> <%= destination %> --template <%= template %>"
      ], {
        templateData: {
          source:      config.dev.cssRoot,
          destination: config.dev.styleguide,
          template:    config.dev.kssRoot
        }
      }
    ));
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

gulp.task("guide:parse", function () {
  return fs.createReadStream(config.dev.dataRoot + "palette.json")
    .pipe(plugins.jsonSass({
      prefix: "$json: ",
    }))
    .pipe(fs.createWriteStream(config.dev.scssRoot + "guide/json.scss"));
});


gulp.task("guide", ["guide:inject", "guide:parse"]);
