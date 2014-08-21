module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          'public/javascript/min/grades.min.js': [
            'public/javascript/spin.min.js',
            'public/javascript/consumeApi.js',
            'public/javascript/script.js',
            'public/javascript/courseSearch.js',
            'public/javascript/myCourses.js',
            'public/javascript/string.js',
            'public/javascript/main.js'
          ],
          'public/javascript/min/about.min.js': [
            'public/javascript/consumeApi.js',
            'public/javascript/contact.js'
          ]
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/css/min/dashboard.min.css': ['public/dashboard.css'],
          'public/css/min/login.min.css': ['public/css/login.css']
        }
      }
    }
  });  

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['uglify','cssmin']);
};