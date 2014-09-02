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
  style['z-index'] = 3;
  var saveAndRemove = function() {
    var text = input.value.trim();
    // if its empty the svg will be unclickable
    if (text) {
      svgText.textContent = format(text);
    }
    $(input).hide();
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
      var left = x - (vertex.getLeafNumber() * 40);
      vertex.forEachChild(function(childId) {
        child = getVertex(childId); 
        var width = child.getLeafNumber() * 40;   
        left += width;
        updatePosition(childId, left, y + 110);
        left += width;
      });
    } 
    var orig = root.getOrigin();
    updatePosition(rootId, orig.x, orig.y);
  }

 function simulate() {
    var simulation = function(vertexId) {
      var vertex = getVertex(vertexId);
      var node = getNode(vertexId);
      var weights = 0,
          bounds = {lower:0, upper: 0},
          minVal = {lower:21, upper: 21},
          minWeight =  {lower: 0, upper: 0},
          weightBound = {lower: 0, upper: 0};

      if (vertex.isLeaf()){
        return node.getBounds();
      }

      vertex.forEachChild(function(childId) {
        var temp = simulation(childId);  
        var child = getNode(childId);
        var weight = child.getWeight();
        bounds.lower += temp.lower * weight;
        bounds.upper += temp.upper * weight;
        weights += weight;

        if (temp.lower < minVal.lower){
          minVal.lower = temp.lower;
          minWeight.lower = weight;
        }

        if (temp.upper < minVal.upper){
          minVal.upper = temp.upper;
          minWeight.upper = weight;
        }
      });

      weightBound.lower = weights;
      weightBound.upper = weights;

      if (node.shouldDeleteMinimum()) {
        bounds.lower -= minVal.lower * minWeight.lower;
        bounds.upper -= minVal.upper * minWeight.upper;
        weightBound.lower -= minWeight.lower;
        weightBound.upper -= minWeight.upper;
      }

      bounds.lower /= weightBound.lower;
      bounds.upper /= weightBound.upper;
      var precision = node.getPrecision();
      var round = node.shouldRound()? 0.5:0.0;
      bounds.lower = Math.floor(bounds.lower * precision + round) / precision;
      bounds.upper = Math.floor(bounds.upper * precision + round) / precision;
      console.log(weightBound);
      console.log(bounds);
      node.setBounds(bounds);
      return bounds;
    }
    simulation(rootId);
    redraw();
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
    createNode: function(data) {
      var id = getNodeId(); 
      nodeView = template.cloneNode(true);
      nodes[id] = Node(id, nodeView, data);
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
    addNode: function(nodeKey, data, noDraw) {
      var childInfo = nodeManager.createNode(data); 
      var child = childInfo.node;
      var childId = childInfo.id;
      var childVertex = childInfo.vertex;

      var ancestor = getNode(nodeKey);
      var ancestorOrigin = ancestor.getOrigin();
      var ancestorVertex = getVertex(nodeKey); 

      // update tree
      ancestorVertex.push(childId); 
      ancestor.setEditable(false);
      childVertex.setPrev(nodeKey);
      child.setOrigin(ancestorOrigin, true);

      var edge = nodeManager.createEdge(nodeKey, childId);
      
      if (!noDraw) { redraw(); };
      nodeManager.animateChanges();
      return childInfo;
    }, 
    removeNode: function(nodeKey, force) {
      if (nodeKey == rootId && !force) {
        return;
      }
      var vertex = getVertex(nodeKey);
      if (!vertex.isRoot()) {
        var prev = getVertex(vertex.getPrev()); 
        prev.removeChild(nodeKey);
        if (prev.isLeaf()) {
          var node = getNode(vertex.getPrev()); 
          node.setEditable(true);
        }
      }
      forEachDecendant(nodeKey, function(id) {
        nodes[id].hide();
        if (!vertices[id].isRoot()) {
          edges[id].hide(); 
        }
        delete nodes[id]; 
        delete vertices[id];
        delete edges[id];
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
    export: function() {
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
      var res = getFormula(rootId);
      return res;
    },
    simulate: simulate,
    moveRoot: function (newOrigin) {
      root.moveTo(newOrigin); 
      redraw();
    },
    cleanSvg: function() {
      if (root) {
        nodeManager.removeNode(rootId, true);
        root = null;
        rootId = null;
      }
      nodeContainer.selectAll("*").remove();
      edgeContainer.selectAll("*").remove();
    },
    newTree: function() {
      nodeManager.cleanSvg();
      var nodeInfo = nodeManager.createNode();
      root = nodeInfo.node;
      rootId = nodeInfo.id;
      root.setOrigin(rootOrigin, true);
      nodeManager.appendChange(root.moveTo(rootOrigin));
      nodeManager.animateChanges();    
    },
    import: function(tree) {
      nodeManager.cleanSvg();
      var nodeInfo = nodeManager.createNode(tree);
      root = nodeInfo.node;
      rootId = nodeInfo.id;
      root.setOrigin(rootOrigin, true);
      nodeManager.appendChange(root.moveTo(rootOrigin));
      nodeManager.animateChanges();
      addChildren(rootId, tree);
      function addChildren(id, node) {
        var children = node.children;
        for (var i = 0; i < children.length; i++){
          var info = nodeManager.addNode(id, children[i], true);
          addChildren(info.id, children[i]);
        }
      }
      redraw();
    },
    parseFormula: function(formula) {
      //2*Pa + Pb + 3*Ex1 + 4*Ex2
      formula = formula.replace(/\s/g, '');
      var data = formula.split('+');
      var NodeObj = function(params) {
        var data =
        {
          "bounds": {
            "lower": 0,
            "upper": 20
          },
          "decimals": 1,
          "deleteMin": 0,
          "isEditable": true,
          "label": null,
          "trunk": 1,
          "weight": 1,
          "children" : []
        };
        return data;
      };
      var parent = new NodeObj();
      
      parent.decimals = 2;
      parent.label = 'Pro';
      parent.trunk = 0;
      parent.isEditable = false;

      for (var i = 0; i < data.length; i++) {
        var weight = data[i].match('^[0-9]*')[0];
        var label = data[i].substring(weight.length);
        label = label.replace(/\*/g, '');
        var child = new NodeObj();
        
        weight = weight || 1;
        child.label = label;
        child.weight = weight;
        child.trunk = 1;
        parent.children.push(child);
      };
      NodeMgr.import(parent);
    }
    
  }; 

  return nodeManager;
};

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

function Node(nodeId, nodeView, data){
  var id = nodeId;
  var isEditable = true;
  var decimals = 2;
  var displayControls = false;
  var grade = null;
  var id = nodeId;
  var isEditable = true;
  var label = null;
  var origin = null;
  var view = nodeView;
  var weight = 1;

  var bounds = {upper: 20, lower: 0};
  var children = [];
  var arrTrunk = ['R', 'T'];
  var arrDelete = ['N', 'E'];
  var trunk = 0;
  var deleteMin = 0;
  var STrunk = d3.select(view).select('#trunk-behavior');
  var SDeleteMin = d3.select(view).select('#delete-min');


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
    setData: function(data) {
      node.setDecimals(data.decimals);
      node.setLabel(data.label);
      node.setBounds(data.bounds);
      node.setTrunkBehavior(data.trunk);
      node.setWeight(data.weight);
      node.setDeleteMinimum(data.deleteMin);
    },
    setDecimals: function(dec) {
      decimals = dec;
      updateNumbers(dec); 
    },
    setLabel: function(lbl) {
      if (!lbl || lbl == "") {
        lbl = "-"; 
      }
      label = lbl; 
      d3.select(view).select("#label").text(label);
    },
    setTrunkBehavior: function(trnk) {
      STrunk.text(arrTrunk[trnk]);
      trunk = trunk; 
    },
    setDeleteMinimum: function(shouldDeleteMinimum) {
      SDeleteMin.text(arrDelete[shouldDeleteMinimum]);
      deleteMin = shouldDeleteMinimum;
    },
    setEditable: function (canEdit) {
      isEditable = canEdit; 
    },
    setOrigin: function(newOrigin, apply) {
      origin = transformTo(newOrigin, -1);
      if (apply) {
        d3.select(view)
          .attr('transform', 'translate('+origin.x+','+origin.y+')');
      }
    },
    setWeight: function(nWeight) {
      if (!nWeight) {
        nWeight = 1; 
      }
      weight = parseInt(nWeight); 
      d3.select(view).select("#weight").text(nWeight);
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
    setBounds: function(newBounds) {
      bounds = newBounds; 
      d3.select(view).select('#min')
            .node().textContent = formatNumber(""+bounds.lower);

      d3.select(view).select('#max')
            .node().textContent = formatNumber(""+bounds.upper);
    },
    getPrecision: function() {
      return +Math.pow(10, decimals); 
    },
    shouldRound: function() {
      return trunk == 0; 
    },
    getWeight: function() {
      return weight; 
    },
    shouldDeleteMinimum: function() {
      return deleteMin == 1;
    },
    getBounds: function() {
      if (!isEditable) {
        return {upper: 20, lower: 0}; 
      }
      return bounds;
    },
    moveTo: function(newOrigin) {
      node.setOrigin(newOrigin);
      return function() {
        d3.select(view).select('#container').classed('leaf', isEditable);
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
        bounds: bounds,
        children: [],
        decimals: decimals,
        deleteMin: deleteMin,
        isEditable: isEditable,
        label: label,
        trunk: trunk,
        weight: weight
      };
    }
  };

  if (data) {
    node.setData(data);
  }

  function updateNumbers(decs) {
     var numbs = ['max', 'min'];
     numbs.forEach(function(id) {
       var node = d3.select(view).select('#'+id).node();
       node.textContent = 
         formatNumber(node.textContent, {zeroPadding: true, decimals: decs});
     });
  }

  function formatNumber(text, ops) {
    var decs = decimals;
    var zeroPad = true;
    if (arguments.length > 1) {
      decs = ops.decimals;
      zeroPad = ops.zeroPadding; 
    }
    var value = "";
    var matches = text.match(/(\d*)[.]?(\d*)/);
    var ent = matches[1], dec = matches[2].substr(0, decs);
    if (zeroPad) {
      ent = Array(3-ent.length).join('0') + ent; 
      dec = dec + Array((1 + decs)-dec.length).join('0');
    }
    if (decs == 0) {
      value = ent; 
    } else {
      value = ent + '.' + dec; 
    }
    return value;
  }

  //set events
  d3.select(view).select('#data')
    .on('click', function() {
      var target = d3.event.target;
      if (!target.id) {
        return;
      }
      switch (target.id) {
        case 'container': 
          node.toggleControls();
          break;
        case 'label':
          bindEdit(target, 
            // format
            function(text) { 
              label = text;
              return text; 
            });
          break; 
        default:
          if (!isEditable && target.id != 'weight') {
            return; 
          }
          bindEdit(target, 
            // format to save
            function(text) {
              var formated = formatNumber(text);
              if (target.id == 'max') {
                bounds.upper = parseFloat(formated); 
              } else if (target.id == 'min') {
                bounds.lower = parseFloat(formated); 
              } else if (target.id == 'weight') {
                formated = 
                  formatNumber(text, {zeroPadding: false, decimals: 0});
                weight = parseInt(formated);  
              }
              NodeMgr.simulate();
              return formated;
            },
            // setup
            function(input) {
              input.type = 'number';
              input.min = '0';
              input.max = '20';
              if (target.id == 'weight') {
                input.step = '' + 1; 
              } else {
                input.step = '' + Math.pow(10, -decimals);
              }
            });
      }
    });
  d3.select(view).select('#add')
    .on('click', function() {
      NodeMgr.addNode(id); 
    })
    .style('pointer-events', 'bounding-box');
  d3.select(view).select("#remove")
    .on('click', function() {
      NodeMgr.removeNode(id); 
    })
    .style('pointer-events', 'bounding-box');
  STrunk.on('click', function() {
    trunk = 1 - trunk;
    STrunk.text(arrTrunk[trunk]);
    NodeMgr.simulate();
  })
  .style('pointer-events', 'bounding-box');
  SDeleteMin.on('click', function() {
    deleteMin = 1 - deleteMin; 
    SDeleteMin.text(arrDelete[deleteMin]);
    NodeMgr.simulate();
  })
  .style('pointer-events', 'bounding-box');
  d3.select(view).select('#inc-decimals')
    .on('click', function() {
      decimals++;
      if (decimals > 2) {
        decimals = 2; 
      }
      NodeMgr.simulate();
      updateNumbers(decimals);
    })
  .style('pointer-events', 'bounding-box');
  d3.select(view).select('#dec-decimals')
    .on('click', function() {
      decimals--;
      if (decimals < 0) {
        decimals = 0; 
      }
      NodeMgr.simulate();
      updateNumbers(decimals);
    })
  .style('pointer-events', 'bounding-box');
  return node;
}

