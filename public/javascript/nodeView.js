  function getOffsetRect(elem) {
  // (1)
  var box = elem.getBoundingClientRect();

  var body = document.body;
  var docElem = document.documentElement;

  // (2)
  var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
  var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

  // (3)
  var clientTop = docElem.clientTop || body.clientTop || 0;
  var clientLeft = docElem.clientLeft || body.clientLeft || 0;

  // (4)
  var top  = box.top +  scrollTop - clientTop;
  var left = box.left + scrollLeft - clientLeft;

  return { 
    top: top - 3, 
    left: left - 1
  };
}


function bindEdit(svgText, format, setup) {
  setup = setup || function() {};
  var input = document.createElement('input');
  setup(input);
  input.value = svgText.textContent;
  var coords = getOffsetRect(svgText);
  var style = input.style;
  var svgStyle = getComputedStyle(svgText);
  style.resize = 'none';
  style.position = 'absolute'; 
  style.background = 'none';
  style.left = coords.left + 'px';
  style.top = coords.top + 'px';
  style['width'] = Math.round(svgText.getBBox().width + 20) + 'px';
  style.height = Math.round(svgStyle.heigth) + 'px';
  style['font-family'] = svgStyle['font-family'];
  style['font-size'] = svgStyle['font-size'];
  style['font-weight'] = svgStyle['font-weight'];
  style.outline = 'none';
  style.overflow = 'hidden';
  style.border = '0 none #FFF';
  style['-webkit-transform-origin'] = 'center center';
  var saveAndRemove = function() {
    var text = input.value.trim();
    // if its empty the svg will be unclickable
    if (text) {
      svgText.textContent = format(text);
    }
    $(input).hide();
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
}

var NodeMgrGen = 
  function(nodeContainer, edgeContainer, nodeTemplate, rootOrigin){
  var nodes = {};
  var edges = {};
  var vertices = {};
  var edges = {};
  var changes = [];
  var root = null;
  var rootId = 0;
  var nodeId = 0;
  var template = nodeTemplate;

  function Vertex(id) {
    var prev = null; 
    var nodeId = id;
    var leafNumber = 0;
    var childLen = 0;
    var adjList = []
    var vertex = {
      isRoot: function() {
        return prev == null; 
      },
      getPrev: function() {
        return prev;
      },
      removeChild: function (id) {
        var pos = adjList.indexOf(id);
        if (pos == -1) {
          return; 
        }
        childLen--;
        adjList.splice(pos, 1);
      },
      setPrev: function(anc) {
        prev = anc;
      },
      isLeaf: function() {
        return childLen == 0;
      },
      push: function(child) {
        childLen++;
        adjList.push(child); 
      },
      setLeafNumber: function(n) {
        leafNumber = n;
      },
      forEachChild: function (op) {
        adjList.forEach(op);
      },
      getLeafNumber: function() {
        return leafNumber;
      },
    }; 
    return vertex; 
  };

  function forEachDecendant(id, fun) {
    var vertex = getVertex(id); 
    var node = getNode(id);
    if (!vertex) {
      return; 
    }
    vertex.forEachChild(function(childId) {
      forEachDecendant(childId, fun); 
    });
    fun(id);
  }

  function getEdge(id) {
    return edges[id];
  }

  function getVertex(id) {
    return vertices[id]; 
  } 

  function updateLeafNumber() {
    function updateLeafs(id) {
      var vertex = getVertex(id);
      if (!vertex) return 0;
      if (vertex.isLeaf()) {
        vertex.setLeafNumber(1);
        return 1; 
      }
      var leafNum = 0;
      vertex.forEachChild(function(childId){
        leafNum += updateLeafs(childId); 
      });
      vertex.setLeafNumber(leafNum);
      return leafNum;
    }
    updateLeafs(rootId);
  }

  function updatePosition() {
    function updatePosition(id, x, y) {
      var vertex = getVertex(id); 
      if (!vertex) return;

      var node = getNode(id);
      node.moveTo({x: x, y: y})();

      if (!vertex.isRoot()) {
        var from = getNode(vertex.getPrev());
        var to = node;
        var edge = getEdge(id);
        edge.moveTo(from.getOrigin(), to.getOrigin())();
      }

      if (vertex.isLeaf()) {
         return;
      }
      var left = x - (vertex.getLeafNumber()*50);
      vertex.forEachChild(function(childId) {
        child = getVertex(childId); 
        var width = child.getLeafNumber() * 50;   
        left += width;
        updatePosition(childId, left, y + 150);
        left += width;
      });
    } 
    var orig = root.getOrigin();
    updatePosition(rootId, orig.x, orig.y);
  }

  function redraw() {
    updateLeafNumber();
    updatePosition();
  }

  function getNodeId() {
    var id = nodeId;
    nodeId++;
    return id;
  }

  function getNode(id) {
    return nodes[id];
  }

  var nodeManager = {
    createEdge: function(fromId, toId) {
      var from = getNode(fromId);
      var to = getNode(toId);
      var edgeTemplate = edgeContainer.append('line')
                           .style('display', 'none')
                           .attr('stroke', 'red')
                           .node();
      var e = Edge(from.getOrigin(), to.getOrigin(), edgeTemplate);
      edges[toId] = e;
      return e;
    },
    createNode: function() {
      var id = getNodeId(); 
      nodeView = template.cloneNode(true);
      nodes[id] = Node(id, nodeView);
      vertices[id] = Vertex(id);
      nodeContainer.node().appendChild(nodeView);
      var node = nodes[id];
      var vertex = vertices[id];
      var nodeInfo = {
        id: id, 
        node: node,
        vertex: vertex
      };
      return nodeInfo;
    },
    addNode: function(nodeKey) {
      var childInfo = nodeManager.createNode(); 
      var child = childInfo.node;
      var childId = childInfo.id;
      var childVertex = childInfo.vertex;

      var ancestor = getNode(nodeKey);
      var ancestorOrigin = ancestor.getOrigin();
      var ancestorVertex = getVertex(nodeKey); 

      // update tree
      ancestorVertex.push(childId); 
      childVertex.setPrev(nodeKey);
      child.setOrigin(ancestorOrigin, true);

      var edge = nodeManager.createEdge(nodeKey, childId);
      
      redraw();
      /*
      nodeManager.appendChange(child.moveTo(
            {x: ancestorOrigin.x + 100, 
             y: ancestorOrigin.y + 100}));
             */
      nodeManager.animateChanges(); 
    }, 
    removeNode: function(nodeKey) {
      if (nodeKey == rootId) {
        return;
      }
      var vertex = getVertex(nodeKey);
      if (!vertex.isRoot()) {
        var prev = getVertex(vertex.getPrev()); 
        prev.removeChild(nodeKey);
      }
      forEachDecendant(nodeKey, function(id) {
        nodes[id].hide();
        if (!vertices[id].isRoot()) {
          edges[id].hide(); 
        }
        delete node[id]; 
        delete vertex[id];
      });
      nodeManager.animateChanges(); 
      redraw();
    },
    appendChange: function(change) {
      changes.push(change);
    },
    animateChanges: function() {
      changes.forEach(function (change){
        change();
      });
      changes = [];
    },
    changePrecision: function() {

    },
    getFormula: function() {
      function getFormula(id) {
        var vertex = getVertex(id);
        var eva = nodes[id].formatFormula();

        if (!vertex.isLeaf()) {
          vertex.forEachChild(function(childId) {
            eva.children.push(getFormula(childId));
          });
        }
        return eva;
      }
      var result = getFormula(rootId);
      console.log(result);
      return result;
    }
  }; 

  root = nodeManager.createNode().node;
  root.setOrigin(rootOrigin);
  nodeManager.appendChange(root.moveTo(rootOrigin));
  nodeManager.animateChanges();

  return nodeManager;
};

var NodeMgr = null;

window.addEventListener('load', function(){
  d3.xml('node_template.svg', 'image/svg+xml', function(error, data) {
    var nodeTemplate = data.documentElement.getElementById('node-template');
    NodeMgr = NodeMgrGen(d3.select('#nodes'), 
                         d3.select('#edges'),
                         nodeTemplate, 
                         {x: 900, y: 60});
    $("#formula").on('click',NodeMgr.getFormula);
  });
});

function Edge(oBegin, oEnd, edgeView) {
  var begin = oBegin; 
  var end = oEnd;
  var view = edgeView;
  d3.select(view)

    .attr('x1', begin.x)
    .attr('y1', begin.y)

    .attr('x2', end.x)
    .attr('y2', end.y);

  var edge = {
    moveTo: function(newBegin, newEnd) {
      return function() {
        begin = newBegin;
        end = newEnd;
        d3
          .select(view)
            .transition()
            .duration(1000)
            .style('display', '')

            .attr('x1', begin.x)
            .attr('y1', begin.y)

            .attr('x2', end.x)
            .attr('y2', end.y);
      };
    },
    hide: function() {
      d3.select(view).style('display', 'none'); 
    }
  };
  return edge;
}

function Node(nodeId, nodeView){
  var id = nodeId;
  var decimals = 2;
  var displayControls = false;
  var grade = null;
  var label = null;
  var origin = null;
  var view = nodeView;
  var children = [];
  var arrPrecision = ['R', 'F'];
  var precision = 0;
  var Sprecision = d3.select(view).select('#precision');

  var nodeFeatures = {
    width: 96,
    height: 109,
  };

  function transformTo(newOrigin, op) {
    return {
      x: newOrigin.x + op*nodeFeatures.width/2, 
      y: newOrigin.y + op*nodeFeatures.height/2
    };  
  }

  var node = {
    setOrigin: function(newOrigin, apply) {
      origin = transformTo(newOrigin, -1);
      if (apply) {
        d3.select(view)
          .attr('transform', 'translate('+origin.x+','+origin.y+')');
      }
    },
    getOrigin: function() {
      return transformTo(origin, +1);
    },
    getChildren: function() {
      return children;
    },
    addChild: function(childId) {
      children.push(childId); 
    },
    moveTo: function(newOrigin) {
      node.setOrigin(newOrigin);
      return function() {
        node.show();
        d3.select(view)
          .transition()
            .duration(1000)
          .attr('transform', 'translate('+origin.x+','+origin.y+')');
      }; 
    },
    show: function() {
      d3.select(view)
        .style('display',''); 
    },
    hide: function() {
      d3.select(view).style('display', 'none'); 
    },
    showControls: function() {
      displayControls = true;
      d3.select(view).select('#controls').style('display', '');
    },
    hideControls: function() {
      displayControls = false;
      d3.select(view).select('#controls').style('display', 'none');
    },
    toggleControls: function() {
      if (displayControls) {
        node.hideControls(); 
      } else {
        node.showControls();
      }
    },
    formatFormula: function() {
      return {
        _id: id,
        grade: grade,
        label: label,
        children: []
      };
    }
  };
  //set events
  d3.select(view).select('#data')
    .on('click', function() {
      var target = d3.event.target;
      console.log(target);
      switch (target.id) {
        case 'container': 
          node.toggleControls();
          break;
        case 'label':
          bindEdit(target, 
            // format
            function(text) { 
              return text; 
            });
          break; 
        default:
          bindEdit(target, 
            // format
            function(text) {
              var value = "";
              var decimals = 0;
              if (text.indexOf('.') == -1) {
                if (decimals == 0) {
                  value = text;
                } else {
                  value = text + '.' + Array(1+decimals).join('0');
                }
              } else {
                var matches = text.match(/(\d*)[.](\d*)/);
                var ent = matches[1], dec = matches[2].substr(0, decimals);
                dec = dec + Array((1 + decimals)-dec.length).join('0');
                if (decimals == 0) {
                  value = ent; 
                } else {
                  value = ent + '.' + dec; 
                }
              }
              return value;
            },
            // setup
            function (input) {
              input.type = 'number';
              input.min = '0';
              input.max = '20';
            });
      }
    });
  d3.select(view).select('#add')
    .on('click', function() {
      NodeMgr.addNode(id); 
    });
  d3.select(view).select("#remove")
    .on('click', function() {
      NodeMgr.removeNode(id); 
    });
  Sprecision.on('click', function() {
    precision = 1 - precision;
    Sprecision.text(arrPrecision[precision]);
  });
  d3.select(view).select('#inc-decimals')
    .on('click', function() {
      decimals++;
    });
  d3.select(view).select('#dec-decimals')
    .on('click', function() {
      decimals--;
    });
  return node;
}

