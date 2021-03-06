NodeMgr = null;
simpleView = null;
viewSelected = null;
myCourseView = false;

var main = {
  load: function(api, strings) {
    d3.xml('node_template.svg', 'image/svg+xml', function(error, data) {
      var nodeTemplate = data.documentElement.getElementById('node-template');
      NodeMgr = NodeMgrGen(d3.select('#nodes'), 
                           d3.select('#edges'),
                           nodeTemplate, 
                           {x: 900, y: 60});
      window.onresize = main.updateTreeView;  
      main.init(api, strings);
    });
  },
  updateTreeView: function () {
    if (viewSelected == simpleView) {
      return;
    }
    var style = getComputedStyle($('#grades-container')[0]);
    var width = parseInt(style['width']) - parseInt(style['left']);
    var height = parseInt(style['height']) - 50;
    var bbox = NodeMgr.getBBox();
    width = Math.max(width, bbox.width + 100);
    height = Math.max(height, bbox.height + 100);
    d3.select('#tree-container')
      .attr('height', height)
      .attr('width', width + parseInt(style['left']));
    NodeMgr.moveRoot({x: width/2, y: 60});
  },
  init: function(api, strings) {
    simpleView= new SimpleView(); 
    $("[data-toggle=tooltip]").tooltip();
    var courseList = courseSearch(api, main, strings);
    var my_list = course(api, main, strings);
    var $left_panel = $("#left-panel");
    var width_sidebar = parseInt($left_panel.css('width'));
    var $toggle_sidebar = $("#toggle-left-panel");
    var $help_link = $('#help-link');
    var $course_base_formula = $('#course-base-formula');
    var $apply_base_formula = $('#apply-base-formula');
    var $tree_container = $('#tree-container');
    var $simple_container = $('#simple-container');
    var $simple_view = $('#simple-view');
    var $advanced_view = $('#advanced-view');

    $tree_container.hide();
    viewSelected = simpleView;

    function updateView(viewObj, data) {
      if (!data) {
        viewObj.newTree();
      } else {
        viewObj.import(data);
      }
    }


    var toggleViews = function () {
      $tree_container.toggle();
      $simple_container.toggle();
      var data = viewSelected.export();
      if(viewSelected == simpleView) {
        updateView(NodeMgr, data);
      } else {
        updateView(simpleView, data);
      }
    };

    var setSimpleview = function() {
      if (viewSelected == simpleView) {
        return;
      }
      toggleViews();
      viewSelected = simpleView;
    };

    function setAdvancedView() {
      if (viewSelected == NodeMgr) {
        return;
      }
      main.show_info_msg_forever(strings.advanced_view);
      toggleViews();
      viewSelected = NodeMgr;
      main.updateTreeView();
    };

    $simple_view.on('click', setSimpleview);
    $advanced_view.on('click', setAdvancedView);

    var tour = new Tour({      
      steps: [
        {
          element: "#help-link",
          title: "Tour",
          content: "Empieza el tour, puedes navegar haciendo click en «, » . o utilizando las flechas del teclado."
        },
        {
          element: "#course-search-box",
          title: "Buscar curso",
          content: "Buscar el curso y guárdalo en tus cursos"
        },
        {
          element: "#course-list",
          title: "Mis cursos",
          content: "Los cursos que te pertenecen, puedes compartirlos dando clic en el ícono con forma de nube."+
                    ' Cuando termine este tour aconsejamos empezar realizando clic sobre "curso ejemplo".'
        },
        {
          element: "#about",
          title: "Contacto",
          content: "Escríbenos sobre sugerencias o dudas.",
          placement: 'left'
        },
        {
          element: "#expand-navigation",
          title: "Compartir",
          content: "Comparte esta página web o cuéntale a tus amigos",
          placement: "top"
        },
        {
          element: "#help",
          title: "Ayuda",
          content: "Obtén ayuda. Si es tu primera vez o quieres saber cómo utilizar la vista avanzada de cursos Clic aquí.",
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
    $help_link.on('click', function() {
      tour.init();
      tour.restart();  
    });

    var toggle_sidebar = function(e) {
      var next_left = width_sidebar - parseInt($toggle_sidebar.css('left'));
      var sidebar_left = -1 * width_sidebar - parseInt($left_panel.css('left')) ;
      $left_panel.animate({'left': sidebar_left + 'px'}, 'slow');
      $toggle_sidebar.animate({'left': next_left + 'px'}, 'slow');
      var $grades_container = $('#grades-container');
      var body_width = $("body").width();
      $grades_container.animate({
          'left': next_left+'px'
        },
        'slow',
        main.updateTreeView
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
      $('#save-formula').off('click').popover('hide');
      $('#course-name').text(course.name);
      elem.find('.click-menu').show();
      if (course.formula) {
        viewSelected.import(JSON.parse(course.formula));
      } else {
        viewSelected.newTree();
      }
      main.updateTreeView();
    };

    var decoratorTourCourse = function(f) {
      return function() {
        f.apply(this, arguments);
        if(arguments[0].name == 'curso ejemplo') {
          var optionsTourCourse = {      
            steps: [
              {
                element: ".course.active",
                title: "1 Curso Tour",
                content: "Se realizaron algunos cambios aconsejamos seguir este pequeño tour. Puedes navegar haciendo click en «, » . "+
                          "o utilizando las flechas del teclado.",
                placement: 'top'
              }, {
                element: ".course.active .menu-icon.click-menu",
                title: "2 Opciones del curso",
                content: "Estas opciones permiten: compartir(para que otra persona utilice la fórmula),editar el nombre y eliminar respectivamente.",
                placement: 'top'
              }, {
                element: "#course-base-formula",
                title: "3 Fórmula",
                content: "Cuando se crea un nuevo curso se debe ingresar la fórmula del curso. Luego se debe hacer click en aplicar fórmula",
                placement: 'bottom'
              }, {
                element: ".phanthom:first",
                title: "4 Agregando evaluaciones",
                content:  "Luego de aplicar la fórmula se debe hacer clic sobre el + para agregar evaluaciones donde sea necesario."+
                          "Para editar las notas se les debe dar un clic. Si la nota es real( ya te entregaron tu jalado ), " +
                          "debes asegurar este valor cerrando el candado. "+
                          "Además, se debe indicar si se debe eliminar la nota mínima para obtener el promedio.",
                placement: "right"
              }, {
                element: "#simple-container .eva-info.big",
                title: "5 Sólo quiero aprobar el curso",
                content: "Se puede dar click y editar el promedio que se desea obtener. PD: Las evaluaciones que no tengan "+
                        "el candado cerrado serán llenadas con otros valores para intentar llegar al promedio indicado. "+
                        "No te olvides de guardar los cambios realizados."
              }, {
                element: "#simple-container .eva-info.big",
                title: "6 Ahora te toca",
                content: "Ahora puedes crear y compartir fórmula de los cursos y averiguar si te vas por 20."
              }
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
          };
          var tourEx = new Tour(optionsTourCourse);
          tourEx.init();
          tourEx.restart();
        }
        
      }
    };

    decoratorTourCourse = decoratorTourCourse(selected_handler);

    var remove_tree = function() {
      $('#save-formula').off('click').popover('hide');
      $('.on-sel-hide').hide();
      $('#course-name').text("");
      viewSelected.cleanSvg();
    };
    $apply_base_formula.on('click', function() {
      var course_baseFormula = $course_base_formula.val();
      if (!course_baseFormula || !course_baseFormula.length) {
        main.show_err_submit($course_base_formula, 'Debe ingresar una fórmula','bottom');
      } else {
        $('#save-formula').trigger('click');
        viewSelected.parseFormula(course_baseFormula);
        main.show_info_msg_forever(strings.base_formula_to_tree);
      }
    });

    var get_formula = function() {
      var formula = JSON.stringify(viewSelected.export());
      console.log(formula);
      return {
        formula: formula,
        baseFormula: $course_base_formula.val()
      };
    };

    my_list.selected_handler = decoratorTourCourse;
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
  show_info_msg_forever: function(msg){
    main.show_msg(msg, 'alert-info', {flag : 1});
  },
  show_info_msg: function(msg){
    main.show_msg(msg, 'alert-info', {time : 2000});
  },
  show_err_submit: function(elem, content, position) {
    position = position || 'top';
    elem.tooltip({
      title: content,
      placement: position
    });
    elem.tooltip('show');
  },
  show_msg: function(msg, classParam, extraData) { 
    var time = 1000;
    var flag = 0;
    if (extraData) {
      time = extraData.time || 1000;
      flag = extraData.flag || 0;
    }
    var init_template = main.config.msg_template;
    var $template = $(init_template.part1 + classParam + init_template.part2 +
        msg + init_template.part3);
    $('#messages').append($template);
    if(!flag){
      setTimeout(function() {
        $template.fadeOut('slow', function() {
          $template.remove();
        });
      },time);
    }
  }
}

$(function() {
  main.load(api, strings);
});
