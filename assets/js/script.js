function getOffsetRect(elem) {
    // (1)
    var box = elem.getBoundingClientRect()
    
    var body = document.body
    var docElem = document.documentElement
    
    // (2)
    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
    
    // (3)
    var clientTop = docElem.clientTop || body.clientTop || 0
    var clientLeft = docElem.clientLeft || body.clientLeft || 0
    
    // (4)
    var top  = box.top +  scrollTop - clientTop
    var left = box.left + scrollLeft - clientLeft
    
    return { top: Math.round(top), left: Math.round(left) }
}

function tree(container, height, show_node) {
  var svgW = 1000, svgH = 600, vRad = 12;
  var tree = {cx:svgW/2, cy:20, w:70, h:70};
  var nodeFeatures = {
    width : 48,
    height : 36, 
    rx : 5, 
    ry : 5,
    getX : function (x) {
      return (2*x - this.width)/2 ;
    },
    getY : function (y) {
      return (2*y - this.height)/2;     
    }
  };
  var cur_key = 0;

  tree.vis = {
    v: 0, 
    l: 'J', 
    p: {x:tree.cx, y:tree.cy},
    c: [], 
    f: {},
    level: 1,
  }; 
  var vertices = {};
  vertices[cur_key] = tree.vis;
  cur_key++;
  tree.size=1;
  tree.glabels = [];
  tree.incMatx = [];
  tree.incX=500, tree.incY=30, tree.incS=20;
  
  tree.getVertices = function() {
    var v = [];
    function getVertices(_) {
      v.push(_);
      _.c.forEach(getVertices);
    }
    getVertices(tree.vis);
    return v.sort(function(a, b) { return a.v - b.v;});
  }
  
  tree.getEdges = function() {
    var e = [];
    function getEdges(_) {
      _.c.forEach(
        function(d){ 
          e.push({v1:_.v, l1:_.l, p1:_.p, v2:d.v, l2:d.l, p2:d.p});
        });
      _.c.forEach(getEdges);
    }
    getEdges(tree.vis);
    return e.sort(function(a,b){ return a.v2 - b.v2;}); 
  }
  
  tree.addLeaf = function(_) {
    if (vertices[_].level > 2) {
      return;
    }
    vertices[cur_key] = {
      v: cur_key, 
      l: 'J', 
      p: {}, 
      c: [], 
      f: vertices[_],
      level: vertices[_].level + 1
    };
    vertices[_].c.push(vertices[cur_key]);
    cur_key++;
    tree.size++;
    reposition(tree.vis);
    redraw();
  }

  tree.removeLeaf = function(_) {
    if (vertices[_] == tree.vis) {
      return;
    }
    var ancestor = vertices[_].f;
    if (ancestor) {
      for (var id = 0; id < ancestor.c.length; id++) {
        var obj = ancestor.c[id];
        if (obj === vertices[_]) {
          delete ancestor.c[id];
          break;
        }
      }
    }
    reposition(tree.vis);
    delete vertices[_];
    redraw();
  }

  bindTextArea = function (svgText, data) {
    var input = document.createElement('textarea');
    var coords = getOffsetRect(svgText);
    var style = input.style;
    style.resize = 'none';
    style.position = 'absolute'; 
    style.background = 'none';
    style.left = coords.left + 'px';
    style.top = coords.top + 'px';
    style.width = svgText.width + 'px';
    style.height = svgText.hegth + 'px';
    style.outline = 'none';
    style.overflow = 'hidden';
    style.border = '0 none #FFF';
    style['-webkit-transform-origin'] = 'center center';
    input.textContent = svgText.textContent;
    var saveAndRemove = function() {
      data.l = input.value.trim();
      // if its empty the svg will be unclickable
      if (!data.l) {
        data.l = 'node';
      }
      svgText.textContent = data.l;
      $(input).remove();
      svgText.style.display = '';
    };
    $(input).focusout(saveAndRemove);
    $(input).keyup(function(event) { 
      // enter keycode
      if (event.which == 13) {
        saveAndRemove();
      }
    });
    svgText.style.display = 'none';
    document.body.appendChild(input);
    input.focus();
  }; 
 
  redraw = function(){
    var edges = d3.select("#g_lines").selectAll('line').data(tree.getEdges());
    
    edges.transition().duration(500)
      .attr('x1',function(d){ return d.p1.x;})
      .attr('y1',function(d){ return d.p1.y;})
      .attr('x2',function(d){ return d.p2.x;})
      .attr('y2',function(d){ return d.p2.y;})

    edges.enter()
      .append('line')
        .attr('x1', function(d){ return d.p1.x;})
        .attr('y1', function(d){ return d.p1.y;})
        .attr('x2', function(d){ return d.p1.x;})
        .attr('y2', function(d){ return d.p1.y;})
      .transition().duration(500)
        .attr('x2', function(d){ return d.p2.x;})
        .attr('y2', function(d){ return d.p2.y;});

    edges.exit().remove();

    var rectangles = d3.select("#g_nodes").selectAll('rect')
                       .data(tree.getVertices());

    rectangles.transition()
      .duration(500)
        .attr('x', function(d){ return nodeFeatures.getX(d.p.x);})
        .attr('y', function(d){ return nodeFeatures.getY(d.p.y);});
    
    rectangles.enter()
      .append('rect')
        .attr('x', function(d){ return nodeFeatures.getX(d.f.p.x);})
        .attr('y', function(d){ return nodeFeatures.getY(d.f.p.y);})
        .attr('width', nodeFeatures.width)
        .attr('height', nodeFeatures.height)
        .attr('rx', nodeFeatures.rx)
        .attr('ry', nodeFeatures.ry)
      .on('click', function(d){ show_node(d);})
      .transition().duration(500)
        .attr('x', function(d){ return nodeFeatures.getX(d.p.x);})
        .attr('y', function(d){ return nodeFeatures.getY(d.p.y);});

    rectangles.exit().remove();
      
    var labels = d3.select("#g_labels").selectAll('text')
                   .data(tree.getVertices());
    
    labels.text(function(d){return d.l;}).transition().duration(500)
      .attr('x',function(d){ return d.p.x;})
      .attr('y',function(d){ return d.p.y+5;})
      .attr('class', function (d) {return d.c.length == 0 ? 'leaf' : ''});
      
    labels.enter()
      .append('text')
        .attr('x',function(d){ return d.f.p.x;})
        .attr('y',function(d){ return d.f.p.y+5;})
        .attr('class', function (d) {return d.c.length == 0 ? 'leaf' : ''})
      .text(function(d){return d.l;})
        .on('click',function(d){ 
          show_node(d);
        })  
      .transition().duration(500)
        .attr('x',function(d){ return d.p.x;})
        .attr('y',function(d){ return d.p.y+5;});

    labels.exit().remove();   
  }
  
  getLeafCount = function(_) {
    if (_.c.length == 0) return 1;
    else return _.c.map(getLeafCount).reduce(function(a,b){ return a+b;});
  };
  
  reposition = function(v){
    var lC = getLeafCount(v), left = v.p.x - tree.w*(lC-1)/2;
    v.c.forEach(function(d){
      var w = tree.w*getLeafCount(d); 
      left += w; 
      d.p = {x:left-(w+tree.w)/2, y:v.p.y+tree.h};
      reposition(d);
    });   
  }; 
  
  initialize = function(container, height){
    svgW = $(container).width();
    svgH = $(container).height();
    d3.select(container)
      .append("svg")
        .attr("width", svgW)
        .attr("height", svgH)
        .attr('id','treesvg');

    d3.select("#treesvg").append('g').attr('id','g_lines').selectAll('line')
      .data(tree.getEdges()).enter().append('line')
        .attr('x1',function(d){ return d.p1.x;})
        .attr('y1',function(d){ return d.p1.y;})
        .attr('x2',function(d){ return d.p2.x;})
        .attr('y2',function(d){ return d.p2.y;});

    d3.select("#treesvg").append('g').attr('id','g_nodes').selectAll('rect')
      .data(tree.getVertices()).enter()
      .append('rect')
        .attr('x', function(d){ return nodeFeatures.getX(d.p.x); })
        .attr('y', function(d){ return nodeFeatures.getY(d.p.y); })
        .attr('width', nodeFeatures.width)
        .attr('height', nodeFeatures.height)
        .attr('rx', nodeFeatures.rx)
        .attr('ry', nodeFeatures.ry)
      .on('click', function(d){
        show_node(d);
      });
      
    d3.select("#treesvg").append('g').attr('id','g_labels').selectAll('text')
      .data(tree.getVertices()).enter().append('text')
        .attr('x',function(d){ return d.p.x;})
        .attr('y',function(d){ return d.p.y+5;})
        .text(function(d){return d.l;})
      .on('click',function(d){
        show_node(d)
      });  
  }
  initialize(container, height);
  tree.redraw = redraw;
  return tree;
}

