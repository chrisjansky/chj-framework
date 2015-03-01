var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*"]
  }),
  config = require("../gulpconfig.json");

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
