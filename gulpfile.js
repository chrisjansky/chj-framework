var
  fs = require("fs"),
  del = require("del"),
  argv = require("yargs").argv,
  glob = require("glob"),
  gulp = require("gulp"),
  vinyl = require("vinyl-paths"),
  plugins = require('gulp-load-plugins')({
    pattern: ["gulp-*", "browser-*", "hygienist-*"]
  }),
  config = require("./gulpconfig.json");

/*
------------------------------ Basic. -----------------------------
*/

gulp.task("server", function() {
  plugins.browserSync({
    server: {
      baseDir: config.paths.development,
      middleware: plugins.hygienistMiddleware(config.paths.development)
    },
    xip: true,
    notify: false
  });
});

gulp.task("styles", function () {
  return gulp.src(config.paths.scss)
    .pipe(plugins.plumber())
    .pipe(plugins.sass({
      errLogToConsole: true,
      includePaths: require("node-neat").with("bower_components/")
    }))
    .pipe(gulp.dest(config.paths.css))
    .pipe(plugins.browserSync.reload({
      stream: true
    }));
});

var
  jsonFiles,
  jsonGroup;

gulp.task("fetch-data", function() {
  jsonFiles = glob.sync(config.paths.glob_data);

  // Check if files exist.
  if (jsonFiles.length > 0) {

    jsonGroup = fs.readFileSync(jsonFiles[0], "utf8");
    // Add other files if more than one.
    if (jsonFiles.length > 1) {
      for (i = 1; i < jsonFiles.length; i++) {
        jsonGroup += ",\n" + fs.readFileSync(jsonFiles[i], "utf8");
      }
    }
    jsonGroup = "{" + jsonGroup + "}";

  } else {
    jsonGroup = null;
  }
});

gulp.task("templates", ["fetch-data"], function() {
  return gulp.src([config.paths.glob_jade, config.paths.ignore_jade])
    .pipe(plugins.plumber())
    .pipe(plugins.jade({
      pretty: true,
      locals: JSON.parse(jsonGroup)
    }))
    .pipe(gulp.dest(config.paths.development));
});

gulp.task("pages", ["templates"], function() {
  plugins.browserSync.reload();
});

gulp.task("refresh", function() {
  plugins.browserSync.reload();
});

gulp.task("scan", function() {
  gulp.watch(config.paths.glob_scss, ["styles"]);
  gulp.watch([config.paths.glob_jade, config.paths.glob_data], ["pages"]);
  gulp.watch(config.paths.glob_js, ["refresh"]);
});

/*
---------------------------- Build. ----------------------------
*/

// Delete the previous build.
gulp.task("build-wipe", function() {
  if (argv.full) {
    return gulp.src(config.paths.production)
      .pipe(vinyl(del));
  } else return;
});

// Minify CSS and JS.
gulp.task("build-compile", ["build-wipe"], function() {
  return gulp.src(config.paths.pages)
    .pipe(plugins.usemin({
      js: [plugins.uglify()],
      css: [
        plugins.autoprefixer({
          cascade: false
        }),
        plugins.minifyCss({
          keepSpecialComments: 0
        })]
    }))
    .pipe(gulp.dest(config.paths.production));
});

// Move other assets to production folder.
gulp.task("build-move", ["build-wipe"], function() {
  gulp.src(config.files, {base: config.paths.development})
    .pipe(gulp.dest(config.paths.production));
});

// Minify images if provided with --full argument.
gulp.task("build-images", ["build-wipe"], function() {
  if (argv.full) {
    return gulp.src([config.paths.glob_images, config.paths.ignore_images])
      .pipe(plugins.imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
      }))
      .pipe(gulp.dest(config.paths.production + config.paths.images));
  };
});

// Strip unused CSS afterwards if --uncss provided.
gulp.task("build-strip", ["build-compile"], function() {
  if (argv.uncss) {
    return gulp.src(config.paths.production + config.paths.glob_css)
      .pipe(plugins.uncss({
        html: glob.sync(config.paths.pages),
        ignore: [/::?-[\w\d]+/]
      }))
      .pipe(plugins.minifyCss({
        keepSpecialComments: 0
      }))
      .pipe(plugins.size({
        showFiles: true
      }))
      .pipe(gulp.dest(config.paths.production + config.paths.css));
  }
});

/*
---------------------------- Deploy. ----------------------------
*/

gulp.task("deploy", function() {
  return gulp.src(config.paths.production + "**/*")
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
gulp.task("svg-wipe", function() {
  return gulp.src(config.paths.fallbacks, {read: false})
    .pipe(vinyl(del));
});

// Render PNG fallbacks for SVG.
gulp.task("svg", ["svg-wipe"], function() {
  return gulp.src(config.paths.glob_svg)
    .pipe(plugins.svg2png())
    .pipe(gulp.dest(config.paths.fallbacks));
});

/*
-------------------------- Styleguide. --------------------------
*/

gulp.task("styleguide-wipe", ["build-wipe"], function() {
  return gulp.src(config.paths.styleguide, {read: false})
    .pipe(vinyl(del));
});

gulp.task("styleguide-move", ["styleguide-wipe"], function() {
  return gulp.src(config.styleguide, {base: config.paths.kss})
    .pipe(gulp.dest(config.paths.styleguide));
});

gulp.task("styleguide-styles", ["styleguide-move"], function() {
  return gulp.src(config.paths.kss_css)
    .pipe(plugins.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(plugins.rename(function (path) {
        path.basename += "-min";
    }))
    .pipe(gulp.dest(config.paths.production + config.paths.css));
});

gulp.task("styleguide-compile", ["styleguide-styles"], function() {
  return gulp.src(config.paths.glob_scss)
    .pipe(plugins.kss({
      overview: config.paths.kss + "/styleguide.md",
      templateDirectory: config.paths.kss
    }))
    .pipe(gulp.dest(config.paths.styleguide));
});

/*
-------------------------- Task groups. ---------------------------
*/
gulp.task("default", ["compile", "server", "scan"]);
gulp.task("compile", ["styles", "templates"]);

// Wipe first. Move, produce. Images if --full. Strip if --uncss.
gulp.task("build", ["build-move", "build-images", "build-strip"]);

gulp.task("styleguide", ["build-compile", "styleguide-compile"]);