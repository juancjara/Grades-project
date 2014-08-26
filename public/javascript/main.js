var main = {
  init: function(api, strings) {
    var courseList = courseSearch(api, main, strings);
    var my_list = course(api, main, strings);
    var $left_panel = $("#left-panel");
    var width_sidebar = parseInt($left_panel.css('width'));
    var $toggle_sidebar = $("#toggle-left-panel");
    var NodeMgr = null;

    d3.xml('node_template.svg', 'image/svg+xml', function(error, data) {
      var nodeTemplate = data.documentElement.getElementById('node-template');
      NodeMgr = NodeMgrGen(d3.select('#nodes'), 
                           d3.select('#edges'),
                           nodeTemplate, 
                           {x: 900, y: 60});
      //NodeMgr.newTree();
      //$("#formula").on('click',NodeMgr.getFormula);
    });

    var toggle_sidebar = function(e) {
      
      var next_left = width_sidebar - parseInt($toggle_sidebar.css('left'));
      var sidebar_left = -1 * width_sidebar - parseInt($left_panel.css('left')) ;
      console.log("left", sidebar_left);
      $left_panel.animate({'left': sidebar_left + 'px'}, 'slow');
      $toggle_sidebar.animate({'left': next_left + 'px'}, 'slow');
      var $grades_container = $('#grades-container');
      if ( $grades_container.css('z-index') == '2' ) {
        $grades_container.animate({'left': next_left + 'px'}, 'slow');
      }
      e.stopPropagation();
    };
    $toggle_sidebar.on('click', toggle_sidebar);

    function clean() {
      $('#left-panel .active').removeClass('active');
      elem.addClass('active');
      $('.click-menu').hide();
      elem.find('.click-menu').show();
    };

    var selected_handler = function(course, elem) {
      clean();
      console.log(course);
      if (course.formula) {
        NodeMgr.import(JSON.parse(course.formula));
      }
      else{
        NodeMgr.newTree();
      }
      //console.log(course);
      //TODO: nodemanager iniciar con curso con getformula
      //iniciar template utilizar id y jugar con formula nomas
    };

    my_list.selected_handler = selected_handler;

    courseList.add_handler = my_list.add;
    courseList.selected_handler = selected_handler;
    courseList.new_course_handler = my_list.create;
  },
  config: {
    msg_template: {
      part1: '<div class="alert ',
      part2: '" role="alert"><button type="button" class="close" data-dismiss="alert">'+
             '<span aria-hidden="true">&times</span><span class="sr-only">Close'+
             '</span></button>',
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
