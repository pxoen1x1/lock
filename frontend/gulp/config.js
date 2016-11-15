/* jshint node: true */
'use strict';

var historyApiFallback = require('connect-history-api-fallback');

var paths = {
    build: 'dist/',
    src: 'app/',
    development: 'dist/development/',
    production: 'dist/production/',
    vendor: 'vendor/'
};

module.exports = {
    browsersync: {
        development: {
            server: {
                baseDir: [paths.development, paths.src],
                middleware: [historyApiFallback()],
                routes: {
                    '/vendor': paths.vendor
                }
            },
            port: 9000,
            files: [
                paths.src + '**/*'
            ]
        },
        production: {
            server: {
                baseDir: [paths.production]
            },
            port: 9100
        }
    },
    copyfonts: {
        src: [
            paths.src + 'fonts/*',
            paths.vendor + 'font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}',
            paths.vendor + 'material-design-icons/iconfont/*.{eot,svg,ttf,woff,woff2}'
        ],
        dest: paths.production + 'fonts'
    },
    copystyles: {
        src: paths.src + 'styles/*',
        dest: paths.development + '/styles'
    },
    delete: {
        src: paths.build
    },
    htmlmin: {
        options: {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            conservativeCollapse: true,
            html5: true,
            removeCommentsFromCDATA: true
        }
    },
    imagemin: {
        src: paths.src + 'images/**/*.{jpg,jpeg,png,gif}',
        dest: paths.production + 'images/',
        options: {
            optimizationLevel: 3,
            progessive: true,
            interlaced: true
        }
    },
    jshint: {
        src: paths.src + 'js/*.js'
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
        src: paths.src + 'js/**/*.html',
        dest: paths.development + 'js',
        options: {
            moduleName: 'app',
            useStrict: true
        }
    },
    replace: {
        materialIcons: {
            from: 'url(MaterialIcons-Regular',
            to: 'url(../fonts/MaterialIcons-Regular'
        }
    },
    rsync: {
        src: paths.production + '**',
        options: {
            destination: '/srv/www/locksmith/frontend/',
            root: paths.production,
            hostname: '192.168.0.99',
            username: 'deploy',
            incremental: true,
            progress: true,
            relative: true,
            emptyDirectories: true,
            recursive: true,
            clean: true,
            exclude: [],
            include: []
        }
    },
    sass: {
        development: {
            src: paths.src + 'scss/**/*.scss',
            dest: paths.development + 'styles'
        },
        production: {
            src: paths.src + 'scss/**/main.scss',
            dest: paths.production + 'styles'
        }
    },
    styles: {
        src: paths.src + 'styles/**/*.css'
    },
    usemin: {
        src: paths.src + '*.html',
        dest: paths.production
    },
    watch: {
        images: paths.src + 'images/**/*',
        scss: paths.src + 'scss/**/*.scss',
        styles: paths.src + 'styles/**/*.css',
        scripts: paths.src + 'js/**/*.js',
        templates: paths.src + 'js/**/*.html'
    }
};