var course = function(apiWS) {
  var api_ws = apiWS;
  var $course_ul = $('#course-list');
  var $btn_my_courses = $('#my-courses');

  $btn_my_courses.on('click',function(){
    $course_ul.toggle('slow');
  });

  var create_course = function(name_course) {
    var data = {
      name: name_course,
      formula: ''
    };
    api_ws.consume('createCourse', data, function(course) {
      add_course(course);
    });
  };

  var on_selected = function(course, courseHTML) {
    if (handler.selected_handler) {
      handler.selected_handler(course,courseHTML);
    }
  };

  var on_share = function(id) {
    api_ws.consume('shareCourse', {id: id},
      function(res) {
        if(res.msg != 'OK') return console.log('error');
    });
  }

  var stop_editing = function() {
    var $el_on_edit = $('.edit-menu');
    if ($el_on_edit) {
      console.log("eliminar");
      console.log("gg",$('.hide'));
      $('.hide').removeClass('hide');
      $el_on_edit.remove();
    };   
  };

  var clean_selected = function() {
    if (selected) {
      selected.toggleClass('active');
    }
  };

  var on_click_outside = function(do_something) {
    $('html').on('click.edit', function() {
      do_something();
      off_click_outside();
    });
  };

  var off_click_outside = function() {
    $('html').off('click.edit');
  }

  var on_edit = function(course, courseHTML) {
    var $el = courseHTML.children().first();
    var $editTemplate = $('<span class="clearfix edit-menu">'+
        '<input type="text" value="'+course.name+'" class="name pull-left">'+
        '<span class="menu-icon">'+
        '<span class="ok glyphicon glyphicon-ok"></span>'+
        '<span class="cancel glyphicon glyphicon-remove"></span>'+
        '</span></span>');

    $el.hide();

    var stop_editing = function() {
      $editTemplate.remove();
      $el.show();
    }

    on_click_outside(stop_editing);

    $editTemplate.on('click', function(e) {
      e.stopPropagation();
    });

    $editTemplate.find('.ok').on('click', function(e) {
      
      var data = {
        id: course._id,
        name: $editTemplate.find(".name").val()
      };
      api_ws.consume('updateCourse', data, 
        function(res) {
          if(res.msg != 'OK') return console.log('error'.res.msg);
          $el.find('.name').text(data.name);
          stop_editing();
          e.stopPropagation();
        });
    });
    $editTemplate.find('.cancel').on('click', function(e) {
      
      stop_editing();
      //e.stopPropagation();
    });

    courseHTML.append($editTemplate);
  };

  var on_remove = function(id, courseHTML) {
    api_ws.consume('deleteCourse', {id: id},
      function(res) {
        if(res.msg != 'OK') return console.log('error'.res.msg);
        courseHTML.remove();
    });
  };

  var format_course = function(course) {
    var template = '<li class="course"><a><span class="name">'+course.name+'</span>'+
        '<span class="menu-icon click-menu">'+
        '<span class="share glyphicon glyphicon-cloud"></span>'+
        '<span class="edit glyphicon glyphicon-pencil"></span>'+
        '<span class="remove glyphicon glyphicon-remove"></span></a>'+
        '</a></li>'     
    return $(template);
  };

  var add_course = function(course) {
    var course_view = format_course(course);

    course_view.find("a").on('click', function() {
      on_selected(course, course_view);
    });

    course_view.find('.share').on('click', function(e) {
      on_share(course._id);
      e.stopPropagation();
    });

    course_view.find('.edit').on('click', function(e) {
      on_edit(course, course_view);
      e.stopPropagation();
    });
    course_view.find('.remove').on('click', function(e) {
      on_remove(course._id, course_view);
      e.stopPropagation();
    });
    $course_ul.append(course_view);
  };

  var init = function() {
    api_ws.consume('getCourses',{}, function(user) {
      var courses = user.courses;
      for (var i=0; i<courses.length; i++) {
        add_course(courses[i]);
      };
    });
  };
  init();

  var handler = {
    selected_handler: null,
    add : add_course,
    create: create_course
  };

  return handler;
};
 