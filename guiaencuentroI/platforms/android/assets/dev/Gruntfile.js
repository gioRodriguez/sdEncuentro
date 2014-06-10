module.exports = function(grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // project configuration
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    yeoman : {
      // configurable paths
      app : require('./bower.json').appPath ||
        'app',
      dist : '../www'
    },

    requirejs : {
      compile : {
        options : {
          almond : true,
          name : 'main',
          mainConfigFile : '.tmp/app/main.js',
          out : '<%= yeoman.dist %>/main.js',
          preserveLicenseComments : false
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch : {
      js : {
        files : [
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ],
        tasks : [
          'newer:jshint:all'
        ],
        options : {
          livereload : true
        }
      },
      jsTest : {
        files : [
          'test/spec/{,*/}*.js'
        ],
        tasks : [
          'newer:jshint:test',
          'karma'
        ]
      },
      compass : {
        files : [
          '<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'
        ],
        tasks : [
          'compass:server',
          'autoprefixer'
        ]
      },
      gruntfile : {
        files : [
          'Gruntfile.js'
        ]
      },
      livereload : {
        options : {
          livereload : '<%= connect.options.livereload %>'
        },
        files : [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect : {
      options : {
        port : 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname : 'localhost',
        livereload : 35729
      },
      livereload : {
        options : {
          open : true,
          base : [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test : {
        options : {
          port : 9001,
          base : [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist : {
        options : {
          base : '<%= yeoman.dist %>'
        }
      }
    },

    // Empties folders to start fresh
    clean : {
      dist : {
        files : [
          {
            dot : true,
            src : [
              '.tmp',
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*'
            ]
          }
        ]
      },
      bh : {
        files : [
          {
            dot : true,
            src : [
              '<%= yeoman.dist %>/texts/**/*.txt'
            ]
          }
        ]
      },
      server : '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer : {
      options : {
        browsers : [
          'last 1 version'
        ]
      },
      dist : {
        files : [
          {
            expand : true,
            cwd : '.tmp/styles/',
            src : '{,*/}*.css',
            dest : '.tmp/styles/'
          }
        ]
      }
    },

    // Automatically inject Bower components into the app
    'bower-install' : {
      app : {
        src : [
          '<%= yeoman.app %>/index.html'
        ],
        ignorePath : '<%= yeoman.app %>/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if
    // requested
    compass : {
      options : {
        sassDir : '<%= yeoman.app %>/styles',
        cssDir : '.tmp/styles',
        generatedImagesDir : '.tmp/images/generated',
        imagesDir : '<%= yeoman.app %>/images',
        javascriptsDir : '<%= yeoman.app %>/scripts',
        fontsDir : '<%= yeoman.app %>/styles/fonts',
        importPath : '<%= yeoman.app %>/bower_components',
        httpImagesPath : '/images',
        httpGeneratedImagesPath : '/images/generated',
        httpFontsPath : '/styles/fonts',
        relativeAssets : false,
        assetCacheBuster : false,
        raw : 'Sass::Script::Number.precision = 10\n'
      },
      dist : {
        options : {
          generatedImagesDir : '<%= yeoman.dist %>/images/generated'
        }
      },
      server : {
        options : {
          debugInfo : true
        }
      }
    },

    // Renames files for browser caching purposes
    rev : {
      dist : {
        files : {
          src : [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/font/{,*/}*.{eot,svg,ttf,woff}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that
    // automatically
    // concat, minify and revision files. Creates configurations in
    // memory so
    // additional tasks can operate on them
    useminPrepare : {
      html : '<%= yeoman.app %>/index.html',
      options : {
        dest : '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare
    // configuration
    usemin : {
      html : [
        '<%= yeoman.dist %>/{,*/}*.html'
      ],
      css : [
        '<%= yeoman.dist %>/styles/{,*/}*.css'
      ],
      options : {
        assetsDirs : [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles/fonts'
        ]
      }
    },

    // The following *-min tasks produce minified files in the dist
    // folder
    imagemin : {
      dist : {
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.app %>/images',
            src : '{,*/}*.{png,jpg,jpeg,gif}',
            dest : '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    svgmin : {
      dist : {
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.app %>/images',
            src : '{,*/}*.svg',
            dest : '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    htmlmin : {
      dist : {
        options : {
          collapseWhitespace : true,
          collapseBooleanAttributes : true,
          removeCommentsFromCDATA : true,
          removeOptionalTags : true
        },
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.dist %>',
            src : [
              '*.html',
              'views/{,*/}*.html'
            ],
            dest : '<%= yeoman.dist %>'
          }
        ]
      }
    },

    // Allow the use of non-minsafe AngularJS files.
    // Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng
    // references
    ngmin : {
      dist : {
        files : [
          {
            expand : true,
            cwd : '.tmp/concat/scripts',
            src : '*.js',
            dest : '.tmp/concat/scripts'
          }
        ]
      }
    },

    // Replace Google CDN references
    cdnify : {
      dist : {
        html : [
          '<%= yeoman.dist %>/*.html'
        ]
      }
    },

    // Copies remaining files to places other tasks can use
    copy : {
      dist : {
        files : [
          {
            expand : true,
            dot : true,
            cwd : '<%= yeoman.app %>',
            dest : '<%= yeoman.dist %>',
            src : [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'views/{,*/}*.html',
              'texts/**/*',
              'images/{,*/}*.{webp}',
              'font/*',
              'plugins/**/*.min.js',
              'cordova_plugins.js',
              'styles/icomatic.*'
            ]
          },
          {
            expand : true,
            cwd : '.tmp/images',
            dest : '<%= yeoman.dist %>/images',
            src : [
              'generated/*'
            ]
          },
          {
            expand : true,
            cwd : '<%= yeoman.app %>',
            dest : '.tmp/app',
            src : [
              'bower_components/**/*.js',
              'scripts/**/*.js',
              '*.js'
            ]
          }
        ]
      },
      styles : {
        expand : true,
        cwd : '<%= yeoman.app %>/styles',
        dest : '.tmp/styles/',
        src : '{,*/}*.css'
      }
    },

    // Compiles Sass to CSS and generates necessary files if
    // requested
    compass : {
      options : {
        sassDir : '<%= yeoman.app %>/styles',
        cssDir : '.tmp/styles',
        generatedImagesDir : '.tmp/images/generated',
        imagesDir : '<%= yeoman.app %>/images',
        javascriptsDir : '<%= yeoman.app %>/scripts',
        fontsDir : '<%= yeoman.app %>/styles/fonts',
        importPath : '<%= yeoman.app %>/bower_components',
        httpImagesPath : '/images',
        httpGeneratedImagesPath : '/images/generated',
        httpFontsPath : '/styles/fonts',
        relativeAssets : false,
        assetCacheBuster : false,
        raw : 'Sass::Script::Number.precision = 10\n'
      },
      dist : {
        options : {
          generatedImagesDir : '<%= yeoman.dist %>/images/generated'
        }
      },
      server : {
        options : {
          debugInfo : true
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent : {
      server : [
        'compass:server'
      ],
      test : [
        'compass'
      ],
      dist : [
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // Make sure code styles are up to par and there are no obvious
    // mistakes
    jshint : {
      options : {
        jshintrc : '.jshintrc',
        reporter : require('jshint-stylish')
      },
      all : [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test : {
        options : {
          jshintrc : 'test/.jshintrc'
        },
        src : [
          'test/spec/{,*/}*.js'
        ]
      }
    },

    // Test settings
    karma : {
      unit : {
        configFile : 'karma.conf.js',
        singleRun : true
      }
    },
    preprocess : {
      options : {
        inline : true,
        context : {
          NODE_ENV : 'production'
        }
      },
      html : {
        src : [
          '<%= yeoman.dist %>/index.html',
          '<%= yeoman.dist %>/views/*.html'
        ]
      },
      js : {
        src : '.tmp/app/scripts/**/*.js'
      }
    },
    compress : {
      main : {
        options : {
          mode : 'gzip'
        },
        expand : true,
        src : [
          '<%= yeoman.dist %>/texts/**/*'
        ],
        ext : '.gz.js'
      }
    }
  });

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'connect:dist:keepalive'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'compass:dist',
    'imagemin',
    'svgmin',
    'autoprefixer',
    'concat',
    'copy:dist',
    'cdnify',
    'cssmin',
    'ngmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  // default task(s).
  grunt.registerTask('default', [
    'build'
  ]);
}
