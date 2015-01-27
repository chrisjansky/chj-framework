var
  fs = require("fs"),
  del = require("del"),
  argv = require("yargs").argv,
  glob = require("glob"),
  gulp = require("gulp"),
  vinyl = require("vinyl-paths"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "browser-*", "hygienist-*", "json-sass"]
  }),
  config = require("./gulpconfig.json");

/*
------------------------------ Basic. -----------------------------
*/

gulp.task("server", ["templates:inject"], function() {
  plugins.browserSync({
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

var
  jsonFiles,
  jsonGroup;

gulp.task("templates:read", function() {
  jsonFiles = glob.sync(config.dev.dataGlob);

  // Check if files exist.
  if (jsonFiles.length > 0) {

    jsonGroup = fs.readFileSync(jsonFiles[0], "utf8");

    // Add other files if more than one.
    if (jsonFiles.length > 1) {
      // Slicing always last two chars because of newline!
      jsonGroup = jsonGroup.slice(0, -2);

      for (i = 1; i < jsonFiles.length; i++) {
        // Remove wrapping brackets.
        var slicedFile = fs.readFileSync(jsonFiles[i], "utf8").slice(1, -2);
        jsonGroup += ",\n" + slicedFile;
      }

      jsonGroup += "}";
    }

  } else {
    jsonGroup = null;
  }
});

gulp.task("templates:compile", ["templates:read"], function() {
  return gulp.src([config.dev.jadeGlob, config.dev.jadeIgnore])
    .pipe(plugins.plumber())
    .pipe(plugins.jade({
      pretty: true,
      locals: JSON.parse(jsonGroup),
      basedir: config.dev.root
    }))
    .pipe(gulp.dest(config.dev.root));
});

gulp.task("templates:inject", ["templates:compile", "resources:read"], function() {
  return gulp.src([config.dev.pagesGlob, config.dev.pagesIgnore])
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
    .pipe(gulp.dest(config.dev.root));
});

gulp.task("templates:reload", ["templates:inject"], function() {
  plugins.browserSync.reload();
});

gulp.task("scan", function() {
  gulp.watch(config.dev.scssGlob, ["styles"]);

  gulp.watch(
    [config.dev.jadeGlob, config.dev.dataGlob, "./resources.json"],
    ["templates:reload"]
  );

  gulp.watch(config.dev.jsGlob, function() {
    plugins.browserSync.reload();
  });
});

/*
------------------------- Resources. --------------------------
*/

var resources;

// Read paths to assets.
gulp.task("resources:read", function() {
  var readFile = fs.readFileSync("./resources.json", "utf8");
  resources = JSON.parse(readFile);
});

/*
---------------------------- JSON. -----------------------------
*/

gulp.task("json-sass", function () {
  return fs.createReadStream(config.dev.dataRoot + "palette.json")
    .pipe(plugins.jsonSass({
      prefix: "$json: ",
    }))
    .pipe(fs.createWriteStream(config.dev.scssRoot + "guide/json.scss"));
});

/*
---------------------------- Build. ----------------------------
*/

// Delete the previous build.
gulp.task("build:wipe", function() {
  if (argv.full) {
    return gulp.src(config.dist.root, {read: false})
      .pipe(vinyl(del));
  } else return;
});

// Move other assets to production folder.
gulp.task("build:move", ["build:wipe", "resources:read"], function() {
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

/*
---------------------------- Deploy. ----------------------------
*/

gulp.task("deploy", function() {
  return gulp.src(config.dist.root + "**/*", {base: config.dist.root})
    .pipe(plugins.ftp({
      host: config.ftp.host,
      user: config.ftp.user,
      pass: config.ftp.pass,
      remotePath: config.ftp.path
    }))
    .pipe(plugins.size());
});

/*
----------------------------- SVG. ------------------------------
*/

// Delete the PNG fallbacks/ folder.
gulp.task("svg:wipe", function() {
  return gulp.src([config.dev.fallbacks, config.dev.svgBuildGlob], {read: false})
    .pipe(vinyl(del));
});

// Optimize SVG.
gulp.task("svg:optimize", ["svg:wipe"], function() {
  return gulp.src(config.dev.svgSourceGlob)
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(config.dev.svgBuild));
});

// Render PNG fallbacks for SVG.
gulp.task("svg", ["svg:optimize"], function() {
  // WTF error, needs src with ".svg".
  return gulp.src(config.dev.svgBuildGlob + ".svg")
    .pipe(plugins.svg2png())
    .pipe(gulp.dest(config.dev.fallbacks));
});

/*
-------------------------- Styleguide. --------------------------
*/

// Delete previous KSS build.
gulp.task("guide:wipe", function() {
  return gulp.src(config.dev.styleguide, {read: false})
    .pipe(vinyl(del));
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

// Inject dev styles into styleguide.
gulp.task("guide:inject", ["guide:compile", "resources:read"], function() {
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

/*
-------------------------- Task groups. ---------------------------
*/
gulp.task("default", ["compile", "server", "scan"]);
gulp.task("compile", ["styles", "templates:reload"]);

// Wipe first. Move, produce. Images if --full.
gulp.task("build", ["build:reload", "build:images"]);

gulp.task("guide", ["guide:inject"]);
