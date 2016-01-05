var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "del"]
  }),
  config = require(pathPrefix + "gulpconfig.json");

// Delete the previous SVG build.
gulp.task("svg:wipe", function() {
  return plugins.del(config.dev.svgBuildGlob);
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
