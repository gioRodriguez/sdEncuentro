module.exports = function(grunt) {
	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// project configuration
	grunt
			.initConfig({
				pkg : grunt.file.readJSON('package.json'),
				yeoman : {
					// configurable paths
					app : require('./bower.json').appPath || 'app',
					dist : '../www'
				},

				requirejs : {
					compile : {
						options : {
							almond : true,
							name : 'main',
							mainConfigFile : 'app/main.js',
							out : '<%= yeoman.dist %>/main.js'
						}
					}
				},

				// Empties folders to start fresh
				clean : {
					dist : {
						files : [ {
							dot : true,
							src : [ '.tmp', '<%= yeoman.dist %>/*',
									'!<%= yeoman.dist %>/.git*' ]
						} ]
					},
					bh : {
						files : [ {
							dot : true,
							src : ['<%= yeoman.dist %>/texts/**/*.bh']
						} ]
					},
					server : '.tmp'
				},

				// Add vendor prefixed styles
				autoprefixer : {
					options : {
						browsers : [ 'last 1 version' ]
					},
					dist : {
						files : [ {
							expand : true,
							cwd : '.tmp/styles/',
							src : '{,*/}*.css',
							dest : '.tmp/styles/'
						} ]
					}
				},

				// Automatically inject Bower components into the app
				'bower-install' : {
					app : {
						html : '<%= yeoman.app %>/index.html',
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
									'<%= yeoman.dist %>/font/{,*/}*.{eot,svg,ttf,woff}' ]
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
					html : [ '<%= yeoman.dist %>/{,*/}*.html' ],
					css : [ '<%= yeoman.dist %>/styles/{,*/}*.css' ],
					options : {
						assetsDirs : [ '<%= yeoman.dist %>',
								'<%= yeoman.dist %>/images',
								'<%= yeoman.dist %>/styles/fonts' ]
					}
				},

				// The following *-min tasks produce minified files in the dist
				// folder
				imagemin : {
					dist : {
						files : [ {
							expand : true,
							cwd : '<%= yeoman.app %>/images',
							src : '{,*/}*.{png,jpg,jpeg,gif}',
							dest : '<%= yeoman.dist %>/images'
						} ]
					}
				},
				svgmin : {
					dist : {
						files : [ {
							expand : true,
							cwd : '<%= yeoman.app %>/images',
							src : '{,*/}*.svg',
							dest : '<%= yeoman.dist %>/images'
						} ]
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
						files : [ {
							expand : true,
							cwd : '<%= yeoman.dist %>',
							src : [ '*.html', 'views/{,*/}*.html' ],
							dest : '<%= yeoman.dist %>'
						} ]
					}
				},

				// Allow the use of non-minsafe AngularJS files.
				// Automatically makes it
				// minsafe compatible so Uglify does not destroy the ng
				// references
				ngmin : {
					dist : {
						files : [ {
							expand : true,
							cwd : '.tmp/concat/scripts',
							src : '*.js',
							dest : '.tmp/concat/scripts'
						} ]
					}
				},

				// Replace Google CDN references
				cdnify : {
					dist : {
						html : [ '<%= yeoman.dist %>/*.html' ]
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
									src : [ '*.{ico,png,txt}', '.htaccess',
											'*.html', 'views/{,*/}*.html',
											'texts/**/*',
											'images/{,*/}*.{webp}', 'font/*' ]
								}, {
									expand : true,
									cwd : '.tmp/images',
									dest : '<%= yeoman.dist %>/images',
									src : [ 'generated/*' ]
								} ]
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
					server : [ 'compass:server' ],
					test : [ 'compass' ],
					dist : [ 'compass:dist', 'imagemin', 'svgmin' ]
				},
				jshint : {
					files : [ 'Gruntfile.js', 'app/**/*.js' ],
					options : {
						globals : {
							jQuery : true,
							console : true,
							module : true,
							document : true
						}
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
						src : [ '<%= yeoman.dist %>/index.html',
								'<%= yeoman.dist %>/views/*.html' ]
					},
					js : {
						src : '.tmp/concat/scripts/*.js'
					}
				},
				compress : {
					main : {
						options : {
							mode : 'gzip'
						},
						expand : true,
						src : [ '<%= yeoman.dist %>/texts/**/*' ],
						ext: '.gz.js'
					}
				}
			});

	grunt.registerTask('build', [ 'clean:dist', 'useminPrepare',
			'compass:dist', 'imagemin', 'svgmin', 'autoprefixer', 'concat',
			'copy:dist', 'cdnify', 'cssmin', 'compress', 'clean:bh', 'preprocess:js', // Remove
			// DEBUG
			// code from
			// production
			// builds
			'preprocess:html', // Remove DEBUG code from production builds
			'ngmin', 'requirejs', 'uglify', 'rev', 'usemin', 'htmlmin' ]);

	// default task(s).
	grunt.registerTask('default', [ 'concat', 'uglify' ]);
}
