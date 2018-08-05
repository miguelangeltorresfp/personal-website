"use strict";

const gulp = require("gulp"),
    concat = require("gulp-concat"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify"),
    minify = require("gulp-minify-css"),
    rename = require("gulp-rename"),
    sass = require("gulp-sass"),
    maps = require("gulp-sourcemaps"),
    nodemon = require("nodemon"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    pug = require('gulp-pug');

gulp.task('views', function buildHTML() {
    return gulp.src('views/*.pug')
        .pipe(pug())
        .pipe(gulp.dest("public/"))
});

gulp.task("concatScripts", () => {
    return gulp
        .src([
            "app/js/jquery.js",
            "app/js/util.js",
            "app/js/carousel.js",
            "app/js/main.js",
        ])
        .pipe(maps.init())
        .pipe(concat("index.js"))
        .pipe(maps.write("./"))
        .pipe(gulp.dest("app/js"))
});;

gulp.task("minifyScripts", ["concatScripts"], () => {
    return gulp
        .src("app/js/index.js")
        .pipe(babel({ presets: ["es2015"] }))
        .pipe(uglify())
        .pipe(rename("index.min.js"))
        .pipe(gulp.dest("public/js"))
});

gulp.task("compileSass", () => {
    return gulp
        .src("app/scss/application.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
});

gulp.task("concatCss", ["compileSass"], () => {
    return gulp
        .src([
            "app/css/normalize.css",
            "app/css/font-awesome.css",
            "app/css/bootstrap.css",
            "app/css/application.css",
        ])
        .pipe(maps.init())
        .pipe(concat("main.css"))
        .pipe(maps.write("./"))
        .pipe(gulp.dest("app/css"))
});

gulp.task("autoprefixer", ["concatCss"], () => {
    return gulp
        .src("app/css/main.css")
        .pipe(maps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(maps.write("./"))
        .pipe(gulp.dest("public/css"))
});

gulp.task("minifyCss", ["autoprefixer"], () => {
    return gulp
        .src("public/css/main.css")
        .pipe(minify())
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest("public/css"))
});

gulp.task("watchFiles", () => {
    gulp.watch("app/scss/**/*.scss", ["concatCss"]);
    gulp.watch("app/js/main.js", ["concatScripts"])
});

gulp.task("dev", ["concatCss", "concatScripts", "watchFiles"], () => {
    nodemon({ script: "app.js", env: { NODE_ENV: "development" } })
});

gulp.task("copy", () => {
    gulp.src("app/css/fonts/*").pipe(gulp.dest("public/css/fonts"));
    gulp.src("app/documents/*").pipe(gulp.dest("public/documents"));
    gulp.src("app/img/*").pipe(gulp.dest("public/img"));
    gulp.src("app/zohoverify/*").pipe(gulp.dest("public/zohoverify"));
    gulp.src(["app/*.ico", "app/*.html"]).pipe(gulp.dest("public"));
});

gulp.task("build", ["copy", "views", "minifyScripts", "minifyCss"]);

gulp.task("default", ["dev"]);
