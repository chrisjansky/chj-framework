var
  gulp = require("gulp"),
  plugins = require("gulp-load-plugins")({
    pattern: ["gulp-*", "vinyl-ftp"]
  }),
  config = require(pathPrefix + "gulpconfig.json");

var
  ftpConn = plugins.vinylFtp.create({
    host: config.ftp.host,
    user: config.ftp.user,
    pass: config.ftp.pass
  });

gulp.task("deploy:clean", function(callback) {
  ftpConn.rmdir(config.ftp.path, function(error) {
    gulp.src(config.dist.root + "**/*", {base: config.dist.root, buffer: false})
      .pipe(ftpConn.dest(config.ftp.path));
  });
});

gulp.task("deploy:update", function() {
  return gulp.src(config.dist.root + "**/*", {base: config.dist.root, buffer: false})
    .pipe(ftpConn.newer(config.ftp.path))
    .pipe(ftpConn.dest(config.ftp.path));
});

// Remove previous build by default.
gulp.task("deploy", ["deploy:clean"]);
