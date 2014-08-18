var main = {
  init: function(api, strings) {
    var courseList = courseSearch(api, main, strings);
    var my_list = course(api, main, strings);

    var $hide_left_panel = $("#hide-left-panel");
    var $show_left_panel = $("#show-left-panel");

    var toggle_left_panel = function(e) {
      $('#left-panel').toggle('slow');
      $show_left_panel.toggle();
      e.stopPropagation();
    };

    $show_left_panel.on('click', toggle_left_panel);
    $hide_left_panel.on('click', toggle_left_panel);

    var selected_handler = function(course, elem) {
      $('#left-panel .active').removeClass('active');
      elem.addClass('active');
      $('.click-menu').hide();
      elem.find('.click-menu').show();
      console.log(course);
    };

    my_list.selected_handler = selected_handler;

    courseList.add_handler = my_list.add;
    courseList.selected_handler = selected_handler;
    courseList.new_course_handler = my_list.create;
  },
  config: {
    msg_template: {
      part1: '<div class="alert ',
      part2: '" role="alert"><button class="close" data-dismiss="alert">'+
             '<span aria-hidden="true">&times<span class="sr-only">Close'+
             '</span></span></button>',
      part3: '</div>'
    }
  },
  show_ok_msg: function(msg) {
    main.show_msg(msg, 'alert-success');
  },
  show_err_msg: function(msg) {
    main.show_msg(msg, 'alert-danger');
  },
  show_err_submit: function(elem, content) {
    console.log("elem",elem);
    elem.tooltip({title: content});
    elem.tooltip('show');
  },
  show_msg: function(msg, classParam) {
    var init_template = main.config.msg_template;
    var $template = $(init_template.part1 + classParam + init_template.part2 +
        msg + init_template.part3);
    $('#messages').append($template);
    setTimeout(function() {
      $template.fadeOut('slow', function() {
        $template.remove();
      });
    },1000);
  }
}
$(function() {
  $('#home').addClass('active');
  main.init(api, strings);
});
