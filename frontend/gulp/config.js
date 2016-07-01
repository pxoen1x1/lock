/* jshint node: true */
'use strict';

var paths = {
    build: 'dist/',
    src: 'app/',
    development: 'dist/development',
    production: 'dist/production',
    vendor: 'vendor/'
    /*src: 'app',
     build: 'build',
     development: 'build/development',
     production: 'build/production',
     developmentAssets: 'build/assets',
     productionAssets: 'build/production/assets'*/
};

module.exports = {
    browsersync: {
        server: {
            baseDir: [paths.development, paths.src],
            routes: {
                '/vendor': paths.vendor
            }
        },
        port: 9000,
        files: [
            paths.src + 'scss/*.scss',
            paths.src + 'styles/*.css',
            paths.src + 'js/**/*.js',
            paths.src + '**/*.html',
            paths.src + 'images/**',
            paths.src + 'fonts/*'
        ]
    },
    copyfonts: {
        src: paths.src + 'fonts/*',
        dest: paths.production + '/fonts'
    },
    copystyles: {
        src: paths.src + 'styles/*',
        dest: paths.development + '/styles'
    },
    delete: {
        development: {
            src: paths.development
        },
        production: {
            src: paths.production
        }
    },
    images: {
        src: paths.src + 'images/**/*',
        dest: paths.production + '/images'
    },
    htmlmin: {
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseBooleanAttributes: true,
        html5: true,
        removeCommentsFromCDATA: true,
        removeOptionalTags: true
    },
    lintStyles: {
        src: [
            paths.src + 'styles/**/*.css',
            '!' + paths.src + 'styles/styles.css'
        ],
        options: {
            stylelint: {
                extends: 'stylelint-config-standard',
                rules: {}
            },
            reporter: {
                clearMessages: true
            }
        }
    },
    ngtemplate: {
        development: {
            src: paths.src + 'js/**/*.html',
            dest: paths.development + '/js'
        },
        options: {
            moduleName: 'app',
            useStrict: true
        }
    },
    sass: {
        development: {
            src: paths.src + 'scss/**/*.scss',
            dest: paths.development + '/styles'
        },
        production: {
            src: paths.src + 'scss/**/main.scss',
            dest: paths.production + '/styles'
        }
    },
    styles: {
        src: paths.src + 'styles/**/*.css'
    },
    watch: {
        images: paths.src + 'images/**/*',
        scss: paths.src + 'scss/**/*.scss',
        styles: paths.src + 'styles/**/*.css',
        scripts: paths.src + 'js/**/*.js',
        templates: paths.src + 'js/**/*.html'
    },
    webserver: {
        src: ['./dist/development/', './app/', './' + paths.vendor + '/'],
        options: {
            path: '/dist/development/',
            port: 9000,
            livereload: true,
            /* fallback: '/index.html', */
            open: '/dist/development/'
        }
    },
    jshint: {
        src: paths.src + 'js/*.js'
    },
    optimize: {
        css: {
            src: paths.src + 'css/**/*.css',
            dest: paths.production + '/css/',
            options: {
                keepSpecialComments: 0
            }
        },
        js: {
            src: paths.src + 'js/**/*.js',
            dest: paths.production + '/js/',
            options: {}
        },
        images: {
            src: paths.src + 'images/**/*.{jpg,jpeg,png,gif}',
            dest: paths.production + '/images/',
            options: {
                optimizationLevel: 3,
                progessive: true,
                interlaced: true
            }
        },
        html: {
            src: paths.src + '**/*.html',
            dest: paths.production,
            options: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
                removeCommentsFromCDATA: true,
                removeOptionalTags: true
            }
        }
    }
};