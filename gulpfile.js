const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
// const imagemin = require("gulp-imagemin"); // Removido completamente
const uglify = require("gulp-uglify");

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
  return gulp.src("./assets/fonts/*")
    .pipe(gulp.dest("./dist/assets/fonts"));
}

exports.default = gulp.parallel(styles, images, imagesToPublic, scripts, copyHtml, copyFonts);

exports.watch = function () {
  gulp.watch("./src/styles/*.scss", gulp.parallel(styles));
  gulp.watch("./src/scripts/*.js", gulp.parallel(scripts));
  gulp.watch("./src/images/**/*", gulp.parallel(images, imagesToPublic));
};
