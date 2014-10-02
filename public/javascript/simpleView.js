
var SimpleView = function() {
  var rootNode = document.getElementById('simple-container');
  var data;
  var exports =  {
    cleanSvg: function() {
      React.unmountComponentAtNode(rootNode);
    },
    import: function(dataParam) {
      data = dataParam;
      exports.cleanSvg();
      React.renderComponent(
        GradeBox({data : dataParam}),
        rootNode
      );
    },
    newTree: function() {
      exports.cleanSvg();
    },
    parseFormula: function(formula) {
      var json = NodeMgr.formulaToJson(formula);
      exports.import(json);
    },
    export: function() {
      return data;
    },
    createNode: function() {
      return {
        bounds: {
          upper: 20,
          lower: 0
        },
        label: 'label',
        children: [],
        decimals: 2,
        deleteMin: 0,
        isEditable: true,
        trunk: 0,
        weight: 1,
        lock: false
      }
    }
  };
  return exports;
};

//TODO add lock to tree view