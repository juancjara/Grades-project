module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          'public/javascript/min/grades.min.js': [
            'public/javascript/algorithm.js',
            'public/javascript/build/simpleViewReact.js',
            'public/javascript/simpleView.js',
            'public/javascript/social-share.js',
            'public/javascript/spin.min.js',
            'public/javascript/consumeApi.js',
            'public/javascript/courseSearch.js',
            'public/javascript/myCourses.js',
            'public/javascript/string.js',
            'public/javascript/nodeView.js',
            'public/javascript/main.js',
            'public/javascript/bootstrap-tour.min.js'
          ],
          'public/javascript/min/about.min.js': [
            'public/javascript/consumeApi.js',
            'public/javascript/spin.min.js',
            'public/javascript/contact.js'
          ],
          'public/javascript/min/help.min.js': [
            'public/javascript/social-share.js',
            'public/javascript/help.js'
          ]
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/dashboard.min.css': [
            'public/dashboard.css',
            'public/css/social-share.css'
            ],
          'public/css/min/login.min.css': [
            'public/css/login.css',
            ]
        }
      }
    }
  });  

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['uglify','cssmin']);
};