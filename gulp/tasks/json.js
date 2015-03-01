var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["fs", "json-sass"]
  }),
  config = require("../gulpconfig.json");

gulp.task("json:convert", function () {
  return plugins.fs.createReadStream(config.dev.dataRoot + "palette.json")
    .pipe(plugins.jsonSass({
      prefix: "$json: ",
    }))
    .pipe(plugins.fs.createWriteStream(config.dev.scssRoot + "guide/json.scss"));
});
