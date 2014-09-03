NodeMgr = null;

var main = {
  load: function(api, strings) {
    d3.xml('node_template.svg', 'image/svg+xml', function(error, data) {
      var nodeTemplate = data.documentElement.getElementById('node-template');
      NodeMgr = NodeMgrGen(d3.select('#nodes'), 
                           d3.select('#edges'),
                           nodeTemplate, 
                           {x: 900, y: 60});
      main.init(api, strings);
    });
  },
  init: function(api, strings) {
    var courseList = courseSearch(api, main, strings);
    var my_list = course(api, main, strings);
    var $left_panel = $("#left-panel");
    var width_sidebar = parseInt($left_panel.css('width'));
    var $toggle_sidebar = $("#toggle-left-panel");
    var $help_link = $('#help-link');
    var $course_base_formula = $('#course-base-formula');
    var $apply_base_formula = $('#apply-base-formula');

    var tour = new Tour({      
      steps: [
        {
          element: "#help-link",
          title: "Tour",
          content: "Empieza el tour, puedes navegar haciendo click en Ant., Sgt. o utilizando las felchas del teclado."
        },
        {
          element: "#course-search-box",
          title: "Buscar curso",
          content: "Buscar el curso y guárdalo en tus cursos"
        },
        {
          element: "#course-list",
          title: "Mis cursos",
          content: "Los cursos que te pertenecen, puedes compartirlos dando click en el ícono con forma de nube"
        },
        {
          element: "#about",
          title: "Contacto",
          content: "Escríbenos sobre sugerencias o dudas.",
          placement: 'left'
        },
        {
          element: "#share",
          title: "Compartir",
          content: "Comparte esta página web",
          placement: "left"
        },
        {
          element: "#help",
          title: "Ayuda",
          content: "Haz click para obtener más ayuda",
          placement: "left"
        },
      ],
      template: "<div class='popover tour'>"+
                "<div class='arrow'></div>"+
                "<h3 class='popover-title'></h3>"+
                "<div class='popover-content'></div>"+
                "<div class='popover-navigation'>"+
                  "<button class='btn btn-default' data-role='prev'>«</button>"+
                  "<span data-role='separator'>&nbsp;</span>"+
                  "<button class='btn btn-default' data-role='next'>»</button>"+
                  "<button class='btn btn-default' data-role='end'>Cerrar</button>"+
                "</div>"+
                "</div>"
    });
    tour.init();
    $help_link.on('click', function() {
      console.log('click');
      tour.restart();  
    });

    var toggle_sidebar = function(e) {
      
      var next_left = width_sidebar - parseInt($toggle_sidebar.css('left'));
      var sidebar_left = -1 * width_sidebar - parseInt($left_panel.css('left')) ;
      console.log("left", sidebar_left);
      $left_panel.animate({'left': sidebar_left + 'px'}, 'slow');
      $toggle_sidebar.animate({'left': next_left + 'px'}, 'slow');
      var $grades_container = $('#grades-container');
      var body_width = $("body").width();
      $grades_container.animate({
        'left': next_left+'px'
      },
      'slow'
      );
      e.stopPropagation();
    };
    $toggle_sidebar.on('click', toggle_sidebar);

    var selected_handler = function(course, elem) {
      $('#left-panel .active').removeClass('active');
      $course_base_formula.val(course.baseFormula);
      elem.addClass('active');
      $('.click-menu').hide();
      $('.on-sel-hide').show();
      $('#save-formula').off('click');
      $('#course-name').text(course.name);      
      elem.find('.click-menu').show();
      if (course.formula) {
        NodeMgr.import(JSON.parse(course.formula));
      } else {
        NodeMgr.newTree();
      }
    };

    var remove_tree = function() {
      $('#save-formula').hide().off('click');
      $('.on-sel-hide').hide();
      $('#course-name').text("");      
      NodeMgr.cleanSvg();

    };
    $apply_base_formula.on('click', function() {
      var course_baseFormula = $course_base_formula.val();
      if (!course_baseFormula || !course_baseFormula.length) {
        main.show_err_submit($course_base_formula, 'Debe ingresar una fórmula','bottom');
      } else {
        NodeMgr.parseFormula(course_baseFormula);
        main.show_info_msg(strings.base_formula_to_tree);
      }
    });

    var get_formula = function() {
      var formula = JSON.stringify(NodeMgr.export());
      return {
        formula: formula,
        baseFormula: $course_base_formula.val()
      };
    };

    my_list.selected_handler = selected_handler;
    my_list.get_formula = get_formula;
    my_list.remove = remove_tree;

    courseList.add_handler = my_list.add;
    courseList.selected_handler = selected_handler;
    courseList.new_course_handler = my_list.create;
    courseList.remove = remove_tree;
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
  show_info_msg: function(msg){
    main.show_msg(msg, 'alert-info', 1);
  },
  show_err_submit: function(elem, content, position) {
    position = position || 'top';
    elem.tooltip({
      title: content,
      placement: position
    });
    elem.tooltip('show');
  },
  show_msg: function(msg, classParam, flag) { 
    var init_template = main.config.msg_template;
    var $template = $(init_template.part1 + classParam + init_template.part2 +
        msg + init_template.part3);
    $('#messages').append($template);
    if(!flag){
      setTimeout(function() {
        $template.fadeOut('slow', function() {
          $template.remove();
        });
      },1000);
    }
  }
}
$(function() {
  main.load(api, strings);
  //main.test();
});
