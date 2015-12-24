pathPrefix = "../";

var gulp = require("gulp");

/* Basic */
require("./gulp/tasks/server.js");
require("./gulp/tasks/templates.js");
require("./gulp/tasks/styles.js");
require("./gulp/tasks/watch.js");

gulp.task("default", ["server:html", "watch"]);

/* Advanced */
require("./gulp/tasks/guide.js");
require("./gulp/tasks/svg.js");

/* Production */
require("./gulp/tasks/build.js");
require("./gulp/tasks/deploy.js");
