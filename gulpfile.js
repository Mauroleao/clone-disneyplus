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
  // Usando copy nativo para evitar qualquer transformação
  const { execSync } = require('child_process');
  
  try {
    // Cria diretório se não existir
    execSync('if not exist "dist\\images" mkdir "dist\\images"', { shell: true });
    // Copia recursivamente preservando estrutura
    execSync('robocopy "src\\images" "dist\\images" /E /NFL /NDL /NJH /NJS /NC /NS', { shell: true });
  } catch (error) {
    // robocopy retorna códigos de saída > 0 mesmo quando bem-sucedido
    if (error.status > 7) {
      console.error('Erro ao copiar imagens:', error);
    }
  }
  
  return Promise.resolve();
}

function copyHtml() {
  return gulp.src("./index.html")
    .pipe(gulp.dest("./dist"));
}

function copyFonts() {
  return gulp.src("./assets/fonts/*")
    .pipe(gulp.dest("./dist/assets/fonts"));
}

exports.default = gulp.parallel(styles, images, scripts, copyHtml, copyFonts);

exports.watch = function () {
  gulp.watch("./src/styles/*.scss", gulp.parallel(styles));
  gulp.watch("./src/scripts/*.js", gulp.parallel(scripts));
};
