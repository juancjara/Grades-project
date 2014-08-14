//:TODO visual OK message on api response
var courseSearch = function(apiWS) {
  var api_ws = apiWS;
  var $form = $('#course-search');
  var $search_box = $('#course-search-box');
  var $btn_search = $('#btn-search');
  var $course_ul = $('#search-results');
  var $clean_search = $('#remove-search');

  $clean_search.on('click', function() {
    $course_ul.children().remove();
  });

  $btn_search.on('click', function() {
    $form.submit();
  });

  var search = {
    selected_handler: null,
    add_handler: null
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
    console.log(idParam);
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
      if (res.msg) return console.log('error',res.msg);
      $course_ul.empty();
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
      console.log("click padre gg");
      on_selected(course, course_view);
    });
    $course_ul.append(course_view);
  };

  return search;
};

$(function() {
  var courseList = courseSearch(api);
  var my_list = course(api);

  var selected_handler = function(course, elem) {
    $('.active').removeClass('active');
    elem.addClass('active');
    $('.click-menu').hide();
    elem.find('.click-menu').show();
    console.log(course);
  };

  my_list.selected_handler = selected_handler;

  courseList.add_handler = my_list.add;
  courseList.selected_handler = selected_handler;
});
