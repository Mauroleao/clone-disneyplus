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
  return gulp.src("./src/images/**/*")
    .pipe(gulp.dest("./dist/images"));
}

// Also copy images into a public-like folder so deployments that expect
// a `public/` directory can find static assets at /public/... if needed.
function imagesToPublic() {
  return gulp.src("./src/images/**/*")
    .pipe(gulp.dest("./dist/public/images"));
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
