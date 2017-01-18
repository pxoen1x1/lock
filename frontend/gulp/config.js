/* jshint node: true */
'use strict';

var historyApiFallback = require('connect-history-api-fallback');

var paths = {
    build: 'dist/',
    app: {
        src: 'app/',
        development: 'dist/app/development/',
        production: 'dist/app/production/'
    },
    admin: {
        src: 'admin/',
        development: 'dist/admin/development/',
        production: 'dist/admin/production/',
    },
    mobile: {
        dest: 'mobile/'
    },
    vendor: 'vendor/'
};

module.exports = {
    browsersync: {
        app: {
            development: {
                server: {
                    baseDir: [paths.app.development, paths.app.src],
                    middleware: [historyApiFallback()],
                    routes: {
                        '/vendor': paths.vendor
                    }
                },
                port: 9000,
                files: [
                    paths.app.src + '**/*'
                ]
            },
            production: {
                server: {
                    baseDir: [paths.app.production]
                },
                port: 9100
            }
        },
        admin: {
            development: {
                server: {
                    baseDir: [paths.admin.development, paths.admin.src],
                    middleware: [historyApiFallback()],
                    routes: {
                        '/vendor': paths.vendor
                    }
                },
                port: 9200,
                files: [
                    paths.admin.src + '**/*'
                ]
            },
            production: {
                server: {
                    baseDir: [paths.admin.production]
                },
                port: 9300
            },
        }
    },
    copyfonts: {
        app: {
            src: [
                paths.app.src + 'fonts/*',
                paths.vendor + 'font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}',
                paths.vendor + 'material-design-icons/iconfont/*.{eot,svg,ttf,woff,woff2}'
            ],
            dest: paths.app.production + 'fonts'
        },
        admin: {
            src: [
                paths.admin.src + 'fonts/*',
                paths.vendor + 'material-design-icons/iconfont/*.{eot,svg,ttf,woff,woff2}'
            ],
            dest: paths.admin.production + 'fonts'
        },
        mobile: {
            src: [
                paths.app.src + 'fonts/*',
                paths.vendor + 'font-awesome/fonts/*.{eot,svg,ttf,woff,woff2}',
                paths.vendor + 'material-design-icons/iconfont/*.{eot,svg,ttf,woff,woff2}'
            ],
            dest: paths.mobile.src + 'fonts'
        }
    },
    copystyles: {
        app: {
            src: paths.app.src + 'styles/*',
            dest: paths.app.development + '/styles'
        },
        admin: {
            src: paths.admin.src + 'styles/*',
            dest: paths.admin.development + '/styles'
        }
    },
    cordova: {
        src: paths.mobile.dest,
        create: {
            src: paths.app.production,
            options: {
                dir: 'mobile',
                id: 'com.lockheal',
                name: 'Lockheal'
            }
        },
        author: {
            name: 'IdeaSoft',
            email: 'dev@i-deasoft.com',
            www: 'http://i-deasoft.com/'
        },
        description: 'Lockheal app.',
        icon: 'www/images/lockheal_logo.png',
        plugins: {
            'cordova-plugin-whitelist': 'latest',
            'cordova-plugin-crosswalk-webview': 'latest',
            'cordova-plugin-device': 'latest',
            'cordova-plugin-splashscreen': 'latest',
            'cordova-plugin-camera': 'latest',
            'cordova-plugin-file': 'latest'
        },
        preferences: {
            'FadeSplashScreen': true,
            'FadeSplashScreenDuration': 1500,
            'AutoHideSplashScreen': true,
            'ShowSplashScreenSpinner': false
        }
    },
    delete: {
        app: {
            src: paths.build + '/app'
        },
        admin: {
            src: paths.build + '/admin'
        },
        mobile: {
            src: paths.mobile.dest
        }
    },
    htmlmin: {
        options: {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            conservativeCollapse: true,
            html5: true,
            removeCommentsFromCDATA: true,
            removeComments: true
        }
    },
    imagemin: {
        app: {
            src: paths.app.src + 'images/**/*.{jpg,jpeg,png,gif}',
            dest: paths.app.production + 'images/',
        },
        admin: {
            src: paths.admin.src + 'images/**/*.{jpg,jpeg,png,gif}',
            dest: paths.admin.production + 'images/',
        },
        mobile: {
            src: paths.app.src + 'images/**/*.{jpg,jpeg,png,gif}',
            dest: paths.mobile.src + 'images/',
        },
        options: {
            optimizationLevel: 3,
            progessive: true,
            interlaced: true
        }
    },
    jshint: {
        app: {
            src: paths.app.src + 'js/*.js'
        },
        admin: {
            src: paths.admin.src + 'js/*.js'
        }
    },
    lintStyles: {
        app: {
            src: [
                paths.app.src + 'styles/**/*.css',
                '!' + paths.app.src + 'styles/styles.css'
            ]
        },
        admin: {
            src: [
                paths.admin.src + 'styles/**/*.css',
                '!' + paths.admin.src + 'styles/styles.css'
            ]
        },
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
        app: {
            src: paths.app.src + 'js/**/*.html',
            dest: paths.app.development + 'js'
        },
        admin: {
            src: paths.admin.src + 'js/**/*.html',
            dest: paths.admin.development + 'js'
        },
        options: {
            moduleName: 'app',
            useStrict: true
        }
    },
    replace: {
        materialIcons: {
            from: 'url(MaterialIcons-Regular',
            to: 'url(../fonts/MaterialIcons-Regular'
        },
        mobile: {
            src: paths.mobile.dest + 'www/',
            from: '="/',
            to: '="'
        }
    },
    sass: {
        app: {
            development: {
                src: paths.app.src + 'scss/**/*.scss',
                dest: paths.app.development + 'styles'
            }
        },
        admin: {
            development: {
                src: paths.admin.src + 'scss/**/*.scss',
                dest: paths.admin.development + 'styles'
            }
        }
    },
    usemin: {
        app: {
            src: paths.app.src + '*.html',
            dest: paths.app.production
        },
        admin: {
            src: paths.admin.src + '*.html',
            dest: paths.admin.production
        },
        mobile: {
            src: paths.app.src + '*.html',
            dest: paths.mobile.src
        },
    },
    watch: {
        app: {
            images: paths.app.src + 'images/**/*',
            scss: paths.app.src + 'scss/**/*.scss',
            styles: paths.app.src + 'styles/**/*.css',
            scripts: paths.app.src + 'js/**/*.js',
            templates: paths.app.src + 'js/**/*.html'
        },
        admin: {
            images: paths.admin.src + 'images/**/*',
            scss: paths.admin.src + 'scss/**/*.scss',
            styles: paths.admin.src + 'styles/**/*.css',
            scripts: paths.admin.src + 'js/**/*.js',
            templates: paths.admin.src + 'js/**/*.html'
        }
    }
};