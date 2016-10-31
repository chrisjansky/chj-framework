A universal project starter kit.

# Gulp tasks
- `gulp` to start a browser-sync server (alias for `gulp server:html gulp:watch`)
  - `gulp server:php` to run PHP files
- `gulp svg` to minify SVG assets (alias for `gulp svg:minify`)
  - `gulp svg:sprites` to build SVG sprites
- `gulp build` to build production-ready version
- `gulp deploy` to upload a clean production version to FTP (alias for `gulp deploy:clean`)
  - `gulp deploy:update` to update a version on FTP
- `gulp guide` to generate a styleguide with kss-node

# Slider plugins
- Flickity
  - Hard to use different gutters inside/outside whilst employing percentage based item widths