var control_panel = function() {
  var label = $('#controls-label');
  var grade = $('#controls-grade');
  var erase = $('#controls-erase');
  var add = $('#controls-add');
  var save = $('#controls-save');
  var tree = null;
  var erase_handler = null;
  var add_handler = null;
  var cur_node = null;
  var panel = {
    set_tree: function(new_tree) {
      tree = new_tree;
    },
    init: function(node) {
      cur_node = node;
      panel.set_label(node.l);
      panel.set_grade(node.grade);
      add_handler = function() {
        tree.addLeaf(node.v);
      };
      erase_handler = function() {
        tree.removeLeaf(node.v);
      }
    },
    set_label: function(new_label) {
      label.val(new_label);
    },
    set_grade: function(new_grade) {
      grade.val(new_grade);
    }, 
    on_erase: function() {
      erase_handler();
      panel.cur_node = null;
      panel.set_label('');
      panel.set_grade('');
    },
    on_add: function() {
      add_handler();
    },
    on_save: function() {
      cur_node.l = label.val();
      cur_node.grade = grade.val();
      tree.redraw();
    }
  };
  erase.click(panel.on_erase);
  add.click(panel.on_add);
  save.click(panel.on_save);
  return panel;
}; 

$(function(){
  var get_height = function () {
    var h = $(window).height();
    return h - 50;
  }
  $(window).on('load resize', function() {
    $('#grades-container').height(get_height());
  });
  var panel = control_panel();
  $(window).on('load', function() { 
    var t = tree('#grades-container', get_height(), function(d) {
      panel.init(d);
    });
    panel.set_tree(t);
  });
});
