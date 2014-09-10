
var SimpleView = function() {
  var rootNode = document.getElementById('view-container');
  var data;
  var exports =  {
    clean: function() {
      React.unmountComponentAtNode(rootNode);
    },
    import: function(dataParam) {
      data = dataParam;
      exports.clean();
      React.renderComponent(
        GradeBox({data : dataParam}),
        rootNode
      );
    },
    newTree: function() {
      exports.clean();
    },
    parseFormula: function(formula) {
      var json = NodeMgr.formulaToJson(formula);
      exports.import(json);
    },
    export: function() {
      console.log(data);
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
        weight: 1
      }
    }
  };
  return exports;
};
