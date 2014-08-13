var courseSearch = function() {
  var form = $('#course-search');
  var search_box = $('#course-search-box');
  var selected = null;
  var course_ul = $('#course-list');

  search_box.keyup(function(event) {
    if (event.which == 13) {
      event.preventDefault();
      form.submit();
    }
  });

  var search = {
    selected_handler: null
  };

  var on_selected = function(course, courseHTML) {
    if (selected) {
      selected.toggleClass('active');
    }
    selected = courseHTML;
    courseHTML.toggleClass('active');
    if (search.selected_handler) {
      search.selected_handler(course);
    }
  };

  var format_course = function(course) {
    return $('<li>').append($('<a>', {text: course.name}));
  };

  form.submit(function(event) {
    event.preventDefault();
    // get courses from the input 
    // fill them 
    var course_list = [
      {name: 'Ajax 1'}, 
      {name: 'Ajax 2'}, 
      {name: 'Ajax 3'}, 
      {name: 'Ajax 4'}
    ]; 
    var course_ul = $('#course-list');
    course_ul.empty();
    course_list.forEach(function(course) {
      var course_view = format_course(course);
      course_view.click(function() {
        on_selected(course, course_view);
      });
      course_ul.append(course_view);
    });
  });

  var add_course = function(course) {
    var course_view = format_course(course);
    course_view.on('click', function() {
      on_selected(course, course_view);
    });
  };

  return search;
};

$(function() {
  var courseList = courseSearch();
  courseList.selected_handler = function (course) {
    console.log(course);
  };
}); 
