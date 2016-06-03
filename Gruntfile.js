module.exports = function(grunt) {

 
  grunt.initConfig({

    
    pkg: grunt.file.readJSON('package.json'),
  

    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },

      build: {
        files: {
          'dist/js/main.min.js': 'src/js/main.js'
        }
      }
    },
    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/css/style.min.css': ['src/css/style.css', 'src/css/sweetalert.css']
        }
      }
    },
    copy: {
    dev: {
        files: [{
        	cwd: 'src/views/',
            src: '*.ejs',
            dest: 'dist/views/',
            expand: true
        },
        {
        	cwd: 'src/',
            src: 'robots.txt',
            dest: 'dist/',
            expand: true
        },
        {
        	cwd: 'src/img',
            src: '*.png',
            dest: 'dist/img',
            expand: true
        },
        {
        	cwd: 'src/js',
            src: 'sweetalert.min.js',
            dest: 'dist/js',
            expand: true
        },
        {
        	cwd: 'src/js',
            src: 'ejs.min.js',
            dest: 'dist/js',
            expand: true
        }]
    }
}
  });

  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    //grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.registerTask('build', [
        'cssmin',
        'uglify',
        'copy:dev'
    ]);
};