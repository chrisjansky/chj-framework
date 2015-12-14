var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "del", "vinyl-paths"]
  }),
  config = require("../gulpconfig.json");

// Delete the PNG fallbacks/ folder.
gulp.task("svg:wipe", function() {
  return gulp.src(config.dev.svgBuildGlob, {read: false})
    .pipe(plugins.vinylPaths(plugins.del));
});

// Optimize SVG.
gulp.task("svg:sprites", ["svg:wipe"], function() {
  return gulp.src(config.dev.svgSourceGlob)
    .pipe(plugins.svgSprite({
      mode: {
        symbol: {
          dest: ".",
          sprite: "symbols.svg",
        }
      }
    }))
    .pipe(gulp.dest(config.dev.svgBuild));
});

gulp.task("svg", ["svg:sprites"]);
