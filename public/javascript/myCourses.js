var course = function(apiWS, msg, strings) {
  var api_ws = apiWS;
  var msg = msg;
  var strings = strings;
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
      if(course.msg) return console.log('error',course.msg);
      add_course(course);
      msg.show_ok_msg(strings.course_create_ok);
    });
  };

  var on_selected = function(course, courseHTML) {
    if (handler.selected_handler) {
      api_ws.consume('getFormulaCourse', {id: course._id}, function(res) {
        handler.selected_handler(res,courseHTML);
        $("#save-formula").show();
        $("#save-formula").on('click', function() {
          save_formula(course._id);
        }).show();
      });
    }
  };


  var on_share = function(id) {
    api_ws.consume('shareCourse', {id: id},
      function(res) {
        if(res.msg != 'OK') return console.log('error',res.msg);
        msg.show_ok_msg(strings.course_share_ok);
    });
  };

  var stop_editing = function() {
    var $el_on_edit = $('.edit-menu');
    if ($el_on_edit) {
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
  };

  var save_formula = function(id) {

    var data = {
      id: id,
      formula: handler.get_formula()
    }
    
    api_ws.consume('updateCourse', data , 
      function(res) {
        if(res.msg != 'OK') return console.log('error'.res.msg);
        msg.show_ok_msg(strings.course_edit_ok);
    });
  };

  var on_edit = function(course, courseHTML) {
    var $el = courseHTML.children().first();
    var $editTemplate = $('<span class="clearfix edit-menu">'+
        '<input type="text" value="'+$el.find('.name').text()+'" class="name pull-left">'+
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
      if (!data.name || !data.name.length) {
        msg.show_err_submit($editTemplate.find(".name"), strings.input_required );
        e.stopPropagation();
        return;
      }
      if (data.name.length > 30) {
        msg.show_err_submit($editTemplate.find('.name'), strings.input_max_length);
        e.stopPropagation();
        return;
      }
      api_ws.consume('updateCourse', data, 
        function(res) {
          if(res.msg != 'OK') return console.log('error'.res.msg);
          msg.show_ok_msg(strings.course_edit_ok);
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
        msg.show_ok_msg(strings.course_remove_ok);
        handler.remove();
    });
  };

  var format_course = function(course) {
    var template = '<li class="course"><a><span class="name">'+course.name+'</span>'+
        '<span class="menu-icon click-menu">'+
        '<span class="share glyphicon glyphicon-cloud" title="Compartir"></span>'+
        '<span class="edit glyphicon glyphicon-pencil" title="Editar"></span>'+
        '<span class="remove glyphicon glyphicon-remove" title="Eliminar"></span></a>'+
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

  var add_course_from_list = function(course) {
    add_course(course);
    save_formula(course._id);
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
    add : add_course_from_list,
    create: create_course,
    get_formula: null,
    remove: null
  };

  return handler;
};
 