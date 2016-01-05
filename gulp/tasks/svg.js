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

// Compile into a single SVG sprite file.
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

// Minify individual SVG assets.
gulp.task("svg:minify", ["svg:wipe"], function() {
  return gulp.src(config.dev.svgSourceGlob)
    .pipe(plugins.imagemin({
      svgoPlugins: [
        {removeViewBox: false},
        {removeUselessStrokeAndFill: false}
      ]
    }))
    .pipe(gulp.dest(config.dev.svgBuild));
});

gulp.task("svg", ["svg:minify"]);
