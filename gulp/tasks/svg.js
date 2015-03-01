var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*"]
  }),
  config = require("../gulpconfig.json");

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
