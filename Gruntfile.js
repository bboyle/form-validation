'use strict';

module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON( 'package.json' ),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.
		clean: {
			files: [ 'dist' ]
		},
		// production pipeline tasks
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': [ 'src/<%= pkg.name %>.js' ],
					'dist/jquery.forms.highlight.min.js': [ 'src/jquery.forms.highlight.js' ]
				}
			},
		},
		// code quality tasks
		qunit: {
			options: {
				timeout: 12000
			},
			files: [ 'test/**/*.html' ]
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				src: [ 'src/**/*.js' ]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: [ 'test/*.js' ]
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: [ 'jshint:gruntfile' ]
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: [ 'jshint:src', 'qunit' ]
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: [ 'jshint:test', 'qunit' ]
			},
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	// Default task.
	grunt.registerTask( 'test', [ 'jshint', 'qunit' ]);
	grunt.registerTask( 'produce', [ 'clean', 'uglify' ]);
	grunt.registerTask( 'default', [ 'test', 'produce' ]);

};
