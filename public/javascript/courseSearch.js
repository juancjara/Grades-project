//:TODO visual OK message on api response
var courseSearch = function(apiWS) {
  var api_ws = apiWS;
  var $form = $('#course-search');
  var $search_box = $('#course-search-box');
  var $btn_search = $('#btn-search');
  var $course_ul = $('#search-results');
  var $clean_search = $('#remove-search');
  var $no_results_msg = $('#no-results');
  var $new_course = $('#new-course');

  $new_course.on('click', function() {
    search.new_course_handler($search_box.val());
    $no_results_msg.hide();
  });

  $clean_search.on('click', function() {
    $course_ul.children().remove();
    $search_box.val('');
    $no_results_msg.hide();
  });

  $btn_search.on('click', function() {
    $form.submit();
  });

  var search = {
    selected_handler: null,
    add_handler: null,
    new_course_handler: null
  };

  var on_selected = function(course, courseHTML) {
    if (search.selected_handler) {
      search.selected_handler(course,courseHTML);
    }
  };

  var on_remove = function(courseHTML) {
    courseHTML.remove();
  };

  var on_add = function(idParam) {
    api_ws.consume('addCourse', {id: idParam},
      function(res) {
        if(res.msg && res.msg != 'OK') return console.log('error',res.msg);
        search.add_handler(res);
    });
  }

  var format_course = function(course) {
    var template = '<li class="course"><a><span class="name">'+course.name+'</span>'+
        '<span class="menu-icon click-menu">'+
        '<span class="add glyphicon glyphicon-floppy-disk"></span>'+
        '<span class="remove glyphicon glyphicon-remove"></span></a>'+
        '</a></li>'     
    return $(template);
  };

  $form.on('submit', function(event) { 
    event.preventDefault();
    api_ws.consume('searchCourse', {name: $search_box.val()},
      function(res) {
      $no_results_msg.hide();
      if (res.msg) return console.log('error',res.msg);
      $course_ul.empty();
      if (!res.length) {
        $no_results_msg.show();
      }
      for (var i = 0; i < res.length; i++) {
        add_course(res[i]);
      };
    });
  });

  var add_course = function(course) {
    var course_view = format_course(course);

    course_view.find('.remove').on('click', function(e) {
      on_remove(course_view);
      e.stopPropagation();
    });

    course_view.find('.add').on('click', function(e) {
      on_add(course._id);
      e.stopPropagation();
    });

    course_view.find("a").on('click', function() {
      on_selected(course, course_view);
    });
    $course_ul.append(course_view);
  };

  return search;
};