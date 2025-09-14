const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
// const imagemin = require("gulp-imagemin"); // Removido completamente
const uglify = require("gulp-uglify");
const fs = require('fs');
const path = require('path');

function scripts() {
  return gulp.src("./src/scripts/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("./dist/js"));
}

function styles() {
  return gulp.src("./src/styles/*.scss")
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(gulp.dest("./dist/css"));
}

function images() {
  // Copy images using Node's binary-safe copy to avoid any stream
  // transformations that could corrupt binary image files.
  const srcDir = path.join(__dirname, 'src', 'images');
  const destDir = path.join(__dirname, 'dist', 'images');
  fs.mkdirSync(destDir, { recursive: true });
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      const srcPath = path.join(dir, entry.name);
      const rel = path.relative(srcDir, srcPath);
      const destPath = path.join(destDir, rel);
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        walk(srcPath);
      } else if (entry.isFile()) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
      }
    });
  };
  walk(srcDir);
  return Promise.resolve();
}

// Also copy images into a public-like folder so deployments that expect
// a `public/` directory can find static assets at /public/... if needed.
function imagesToPublic() {
  const srcDir = path.join(__dirname, 'src', 'images');
  const destDir = path.join(__dirname, 'dist', 'public', 'images');
  fs.mkdirSync(destDir, { recursive: true });
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    entries.forEach((entry) => {
      const srcPath = path.join(dir, entry.name);
      const rel = path.relative(path.join(__dirname, 'src', 'images'), srcPath);
      const destPath = path.join(destDir, rel);
      if (entry.isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        walk(srcPath);
      } else if (entry.isFile()) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
      }
    });
  };
  walk(srcDir);
  return Promise.resolve();
}

function copyHtml() {
  return gulp.src("./index.html")
    .pipe(gulp.dest("./dist"));
}

function copyFonts() {
  // Use Node's binary-safe copy to avoid any stream/encoding transformations
  // that could corrupt binary font files when copied through gulp streams.
  const srcDir = path.join(__dirname, 'assets', 'fonts');
  const destDir = path.join(__dirname, 'dist', 'assets', 'fonts');
  fs.mkdirSync(destDir, { recursive: true });
  const files = fs.readdirSync(srcDir);
  files.forEach((file) => {
    const src = path.join(srcDir, file);
    const dest = path.join(destDir, file);
    fs.copyFileSync(src, dest);
  });
  return Promise.resolve();
}

exports.default = gulp.parallel(styles, images, imagesToPublic, scripts, copyHtml, copyFonts);

exports.watch = function () {
  gulp.watch("./src/styles/*.scss", gulp.parallel(styles));
  gulp.watch("./src/scripts/*.js", gulp.parallel(scripts));
  gulp.watch("./src/images/**/*", gulp.parallel(images, imagesToPublic));
};
