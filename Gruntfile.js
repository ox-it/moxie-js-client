(function () {
    'use strict';
    var cordova = require('cordova');
    
    // var plugins = [
    //     "cordova-plugin-dialogs",
    //     "cordova-plugin-contacts",
    //     "cordova-plugin-device",
    //     "cordova-plugin-splashscreen",
    //     "cordova-plugin-geolocation",
    //     "cordova-plugin-inappbrowser",
    //     "cordova-plugin-statusbar",
    //     "cordova-plugin-calendar",
    //     "com.adobe.plugins.GAPlugin",
    //     "cordova-plugin-whitelist",
    //     "cordova-plugin-pushplugin"
    //     // 'cordova-plugin-device',
    //     // 'cordova-plugin-inappbrowser',
    //     // 'cordova-plugin-dialogs',
    //     // 'cordova-plugin-x-socialsharing',
    //     // 'cordova-plugin-statusbar',
    //     // 'cordova-plugin-whitelist',
    //     // 'cordova-plugin-crosswalk-webview'
    //     //add further plugins here
    // ]
    
    var platforms = [
        'ios',
        'android@3.7.1'
        //add further platforms here
    ]
    

    module.exports = function (grunt) {
        // load all grunt tasks
        require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

        // configurable paths
        var yeomanConfig = {
            app: 'www'
        };

        try {
            yeomanConfig.app = require('./component.json').appPath || yeomanConfig.app;
        } catch (e) {
        }

        var device = {
            platform: grunt.option('platform') || '',
            family: grunt.option('family') || 'default',
            target: grunt.option('target') || 'emulator'
        };

        grunt.initConfig({
            // yeoman: yeomanConfig,
            // jshint: {
            //     gruntfile: ['Gruntfile.js'],
            //     files: ['www/**/*.js', 'test/**/*.js'],
            //     options: {
            //         // options here to override JSHint defaults
            //         globals: {
            //             console: true,
            //             module: true
            //         }
            //     }
            // },
            watchfiles: {
                all: [
                    'www/{,*/}*.html',
                    'www/js/{,*/,*/}*.js',
                    'www/css/{,*/}*.css',
                    'www/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    'sass/*.scss'
                ]
            },
            watch: {
                scripts: {
                    files: [
                        'www/js/**/*.js',
                        'www/css/**/*.css'
                    ],
                    tasks: ['jshint']
                },
                liveserve: {
                    options: {
                        livereload: true,
                    },
                    files: ['<%=watchfiles.all %>'],
                    tasks: ['shell:serveend', 'cordova-prepareserve']
                },
                liveemulate: {
                    files: ['<%=watchfiles.all %>'],
                    tasks: ['cordova-emulate-end', 'cordova-buildemulate']
                },
                livedevice: {
                    files: ['<%=watchfiles.all %>'],
                    tasks: ['cordova-buildrun']
                },
                styles: {
                    files: ['<%=watchfiles.all %>'],
                    tasks: ['compass']
                }
            
            },
            // shell: {
            //     iossimstart: {
            //         command: 'ios-sim launch platforms/ios/build/yoco.app --exit' + (device.family !== 'default' ? ' --family ' + device.family : ''),
            //         options: {
            //             stdout: true
            //         }
            //     },
            //     iossimend: {
            //         command: 'killall -9 "iPhone Simulator"'
            //     },
            //     serveend: {
            //         command: 'killall -9 "cordova serve"'
            //     },
            //     rippleend: {
            //         command: 'killall -9 "cordova ripple"'
            //     }
            // },
            
            requirejs: {
              compile: {
                options: {
                  mainConfigFile: "require.config.js",
                  name: "app/libs/almond.js",
                  out: "app/built.js",
                  include: ['app/main'],
                  optimize: 'none'
                }
              }
            },
            compass: {
              dist: {
                options: {
                  config: 'config.rb'
                }
              }
            },
            clean: {
                src: ["www/*", "!www/config.xml"],
                filter: 'isFile'
            },
            copy: {
              main: {
                files: [
                  {
                    expand: true,
                    src: [
                      "app/built.js",
                      // "mobileoxford/moxie-js-client/app/libs/pouchdb/dist/pouchdb.js",                                 
                      // "app/libs/pouchdb-quick-search/dist/pouchdb.quick-search.js",
                      // "app/libs/auth0-lock/build/auth0-lock.js",
                      // "app/data/**",
                      // "app/libs/jquery-mobile-bower/css/jquery.mobile-*.css",
                      // "app/libs/owl.carousel/dist/assets/owl.carousel.min.css",
                      // "app/libs/jquery-mobile-bower/css/images/**",
                      "images/**",
                      "css/**",
                      "fonts/*"
                    ],
                    dest:"www" },
                    {
                      src: ["moxie-js-client/index-phonegap.html"],
                      dest: "www/index.html"
                    },
                    // {
                    //   src: ["app/config/appConfigDevice.json"],
                    //   dest: "www/app/config/appConfig.json"
                    // },
                  ]
                },
                // schema: {
                //   files: [
                //     {
                //         expand: true,
                //         src: ["../schema/**"],
                //         dest: "app/schema"
                //     }
                //   ]
                // }
              },
              // jasmine: {
              //   testTask: {
              //     src: [
              //       'app/**/*.js',
              //       '!app/built.js',
              //       '!app/libs/**',
              //     ],
              //     options: {
              //       specs: [
              //         'spec/removeCustomSkill.js',
              //         'spec/index.js',
              //         'spec/skills.js',
              //         'spec/goals.js',
              //         'spec/activities.js',
              //         'spec/createGoal.js',
              //         'spec/validateSkill.js',
              //         'spec/validateGoal.js',
              //         'spec/validateActivity.js',
              //         'spec/cascadingChanges.js',
              //       ],
              //       vendor: [
              //         'app/libs/es5-shim/es5-shim.js',
              //         'app/libs/es6-promise/promise.js',
              //         'app/libs/underscore/underscore.js',
              //         'app/libs/pouchdb/dist/pouchdb.js',
              //         'app/libs/auth0-lock/build/auth0-lock.js',
              //         'app/libs/pouchdb-quick-search/dist/pouchdb.quick-search.js'
              //       ],
              //       helpers: 'spec/helper.js',
              //       template: require('grunt-template-jasmine-requirejs'),
              //       templateOptions: {
              //         requireConfigFile: './require.config.js'
              //       },
              //       keepRunner: true,
              //       junit: {
              //         path: '.',
              //         consolidate: false
              //       }
              //     }
              //   }
              // },
              cordovacli: {
                options: {
                    path: '.',
                    cli: 'cordova',
                },
                build_ios: {
                    options: {
                        command: 'build',
                        platforms: ['ios']
                    }
                },
                build_android: {
                    options: {
                        command: 'build',
                        platforms: ['android']
                    }
                },
                ios: {
                    options: {
                        command: 'run',
                        args: ['--device'],
                        platforms: ['ios']
                    }
                },
                android: {
                    options: {
                        command: 'run',
                        args: ['--device'],
                        platforms: ['android']
                    }
                },
                emulate_android: {
                    options: {
                        command: 'run',
                        platforms: ['android']
                    }
                },
                emulate_ios: {
                    options: {
                        command: 'run',
                        platforms: ['ios']
                    }
                },
                // add_plugins: {
                //     options: {
                //         command: 'plugin',
                //         action: 'add',  
                //         plugins: plugins,
                //     }
                // },
                add_platforms: {
                    options: {
                        command: 'platform',
                        action: 'add',
                        platforms: platforms 
                    }
                }
            }
        });
        
        grunt.registerTask('ios', [
            'package',
            'cordovacli:build_ios',
            'cordovacli:ios'
        ]);
        
        grunt.registerTask('android', [
            'package',
            'cordovacli:build_android',
            'cordovacli:android'
        ]);
        
        grunt.registerTask('ios-sim', [
            'package',
            'cordovacli:build_ios',
            'cordovacli:emulate_ios'
        ]);
        
        grunt.registerTask('android-sim', [
            'package',
            'cordovacli:build_android',
            'cordovacli:emulate_android'
        ]);


        grunt.registerTask('default', ['package']);

        grunt.registerTask('package', 'prepare file for building', ['clean', 'requirejs', 'compass', 'copy'])
        
        grunt.registerTask('ci_build', 'build on CI server', ['package'])

        // grunt.registerTask('plugins', 'cordovacli:add_plugins');
        grunt.registerTask('platforms', 'cordovacli:add_platforms');
        // grunt.registerTask('setup', ['cordovacli:add_platforms', 'cordovacli:add_plugins', 'copy:schema'] );

    };
}());
